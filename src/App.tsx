import { useAlgorithm } from './hooks/useAlgorithm';
import Sidebar from './components/Sidebar';
import InputForm from './components/InputForm';
import PixelGrid from './components/PixelGrid';
import StepTable from './components/StepTable';
import Controls from './components/Controls';
import { Github, Monitor, Layers } from 'lucide-react';

function App() {
  const {
    algorithm, setAlgorithm,
    allSteps, visibleSteps,
    currentIndex, isComplete,
    isPlaying, speed, setSpeed,
    litPixels, gridSize,
    runAlgorithm, nextStep, prevStep, reset, togglePlay, exportToExcel
  } = useAlgorithm();

  const currentStepData = allSteps[currentIndex];
  const currentPoint = currentStepData 
    ? ('point' in currentStepData ? currentStepData.point : ('points' in currentStepData ? currentStepData.points[0] : undefined))
    : undefined;

  return (
    <div className="min-h-screen bg-snow-white text-almost-black font-sans selection:bg-duo-green-light">
      <div className="min-h-screen">
        
        {/* Header */}
        <header className="h-20 border-b-2 border-cloud-gray flex items-center justify-between px-4 md:px-8 bg-snow-white sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-duo-green rounded-xl flex items-center justify-center shadow-duo-green">
              <Layers size={22} className="text-white" />
            </div>
            <h1 className="text-heading-sm md:text-heading font-feather text-duo-green tracking-tight mt-1">
              GraphicAlgo
              <span className="ml-2 text-[10px] md:text-[13px] font-sans font-bold text-silver uppercase bg-cloud-gray px-2 py-1 rounded-xl">v1.1</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/Snowclik/GraphicAlgo" 
              target="_blank" 
              className="p-2 border-2 border-cloud-gray rounded-xl transition-all hover:bg-cloud-gray text-silver hover:text-charcoal active:translate-y-1"
            >
              <Github size={20} />
            </a>
          </div>
        </header>

        <main className="max-w-[1140px] mx-auto p-4 md:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 md:gap-8">
          
          {/* Left Column: Navigation & Settings */}
          <div className="flex flex-col gap-6">
            <Sidebar current={algorithm} onChange={(type) => { reset(); setAlgorithm(type); }} />
            <InputForm algorithm={algorithm} onRun={runAlgorithm} onModeChange={setAlgorithm} />
            <div className="hidden lg:block p-6 rounded-xl bg-snow-white border-2 border-cloud-gray shadow-cloud-gray">
              <div className="flex items-center gap-2 mb-3 text-sky-blue font-bold">
                <Monitor size={18} />
                <span className="text-caption font-bold uppercase tracking-wider">Sistema</span>
              </div>
              <p className="text-body text-graphite leading-relaxed">
                Visualización de algoritmos de rasterización. La rejilla se ajusta dinámicamente al tamaño de tus coordenadas.
              </p>
            </div>
          </div>

          {/* Right Column: Visualizer & Steps */}
          <div className="flex flex-col gap-6 md:gap-8">
            <PixelGrid 
              litPixels={litPixels} 
              currentPoint={currentPoint as [number, number]} 
              gridSize={gridSize}
              algorithm={algorithm}
            />
            
            <Controls 
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onNext={nextStep}
              onPrev={prevStep}
              onReset={reset}
              speed={speed}
              onSpeedChange={setSpeed}
              isComplete={isComplete}
            />

            <StepTable 
              steps={visibleSteps} 
              currentIndex={currentIndex} 
              onExport={exportToExcel}
              allStepsCount={allSteps.length}
            />
          </div>

        </main>

        {/* Footer */}
        <footer className="border-t-2 border-cloud-gray py-8 px-10 mt-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-silver text-caption font-bold uppercase tracking-wider">
            <span>© 2026 GraphicAlgo</span>
            <div className="flex gap-6">
              <span>Línea, Círculo y Elipse</span>
              <span>Gráficos Paso a Paso</span>
            </div>
            <span>Snowclik</span>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;
