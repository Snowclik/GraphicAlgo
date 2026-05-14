import { useState, useCallback, useRef, useEffect } from 'react';
import { runBresenham, type BresenhamStep } from '../algorithms/bresenham';
import { runMidpointCircle, type CircleStep } from '../algorithms/midpointCircle';
import { runMidpointEllipse, type EllipseStep } from '../algorithms/midpointEllipse';
import { runDDA, type DDAStep } from '../algorithms/dda';

export type AlgorithmType = 'bresenham' | 'dda' | 'circle' | 'ellipse';

export type AnyStep = BresenhamStep | CircleStep | EllipseStep | DDAStep;

export function useAlgorithm() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bresenham');
  const [allSteps, setAllSteps] = useState<AnyStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [gridSize, setGridSize] = useState(11);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visibleSteps = allSteps.slice(0, currentIndex + 1);
  const isComplete = allSteps.length > 0 && currentIndex >= allSteps.length - 1;

  const litPixels: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i <= currentIndex; i++) {
    const step = allSteps[i];
    if (!step) continue;
    const pts: [number, number][] = 'point' in step ? [step.point] : ('points' in step ? step.points : []);
    for (const [px, py] of pts) {
      const key = `${px},${py}`;
      if (!seen.has(key)) {
        seen.add(key);
        litPixels.push([px, py]);
      }
    }
  }

  const [lastParams, setLastParams] = useState<Record<string, number>>({});

  const runAlgorithm = useCallback((params: Record<string, number>) => {
    setLastParams(params);
    let steps: AnyStep[] = [];
    let maxCoord = 0;

    if (algorithm === 'bresenham') {
      const result = runBresenham(params.x0, params.y0, params.x1, params.y1);
      steps = result.steps;
      maxCoord = Math.max(params.x0, params.y0, params.x1, params.y1);
    } else if (algorithm === 'dda') {
      const result = runDDA(params.x0, params.y0, params.x1, params.y1);
      steps = result.steps;
      maxCoord = Math.max(params.x0, params.y0, params.x1, params.y1);
    } else if (algorithm === 'circle') {
      const cx = params.cx ?? 0;
      const cy = params.cy ?? 0;
      steps = runMidpointCircle(params.r, cx, cy);
      maxCoord = Math.max(cx + params.r, cy + params.r);
    } else {
      const cx = params.cx ?? 0;
      const cy = params.cy ?? 0;
      steps = runMidpointEllipse(params.rx, params.ry, cx, cy);
      maxCoord = Math.max(cx + params.rx, cy + params.ry);
    }

    setGridSize(Math.max(11, maxCoord + 1));
    setAllSteps(steps);
    setCurrentIndex(-1);
    setIsPlaying(false);
  }, [algorithm]);

  const exportToExcelAction = useCallback(async () => {
    if (visibleSteps.length === 0) return;
    
    const { exportToExcel } = await import('../utils/excelExport');
    
    await exportToExcel(
      algorithm,
      lastParams,
      visibleSteps,   // ✅ Solo lo que está visible en pantalla
      litPixels,
      gridSize,
      'pixel-grid-container'
    );
  }, [visibleSteps, algorithm, lastParams, litPixels, gridSize]);

  const nextStep = useCallback(() => {
    setCurrentIndex((prev: number) => Math.min(prev + 1, allSteps.length - 1));
  }, [allSteps.length]);

  const prevStep = useCallback(() => {
    setCurrentIndex((prev: number) => Math.max(prev - 1, -1));
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(-1);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isComplete) {
      setCurrentIndex(-1);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev: boolean) => !prev);
    }
  }, [isComplete]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev: number) => {
          if (prev >= allSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, allSteps.length]);

  return {
    algorithm, setAlgorithm,
    allSteps, visibleSteps,
    currentIndex, isComplete,
    isPlaying, speed, setSpeed,
    litPixels, gridSize,
    runAlgorithm, nextStep, prevStep, reset, togglePlay, exportToExcel: exportToExcelAction
  };
}
