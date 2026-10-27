'use client';

import React from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Sliders,
  ChevronDown,
  Cpu,
  Circle,
  Zap,
} from 'lucide-react';
import { PRESETS } from '../../data/presets';
import { PlacedComponent } from '../../types/circuit';

interface StudioHeaderProps {
  boardComponent?: PlacedComponent;
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  isSensorsPanelOpen: boolean;
  onToggleSensorsPanel: () => void;
  simulationTime: string;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  boardComponent,
  selectedPresetId,
  onSelectPreset,
  isRunning,
  onRun,
  onStop,
  onReset,
  isSensorsPanelOpen,
  onToggleSensorsPanel,
  simulationTime,
}) => {
  return (
    <header className="h-12 bg-[#17171a] border-b border-[#26262d] px-3.5 flex items-center justify-between shrink-0 select-none z-30 font-sans">
      {/* Left: Window Chrome & Board Identity */}
      <div className="flex items-center gap-3">
        {/* macOS Traffic Lights */}
        <div className="flex items-center gap-2 pr-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:opacity-80 transition-opacity" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:opacity-80 transition-opacity" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:opacity-80 transition-opacity" />
        </div>

        {/* Brand / Project Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="font-bold text-white tracking-wide flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-white" />
            SIMULARCA
          </span>
          <span className="text-[#52525b]">/</span>
          <span className="text-[#a1a1aa] bg-[#202026] border border-[#2b2b34] px-2 py-0.5 rounded-md text-[11px] font-mono">
            {boardComponent?.name || 'No Board Selected'}
          </span>
        </div>
      </div>

      {/* Center: Circuit Run / Execution Controls */}
      <div className="flex items-center gap-2">
        {/* Preset Selector Pill */}
        <div className="relative flex items-center bg-[#202026] border border-[#2c2c36] rounded-xl px-2.5 py-1 text-xs text-white">
          <span className="text-[11px] text-[#71717a] mr-1.5 font-medium">Circuit:</span>
          <select
            value={selectedPresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="bg-transparent text-white text-xs font-medium pr-5 focus:outline-none cursor-pointer appearance-none"
          >
            {Object.values(PRESETS).map((p) => (
              <option key={p.id} value={p.id} className="bg-[#1b1b20] text-white">
                {p.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717a] absolute right-2 pointer-events-none" />
        </div>

        {/* Execution Timer Pill */}
        <div className="flex items-center gap-2 bg-[#202026] border border-[#2c2c36] px-2.5 py-1 rounded-xl text-xs font-mono font-medium text-white">
          <Circle
            className={`w-2 h-2 ${
              isRunning ? 'fill-emerald-400 text-emerald-400 animate-ping' : 'fill-[#71717a] text-[#71717a]'
            }`}
          />
          <span>{simulationTime}</span>
        </div>

        {/* Run / Stop Button */}
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl font-semibold text-xs transition-all active:scale-95 shadow-sm"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop Logic</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-white hover:bg-slate-200 text-black rounded-xl font-semibold text-xs transition-all active:scale-95 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Logic</span>
          </button>
        )}

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="p-1.5 bg-[#202026] hover:bg-[#282832] border border-[#2c2c36] text-[#9ca3af] hover:text-white rounded-xl transition-colors"
          title="Reset Circuit"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Sensor Inspector Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSensorsPanel}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            isSensorsPanelOpen
              ? 'bg-[#282832] border-white/30 text-white shadow-sm'
              : 'bg-[#202026] border-[#2c2c36] text-[#a1a1aa] hover:text-white hover:bg-[#26262e]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Live Sensors</span>
        </button>
      </div>
    </header>
  );
};
