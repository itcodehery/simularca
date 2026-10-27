'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlacedComponent,
  WireConnection,
  PinRuntimeState,
  TelemetryPoint,
  BoardDefinition,
  SensorDefinition,
} from '../src/types/circuit';
import { PRESETS } from '../src/data/presets';
import { BOARDS } from '../src/data/boards';
import { SENSORS } from '../src/data/sensors';
import { validateCircuit } from '../src/engine/circuit-validator';
import { SimulationEngine, LogMessage } from '../src/engine/simulation-engine';
import { StudioHeader } from '../src/components/layout/StudioHeader';
import { LeftToolDock } from '../src/components/layout/LeftToolDock';
import { CatalogSidebar } from '../src/components/layout/CatalogSidebar';
import { WiringCanvas } from '../src/components/canvas/WiringCanvas';
import { SensorControlPanel } from '../src/components/controls/SensorControlPanel';
import { CodeEditor } from '../src/components/editor/CodeEditor';
import { TerminalOutput } from '../src/components/telemetry/TerminalOutput';
import { PinoutInspector } from '../src/components/telemetry/PinoutInspector';
import { WaveformPlotter } from '../src/components/telemetry/WaveformPlotter';
import {
  Code,
  Terminal,
  Cpu,
  Activity,
  Layers,
} from 'lucide-react';

