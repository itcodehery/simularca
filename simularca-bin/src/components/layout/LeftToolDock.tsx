'use client';

import React, { useState } from 'react';
import {
  Plus,
  Cpu,
  Radio,
  Sliders,
  Terminal,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LeftToolDockProps {
  activeView: 'catalog' | 'sensors' | 'terminal' | 'diagnostics';
  onSelectView: (view: 'catalog' | 'sensors' | 'terminal' | 'diagnostics') => void;
  onOpenAddModal: () => void;
}

export const LeftToolDock: React.FC<LeftToolDockProps> = ({
  activeView,
  onSelectView,
  onOpenAddModal,
}) => {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const tools = [
    { id: 'add', label: 'Add Hardware Module', icon: Plus, action: onOpenAddModal },
    { id: 'catalog', label: 'Board & Component Library', icon: Cpu, action: () => onSelectView('catalog') },
    { id: 'sensors', label: 'Environmental Controls', icon: Sliders, action: () => onSelectView('sensors') },
    { id: 'terminal', label: 'Serial Console (tty)', icon: Terminal, action: () => onSelectView('terminal') },
    { id: 'diagnostics', label: 'Circuit Diagnostics & I2C', icon: Activity, action: () => onSelectView('diagnostics') },
  ];

  return (
    <div className="w-13 bg-[#141416] border-r border-[#242429] flex flex-col items-center py-3 select-none shrink-0 z-20">
      <div className="space-y-2">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeView === t.id;

          return (
            <div key={t.id} className="relative group flex items-center justify-center">
              <button
                onClick={t.action}
                onMouseEnter={() => setHoveredTool(t.id)}
                onMouseLeave={() => setHoveredTool(null)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  t.id === 'add'
                    ? 'bg-[#222227] hover:bg-[#2d2d34] text-white border border-[#2e2e36] shadow-sm'
                    : isActive
                    ? 'bg-[#2b2b32] text-white shadow-sm border border-white/20'
                    : 'text-[#8e8e96] hover:text-white hover:bg-[#1e1e22]'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[1.8]" />
              </button>

              {/* High-contrast White Tooltip Popover (from reference Image 1) */}
              {hoveredTool === t.id && (
                <div className="absolute left-13 z-50 pointer-events-none bg-white text-black px-2.5 py-1.5 rounded-lg shadow-2xl text-[11px] font-semibold whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-black font-semibold tracking-tight">{t.label}</div>
                  <div className="text-[#6b7280] text-[9px] font-normal">Simularca Tool</div>
                  {/* Subtle arrow pointer */}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
