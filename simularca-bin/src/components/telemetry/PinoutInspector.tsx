'use client';

import React from 'react';
import { PlacedComponent, PinRuntimeState } from '../../types/circuit';
import { BOARDS } from '../../data/boards';
import { Cpu } from 'lucide-react';

interface PinoutInspectorProps {
  boardComponent?: PlacedComponent;
  pinStates: Map<string, PinRuntimeState>;
}

export const PinoutInspector: React.FC<PinoutInspectorProps> = ({
  boardComponent,
  pinStates,
}) => {
  if (!boardComponent) {
    return (
      <div className="p-4 text-center text-[#71717a] text-xs font-mono">
        No board selected. Add a Raspberry Pi to view the live pinout matrix.
      </div>
    );
  }

  const board = BOARDS[boardComponent.definitionId];
  if (!board) return null;

  const pinRows: Array<{ odd?: any; even?: any }> = [];
  const maxPins = board.pins.length;

  for (let i = 1; i <= Math.min(40, maxPins); i += 2) {
    const odd = board.pins.find((p) => p.physicalPin === i);
    const even = board.pins.find((p) => p.physicalPin === i + 1);
    if (odd || even) {
      pinRows.push({ odd, even });
    }
  }

  const getBadgeStyle = (pin: any) => {
    if (!pin) return { bg: 'bg-transparent', border: 'border-transparent', text: 'text-transparent' };
    if (pin.type === 'POWER_3V3') return { bg: 'bg-[#291e20]', border: 'border-rose-900/50', text: 'text-rose-300' };
    if (pin.type === 'POWER_5V') return { bg: 'bg-[#321c1f]', border: 'border-red-900/50', text: 'text-red-300' };
    if (pin.type === 'GND') return { bg: 'bg-[#1e1e24]', border: 'border-[#292932]', text: 'text-[#8e8e93]' };
    if (pin.type === 'I2C_SDA' || pin.type === 'I2C_SCL')
      return { bg: 'bg-[#1a2333]', border: 'border-blue-900/50', text: 'text-sky-300' };
    if (pin.type === 'SPI_MOSI' || pin.type === 'SPI_MISO' || pin.type === 'SPI_SCLK')
      return { bg: 'bg-[#241d33]', border: 'border-purple-900/50', text: 'text-purple-300' };
    return { bg: 'bg-[#1b2621]', border: 'border-emerald-900/50', text: 'text-emerald-300' };
  };

  return (
    <div className="flex flex-col h-full bg-[#18181b] border border-[#27272f] rounded-2xl overflow-hidden font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1f1f24] border-b border-[#27272f]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-white" />
          <span className="font-semibold text-white tracking-tight font-sans">{board.name} 40-Pin Header</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#8e8e93] font-sans">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Power
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#52525b]" /> GND
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> GPIO
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500" /> I2C
          </span>
        </div>
      </div>

      {/* 40-Pin Header Live Matrix */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-[#2c2c34]">
        {pinRows.map((row, idx) => {
          const oddState = row.odd
            ? pinStates.get(`${boardComponent.instanceId}:${row.odd.id}`)
            : undefined;
          const evenState = row.even
            ? pinStates.get(`${boardComponent.instanceId}:${row.even.id}`)
            : undefined;

          const oddStyle = getBadgeStyle(row.odd);
          const evenStyle = getBadgeStyle(row.even);

          return (
            <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
              {/* Left Pin (Odd) */}
              <div
                className={`flex-1 flex items-center justify-between px-2.5 py-1.5 rounded-xl border ${oddStyle.bg} ${oddStyle.border} ${oddStyle.text} transition-colors`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[#71717a] text-[10px] w-6 font-mono">#{row.odd?.physicalPin}</span>
                  <span className="font-medium truncate max-w-[120px]">{row.odd?.name}</span>
                </div>
                {oddState && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                      oddState.logicState === 'HIGH'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : oddState.voltage > 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-[#22222a] text-[#71717a]'
                    }`}
                  >
                    {oddState.voltage.toFixed(1)}V
                  </span>
                )}
              </div>

              {/* Pin Header Center Divider */}
              <div className="flex items-center gap-1 px-1 text-[#3f3f46]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27272f]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#27272f]" />
              </div>

              {/* Right Pin (Even) */}
              <div
                className={`flex-1 flex items-center justify-between px-2.5 py-1.5 rounded-xl border ${evenStyle.bg} ${evenStyle.border} ${evenStyle.text} transition-colors`}
              >
                {evenState && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                      evenState.logicState === 'HIGH'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : evenState.voltage > 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-[#22222a] text-[#71717a]'
                    }`}
                  >
                    {evenState.voltage.toFixed(1)}V
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-right ml-auto">
                  <span className="font-medium truncate max-w-[120px]">{row.even?.name}</span>
                  <span className="text-[#71717a] text-[10px] w-6 text-right font-mono">#{row.even?.physicalPin}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
