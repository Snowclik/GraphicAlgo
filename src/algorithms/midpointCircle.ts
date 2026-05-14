export interface CircleStep {
  step: number;
  x: number;
  y: number;
  pk: number;
  decision: 'stay' | 'down';
  formula: string;
  points: [number, number][];
}

export function runMidpointCircle(r: number, cx: number = 0, cy: number = 0): CircleStep[] {
  const steps: CircleStep[] = [];
  let x = 0;
  let y = r;
  let pk = 1 - r;
  let stepNum = 0;

  steps.push({
    step: stepNum,
    x,
    y,
    pk,
    decision: 'stay',
    formula: `p₀ = 1 - r = 1 - ${r} = ${pk}`,
    points: [[cx + x, cy + y]],
  });

  while (x < y) {
    stepNum++;
    x++;
    
    // Determinamos si es el último paso para evitar el cálculo innecesario de pk
    const isLastStep = x >= y;

    if (pk < 0) {
      const formula = isLastStep 
        ? `Fin del octante (${x} ≥ ${y})` 
        : `p = ${pk} + 2·${x} + 1 = ${pk + 2 * x + 1} → Y se queda (${y})`;
      
      steps.push({
        step: stepNum, x, y, pk, decision: 'stay', formula,
        points: [[cx + x, cy + y]],
      });
      
      if (!isLastStep) pk = pk + 2 * x + 1;
    } else {
      y--;
      // Si después de bajar y, x >= y, ya no calculamos el siguiente pk
      const formula = (x > y)
        ? `Fin del octante (${x} > ${y})`
        : `p = ${pk} + 2·${x} + 1 - 2·${y} = ${pk + 2 * x + 1 - 2 * y} → Y baja a ${y}`;

      steps.push({
        step: stepNum, x, y, pk, decision: 'down', formula,
        points: [[cx + x, cy + y]],
      });

      if (x <= y) pk = pk + 2 * x + 1 - 2 * y;
    }
    
    if (x >= y) break;
  }

  return steps;
}
