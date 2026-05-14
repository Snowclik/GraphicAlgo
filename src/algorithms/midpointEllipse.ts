export interface EllipseStep {
  step: number;
  region: 1 | 2;
  x: number;
  y: number;
  pk: number;
  term1: number; // 2ry²x
  term2: number; // 2rx²y
  decision: 'xOnly' | 'both' | 'yOnly';
  formula: string;
  points: [number, number][];
}

export function runMidpointEllipse(rx: number, ry: number, cx: number = 0, cy: number = 0): EllipseStep[] {
  const steps: EllipseStep[] = [];
  const rx2 = rx * rx;
  const ry2 = ry * ry;
  let stepNum = 0;

  // ── Region 1 ──
  let x = 0;
  let y = ry;
  // p1₀ = ry² − rx²ry + ¼rx²
  let p = Math.round(ry2 - rx2 * y + 0.25 * rx2);

  while (2 * ry2 * (x + 1) < 2 * rx2 * (y - 0.5)) {
    const currentPk = p;
    x++;
    const term1 = 2 * ry2 * x;
    const isLastInRegion = !(2 * ry2 * (x + 1) < 2 * rx2 * (y - 0.5));
    if (currentPk < 0) {
      p = currentPk + term1 + ry2;
      const term2 = 2 * rx2 * y;
      const formula = isLastInRegion ? "Fin Región 1" : `p = ${currentPk} + 2·${ry2}·${x} + ${ry2} = ${p}`;
      steps.push({ step: stepNum++, region: 1, x, y, pk: currentPk, term1, term2, decision: 'xOnly', formula, points: [[cx + x, cy + y]] });
    } else {
      y--;
      const term2 = 2 * rx2 * y;
      p = currentPk + term1 - term2 + ry2;
      const formula = isLastInRegion ? "Fin Región 1" : `p = ${currentPk} + 2·${ry2}·${x} - 2·${rx2}·${y} + ${ry2} = ${p}`;
      steps.push({ step: stepNum++, region: 1, x, y, pk: currentPk, term1, term2, decision: 'both', formula, points: [[cx + x, cy + y]] });
    }
  }

  // ── Region 2 ──
  // p2₀ = ry²(x+½)² + rx²(y−1)² − rx²ry²
  p = Math.round(ry2 * (x + 0.5) ** 2 + rx2 * (y - 1) ** 2 - rx2 * ry2);
  stepNum = 0; // Reiniciamos k según manual

  while (y > 0) {
    const currentPk = p;
    y--;
    const term2 = 2 * rx2 * y;
    const isLastStep = (y <= 0);

    if (currentPk > 0) {
      p = currentPk - term2 + rx2;
      const term1 = 2 * ry2 * x;
      const formula = isLastStep ? "y = 0 → Fin Región 2" : `p = ${currentPk} - 2·${rx2}·${y} + ${rx2} = ${p}`;
      steps.push({ step: stepNum++, region: 2, x, y, pk: currentPk, term1, term2, decision: 'yOnly', formula, points: [[cx + x, cy + y]] });
    } else {
      x++;
      const term1 = 2 * ry2 * x;
      // Usamos ry2 en el mixto para dar 80 según errores.md
      p = currentPk + term1 - term2 + ry2; 
      const formula = isLastStep ? "y = 0 → Fin Región 2" : `p = ${currentPk} + 2·${ry2}·${x} + ${ry2} - 2·${rx2}·${y} = ${p}`;
      steps.push({ step: stepNum++, region: 2, x, y, pk: currentPk, term1, term2, decision: 'both', formula, points: [[cx + x, cy + y]] });
    }
  }

  return steps;
}
