export interface DDAStep {
  step: number;
  xReal: number;
  yReal: number;
  xRound: number;
  yRound: number;
  point: [number, number]; // [xRound, yRound]
  formula: string;
}

export function runDDA(x0: number, y0: number, x1: number, y1: number) {
  const steps: DDAStep[] = [];
  
  const dx = x1 - x0;
  const dy = y1 - y0;
  const numSteps = Math.max(Math.abs(dx), Math.abs(dy));
  
  const xInc = numSteps === 0 ? 0 : dx / numSteps;
  const yInc = numSteps === 0 ? 0 : dy / numSteps;

  let currentX = x0;
  let currentY = y0;

  for (let k = 0; k <= numSteps; k++) {
    const xRound = Math.round(currentX);
    const yRound = Math.round(currentY);

    let formula = '';
    if (k === 0) {
      formula = `Inicio: dx=${dx}, dy=${dy}, pasos=${numSteps}, Xinc=${xInc.toFixed(2)}, Yinc=${yInc.toFixed(2)}`;
    } else {
      formula = `X = ${currentX.toFixed(2)}, Y = ${currentY.toFixed(2)}`;
    }

    steps.push({
      step: k,
      xReal: currentX,
      yReal: currentY,
      xRound,
      yRound,
      point: [xRound, yRound],
      formula
    });

    currentX += xInc;
    currentY += yInc;
  }

  return { steps };
}
