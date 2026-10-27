'use client';

import React, { useState } from 'react';
import { BoardDefinition, SensorDefinition, CircuitValidationIssue } from '../../types/circuit';
import { BOARDS } from '../../data/boards';
import { SENSORS } from '../../data/sensors';
import {
  Cpu,
  Layers,
  Thermometer,
  Compass,
  Mic,
  Ruler,
  Tv,
  Lightbulb,
  Radio,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Palette,
  Info,
} from 'lucide-react';

interface CatalogSidebarProps {
  onAddBoard: (board: BoardDefinition) => void;
  onAddSensor: (sensor: SensorDefinition) => void;
  activeWireColor: string;
  onSelectWireColor: (color: string) => void;
  validationIssues: CircuitValidationIssue[];
  i2cDevicesFound: Array<{ address: number; name: string }>;
}

export const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
  onAddBoard,
  onAddSensor,
  activeWireColor,
  onSelectWireColor,
  validationIssues,
  i2cDevicesFound,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'diagnostics'>('catalog');
  const [selectedFamily, setSelectedFamily] = useState<'all' | 'zero' | 'standard' | 'pico'>('all');

  const wireColors = [
    { name: 'Red (3.3V/5V)', hex: '#ef4444' },
    { name: 'Black (GND)', hex: '#18181b' },
    { name: 'Blue (SDA)', hex: '#3b82f6' },
    { name: 'Yellow (SCL)', hex: '#eab308' },
    { name: 'Green (Signal)', hex: '#22c55e' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'White', hex: '#ffffff' },
  ];

  const filteredBoards = Object.values(BOARDS).filter((b) => {
    if (selectedFamily === 'zero') return b.family === 'pi-zero';
    if (selectedFamily === 'standard') return b.family === 'pi-standard';
    if (selectedFamily === 'pico') return b.family === 'pi-pico';
    return true;
  });

  const errorCount = validationIssues.filter((i) => i.severity === 'error').length;

  return (
    <div className="w-80 h-full bg-[#18181b] border-r border-[#27272a] flex flex-col select-none text-[#f4f4f6] font-sans">
      {/* Segmented Pill Tabs Header (Matching reference Image 0) */}
      <div className="p-3 border-b border-[#27272a] bg-[#18181b]">
        <div className="grid grid-cols-2 gap-1 bg-[#202024] p-1 rounded-xl border border-[#2a2a30]">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'catalog'
                ? 'bg-[#2b2b32] text-white border border-white/20 shadow-sm'
                : 'text-[#8e8e93] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Library
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'diagnostics'
                ? 'bg-[#2b2b32] text-white border border-white/20 shadow-sm'
                : 'text-[#8e8e93] hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Diagnostics
            {errorCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {errorCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Wire Color Swatches (Matching Image 1 Fill/Stroke Color Swatches) */}
      <div className="px-4 py-2.5 bg-[#1c1c1f] border-b border-[#27272a] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#a1a1aa] font-medium">
          <Palette className="w-3.5 h-3.5 text-white" />
          <span>Jumper Wire:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {wireColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => onSelectWireColor(c.hex)}
              className={`w-4 h-4 rounded-full border transition-all ${
                activeWireColor === c.hex
                  ? 'scale-125 ring-2 ring-white border-transparent'
                  : 'border-[#383842] hover:scale-110'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Tab Content: Component Library */}
      {activeTab === 'catalog' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-[#2c2c34]">
          {/* Raspberry Pi Boards Shelf */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-white" /> Raspberry Pi Boards
              </span>
            </div>

            {/* Segmented Family Chips */}
            <div className="grid grid-cols-4 gap-1 mb-3 bg-[#202024] p-1 rounded-lg border border-[#2a2a30]">
              {(['all', 'zero', 'standard', 'pico'] as const).map((fam) => (
                <button
                  key={fam}
                  onClick={() => setSelectedFamily(fam)}
                  className={`text-[10px] py-1 rounded-md capitalize font-mono transition-all ${
                    selectedFamily === fam
                      ? 'bg-[#2e2e36] text-white border border-white/20 font-bold'
                      : 'text-[#8e8e93] hover:text-white'
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredBoards.map((board) => (
                <div
                  key={board.id}
                  className="bg-[#202024] border border-[#2c2c34] hover:border-white/30 rounded-xl p-3 transition-all group shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-white group-hover:text-emerald-400 transition-colors">
                        {board.name}
                      </h4>
                      <p className="text-[10px] text-[#8e8e93] line-clamp-2 mt-0.5 leading-tight">
                        {board.tagline}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddBoard(board)}
                      className="p-1.5 bg-[#2a2a32] hover:bg-white hover:text-black text-white rounded-lg transition-colors ml-2 shrink-0 border border-[#34343e]"
                      title="Add to canvas"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-[#2a2a32] flex items-center justify-between text-[10px] text-[#71717a] font-mono">
                    <span>{board.pins.length} Pin Header</span>
                    <span className="text-white/80">{board.specs.cpu.split('(')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sensors & Modules Shelf */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-white" /> Sensors &amp; Modules
              </span>
            </div>

            <div className="space-y-2">
              {Object.values(SENSORS).map((sensor) => {
                let icon = <Thermometer className="w-3.5 h-3.5 text-white" />;
                if (sensor.category === 'motion') icon = <Compass className="w-3.5 h-3.5 text-white" />;
                if (sensor.category === 'audio') icon = <Mic className="w-3.5 h-3.5 text-white" />;
                if (sensor.category === 'distance') icon = <Ruler className="w-3.5 h-3.5 text-white" />;
                if (sensor.category === 'display') icon = <Tv className="w-3.5 h-3.5 text-white" />;
                if (sensor.category === 'actuator') icon = <Lightbulb className="w-3.5 h-3.5 text-white" />;

                return (
                  <div
                    key={sensor.id}
                    className="bg-[#202024] border border-[#2c2c34] hover:border-white/30 rounded-xl p-2.5 transition-all group flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-[#28282f] text-white border border-[#34343d]">
                        {icon}
                      </span>
                      <div>
                        <h4 className="font-semibold text-xs text-white group-hover:text-sky-300 transition-colors">
                          {sensor.name}
                        </h4>
                        <span className="text-[10px] text-[#8e8e93] font-mono">
                          {sensor.pins.length} pins {sensor.i2cAddress ? `· 0x${sensor.i2cAddress.toString(16)}` : ''}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onAddSensor(sensor)}
                      className="p-1.5 bg-[#2a2a32] hover:bg-white hover:text-black text-white rounded-lg transition-colors ml-2 border border-[#34343e]"
                      title="Add to canvas"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Diagnostics */}
      {activeTab === 'diagnostics' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-mono scrollbar-thin scrollbar-thumb-[#2c2c34]">
          {/* I2C Address Map Card */}
          <div className="bg-[#202024] border border-[#2c2c34] rounded-xl p-3">
            <span className="font-bold text-white flex items-center gap-1.5 mb-2 font-sans">
              <Radio className="w-4 h-4 text-sky-400" /> Active I2C Hardware Bus
            </span>
            {i2cDevicesFound.length === 0 ? (
              <p className="text-[#71717a] text-[11px] font-sans">
                No I2C modules connected to Raspberry Pi GPIO 2 (SDA) &amp; GPIO 3 (SCL).
              </p>
            ) : (
              <div className="space-y-1.5">
                {i2cDevicesFound.map((dev) => (
                  <div
                    key={dev.address}
                    className="flex justify-between items-center py-1 border-b border-[#2b2b32] text-[11px]"
                  >
                    <span className="text-white font-medium">{dev.name}</span>
                    <span className="text-sky-400 font-bold bg-[#26262d] px-2 py-0.5 rounded">
                      0x{dev.address.toString(16).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Validation Checklist */}
          <div className="space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5 font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Circuit Validation Checks
            </span>

            {validationIssues.map((issue, idx) => {
              let Icon = Info;
              let border = 'border-[#2d2d35] bg-[#222227] text-white';
              if (issue.severity === 'error') {
                Icon = XCircle;
                border = 'border-rose-500/40 bg-rose-950/20 text-rose-300';
              } else if (issue.severity === 'warning') {
                Icon = AlertTriangle;
                border = 'border-amber-500/40 bg-amber-950/20 text-amber-300';
              }

              return (
                <div key={idx} className={`p-3 rounded-xl border ${border} text-[11px]`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{issue.title}</span>
                  </div>
                  <p className="text-[10px] text-[#a1a1aa] leading-relaxed font-sans">{issue.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
