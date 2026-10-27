'use client';

import React, { useRef, useEffect } from 'react';
import { TelemetryPoint } from '../../types/circuit';
import { Activity } from 'lucide-react';

interface WaveformPlotterProps {
  telemetry: TelemetryPoint[];
}

export const WaveformPlotter: React.FC<WaveformPlotterProps> = ({ telemetry }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#272730';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < width; x += 40) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += 30) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    if (telemetry.length < 2) {
      ctx.fillStyle = '#71717a';
      ctx.font = '11px sans-serif';
      ctx.fillText('Awaiting sensor telemetry data stream...', 20, height / 2);
      return;
    }

    // Group by channel
    const channels = new Map<string, TelemetryPoint[]>();
    telemetry.forEach((pt) => {
      const arr = channels.get(pt.channel) || [];
      arr.push(pt);
      channels.set(pt.channel, arr);
    });

    const channelColors: Record<string, string> = {
      'Temperature (°C)': '#f59e0b',
      'Humidity (%)': '#0ea5e9',
      'Accel Z (g)': '#a855f7',
      'Sound Level (dB)': '#f43f5e',
    };

    let legendX = 20;

    channels.forEach((points, channel) => {
      const color = channelColors[channel] || '#10b981';

      let minVal = Math.min(...points.map((p) => p.value));
      let maxVal = Math.max(...points.map((p) => p.value));
      if (minVal === maxVal) {
        minVal -= 5;
        maxVal += 5;
      }
      const range = maxVal - minVal;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const maxPoints = Math.min(points.length, 30);
      const recent = points.slice(-maxPoints);
      const stepX = (width - 60) / Math.max(1, recent.length - 1);

      recent.forEach((pt, i) => {
        const x = 30 + i * stepX;
        const normalized = (pt.value - minVal) / range;
        const y = height - 25 - normalized * (height - 50);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Points
      recent.forEach((pt, i) => {
        const x = 30 + i * stepX;
        const normalized = (pt.value - minVal) / range;
        const y = height - 25 - normalized * (height - 50);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Legend in top bar
      ctx.fillStyle = color;
      ctx.fillRect(legendX, 10, 8, 8);
      ctx.fillStyle = '#d4d4d8';
      ctx.font = '10px monospace';
      const lastVal = recent[recent.length - 1]?.value.toFixed(1);
      ctx.fillText(`${channel}: ${lastVal}`, legendX + 12, 18);
      legendX += 160;
    });
  }, [telemetry]);

  return (
    <div className="flex flex-col h-full bg-[#18181b] border border-[#27272f] rounded-2xl overflow-hidden font-mono shadow-xl">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1f1f24] border-b border-[#27272f] text-xs text-[#a1a1aa] font-sans">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white" />
          <span className="font-semibold text-white tracking-tight">Signal Telemetry &amp; Scope</span>
        </div>
        <span className="text-[10px] text-[#71717a] font-mono">
          {telemetry.length} samples
        </span>
      </div>
      <div className="flex-1 p-2 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-full rounded-xl bg-[#18181b]"
        />
      </div>
    </div>
  );
};
