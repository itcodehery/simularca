'use client';

import React, { useState } from 'react';
import { PlacedComponent } from '../../types/circuit';
import { SENSORS } from '../../data/sensors';
import {
  X,
  Thermometer,
  Compass,
  Mic,
  Ruler,
  Sliders,
  Volume2,
  Activity,
  Zap,
  Radio,
  Eye,
} from 'lucide-react';

interface SensorControlPanelProps {
  components: PlacedComponent[];
  onComponentValuesChange: (instanceId: string, values: Record<string, any>) => void;
  onClose?: () => void;
}

export const SensorControlPanel: React.FC<SensorControlPanelProps> = ({
  components,
  onComponentValuesChange,
  onClose,
}) => {
  const sensorComponents = components.filter((c) => c.kind === 'sensor');
  const [telemetryPollToggle, setTelemetryPollToggle] = useState<boolean>(true);
  const [buzzerAudioToggle, setBuzzerAudioToggle] = useState<boolean>(true);

  return (
    <div className="w-80 h-full bg-[#18181b] border-l border-[#27272a] flex flex-col select-none text-[#f4f4f6] font-sans">
      {/* Panel Header */}
      <div className="px-4 py-3.5 border-b border-[#27272a] flex items-center justify-between">
        <h3 className="font-semibold text-sm tracking-tight text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-white" />
          Sensor Controls
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#27272a] text-[#8e8e93] hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#2c2c34]">
        {sensorComponents.length === 0 ? (
          <div className="py-8 text-center text-[#71717a] text-xs">
            <Sliders className="w-6 h-6 mx-auto mb-2 opacity-30 text-[#a1a1aa]" />
            No sensors currently on canvas. Add a module from the left shelf to inspect its physical parameters.
          </div>
        ) : (
          sensorComponents.map((comp) => {
            const def = SENSORS[comp.definitionId];
            if (!def) return null;

            return (
              <div key={comp.instanceId} className="space-y-4">
                {/* Module Section Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#a1a1aa] tracking-tight uppercase">
                    {comp.name}
                  </span>
                  <span className="text-[10px] bg-[#222227] border border-[#2b2b32] px-2 py-0.5 rounded-full text-[#a1a1aa] font-mono">
                    {def.category}
                  </span>
                </div>

                {/* Breadboard Prototyping Module */}
                {comp.definitionId === 'module-breadboard' && (
                  <div className="p-3 bg-[#1e1e24] border border-[#2c2c36] rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between text-[#a1a1aa]">
                      <span className="font-medium text-white">Power Distribution</span>
                      <span className="font-mono text-[11px] text-emerald-400">ACTIVE BUS</span>
                    </div>
                    <div className="text-[11px] text-[#71717a] leading-relaxed">
                      Distributes +3.3V, +5.0V, and GND across multi-hole tie points. Eliminates multiple DuPont wires on any single Raspberry Pi header pin.
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-mono">
                        +3.3V Rail
                      </span>
                      <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20 text-[10px] font-mono">
                        +5.0V Rail
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-mono">
                        GND Rail
                      </span>
                    </div>
                  </div>
                )}

                {/* 1. DHT22 */}
                {comp.definitionId === 'sensor-dht22' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Thermometer className="w-3.5 h-3.5 text-white" /> Temperature
                        </span>
                        <span className="text-white font-mono font-semibold">
                          {Number(comp.values.temperature ?? 24.5).toFixed(1)}°C
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="60"
                        step="0.5"
                        value={Number(comp.values.temperature ?? 24.5)}
                        onChange={(e) =>
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            temperature: parseFloat(e.target.value),
                          })
                        }
                        className="studio-slider"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-white" /> Relative Humidity
                        </span>
                        <span className="text-white font-mono font-semibold">
                          {Number(comp.values.humidity ?? 50).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="95"
                        step="1"
                        value={Number(comp.values.humidity ?? 50)}
                        onChange={(e) =>
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            humidity: parseFloat(e.target.value),
                          })
                        }
                        className="studio-slider"
                      />
                    </div>
                  </div>
                )}

                {/* 2. DS18B20 Temp Probe */}
                {comp.definitionId === 'sensor-ds18b20' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Probe Temperature
                        </span>
                        <span className="text-white font-mono font-semibold">
                          {Number(comp.values.temperature ?? 26.8).toFixed(1)}°C
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-55"
                        max="125"
                        step="0.5"
                        value={Number(comp.values.temperature ?? 26.8)}
                        onChange={(e) =>
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            temperature: parseFloat(e.target.value),
                          })
                        }
                        className="studio-slider"
                      />
                    </div>

                    {/* Presets Segmented Pills */}
                    <div className="space-y-1.5">
                      <span className="text-xs text-[#8e8e93] font-medium">Thermal Benchmarks</span>
                      <div className="grid grid-cols-4 gap-1 bg-[#202026] p-1 rounded-xl border border-[#2c2c34]">
                        {[
                          { label: '0°C', val: 0.0 },
                          { label: '25°C', val: 25.0 },
                          { label: '40°C', val: 40.0 },
                          { label: '100°C', val: 100.0 },
                        ].map((b) => (
                          <button
                            key={b.label}
                            onClick={() =>
                              onComponentValuesChange(comp.instanceId, {
                                ...comp.values,
                                temperature: b.val,
                              })
                            }
                            className={`py-1 rounded-lg text-xs font-mono transition-all ${
                              Math.round(Number(comp.values.temperature)) === b.val
                                ? 'bg-[#2e2e38] text-white border border-white/20 font-semibold'
                                : 'text-[#8e8e93] hover:text-white'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#222227] border border-[#2b2b32] rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                      <span className="text-[#8e8e93] font-medium">1-Wire Bus</span>
                      <span className="text-white font-mono font-semibold">
                        {Number(comp.values.temperature ?? 26.8).toFixed(2)}
                      </span>
                      <span className="text-[#71717a] text-[10px] font-mono">°C (Dallas ROM)</span>
                    </div>
                  </div>
                )}

                {/* 3. MPU6050 6-Axis */}
                {comp.definitionId === 'sensor-mpu6050' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#202026] border border-[#2c2c34] rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-[#282830] border border-[#383842] flex items-center justify-center relative shadow-inner cursor-pointer hover:border-white/40 transition-colors"
                          style={{
                            transform: `rotate(${comp.values.pitch ?? 0}deg)`,
                          }}
                        >
                          <div className="w-0.5 h-3.5 bg-white rounded-full -translate-y-1.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">Orientation Dial</div>
                          <div className="text-[10px] text-[#8e8e93] font-mono">
                            Pitch {Number(comp.values.pitch ?? 0)}° | Roll {Number(comp.values.roll ?? 0)}°
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#282830] border border-[#34343e] px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white flex items-center gap-1">
                        <span>{Number(comp.values.pitch ?? 0)}</span>
                        <span className="text-[#71717a]">°</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
                        <span>Pitch Angle</span>
                        <span className="text-white font-mono font-semibold">{Number(comp.values.pitch ?? 0)}°</span>
                      </div>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={Number(comp.values.pitch ?? 0)}
                        onChange={(e) => {
                          const pitch = parseInt(e.target.value, 10);
                          const rad = (pitch * Math.PI) / 180;
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            pitch,
                            accelY: -Math.sin(rad),
                            accelZ: Math.cos(rad),
                          });
                        }}
                        className="studio-slider"
                      />
                    </div>
                  </div>
                )}

                {/* 4. ADXL345 3-Axis Accel */}
                {comp.definitionId === 'sensor-adxl345' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#202026] border border-[#2c2c34] rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-[#1e293b] border border-[#3b82f6] flex items-center justify-center relative shadow-inner cursor-pointer"
                          style={{
                            transform: `rotate(${comp.values.pitch ?? 0}deg)`,
                          }}
                        >
                          <div className="w-0.5 h-3.5 bg-sky-400 rounded-full -translate-y-1.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">ADXL345 G-Vector</div>
                          <div className="text-[10px] text-sky-400 font-mono">
                            I2C: 0x53 (13-bit)
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#282830] border border-[#34343e] px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white">
                        {comp.values.range || '±16g'}
                      </div>
                    </div>

                    {/* Sensitivity Range Selector Pills */}
                    <div className="space-y-1.5">
                      <span className="text-xs text-[#8e8e93] font-medium">Dynamic Range</span>
                      <div className="grid grid-cols-4 gap-1 bg-[#202024] p-1 rounded-xl border border-[#2c2c34]">
                        {['±2g', '±4g', '±8g', '±16g'].map((r) => (
                          <button
                            key={r}
                            onClick={() =>
                              onComponentValuesChange(comp.instanceId, {
                                ...comp.values,
                                range: r,
                              })
                            }
                            className={`py-1 rounded-lg text-xs font-mono transition-all ${
                              (comp.values.range || '±16g') === r
                                ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40 font-semibold'
                                : 'text-[#8e8e93] hover:text-white'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
                        <span>Tilt / Acceleration Angle</span>
                        <span className="text-white font-mono font-semibold">{Number(comp.values.pitch ?? 0)}°</span>
                      </div>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={Number(comp.values.pitch ?? 0)}
                        onChange={(e) => {
                          const pitch = parseInt(e.target.value, 10);
                          const rad = (pitch * Math.PI) / 180;
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            pitch,
                            accelY: -Math.sin(rad),
                            accelZ: Math.cos(rad),
                          });
                        }}
                        className="studio-slider"
                      />
                    </div>
                  </div>
                )}

                {/* 5. IR Obstacle Sensor */}
                {comp.definitionId === 'sensor-ir' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#202026] border border-[#2c2c34] rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <Eye className={`w-5 h-5 ${comp.values.obstacleDetected ? 'text-emerald-400' : 'text-[#71717a]'}`} />
                        <div>
                          <div className="text-xs font-semibold text-white">Infrared Beam</div>
                          <div className="text-[10px] text-[#8e8e93] font-mono">
                            Active LOW (LM393)
                          </div>
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${comp.values.obstacleDetected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-[#282830] text-[#71717a]'}`}>
                        {comp.values.obstacleDetected ? 'TRIGGERED' : 'CLEAR'}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
                        <span>Obstacle Distance</span>
                        <span className="text-white font-mono font-semibold">
                          {Number(comp.values.distance ?? 14).toFixed(0)} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="35"
                        step="1"
                        value={Number(comp.values.distance ?? 14)}
                        onChange={(e) => {
                          const dist = parseInt(e.target.value, 10);
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            distance: dist,
                            obstacleDetected: dist < 12,
                          });
                        }}
                        className="studio-slider"
                      />
                    </div>

                    <button
                      onClick={() =>
                        onComponentValuesChange(comp.instanceId, {
                          ...comp.values,
                          obstacleDetected: !comp.values.obstacleDetected,
                          distance: comp.values.obstacleDetected ? 20 : 6,
                        })
                      }
                      className="w-full py-2 bg-[#25252c] hover:bg-[#2e2e36] border border-[#343440] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Toggle Obstacle In Front</span>
                    </button>
                  </div>
                )}

                {/* 6. INMP441 I2S MEMS Mic */}
                {comp.definitionId === 'sensor-inmp441' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#202026] border border-[#2c2c34] rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <Mic className="w-5 h-5 text-purple-400" />
                        <div>
                          <div className="text-xs font-semibold text-white">Digital I2S Audio</div>
                          <div className="text-[10px] text-purple-400 font-mono">
                            24-bit / 44.1 kHz PCM
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#282830] border border-[#34343e] px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-purple-300">
                        {comp.values.soundLevel ?? 40} dB
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Acoustic Amplitude
                        </span>
                        <span className="text-white font-mono font-semibold">
                          {comp.values.soundLevel ?? 40} dB
                        </span>
                      </div>
                      <input
                        type="range"
                        min="25"
                        max="110"
                        value={Number(comp.values.soundLevel ?? 40)}
                        onChange={(e) => {
                          const sound = parseInt(e.target.value, 10);
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            soundLevel: sound,
                            triggered: sound > 70,
                          });
                        }}
                        className="studio-slider"
                      />
                    </div>

                    <button
                      onMouseDown={() => {
                        onComponentValuesChange(comp.instanceId, {
                          ...comp.values,
                          soundLevel: 98,
                          triggered: true,
                        });
                      }}
                      onMouseUp={() => {
                        setTimeout(() => {
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            soundLevel: 40,
                            triggered: false,
                          });
                        }, 350);
                      }}
                      className="w-full py-2 bg-purple-950/40 hover:bg-purple-950/60 border border-purple-800/40 text-purple-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                      <span>Trigger Loud Sound Pulse</span>
                    </button>
                  </div>
                )}

                {/* 7. Classic Mic */}
                {comp.definitionId === 'sensor-mic' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-white" /> Audio Gain
                        </span>
                        <span className="text-white font-mono font-semibold">
                          {comp.values.soundLevel ?? 42} dB
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="105"
                        value={Number(comp.values.soundLevel ?? 42)}
                        onChange={(e) => {
                          const sound = parseInt(e.target.value, 10);
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            soundLevel: sound,
                            triggered: sound > Number(comp.values.threshold ?? 65),
                          });
                        }}
                        className="studio-slider"
                      />
                    </div>
                  </div>
                )}

                {/* 8. Ultrasonic */}
                {comp.definitionId === 'sensor-ultrasonic' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5 text-white" /> Distance Target
                        </span>
                        <span className="text-white font-mono font-semibold">
                          {Number(comp.values.distance ?? 25).toFixed(1)} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="300"
                        step="1"
                        value={Number(comp.values.distance ?? 25)}
                        onChange={(e) =>
                          onComponentValuesChange(comp.instanceId, {
                            ...comp.values,
                            distance: parseFloat(e.target.value),
                          })
                        }
                        className="studio-slider"
                      />
                    </div>
                  </div>
                )}

                {/* 9. Push Button */}
                {comp.definitionId === 'module-button' && (
                  <div>
                    <button
                      onMouseDown={() =>
                        onComponentValuesChange(comp.instanceId, {
                          ...comp.values,
                          pressed: true,
                        })
                      }
                      onMouseUp={() =>
                        onComponentValuesChange(comp.instanceId, {
                          ...comp.values,
                          pressed: false,
                        })
                      }
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 border ${
                        comp.values.pressed
                          ? 'bg-white text-black border-white'
                          : 'bg-[#25252c] text-[#f4f4f6] border-[#343440] hover:bg-[#2c2c34]'
                      }`}
                    >
                      {comp.values.pressed ? 'Button Active (HIGH)' : 'Press & Hold Tactile Switch'}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Global IoT Toggles */}
        <div className="pt-4 border-t border-[#27272a] space-y-3">
          <span className="text-xs font-semibold text-[#a1a1aa] tracking-tight">System Settings</span>

          <div className="flex items-center justify-between text-xs">
            <span className="text-white font-medium">Real-time pin polling</span>
            <button
              onClick={() => setTelemetryPollToggle(!telemetryPollToggle)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${
                telemetryPollToggle ? 'bg-white' : 'bg-[#2a2a32]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  telemetryPollToggle ? 'bg-black translate-x-4' : 'bg-white translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-white font-medium">Web Audio buzzer beep</span>
            <button
              onClick={() => setBuzzerAudioToggle(!buzzerAudioToggle)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${
                buzzerAudioToggle ? 'bg-white' : 'bg-[#2a2a32]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  buzzerAudioToggle ? 'bg-black translate-x-4' : 'bg-white translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
