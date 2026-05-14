export interface BresenhamStep {
  step: number;
  x: number;
  y: number;
  d: number;
  decision: 'E' | 'NE';
  formula: string;
  point: [number, number];
}

export interface BresenhamResult {
  steps: BresenhamStep[];
  dx: number;
  dy: number;
  d0: number;
  dE: number;
  dNE: number;
}

export function runBresenham(x0: number, y0: number, x1: number, y1: number): BresenhamResult {
  const steps: BresenhamStep[] = [];

  // Handle general case with octant normalization
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);

  const steep = dy > dx;
  if (steep) {
    [x0, y0] = [y0, x0];
    [x1, y1] = [y1, x1];
    [dx, dy] = [dy, dx];
  }

  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;

  const dE = 2 * dy;
  const dNE = 2 * (dy - dx);
  let d = 2 * dy - dx;
  const d0 = d;

  let x = x0;
  let y = y0;
  let stepNum = 0;

  // Initial point
  const initPx: [number, number] = steep ? [y, x] : [x, y];
  steps.push({
    step: stepNum,
    x: steep ? y : x,
    y: steep ? x : y,
    d,
    decision: 'E',
    formula: `d₀ = 2·dy - dx = 2·${dy} - ${dx} = ${d}`,
    point: initPx,
  });

  while (x !== x1) {
    stepNum++;
    if (d <= 0) {
      const newD = d + dE;
      const formula = `d = ${d} + dE(${dE}) = ${newD} → solo X avanza`;
      x += sx;
      d = newD;
      const px: [number, number] = steep ? [y, x] : [x, y];
      steps.push({ step: stepNum, x: steep ? y : x, y: steep ? x : y, d, decision: 'E', formula, point: px });
    } else {
      const newD = d + dNE;
      const formula = `d = ${d} + dNE(${dNE}) = ${newD} → X e Y avanzan`;
      x += sx;
      y += sy;
      d = newD;
      const px: [number, number] = steep ? [y, x] : [x, y];
      steps.push({ step: stepNum, x: steep ? y : x, y: steep ? x : y, d, decision: 'NE', formula, point: px });
    }
  }

  return {
    steps,
    dx: Math.abs(x1 - x0),
    dy: Math.abs(y1 - y0),
    d0,
    dE,
    dNE,
  };
}
