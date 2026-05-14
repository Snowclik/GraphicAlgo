import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (val: number) => void;
  isComplete: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
  speed,
  onSpeedChange,
  isComplete
}) => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-snow-white rounded-xl border-2 border-cloud-gray shadow-cloud-gray">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          <ControlButton onClick={onReset} icon={<RotateCcw size={20} />} label="Reiniciar" />
          <ControlButton onClick={onPrev} icon={<SkipBack size={20} />} label="Anterior" />
          
          <button
            onClick={onTogglePlay}
            className={`btn-3d w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all 
              ${isPlaying 
                ? 'bg-bubblegum-pink border-[#a62a72] text-snow-white shadow-[0_4px_0_#a62a72]' 
                : 'bg-duo-green border-[#3f8f01] text-snow-white shadow-duo-green'}`}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <ControlButton onClick={onNext} icon={<SkipForward size={20} />} label="Siguiente" disabled={isComplete} />
        </div>

        {/* Speed Slider */}
        <div className="w-full md:w-auto md:flex-1 flex flex-col gap-3 md:max-w-[200px]">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-silver">
              <Zap size={14} />
              <span className="text-caption font-bold uppercase tracking-wider">Velocidad</span>
            </div>
            <span className="text-caption font-bold text-sky-blue">{speed}ms</span>
          </div>
          
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[speed]}
            onValueChange={(vals) => onSpeedChange(vals[0])}
            max={1000}
            min={50}
            step={50}
          >
            <Slider.Track className="bg-cloud-gray relative grow rounded-full h-[8px]">
              <Slider.Range className="absolute bg-sky-blue rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-snow-white border-2 border-sky-blue shadow-[0_2px_0_#1899d6] rounded-full hover:scale-110 transition-transform focus:outline-none"
              aria-label="Velocidad"
            />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ onClick, icon, label, disabled = false }: { onClick: () => void; icon: React.ReactNode; label: string; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={label}
    className={`btn-3d p-3 rounded-xl border-2 border-cloud-gray bg-snow-white text-silver shadow-cloud-gray hover:text-charcoal hover:border-silver transition-all
      ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
  >
    {icon}
  </button>
);

export default Controls;
