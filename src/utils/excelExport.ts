import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

// ── Colores corporativos alineados con la app ──────────────────────────────────
const COLORS = {
  headerBg:   'FF1E40AF', // Azul marino
  headerText: 'FFFFFFFF',
  rowNeg:     'FFE0F2F1', // Teal suave (p < 0)
  rowPos:     'FFFFF3E0', // Naranja suave (p >= 0)
  pixelOn:    'FF3B82F6', // Azul pixel activo
  pixelCurr:  'FFFBBF24', // Amarillo pixel actual
  pixelOff:   'FFFFFFFF', // Blanco
  gridLine:   'FFD1D5DB', // Gris claro
  accent:     'FF0EA5E9', // Sky blue
};

function applyHeaderStyle(row: ExcelJS.Row, colCount: number) {
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    cell.font = { bold: true, color: { argb: COLORS.headerText }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top:    { style: 'thin', color: { argb: COLORS.gridLine } },
      left:   { style: 'thin', color: { argb: COLORS.gridLine } },
      bottom: { style: 'thin', color: { argb: COLORS.gridLine } },
      right:  { style: 'thin', color: { argb: COLORS.gridLine } },
    };
  }
  row.height = 28;
}

function applyDataRow(row: ExcelJS.Row, isNegative: boolean, colCount: number) {
  const color = isNegative ? COLORS.rowNeg : COLORS.rowPos;
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top:    { style: 'thin', color: { argb: COLORS.gridLine } },
      left:   { style: 'thin', color: { argb: COLORS.gridLine } },
      bottom: { style: 'thin', color: { argb: COLORS.gridLine } },
      right:  { style: 'thin', color: { argb: COLORS.gridLine } },
    };
  }
  row.height = 24;
}

// ── Helpers para extraer x, y, pk de cualquier tipo de paso ───────────────────
function getPointXY(step: any): [number, number] {
  if ('x' in step && 'y' in step) return [step.x, step.y];
  if ('point' in step) return [step.point[0], step.point[1]];
  return [step.points[0][0], step.points[0][1]];
}

function getPk(step: any): number {
  if ('pk' in step) return step.pk;
  if ('d' in step) return step.d;
  return 0;
}

