import React from 'react';
import type { AlgorithmType } from '../hooks/useAlgorithm';
import { LineChart, Circle, Disc, LucideIcon } from 'lucide-react';

interface SidebarProps {
  current: AlgorithmType;
  onChange: (type: AlgorithmType) => void;
}

interface SidebarItem {
  id: AlgorithmType;
  label: string;
  icon: LucideIcon;
  desc: string;
}

const Sidebar: React.FC<SidebarProps> = ({ current, onChange }) => {
  const items: SidebarItem[] = [
    { id: 'bresenham', label: 'Línea Recta', icon: LineChart, desc: 'Algoritmos' },
    { id: 'circle', label: 'Punto Medio', icon: Circle, desc: 'Círculo' },
    { id: 'ellipse', label: 'Punto Medio', icon: Disc, desc: 'Elipse' },
  ];

  return (
    <div className="w-full flex flex-row lg:flex-col gap-4">
      {items.map((item) => {
        // Línea recta está activa tanto en bresenham como en dda
        const isActive = (item.id === 'bresenham' && (current === 'bresenham' || current === 'dda')) || current === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex-1 lg:flex-none flex flex-col lg:flex-row items-center lg:items-start gap-4 p-4 rounded-xl border-2 transition-all btn-3d
              ${isActive 
                ? 'bg-sky-blue border-[#1899d6] text-snow-white shadow-sky-blue' 
                : 'bg-snow-white border-cloud-gray text-silver shadow-cloud-gray hover:border-silver'}`}
          >
            <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-snow-white/20' : 'bg-cloud-gray group-hover:bg-silver/20'}`}>
              <Icon size={24} className={isActive ? 'text-snow-white' : 'text-graphite'} />
            </div>
            <div className="text-left hidden md:block">
              <div className={`text-caption font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-snow-white/80' : 'text-silver'}`}>
                {item.desc}
              </div>
              <div className={`text-body font-bold ${isActive ? 'text-snow-white' : 'text-charcoal'}`}>{item.label}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
