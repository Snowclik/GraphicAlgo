import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import type { AnyStep } from '../hooks/useAlgorithm';

interface StepTableProps {
  steps: AnyStep[];
  currentIndex: number;
  onExport: () => void;
  allStepsCount: number;
}

const StepTable: React.FC<StepTableProps> = ({ steps, currentIndex, onExport, allStepsCount }) => {
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

  return (
    <div className="flex flex-col h-full bg-snow-white rounded-xl border-2 border-cloud-gray shadow-cloud-gray overflow-hidden">
      <div className="p-4 md:p-6 border-b-2 border-cloud-gray bg-snow-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-heading-sm font-bold text-charcoal">Registro de Pasos</h3>
            <p className="text-caption font-bold text-silver uppercase tracking-wider mt-1">Lógica Matemática</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-4">
        {allStepsCount > 0 ? (
          <>
            {isEllipse ? (
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