// ── Exportación principal ──────────────────────────────────────────────────────
export async function exportToExcel(
  algorithm: string,
  params: Record<string, number>,
  steps: any[],
  litPixels: [number, number][],
  gridSize: number,
  containerId: string
) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'GraphicAlgo';
  wb.created = new Date();
  wb.modified = new Date();

  const algoLabel: Record<string, string> = {
    bresenham: 'Bresenham – Línea Recta',
    circle:    'Punto Medio – Circunferencia',
    ellipse:   'Punto Medio – Elipse',
  };

  const isEllipse = algorithm === 'ellipse';

  // ── 1. Hoja RESUMEN ──────────────────────────────────────────────────────────
  const summarySheet = wb.addWorksheet('Resumen');
  summarySheet.columns = [
    { key: 'prop', width: 28 },
    { key: 'val',  width: 38 },
  ];

  // Título fusionado
  summarySheet.mergeCells('A1:B1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = '📊 GraphicAlgo — Reporte de Exportación';
  titleCell.font = { bold: true, size: 14, color: { argb: COLORS.headerText } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  summarySheet.getRow(1).height = 40;

  const summaryData = [
    ['Algoritmo',          algoLabel[algorithm] ?? algorithm],
    ['Fecha de exportación', new Date().toLocaleString()],
    ['Pasos exportados',   steps.length],
    ['Pasos totales',      steps.length],
    ['Tamaño de matriz',   `${gridSize} × ${gridSize}`],
    ...Object.entries(params).map(([k, v]) => [`Parámetro: ${k.toUpperCase()}`, v]),
  ];

  summaryData.forEach(([prop, val], i) => {
    const row = summarySheet.addRow({ prop, val });
    row.getCell(1).font  = { bold: true };
    row.getCell(1).fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    row.getCell(2).alignment = { horizontal: 'left' };
    if (i % 2 === 1) {
      row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    }
    row.height = 22;
  });

  // ── 2. Hoja REGISTRO MATEMÁTICO (fiel a la UI) ───────────────────────────────
  const buildMathSheet = (ws: ExcelJS.Worksheet, sheetSteps: any[], title: string, sheetParams: Record<string, number>) => {
    const isDDA = sheetSteps.length > 0 && 'xReal' in sheetSteps[0];

    // Nombre de la hoja ya se pone al crear. Aquí solo el encabezado interno.
    let headers: string[];
    if (isEllipse) {
      headers = ['K', 'PK', '(X, Y)', '2ry²x', '2rx²y', 'Fórmula'];
    } else if (isDDA) {
      headers = ['Paso', 'X real', 'Y real', 'Punto', 'Fórmula'];
    } else {
      headers = ['K', 'PK', '(X, Y)', 'Fórmula'];
    }

    let columns: any[] = [];
    if (isDDA) {
      columns = [
        { key: 'step', width: 8 },
        { key: 'xr',   width: 12 },
        { key: 'yr',   width: 12 },
        { key: 'xy',   width: 14 },
        { key: 'formula', width: 60 },
      ];
    } else {
      columns = [
        { key: 'k',      width: 12 },
        { key: 'pk',     width: 12 },
        { key: 'xy',     width: 14 },
        ...(isEllipse
          ? [{ key: 't1', width: 12 }, { key: 't2', width: 12 }]
          : []),
        { key: 'formula', width: 60 },
      ];
    }
    ws.columns = columns;

    // Fila de título de región
    ws.mergeCells(1, 1, 1, headers.length);
    const secCell = ws.getCell('A1');
    secCell.value = title;
    secCell.font = { bold: true, size: 12, color: { argb: COLORS.headerText } };
    secCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.accent } };
    secCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(1).height = 30;

    // Parámetros de Entrada
    ws.addRow([]); // Espacio
    const paramTitleRow = ws.addRow(['Parámetros de Entrada']);
    paramTitleRow.getCell(1).font = { bold: true, color: { argb: COLORS.accent } };
    
    Object.entries(sheetParams).forEach(([k, v]) => {
      const pRow = ws.addRow([k.toUpperCase(), v]);
      pRow.getCell(1).font = { bold: true };
      pRow.getCell(1).alignment = { horizontal: 'right' };
      pRow.getCell(2).alignment = { horizontal: 'left' };
    });
    
    ws.addRow([]); // Espacio antes de la tabla

    // Cabecera de columnas
    const headerRow = ws.addRow(headers);
    applyHeaderStyle(headerRow, headers.length);

    // Filas de datos
    sheetSteps.forEach(step => {
      const [px, py] = getPointXY(step);
      
      let rowData: any[];
      let isNegative = false;
      
      if (isDDA) {
        rowData = [
          step.step,
          step.xReal.toFixed(2),
          step.yReal.toFixed(2),
          `(${px}, ${py})`,
          step.formula ?? ''
        ];
        isNegative = step.step % 2 === 0;
      } else {
        const pk = getPk(step);
        isNegative = pk < 0;
        rowData = isEllipse
          ? [step.step, pk, `(${px}, ${py})`, step.term1 ?? '', step.term2 ?? '', step.formula ?? '']
          : [step.step, pk, `(${px}, ${py})`, step.formula ?? ''];
      }

      const row = ws.addRow(rowData);
      applyDataRow(row, isNegative, headers.length);
    });
  };

  if (isEllipse) {
    const r1Steps = steps.filter(s => s.region === 1);
    const r2Steps = steps.filter(s => s.region === 2);

    const ws1 = wb.addWorksheet('Tabla Región 1');
    buildMathSheet(ws1, r1Steps, '📐 Tabla Región 1 — Punto Medio Elipse', params);

    const ws2 = wb.addWorksheet('Tabla Región 2');
    buildMathSheet(ws2, r2Steps, '📐 Tabla Región 2 — Punto Medio Elipse', params);
  } else {
    const wsM = wb.addWorksheet('Registro Matemático');
    buildMathSheet(wsM, steps, `📐 ${algoLabel[algorithm] ?? algorithm}`, params);
  }

  // ── 3. Hoja PUNTOS FINALES (Coordenadas Trasladadas) ────────────────────────
  const pointsSheet = wb.addWorksheet('Puntos Finales');
  pointsSheet.columns = [
    { key: 'punto', width: 15 },
    { key: 'coord', width: 25 },
  ];
  const pointsHeader = pointsSheet.addRow(['Punto', 'Coordenada Final (cx+x, cy+y)']);
  applyHeaderStyle(pointsHeader, 2);

  const allLitPoints: [number, number][] = [];
  steps.forEach(step => {
    const pts = step.points || (step.point ? [step.point] : []);
    pts.forEach((p: [number, number]) => {
      // Evitar duplicados visuales en la lista
      if (!allLitPoints.some(lp => lp[0] === p[0] && lp[1] === p[1])) {
        allLitPoints.push(p);
        pointsSheet.addRow([`P${allLitPoints.length}`, `(${p[0]}, ${p[1]})`]);
      }
    });
  });

  // ── 4. Hoja PIXEL MATRIX (visual con viewport dinámico) ─────────────────────
  const pixelSheet = wb.addWorksheet('Pixel Matrix');
  const CELL_W = 4;
  const CELL_H = 20;

  // Calculamos el rango real para no exportar celdas infinitas
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  allLitPoints.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });
  
  // Margen
  minX = Math.max(0, minX - 2);
  maxX = maxX + 2;
  minY = Math.max(0, minY - 2);
  maxY = maxY + 2;

  const viewW = maxX - minX + 1;
  const viewH = maxY - minY + 1;

  // Mapa rápido de píxeles encendidos
  const pixelMap = new Set(allLitPoints.map(([px, py]) => `${px},${py}`));
  const lastPx = allLitPoints.length > 0 ? allLitPoints[allLitPoints.length - 1] : null;

  for (let y = maxY; y >= minY; y--) {
    const excelRow = (maxY - y) + 1;
    pixelSheet.getRow(excelRow).height = CELL_H;

    for (let x = minX; x <= maxX; x++) {
      const excelCol = (x - minX) + 1;
      pixelSheet.getColumn(excelCol).width = CELL_W;

      const cell = pixelSheet.getCell(excelRow, excelCol);
      const isLit  = pixelMap.has(`${x},${y}`);
      const isCurr = lastPx && lastPx[0] === x && lastPx[1] === y;

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isCurr ? COLORS.pixelCurr : isLit ? COLORS.pixelOn : COLORS.pixelOff },
      };
      cell.border = {
        top:    { style: 'hair', color: { argb: COLORS.gridLine } },
        left:   { style: 'hair', color: { argb: COLORS.gridLine } },
        bottom: { style: 'hair', color: { argb: COLORS.gridLine } },
        right:  { style: 'hair', color: { argb: COLORS.gridLine } },
      };
    }
  }

  // Leyenda debajo del grid
  const legendRow = viewH + 2;
  pixelSheet.getCell(legendRow, 1).value = `Mostrando área: (${minX}, ${minY}) hasta (${maxX}, ${maxY})`;
  pixelSheet.getCell(legendRow, 1).font = { italic: true, color: { argb: 'FF64748B' } };
  
  pixelSheet.getCell(legendRow + 1, 1).value = '■ Pixel activo';
  pixelSheet.getCell(legendRow + 1, 1).font = { bold: true, color: { argb: COLORS.pixelOn } };
  pixelSheet.getCell(legendRow + 1, 3).value = '■ Pixel actual';
  pixelSheet.getCell(legendRow + 1, 3).font = { bold: true, color: { argb: 'FFCA8A04' } };
  pixelSheet.getCell(legendRow + 1, 5).value = '□ Vacío';
  pixelSheet.getCell(legendRow + 1, 5).font = { color: { argb: 'FF9CA3AF' } };


  // ── 4. Hoja PREVIEW (captura PNG de la app) ───────────────────────────────────
  const element = document.getElementById(containerId);
  if (element) {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const imageBase64 = canvas.toDataURL('image/png').split(',')[1];
      const imageId = wb.addImage({ base64: imageBase64, extension: 'png' });
      const previewSheet = wb.addWorksheet('Preview');
      previewSheet.addImage(imageId, {
        tl: { col: 1, row: 1 },
        ext: { width: 760, height: 560 },
      });
    } catch (err) {
      console.warn('html2canvas no pudo capturar la imagen:', err);
    }
  }

  // ── 5. Hoja CONFIGURACIÓN ────────────────────────────────────────────────────
  const cfgSheet = wb.addWorksheet('Configuración');
  cfgSheet.columns = [
    { key: 'param', width: 22 },
    { key: 'val',   width: 22 },
  ];
  const cfgHeader = cfgSheet.addRow(['Parámetro', 'Valor']);
  applyHeaderStyle(cfgHeader, 2);

  Object.entries(params).forEach(([k, v], i) => {
    const r = cfgSheet.addRow([k.toUpperCase(), v]);
    applyDataRow(r, i % 2 === 0, 2);
  });
  cfgSheet.addRow(['Pasos exportados', steps.length]).height = 22;
  cfgSheet.addRow(['Tamaño de matriz', `${gridSize}×${gridSize}`]).height = 22;

  // ── Descarga ─────────────────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const algo = algorithm.charAt(0).toUpperCase() + algorithm.slice(1);
  saveAs(blob, `GraphicAlgo_${algo}_${Date.now()}.xlsx`);
}
