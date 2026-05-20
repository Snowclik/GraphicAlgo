import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, EyeOff } from 'lucide-react';
import type { AnyStep } from '../hooks/useAlgorithm';

interface StepTableProps {
  steps: AnyStep[];
  currentIndex: number;
  onExport: () => void;
  allStepsCount: number;
  algorithm: string;
  params?: Record<string, number>;
}

const StepTable: React.FC<StepTableProps> = ({ steps, currentIndex, onExport, allStepsCount, algorithm, params }) => {
  const [showMathSteps, setShowMathSteps] = useState(false);
  const isBresenham = algorithm === 'bresenham';
  const isEllipse = steps.length > 0 && 'region' in steps[0];
  const isDDA = steps.length > 0 && 'xReal' in steps[0];
  
  const region1Steps = isEllipse ? (steps as any[]).filter(s => s.region === 1) : [];
  const region2Steps = isEllipse ? (steps as any[]).filter(s => s.region === 2) : [];

  const renderTable = (tableSteps: AnyStep[], title?: string) => (
    <div className="mb-8">
      {title && <h4 className="text-caption font-bold text-sky-blue uppercase mb-2 ml-2">{title}</h4>}
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead>
            <tr className="border-b-2 border-cloud-gray text-caption font-bold text-silver uppercase tracking-wider">
              {isBresenham ? (
                <>
                  <th className="py-3 px-4">k</th>
                  <th className="py-3 px-4">x</th>
                  <th className="py-3 px-4">y</th>
                  <th className="py-3 px-4">p</th>
                  <th className="py-3 px-4">Puntos</th>
                </>
              ) : (
                <>
                  <th className="py-3 px-4">Paso</th>
                  {isDDA ? (
                    <>
                      <th className="py-3 px-4">X real</th>
                      <th className="py-3 px-4">Y real</th>
                      <th className="py-3 px-4">Punto</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-4">pk</th>
                      <th className="py-3 px-4">(x, y)</th>
                    </>
                  )}
                  {isEllipse && (
                    <>
                      <th className="py-3 px-4">2ry²x</th>
                      <th className="py-3 px-4">2rx²y</th>
                    </>
                  )}
                </>
              )}
              <th className="py-3 px-4 hidden lg:table-cell">Fórmula</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {tableSteps.map((step) => {
                const globalIdx = steps.indexOf(step);
                const isCurrent = globalIdx === currentIndex;
                
                // Para DDA no hay pk, coloreamos alternado
                const pkValue = 'pk' in step ? step.pk : ('d' in step ? (step as any).d : 0);
                const isNegative = isDDA ? (step.step % 2 === 0) : pkValue < 0;
                const bgColorClass = isNegative ? 'bg-duo-green-light/50' : 'bg-[#ffe4b8]/50';

                let pointX: number;
                let pointY: number;

                if ('x' in step && 'y' in step) {
                  pointX = (step as any).x;
                  pointY = (step as any).y;
                } else if ('point' in step) {
                  pointX = (step as any).point[0];
                  pointY = (step as any).point[1];
                } else {
                  pointX = (step as any).points[0][0];
                  pointY = (step as any).points[0][1];
                }

                return (
                  <motion.tr
                    key={`${step.step}-${(step as any).region || ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border-b-2 border-cloud-gray transition-colors
                      ${isCurrent ? 'border-l-4 border-l-sky-blue' : ''}
                      ${bgColorClass} hover:brightness-95
                    `}
                  >
                    {isBresenham ? (
                      <>
                        <td className="py-4 px-4 text-body font-bold text-charcoal">{step.step}</td>
                        <td className="py-4 px-4 text-body font-bold text-charcoal">{pointX}</td>
                        <td className="py-4 px-4 text-body font-bold text-charcoal">{pointY}</td>
                        <td className="py-4 px-4 text-body font-bold text-charcoal">{pkValue}</td>
                        <td className="py-4 px-4 text-body font-bold text-charcoal">({pointX}, {pointY})</td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4 text-body font-bold text-charcoal">{step.step}</td>
                        {isDDA ? (
                          <>
                            <td className="py-4 px-4 text-body font-bold text-charcoal">{(step as any).xReal.toFixed(2)}</td>
                            <td className="py-4 px-4 text-body font-bold text-charcoal">{(step as any).yReal.toFixed(2)}</td>
                            <td className="py-4 px-4 text-body font-bold text-charcoal">({pointX}, {pointY})</td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-4 text-body font-bold text-charcoal">{pkValue}</td>
                            <td className="py-4 px-4 text-body font-bold text-charcoal">({pointX}, {pointY})</td>
                          </>
                        )}
                        {isEllipse && (
                          <>
                            <td className="py-4 px-4 text-body font-bold text-graphite">{(step as any).term1}</td>
                            <td className="py-4 px-4 text-body font-bold text-graphite">{(step as any).term2}</td>
                          </>
                        )}
                      </>
                    )}
                    <td className="py-4 px-4 text-caption font-bold text-graphite italic hidden lg:table-cell">{step.formula}</td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );

  React.useEffect(() => {
    setShowMathSteps(false);
  }, [algorithm]);

  const renderMathSteps = () => {
    const rx = params?.rx ?? 0;
    const ry = params?.ry ?? 0;
    const cx = params?.cx ?? 0;
    const cy = params?.cy ?? 0;
    const rx2 = rx * rx;
    const ry2 = ry * ry;

    const ellipseSteps = steps as any[];

    // Calculate initial parameter for Region 1
    const p1_0 = Math.round(ry2 - rx2 * ry + 0.25 * rx2);

    // Find Region 1 steps
    const r1Steps = ellipseSteps.filter(s => s.region === 1);

    // Calculate initial parameter for Region 2 if there's any R2 step visible or if R1 is done
    const lastR1Step = r1Steps[r1Steps.length - 1] || ellipseSteps.find(s => s.region === 1 && s.step === (ellipseSteps.filter(x => x.region === 1).length - 1));
    const xLast = lastR1Step ? lastR1Step.x : 0;
    const yLast = lastR1Step ? lastR1Step.y : ry;
    const p2_0 = Math.round(ry2 * (xLast + 0.5) ** 2 + rx2 * (yLast - 1) ** 2 - rx2 * ry2);

    return (
      <div className="space-y-6">
        {/* Leyenda de Colores */}
        <div className="bg-snow-white p-5 rounded-2xl border-2 border-cloud-gray shadow-sm">
          <h4 className="text-caption font-bold text-sky-blue uppercase tracking-wider mb-3">
            Leyenda de Variables y Parámetros
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-body">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-lg bg-amber-100 border border-amber-300 block"></span>
              <span className="text-charcoal font-bold text-caption">p<sub>k</sub></span>
              <span className="text-silver text-caption">Decisión</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-lg bg-purple-100 border border-purple-300 block"></span>
              <span className="text-purple-800 font-bold text-caption">r<sub>x</sub> = {rx}</span>
              <span className="text-silver text-caption">Radio X</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-lg bg-sky-100 border border-sky-300 block"></span>
              <span className="text-sky-800 font-bold text-caption">r<sub>y</sub> = {ry}</span>
              <span className="text-silver text-caption">Radio Y</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-lg bg-emerald-100 border border-emerald-300 block"></span>
              <span className="text-emerald-800 font-bold text-caption">x</span>
              <span className="text-silver text-caption">Coord. X</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-lg bg-pink-100 border border-pink-300 block"></span>
              <span className="text-pink-800 font-bold text-caption">y</span>
              <span className="text-silver text-caption">Coord. Y</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-cloud-gray text-caption font-bold text-graphite font-mono">
            <div>r<sub>x</sub>² = {rx2}</div>
            <div>r<sub>y</sub>² = {ry2}</div>
            <div>2r<sub>x</sub>² = {2 * rx2}</div>
            <div>2r<sub>y</sub>² = {2 * ry2}</div>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4">
          {/* REGION 1 INITIALIZATION */}
          {r1Steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border-2 border-cloud-gray bg-snow-white shadow-sm border-l-4 border-l-sky-blue"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption font-bold text-sky-blue uppercase tracking-wider">Región 1</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold uppercase">Inicialización</span>
              </div>
              <div className="space-y-2 text-body">
                <div>
                  Fórmula del parámetro inicial:
                  <div className="my-2 p-2 bg-cloud-gray/30 rounded-lg font-mono font-bold text-center">
                    p1<sub>0</sub> = r<sub>y</sub>² - r<sub>x</sub>²·r<sub>y</sub> + ¼·r<sub>x</sub>²
                  </div>
                </div>
                <div className="text-graphite">
                  Sustitución de valores:
                  <div className="my-2 p-2 bg-cloud-gray/30 rounded-lg font-mono text-center">
                    p1<sub>0</sub> = <span className="text-sky-600 font-bold">{ry}</span>² - <span className="text-purple-600 font-bold">{rx}</span>²·<span className="text-sky-600 font-bold">{ry}</span> + 0.25·<span className="text-purple-600 font-bold">{rx}</span>²
                  </div>
                  <div className="my-2 p-2 bg-cloud-gray/30 rounded-lg font-mono text-center">
                    p1<sub>0</sub> = <span className="text-sky-600 font-bold">{ry2}</span> - <span className="text-purple-600 font-bold">{rx2}</span>·<span className="text-sky-600 font-bold">{ry}</span> + 0.25·<span className="text-purple-600 font-bold">{rx2}</span>
                  </div>
                  <div className="my-2 p-2 bg-cloud-gray/30 rounded-lg font-mono text-center">
                    p1<sub>0</sub> = {ry2} - {rx2 * ry} + {0.25 * rx2} = <span className="text-amber-600 font-bold font-mono">{p1_0}</span>
                  </div>
                </div>
                <p className="text-caption font-bold text-graphite mt-2">
                  Punto de partida: (0, r<sub>y</sub>) = (0, {ry})
                </p>
              </div>
            </motion.div>
          )}

          {/* ITERATION STEPS */}
          {ellipseSteps.map((step, idx) => {
            const isR1 = step.region === 1;
            const stepNum = step.step;
            const pk = step.pk;
            const isNegative = isR1 ? pk < 0 : pk <= 0;
            const decisionType = step.decision;
            
            let formulaElement: React.ReactNode;
            
            if (isR1) {
              if (decisionType === 'xOnly') {
                formulaElement = (
                  <>
                    p<sub>k+1</sub> = p<sub>k</sub> + 2r<sub>y</sub>²·x<sub>k+1</sub> + r<sub>y</sub>²
                  </>
                );
              } else {
                formulaElement = (
                  <>
                    p<sub>k+1</sub> = p<sub>k</sub> + 2r<sub>y</sub>²·x<sub>k+1</sub> - 2r<sub>x</sub>²·y<sub>k+1</sub> + r<sub>y</sub>²
                  </>
                );
              }
            } else {
              if (decisionType === 'yOnly') {
                formulaElement = (
                  <>
                    p<sub>k+1</sub> = p<sub>k</sub> - 2r<sub>x</sub>²·y<sub>k+1</sub> + r<sub>x</sub>²
                  </>
                );
              } else {
                formulaElement = (
                  <>
                    p<sub>k+1</sub> = p<sub>k</sub> + 2r<sub>y</sub>²·x<sub>k+1</sub> - 2r<sub>x</sub>²·y<sub>k+1</sub> + r<sub>y</sub>²
                  </>
                );
              }
            }

            const nextPkValue = isR1 
              ? (decisionType === 'xOnly' ? pk + step.term1 + ry2 : pk + step.term1 - step.term2 + ry2)
              : (decisionType === 'yOnly' ? pk - step.term2 + rx2 : pk + step.term1 - step.term2 + ry2);

            let prevX = 0;
            let prevY = 0;
            if (idx === 0) {
              prevX = 0;
              prevY = ry;
            } else {
              prevX = ellipseSteps[idx - 1].x;
              prevY = ellipseSteps[idx - 1].y;
            }

            const borderCol = isNegative ? "border-l-4 border-l-emerald-400" : "border-l-4 border-l-amber-400";
            const bgCol = isNegative ? "bg-emerald-50/10" : "bg-amber-50/10";

            const symPts = [
              `(${cx + step.x}, ${cy + step.y})`,
              `(${cx - step.x}, ${cy + step.y})`,
              `(${cx + step.x}, ${cy - step.y})`,
              `(${cx - step.x}, ${cy - step.y})`
            ];
            const uniqueSymPts = Array.from(new Set(symPts));
            const isCurrent = idx === currentIndex;

            return (
              <React.Fragment key={`${step.step}-${step.region}`}>
                {/* R2 INITIALIZATION DETECTED BEFORE THE FIRST STEP OF REGION 2 */}
                {!isR1 && stepNum === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border-2 border-cloud-gray bg-snow-white shadow-sm border-l-4 border-l-sky-blue my-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-caption font-bold text-sky-blue uppercase tracking-wider">Región 2</span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold uppercase">Inicialización</span>
                    </div>
                    <div className="space-y-2 text-body">
                      <div>
                        Fórmula del parámetro inicial:
                        <div className="my-2 p-2 bg-cloud-gray/30 rounded-lg font-mono font-bold text-center">
                          p2<sub>0</sub> = r<sub>y</sub>²·(x₀ + ½)² + r<sub>x</sub>²·(y₀ - 1)² - r<sub>x</sub>²·r<sub>y</sub>²
                        </div>
                      </div>
                      <div className="text-graphite">
                        Usando el último punto de la Región 1: (x₀, y₀) = ({xLast}, {yLast})
                        <div className="my-2 p-2 bg-cloud-gray/30 rounded-lg font-mono text-center">
                          p2<sub>0</sub> = <span className="text-sky-600 font-bold">{ry}</span>²·(<span className="text-emerald-600 font-bold">{xLast}</span> + 0.5)² + <span className="text-purple-600 font-bold">{rx}</span>²·(<span className="text-pink-600 font-bold">{yLast}</span> - 1)² - <span className="text-purple-600 font-bold">{rx}</span>²·<span className="text-sky-600 font-bold">{ry}</span>²
                        </div>
                        <div className="my-2 p-2 bg-cloud-gray/30 rounded-lg font-mono text-center">
                          p2<sub>0</sub> = <span className="text-sky-600 font-bold">{ry2}</span>·({(xLast + 0.5).toFixed(1)})² + <span className="text-purple-600 font-bold">{rx2}</span>·({yLast - 1})² - {rx2 * ry2}
                        </div>
                        <div className="my-2 p-2 bg-cloud-gray/30 rounded-lg font-mono text-center">
                          p2<sub>0</sub> = <span className="text-sky-600 font-bold">{ry2}</span>·{(xLast + 0.5) ** 2} + <span className="text-purple-600 font-bold">{rx2}</span>·{(yLast - 1) ** 2} - {rx2 * ry2}
                        </div>
                        <div className="my-2 p-2 bg-cloud-gray/30 rounded-lg font-mono text-center">
                          p2<sub>0</sub> = {Math.round(ry2 * (xLast + 0.5) ** 2)} + {rx2 * (yLast - 1) ** 2} - {rx2 * ry2} = <span className="text-amber-600 font-bold font-mono">{p2_0}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ITERATION STEP CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-2xl border-2 border-cloud-gray bg-snow-white shadow-sm transition-all duration-200
                    ${isCurrent ? 'ring-2 ring-sky-blue ring-offset-2 scale-[1.01] shadow-md' : ''}
                    ${borderCol} ${bgCol}
                  `}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-caption font-bold text-charcoal">
                        Paso {stepNum} ({isR1 ? 'Región 1' : 'Región 2'})
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-bold uppercase animate-pulse">
                          Paso Actual
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                      ${isNegative ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}
                    >
                      {isR1 
                        ? (pk < 0 ? 'p < 0 → Solo X' : 'p ≥ 0 → X e Y')
                        : (pk > 0 ? 'p > 0 → Solo Y' : 'p ≤ 0 → X e Y')
                      }
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left side: Evaluation & Coordinates */}
                    <div className="space-y-2 text-body">
                      <div>
                        <span className="text-graphite">Evaluando parámetro de decisión:</span>
                        <div className="font-mono mt-1">
                          p<sub>{stepNum}</sub> = <span className="font-bold text-amber-600 bg-amber-100 px-1 rounded">{pk}</span>
                          {isR1 ? (
                            pk < 0 ? " < 0 (Negativo)" : " ≥ 0 (Positivo/Cero)"
                          ) : (
                            pk > 0 ? " > 0 (Positivo)" : " ≤ 0 (Negativo/Cero)"
                          )}
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-graphite">Coordenadas del punto en la elipse:</span>
                        <div className="font-mono mt-1 text-charcoal">
                          (x<sub>k</sub>, y<sub>k</sub>) anterior: <span className="font-bold">({prevX}, {prevY})</span>
                          <br />
                          {decisionType === 'xOnly' && <span>Avanza X: x + 1 = <span className="text-emerald-600 font-bold">{step.x}</span>, y queda igual: <span className="text-pink-600 font-bold">{step.y}</span></span>}
                          {decisionType === 'both' && <span>Avanzan ambos: x + 1 = <span className="text-emerald-600 font-bold">{step.x}</span>, y - 1 = <span className="text-pink-600 font-bold">{step.y}</span></span>}
                          {decisionType === 'yOnly' && <span>Avanza Y: y - 1 = <span className="text-pink-600 font-bold">{step.y}</span>, x queda igual: <span className="text-emerald-600 font-bold">{step.x}</span></span>}
                        </div>
                      </div>

                      <div className="pt-2 text-caption">
                        <span className="text-silver font-bold uppercase block tracking-wider mb-1">Puntos Simétricos Dibujados</span>
                        <div className="flex flex-wrap gap-2">
                          {uniqueSymPts.map((pStr, i) => (
                            <span key={i} className="px-2 py-1 bg-cloud-gray/50 rounded-lg text-graphite font-mono font-semibold">
                              {pStr}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-cloud-gray/60 mt-3 text-[13px]">
                        <span className="text-silver font-bold uppercase block tracking-wider mb-1">Cálculo de Términos Auxiliares</span>
                        <div className="font-mono text-charcoal space-y-1">
                          <div>
                            2r<sub>y</sub>²x = 2 · <span className="text-sky-600 font-bold">{ry2}</span> · <span className="text-emerald-600 font-bold">{step.x}</span> = <span className="text-purple-700 font-bold">{step.term1}</span>
                          </div>
                          <div>
                            2r<sub>x</sub>²y = 2 · <span className="text-purple-600 font-bold">{rx2}</span> · <span className="text-pink-600 font-bold">{step.y}</span> = <span className="text-indigo-700 font-bold">{step.term2}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Calculation details */}
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-cloud-gray pt-3 md:pt-0 md:pl-4">
                      <span className="text-graphite block">Cálculo del siguiente parámetro:</span>
                      <div className="space-y-1 text-body">
                        <div className="text-[13px] text-silver font-mono italic">
                          Fórmula: {formulaElement}
                        </div>
                        <div className="font-mono text-charcoal break-all text-[14px] leading-relaxed">
                          Reemplazo:
                          <br />
                          p<sub>{stepNum+1}</sub> = <span className="text-amber-600 font-bold bg-amber-50 px-1 rounded">{pk}</span>
                          {isR1 ? (
                            decisionType === 'xOnly' ? (
                              <> + 2·<span className="text-sky-600 font-bold">{ry2}</span>·(<span className="text-emerald-600 font-bold">{step.x}</span>) + <span className="text-sky-600 font-bold">{ry2}</span></>
                            ) : (
                              <> + 2·<span className="text-sky-600 font-bold">{ry2}</span>·(<span className="text-emerald-600 font-bold">{step.x}</span>) - 2·<span className="text-purple-600 font-bold">{rx2}</span>·(<span className="text-pink-600 font-bold">{step.y}</span>) + <span className="text-sky-600 font-bold">{ry2}</span></>
                            )
                          ) : (
                            decisionType === 'yOnly' ? (
                              <> - 2·<span className="text-purple-600 font-bold">{rx2}</span>·(<span className="text-pink-600 font-bold">{step.y}</span>) + <span className="text-purple-600 font-bold">{rx2}</span></>
                            ) : (
                              <> + 2·<span className="text-sky-600 font-bold">{ry2}</span>·(<span className="text-emerald-600 font-bold">{step.x}</span>) - 2·<span className="text-purple-600 font-bold">{rx2}</span>·(<span className="text-pink-600 font-bold">{step.y}</span>) + <span className="text-sky-600 font-bold">{ry2}</span></>
                            )
                          )}
                        </div>

                        <div className="font-mono text-charcoal break-all text-[14px]">
                          Evaluando términos:
                          <br />
                          p<sub>{stepNum+1}</sub> = {pk}
                          {isR1 ? (
                            decisionType === 'xOnly' ? (
                              <> + <span className="text-purple-700 font-bold">{step.term1}</span> + {ry2}</>
                            ) : (
                              <> + <span className="text-purple-700 font-bold">{step.term1}</span> - <span className="text-indigo-700 font-bold">{step.term2}</span> + {ry2}</>
                            )
                          ) : (
                            decisionType === 'yOnly' ? (
                              <> - <span className="text-indigo-700 font-bold">{step.term2}</span> + {rx2}</>
                            ) : (
                              <> + <span className="text-purple-700 font-bold">{step.term1}</span> - <span className="text-indigo-700 font-bold">{step.term2}</span> + {ry2}</>
                            )
                          )}
                        </div>

                        <div className="pt-2 border-t border-dashed border-cloud-gray flex items-center justify-between">
                          <span className="font-bold text-charcoal">Siguiente p:</span>
                          <span className="font-mono font-bold text-heading-sm text-sky-blue">
                            p<sub>{stepNum+1}</sub> = {nextPkValue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-snow-white rounded-xl border-2 border-cloud-gray shadow-cloud-gray overflow-hidden">
      <div className="p-4 md:p-6 border-b-2 border-cloud-gray bg-snow-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-heading-sm font-bold text-charcoal">Registro de Pasos</h3>
            <p className="text-caption font-bold text-silver uppercase tracking-wider mt-1">Lógica Matemática</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {algorithm === 'ellipse' && allStepsCount > 0 && (
              <button
                onClick={() => setShowMathSteps(prev => !prev)}
                className={`btn-3d flex items-center justify-center p-2.5 rounded-xl border-2 transition-all text-sky-blue border-sky-blue/40 bg-sky-blue/10 shadow-[0_3px_0_rgba(28,176,246,0.3)] active:translate-y-1 hover:bg-sky-blue/20`}
                title={showMathSteps ? "Ver Tabla de Registro" : "Ver Fórmulas Paso a Paso"}
              >
                {showMathSteps ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            <button
              onClick={onExport}
              disabled={allStepsCount === 0}
              className={`btn-3d flex items-center gap-2 px-4 py-2 rounded-xl text-caption font-bold uppercase tracking-wider border-2 transition-all
                ${allStepsCount > 0 
                  ? 'bg-duo-green text-snow-white border-[#3f8f01] shadow-[0_3px_0_#3f8f01]' 
                  : 'bg-cloud-gray text-silver border-silver cursor-not-allowed opacity-50'}`}
            >
              <Download size={16} />
              Excel
            </button>
            <div className="px-3 py-1.5 bg-sky-blue/10 rounded-xl text-sky-blue text-caption font-bold border-2 border-sky-blue/20">
              {allStepsCount} Pasos
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-4 font-sans">
        {allStepsCount > 0 ? (
          <>
            {algorithm === 'ellipse' && showMathSteps ? (
              renderMathSteps()
            ) : isEllipse ? (
              <>
                {renderTable(region1Steps, "Tabla Región 1")}
                {renderTable(region2Steps, "Tabla Región 2")}
              </>
            ) : (
              renderTable(steps)
            )}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-40 py-20">
            <div className="w-12 h-12 border-4 border-dashed border-silver rounded-xl mb-4"></div>
            <p className="text-caption font-bold uppercase tracking-widest text-silver">Esperando ejecución...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepTable;
