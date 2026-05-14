import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PixelGridProps {
  litPixels: [number, number][];
  currentPoint?: [number, number];
  gridSize?: number;
  algorithm?: string;
}

const PixelGrid: React.FC<PixelGridProps> = ({ 
  litPixels, 
  currentPoint, 
  gridSize: _unused = 32,
}) => {
  // Calculamos el rango visible de los píxeles para el viewport dinámico
  const bounds = useMemo(() => {
    if (litPixels.length === 0) return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    litPixels.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
    
    if (currentPoint) {
      minX = Math.min(minX, currentPoint[0]);
      maxX = Math.max(maxX, currentPoint[0]);
      minY = Math.min(minY, currentPoint[1]);
      maxY = Math.max(maxY, currentPoint[1]);
    }

    const margin = 1;
    return {
      minX: Math.max(0, minX - margin),
      maxX: maxX + margin,
      minY: Math.max(0, minY - margin),
      maxY: maxY + margin
    };
  }, [litPixels, currentPoint]);

  const { minX, maxX, minY, maxY } = bounds;
  const viewWidth = maxX - minX + 1;
  const viewHeight = maxY - minY + 1;

  const xLabels = useMemo(() => {
    const labels = [];
    for (let x = minX; x <= maxX; x++) labels.push(x);
    return labels;
  }, [minX, maxX]);

  const yLabels = useMemo(() => {
    const labels = [];
    for (let y = minY; y <= maxY; y++) labels.push(y);
    return labels;
  }, [minY, maxY]);

  return (
    <div id="pixel-grid-container" className="flex flex-col items-center justify-center p-4 md:p-8 bg-snow-white rounded-xl border-2 border-cloud-gray shadow-cloud-gray w-full relative">
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between w-full px-2 md:px-4 gap-4 md:gap-0">
        <div className="flex flex-col">
          <span className="text-[11px] md:text-caption font-bold text-silver uppercase tracking-wider">Visualizer (Viewport Dinámico)</span>
          <span className="text-body md:text-heading-sm font-bold text-charcoal">Pixel Matrix</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-md bg-sky-blue"></div>
            <span className="text-[10px] md:text-caption font-bold text-silver uppercase tracking-wider">Puntos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-md bg-sunshine-yellow animate-pulse"></div>
            <span className="text-[10px] md:text-caption font-bold text-silver uppercase tracking-wider">Actual</span>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center relative px-6 md:px-10 pb-10 md:pb-12 pt-4">
        {/* Contenedor unificado para Cuadrícula y Etiquetas */}
        <div 
          className="relative mx-auto"
          style={{ 
            width: '100%',
            maxWidth: viewWidth > viewHeight ? '700px' : `${(viewWidth / viewHeight) * 450}px`,
            aspectRatio: `${viewWidth} / ${viewHeight}`,
            maxHeight: '450px',
          }}
        >
          {/* Y-Axis Labels (Pegadas al borde izquierdo de la cuadrícula) */}
          <div className="absolute left-[-35px] md:left-[-45px] top-0 bottom-0 w-[30px] md:w-[40px] pointer-events-none z-30">
            {yLabels.map((y) => {
              const bottom = ((y - minY) / viewHeight) * 100;
              const height = (1 / viewHeight) * 100;
              return (
                <div 
                  key={`y-${y}`}
                  className="absolute text-[9px] md:text-[11px] font-bold text-silver flex items-center justify-end w-full pr-1 md:pr-2"
                  style={{ 
                    bottom: `${bottom}%`, 
                    height: `${height}%`,
                  }}
                >
                  {y}
                </div>
              );
            })}
          </div>

          {/* X-Axis Labels (Pegadas al borde inferior de la cuadrícula) */}
          <div className="absolute bottom-[-25px] md:bottom-[-35px] left-0 right-0 h-[20px] md:h-[30px] pointer-events-none z-30">
            {xLabels.map((x) => {
              const left = ((x - minX) / viewWidth) * 100;
              const width = (1 / viewWidth) * 100;
              return (
                <div 
                  key={`x-bottom-${x}`}
                  className="absolute text-[9px] md:text-[11px] font-bold text-silver flex justify-center items-start pt-1 md:pt-2"
                  style={{ 
                    left: `${left}%`, 
                    width: `${width}%`,
                  }}
                >
                  {x}
                </div>
              );
            })}
          </div>

          {/* Grid Container (Ocupa el 100% del wrapper con aspect-ratio) */}
          <div 
            className="w-full h-full bg-snow-white rounded-lg border-2 border-cloud-gray overflow-hidden shadow-inner cursor-crosshair relative"
            style={{ 
              backgroundImage: `
                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
              `,
              backgroundSize: `${100 / viewWidth}% ${100 / viewHeight}%`,
            }}
          >
            <AnimatePresence>
              {litPixels.map(([x, y], idx) => {
                const isCurrent = currentPoint && currentPoint[0] === x && currentPoint[1] === y;
                const left = ((x - minX) / viewWidth) * 100;
                const bottom = ((y - minY) / viewHeight) * 100;
                
                return (
                  <motion.div
                    key={`${x},${y}-${idx}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 0.95, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`absolute rounded-sm transition-colors duration-300
                      ${isCurrent 
                        ? 'bg-sunshine-yellow shadow-[0_2px_0_#e5b300] z-20' 
                        : 'bg-sky-blue shadow-[0_2px_0_#1899d6] z-10'}`}
                    style={{
                      left: `${left}%`,
                      bottom: `${bottom}%`,
                      width: `${100 / viewWidth}%`,
                      height: `${100 / viewHeight}%`,
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default PixelGrid;
