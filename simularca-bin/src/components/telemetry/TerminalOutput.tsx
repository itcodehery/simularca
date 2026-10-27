'use client';

import React, { useRef, useEffect } from 'react';
import { LogMessage } from '../../engine/simulation-engine';
import { Terminal, Copy, Trash2, Check } from 'lucide-react';

interface TerminalOutputProps {
  logs: LogMessage[];
  onClear: () => void;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs, onClear }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const copyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#18181b] border border-[#27272f] rounded-2xl overflow-hidden shadow-xl font-mono">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1f1f24] border-b border-[#27272f] text-xs">
        <div className="flex items-center gap-2 text-[#a1a1aa]">
          <Terminal className="w-3.5 h-3.5 text-white" />
          <span className="font-semibold text-white tracking-tight font-sans">RPi Serial Console (ttyAMA0)</span>
          <span className="text-[10px] bg-[#272730] text-[#a1a1aa] px-2 py-0.5 rounded-full border border-[#32323c]">
            115200 baud
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={copyLogs}
            className="p-1 hover:bg-[#282830] rounded-lg text-[#8e8e93] hover:text-white transition-colors"
            title="Copy Output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClear}
            className="p-1 hover:bg-[#282830] rounded-lg text-[#8e8e93] hover:text-rose-400 transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Stream */}
      <div
        ref={containerRef}
        className="flex-1 p-3.5 overflow-y-auto space-y-1 text-xs select-text scrollbar-thin scrollbar-thumb-[#2c2c34]"
      >
        {logs.length === 0 ? (
          <div className="text-[#52525b] italic font-sans text-xs">No output yet. Click &quot;Run Logic&quot; to begin simulation...</div>
        ) : (
          logs.map((log) => {
            let color = 'text-[#e4e4e7]';
            if (log.level === 'warn') color = 'text-amber-400';
            if (log.level === 'error') color = 'text-rose-400 font-semibold';
            if (log.level === 'success') color = 'text-emerald-400 font-medium';

            return (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-[#52525b] select-none text-[10px] w-14 shrink-0 font-mono">
                  {log.timestamp}
                </span>
                <span className={`${color} whitespace-pre-wrap break-all flex-1`}>{log.text}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