export default function SimularcaPage() {
  const defaultPreset = PRESETS['default-iot-lab'];

  // State
  const [components, setComponents] = useState<PlacedComponent[]>(() =>
    defaultPreset.components.map((c, i) => {
      const def =
        c.kind === 'board' ? BOARDS[c.definitionId] : SENSORS[c.definitionId];
      return {
        instanceId: `inst_${i}_${c.definitionId}`,
        definitionId: c.definitionId,
        kind: c.kind,
        name: def?.name || c.definitionId,
        x: c.x,
        y: c.y,
        values: c.values || (c.kind === 'sensor' && def && 'defaultValues' in def ? def.defaultValues : {}),
      };
    })
  );

  const [wires, setWires] = useState<WireConnection[]>(() =>
    defaultPreset.wires.map((w, idx) => ({
      id: `wire_init_${idx}`,
      fromComponentId: `inst_${w.fromIndex}_${defaultPreset.components[w.fromIndex].definitionId}`,
      fromPinId: w.fromPinId,
      toComponentId: `inst_${w.toIndex}_${defaultPreset.components[w.toIndex].definitionId}`,
      toPinId: w.toPinId,
      color: w.color,
    }))
  );

  const [activeWireColor, setActiveWireColor] = useState<string>('#ef4444');
  const [pinStates, setPinStates] = useState<Map<string, PinRuntimeState>>(new Map());
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [code, setCode] = useState<string>(defaultPreset.code);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('default-iot-lab');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simulationSeconds, setSimulationSeconds] = useState<number>(0);

  // Layout View Toggles
  const [activeLeftView, setActiveLeftView] = useState<'catalog' | 'sensors' | 'terminal' | 'diagnostics'>('catalog');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSensorsPanelOpen, setIsSensorsPanelOpen] = useState<boolean>(true);
  const [bottomTab, setBottomTab] = useState<'editor' | 'terminal' | 'pinout' | 'plotter'>('editor');

  const engineRef = useRef<SimulationEngine | null>(null);

  // Timer tick
  useEffect(() => {
    let timer: any;
    if (isRunning) {
      timer = setInterval(() => {
        setSimulationSeconds((s) => s + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formattedTime = (() => {
    const totalSecs = Math.floor(simulationSeconds);
    const ms = Math.floor((simulationSeconds % 1) * 100);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  })();

  // Engine callbacks
  useEffect(() => {
    const engine = new SimulationEngine();
    engine.setCallbacks({
      onLog: (log) => setLogs((prev) => [...prev, log]),
      onPinStateChange: (states) => setPinStates(states),
      onTelemetry: (pt) => setTelemetry((prev) => [...prev.slice(-100), pt]),
      onComponentValueChange: (instanceId, newValues) => {
        setComponents((prev) =>
          prev.map((c) => (c.instanceId === instanceId ? { ...c, values: newValues } : c))
        );
      },
    });

    engine.resetPins(components, wires);
    engineRef.current = engine;

    return () => {
      engine.stop();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current && !isRunning) {
      engineRef.current.resetPins(components, wires);
    }
  }, [components, wires, isRunning]);

  const validationResult = validateCircuit(components, wires);

  // Load Preset Circuit
  const loadPreset = useCallback((presetId: string) => {
    const preset = PRESETS[presetId];
    if (!preset) return;

    if (engineRef.current) {
      engineRef.current.stop();
    }
    setIsRunning(false);
    setSimulationSeconds(0);

    const newComponents: PlacedComponent[] = preset.components.map((c, i) => {
      const def =
        c.kind === 'board' ? BOARDS[c.definitionId] : SENSORS[c.definitionId];
      return {
        instanceId: `inst_${Date.now()}_${i}_${c.definitionId}`,
        definitionId: c.definitionId,
        kind: c.kind,
        name: def?.name || c.definitionId,
        x: c.x,
        y: c.y,
        values: c.values || (c.kind === 'sensor' && def && 'defaultValues' in def ? def.defaultValues : {}),
      };
    });

    const newWires: WireConnection[] = preset.wires.map((w, idx) => ({
      id: `wire_${Date.now()}_${idx}`,
      fromComponentId: newComponents[w.fromIndex].instanceId,
      fromPinId: w.fromPinId,
      toComponentId: newComponents[w.toIndex].instanceId,
      toPinId: w.toPinId,
      color: w.color,
    }));

    setComponents(newComponents);
    setWires(newWires);
    setCode(preset.code);
    setSelectedPresetId(presetId);
    setLogs([]);
    setTelemetry([]);

    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
      });
    });
  }, []);

  // Run Simulation
  const handleRunSimulation = async () => {
    if (!engineRef.current) return;
    setIsRunning(true);
    setBottomTab('terminal');
    try {
      await engineRef.current.runCode(code, components, wires);
    } finally {
      setIsRunning(false);
    }
  };

  // Stop Simulation
  const handleStopSimulation = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    setIsRunning(false);
  };

  // Reset Circuit
  const handleResetCircuit = () => {
    handleStopSimulation();
    setSimulationSeconds(0);
    setLogs([]);
    setTelemetry([]);
    if (engineRef.current) {
      engineRef.current.resetPins(components, wires);
    }
  };

  const handleAddBoard = (board: BoardDefinition) => {
    const newComp: PlacedComponent = {
      instanceId: `board_${Date.now()}`,
      definitionId: board.id,
      kind: 'board',
      name: board.name,
      x: 60,
      y: 60,
      values: {},
    };
    setComponents([newComp, ...components.filter((c) => c.kind !== 'board')]);
    setWires([]);
  };

  const handleAddSensor = (sensor: SensorDefinition) => {
    const newComp: PlacedComponent = {
      instanceId: `sensor_${Date.now()}`,
      definitionId: sensor.id,
      kind: 'sensor',
      name: sensor.name,
      x: 520,
      y: 80 + (components.length % 4) * 80,
      values: { ...sensor.defaultValues },
    };
    setComponents([...components, newComp]);
  };

  const handleComponentValuesChange = (instanceId: string, values: Record<string, any>) => {
    setComponents((prev) =>
      prev.map((c) => (c.instanceId === instanceId ? { ...c, values } : c))
    );
  };

  const boardComponent = components.find((c) => c.kind === 'board');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0c0e] text-[#f4f4f6] font-sans p-2">
      {/* Sleek macOS App Window Container with Rounded Border */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#161619] border border-[#27272f] rounded-2xl shadow-2xl">
        {/* Top Header Bar */}
        <StudioHeader
          boardComponent={boardComponent}
          selectedPresetId={selectedPresetId}
          onSelectPreset={loadPreset}
          isRunning={isRunning}
          onRun={handleRunSimulation}
          onStop={handleStopSimulation}
          onReset={handleResetCircuit}
          isSensorsPanelOpen={isSensorsPanelOpen}
          onToggleSensorsPanel={() => setIsSensorsPanelOpen(!isSensorsPanelOpen)}
          simulationTime={formattedTime}
        />

        {/* Center Workspace Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Vertical Tool Dock */}
          <LeftToolDock
            activeView={activeLeftView}
            onSelectView={(v) => {
              setActiveLeftView(v);
              if (v === 'catalog' || v === 'diagnostics') {
                setIsSidebarOpen(true);
              } else if (v === 'sensors') {
                setIsSensorsPanelOpen(true);
              } else if (v === 'terminal') {
                setBottomTab('terminal');
              }
            }}
            onOpenAddModal={() => setIsSidebarOpen(true)}
          />

          {/* Left Component Shelf / Catalog Drawer */}
          {isSidebarOpen && (
            <CatalogSidebar
              onAddBoard={handleAddBoard}
              onAddSensor={handleAddSensor}
              activeWireColor={activeWireColor}
              onSelectWireColor={setActiveWireColor}
              validationIssues={validationResult.issues}
              i2cDevicesFound={validationResult.i2cDevicesFound}
            />
          )}

          {/* Center Wiring Canvas */}
          <div className="flex-1 h-full relative">
            <WiringCanvas
              components={components}
              wires={wires}
              pinStates={pinStates}
              onComponentsChange={setComponents}
              onWiresChange={setWires}
              onComponentValuesChange={handleComponentValuesChange}
              activeWireColor={activeWireColor}
            />
          </div>

          {/* Right Sensor Physical Controls Drawer */}
          {isSensorsPanelOpen && (
            <SensorControlPanel
              components={components}
              onComponentValuesChange={handleComponentValuesChange}
              onClose={() => setIsSensorsPanelOpen(false)}
            />
          )}
        </div>

        {/* Bottom Drawer: Code Editor & Telemetry Instrumentation */}
        <div className="h-64 bg-[#141416] border-t border-[#26262d] flex flex-col shrink-0 z-20">
          {/* Segmented Bottom Tabs (Matching reference Image 0 pill style) */}
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#17171a] border-b border-[#24242a] text-xs">
            <div className="flex items-center gap-1 bg-[#1e1e24] p-0.5 rounded-xl border border-[#292932]">
              <button
                onClick={() => setBottomTab('editor')}
                className={`py-1 px-3 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  bottomTab === 'editor'
                    ? 'bg-[#292934] text-white border border-white/20 shadow-sm font-semibold'
                    : 'text-[#8e8e93] hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> Python Logic (RPi.GPIO)
              </button>
              <button
                onClick={() => setBottomTab('terminal')}
                className={`py-1 px-3 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  bottomTab === 'terminal'
                    ? 'bg-[#292934] text-white border border-white/20 shadow-sm font-semibold'
                    : 'text-[#8e8e93] hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Serial Console
                {logs.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#1b1b22] text-[10px] text-white font-mono border border-[#32323e]">
                    {logs.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setBottomTab('pinout')}
                className={`py-1 px-3 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  bottomTab === 'pinout'
                    ? 'bg-[#292934] text-white border border-white/20 shadow-sm font-semibold'
                    : 'text-[#8e8e93] hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> 40-Pin Header
              </button>
              <button
                onClick={() => setBottomTab('plotter')}
                className={`py-1 px-3 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  bottomTab === 'plotter'
                    ? 'bg-[#292934] text-white border border-white/20 shadow-sm font-semibold'
                    : 'text-[#8e8e93] hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Oscilloscope
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#71717a] font-mono">
              <span>Wires: {wires.length}</span>
              <span>Modules: {components.length}</span>
            </div>
          </div>

          {/* Active Drawer View Content */}
          <div className="flex-1 overflow-hidden p-2 bg-[#121214]">
            {bottomTab === 'editor' && (
              <CodeEditor
                code={code}
                onChange={setCode}
                onRun={handleRunSimulation}
                onStop={handleStopSimulation}
                isRunning={isRunning}
                selectedPresetId={selectedPresetId}
                onSelectPreset={loadPreset}
              />
            )}
            {bottomTab === 'terminal' && (
              <TerminalOutput logs={logs} onClear={() => setLogs([])} />
            )}
            {bottomTab === 'pinout' && (
              <PinoutInspector boardComponent={boardComponent} pinStates={pinStates} />
            )}
            {bottomTab === 'plotter' && <WaveformPlotter telemetry={telemetry} />}
          </div>
        </div>
      </div>
    </div>
  );
}
