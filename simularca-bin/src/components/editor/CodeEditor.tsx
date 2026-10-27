'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Play, Square, Code, Sparkles, BookOpen } from 'lucide-react';
import { PRESETS } from '../../data/presets';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#18181b] text-[#71717a] font-mono text-xs">
      Loading Python Code Environment...
    </div>
  ),
});

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onStop: () => void;
  isRunning: boolean;
  selectedPresetId?: string;
  onSelectPreset: (presetId: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  onStop,
  isRunning,
  selectedPresetId,
  onSelectPreset,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#18181b] border border-[#27272f] rounded-2xl overflow-hidden shadow-xl">
      {/* Editor Control Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1f1f24] border-b border-[#27272f] text-xs font-sans">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-white" />
          <span className="font-semibold text-white tracking-tight">main.py</span>
          <span className="text-[10px] bg-[#272730] text-[#a1a1aa] border border-[#32323c] px-2 py-0.5 rounded-full font-mono">
            Python 3.11 / RPi.GPIO
          </span>
        </div>

        {/* Preset Selector & Action Buttons */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl font-semibold text-xs transition-all active:scale-95 shadow-sm"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Stop Logic
            </button>
          ) : (
            <button
              onClick={onRun}
              className="flex items-center gap-1.5 px-3.5 py-1 bg-white hover:bg-slate-200 text-black rounded-xl font-semibold text-xs transition-all active:scale-95 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run Logic
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 w-full relative">
        <MonacoEditor
          height="100%"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 12.5,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        />
      </div>
    </div>
  );
};
