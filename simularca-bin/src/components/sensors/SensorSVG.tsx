'use client';

import React from 'react';
import { SensorDefinition, PinDefinition, PinRuntimeState } from '../../types/circuit';

interface SensorSVGProps {
  sensor: SensorDefinition;
  values: Record<string, any>;
  pinStates: Map<string, PinRuntimeState>;
  componentId: string;
  onPinMouseDown: (pin: PinDefinition, e: React.MouseEvent) => void;
  onPinMouseEnter: (pin: PinDefinition, e: React.MouseEvent) => void;
  onPinMouseLeave: () => void;
  hoveredPinId?: string;
}

export const SensorSVG: React.FC<SensorSVGProps> = ({
  sensor,
  values,
  pinStates,
  componentId,
  onPinMouseDown,
  onPinMouseEnter,
  onPinMouseLeave,
  hoveredPinId,
}) => {
  const width = sensor.defaultWidth;
  const height = sensor.defaultHeight;

  // Render specific sensor graphics based on sensor.type
  const renderHardwareContent = () => {
    switch (sensor.type) {
      case 'DHT22': {
        const temp = values.temperature ?? 24.5;
        const hum = values.humidity ?? 50.0;
        return (
          <g id="dht22-body">
            {/* White plastic ribbed grille enclosure */}
            <rect x="15" y="15" width={width - 30} height={height - 50} rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            {[28, 42, 56, 70, 84].map((y, idx) => (
              <rect key={idx} x="28" y={y} width={width - 56} height="7" rx="3" fill="#94a3b8" />
            ))}
            <text x={width / 2} y="112" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              AM2302 (DHT22)
            </text>
            <text x={width / 2} y="128" fill="#0284c7" fontSize="9" fontWeight="600" textAnchor="middle">
              {Number(temp).toFixed(1)}°C | {Number(hum).toFixed(0)}% RH
            </text>
          </g>
        );
      }

      case 'DS18B20': {
        const temp = Number(values.temperature ?? 26.8).toFixed(1);
        return (
          <g id="ds18b20-body">
            {/* Stainless steel waterproof probe cylinder & TO-92 head */}
            <rect x="18" y="14" width={width - 36} height="48" rx="8" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            <rect x="24" y="20" width={width - 48} height="12" rx="3" fill="#64748b" />
            {/* TO-92 Black Epoxy package */}
            <path
              d={`M ${width / 2 - 22} 66 L ${width / 2 + 22} 66 C ${width / 2 + 22} 98, ${width / 2 - 22} 98, ${width / 2 - 22} 66 Z`}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2"
            />
            <text x={width / 2} y="82" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              DALLAS
            </text>
            <text x={width / 2} y="93" fill="#38bdf8" fontSize="7" textAnchor="middle" fontFamily="monospace">
              18B20 1-Wire
            </text>
            <text x={width / 2} y="120" fill="#facc15" fontSize="11" fontWeight="bold" textAnchor="middle">
              {temp}°C
            </text>
          </g>
        );
      }

      case 'MPU6050': {
        const ax = Number(values.accelX ?? 0).toFixed(2);
        const ay = Number(values.accelY ?? 0).toFixed(2);
        const az = Number(values.accelZ ?? 1).toFixed(2);
        return (
          <g id="mpu6050-body">
            <rect x="8" y="10" width={width - 16} height={height - 35} rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            <rect x={width / 2 - 24} y="32" width="48" height="48" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x={width / 2} y="55" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              MPU
            </text>
            <text x={width / 2} y="68" fill="#38bdf8" fontSize="7" textAnchor="middle" fontFamily="monospace">
              6050
            </text>
            <path d={`M ${width / 2 - 38} 45 L ${width / 2 - 38} 25 L ${width / 2 - 42} 29 M ${width / 2 - 38} 25 L ${width / 2 - 34} 29`} stroke="#facc15" strokeWidth="1.5" />
            <text x={width / 2 - 44} y="25" fill="#facc15" fontSize="7" fontWeight="bold">Y</text>
            <path d={`M ${width / 2 - 38} 45 L ${width / 2 - 18} 45 L ${width / 2 - 22} 41 M ${width / 2 - 18} 45 L ${width / 2 - 22} 49`} stroke="#facc15" strokeWidth="1.5" />
            <text x={width / 2 - 14} y="48" fill="#facc15" fontSize="7" fontWeight="bold">X</text>
            <text x={width / 2} y="98" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              Z: {az}g | Pitch: {Number(values.pitch ?? 0).toFixed(0)}°
            </text>
            <text x={width / 2} y="112" fill="#bae6fd" fontSize="8" textAnchor="middle">
              X:{ax} Y:{ay} (I2C: 0x68)
            </text>
          </g>
        );
      }

      case 'ADXL345': {
        const ax = Number(values.accelX ?? 0).toFixed(2);
        const ay = Number(values.accelY ?? 0).toFixed(2);
        const az = Number(values.accelZ ?? 1).toFixed(2);
        return (
          <g id="adxl345-body">
            {/* Deep Blue PCB */}
            <rect x="8" y="10" width={width - 16} height={height - 35} rx="6" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="2" />
            {/* ADXL345 LGA-14 IC */}
            <rect x={width / 2 - 20} y="32" width="40" height="40" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <circle cx={width / 2 - 12} cy="40" r="2" fill="#ca8a04" />
            <text x={width / 2} y="54" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              ADXL
            </text>
            <text x={width / 2} y="65" fill="#60a5fa" fontSize="7" textAnchor="middle" fontFamily="monospace">
              345
            </text>
            {/* Silkscreen text */}
            <text x={width / 2} y="92" fill="#facc15" fontSize="9" fontWeight="bold" textAnchor="middle">
              Z: {az}g ({values.range || '±16g'})
            </text>
            <text x={width / 2} y="106" fill="#bfdbfe" fontSize="8" textAnchor="middle">
              X:{ax} Y:{ay} | I2C: 0x53
            </text>
          </g>
        );
      }

      case 'MICROPHONE': {
        const sound = Number(values.soundLevel ?? 40);
        const isTriggered = values.triggered || sound > Number(values.threshold ?? 60);
        return (
          <g id="mic-body">
            <rect x="8" y="10" width={width - 16} height={height - 35} rx="6" fill="#be123c" stroke="#9f1239" strokeWidth="2" />
            <circle cx={width / 2} cy="48" r="24" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            <circle cx={width / 2} cy="48" r="18" fill="#94a3b8" />
            <circle cx={width / 2} cy="48" r="7" fill="#0f172a" />
            <rect x="25" y="80" width="22" height="22" rx="2" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
            <circle cx="36" cy="91" r="5" fill="#ca8a04" />
            <line x1="33" y1="91" x2="39" y2="91" stroke="#451a03" strokeWidth="1.5" />
            <text x={width / 2 + 15} y="90" fill="#ffffff" fontSize="10" fontWeight="bold">
              {sound} dB
            </text>
            <circle
              cx={width / 2 + 50}
              cy="86"
              r="5"
              fill={isTriggered ? '#ef4444' : '#22c55e'}
              stroke="#ffffff"
              strokeWidth="1"
              className={isTriggered ? 'animate-ping' : ''}
            />
            <text x={width / 2} y="116" fill="#fecdd3" fontSize="8" textAnchor="middle">
              {isTriggered ? 'THRESHOLD EXCEEDED!' : 'LM393 Comparator OK'}
            </text>
          </g>
        );
      }

      case 'INMP441': {
        const sound = Number(values.soundLevel ?? 40);
        const isTriggered = values.triggered || sound > 65;
        return (
          <g id="inmp441-body">
            {/* Hexagonal / Rounded Purple Breakout PCB */}
            <rect x="8" y="10" width={width - 16} height={height - 35} rx="8" fill="#581c87" stroke="#7e22ce" strokeWidth="2" />
            {/* Gold MEMS Microphone Canister with Center Port */}
            <circle cx={width / 2} cy="46" r="22" fill="#ca8a04" stroke="#eab308" strokeWidth="2" />
            <circle cx={width / 2} cy="46" r="16" fill="#1e1b4b" />
            <circle cx={width / 2} cy="46" r="4" fill="#020617" />
            {/* Sound Wave Indicator */}
            <text x={width / 2} y="86" fill="#f3e8ff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              INMP441 I2S
            </text>
            <text x={width / 2} y="102" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {sound} dB {isTriggered ? '⚡' : ''}
            </text>
            <text x={width / 2} y="116" fill="#d8b4fe" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
              24-bit PCM / 44.1kHz
            </text>
          </g>
        );
      }

      case 'IR_SENSOR': {
        const isDetected = Boolean(values.obstacleDetected || Number(values.distance ?? 20) < 10);
        const dist = Number(values.distance ?? 14).toFixed(0);
        return (
          <g id="ir-body">
            {/* Black PCB */}
            <rect x="8" y="10" width={width - 16} height={height - 35} rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            {/* Dual IR Diodes (Transmitter Clear & Receiver Black) */}
            <circle cx={width / 2 - 20} cy="26" r="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <circle cx={width / 2 - 20} cy="26" r="6" fill="#f8fafc" />
            <text x={width / 2 - 20} y="44" fill="#cbd5e1" fontSize="7" textAnchor="middle">TX</text>

            <circle cx={width / 2 + 20} cy="26" r="11" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
            <circle cx={width / 2 + 20} cy="26" r="6" fill="#18181b" />
            <text x={width / 2 + 20} y="44" fill="#a1a1aa" fontSize="7" textAnchor="middle">RX</text>

            {/* Trimmer & Indicator LED */}
            <rect x={width / 2 - 12} y="54" width="24" height="24" rx="3" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
            <circle cx={width / 2} cy="66" r="5" fill="#ca8a04" />

            {/* Obstacle status LED */}
            <circle
              cx={width / 2}
              cy="92"
              r="6"
              fill={isDetected ? '#22c55e' : '#334155'}
              stroke="#ffffff"
              strokeWidth="1"
              className={isDetected ? 'animate-pulse' : ''}
            />
            <text x={width / 2} y="112" fill={isDetected ? '#4ade80' : '#a1a1aa'} fontSize="8.5" fontWeight="bold" textAnchor="middle">
              {isDetected ? 'OBSTACLE DETECTED' : `CLEAR (${dist}cm)`}
            </text>
          </g>
        );
      }

      case 'HC_SR04': {
        const dist = Number(values.distance ?? 25).toFixed(1);
        return (
          <g id="ultrasonic-body">
            <rect x="6" y="8" width={width - 12} height={height - 30} rx="6" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            <circle cx="55" cy="50" r="26" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            <circle cx="55" cy="50" r="20" fill="#64748b" />
            <text x="55" y="55" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">T</text>
            <circle cx={width - 55} cy="50" r="26" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            <circle cx={width - 55} cy="50" r="20" fill="#64748b" />
            <text x={width - 55} y="55" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">R</text>
            <text x={width / 2} y="100" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">
              {dist} cm
            </text>
          </g>
        );
      }

      case 'SSD1306': {
        const l1 = values.line1 ?? 'SIMULARCA IoT';
        const l2 = values.line2 ?? 'Raspberry Pi Zero W';
        const l3 = values.line3 ?? 'System Active';
        const l4 = values.line4 ?? '';
        return (
          <g id="oled-body">
            <rect x="6" y="6" width={width - 12} height={height - 12} rx="6" fill="#0369a1" stroke="#0284c7" strokeWidth="2" />
            <rect x="18" y="38" width={width - 36} height="120" rx="3" fill="#050b14" stroke="#0f172a" strokeWidth="2" />
            <text x="26" y="62" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {l1}
            </text>
            <text x="26" y="80" fill="#38bdf8" fontSize="9" fontFamily="monospace">
              {l2}
            </text>
            <text x="26" y="98" fill="#38bdf8" fontSize="9" fontFamily="monospace">
              {l3}
            </text>
            <text x="26" y="116" fill="#38bdf8" fontSize="9" fontFamily="monospace">
              {l4}
            </text>
            <rect x="26" y="132" width={width - 52} height="14" fill="#0284c7" opacity="0.3" rx="2" />
            <text x="30" y="143" fill="#7dd3fc" fontSize="8" fontFamily="monospace">
              [ 128x64 I2C: 0x3C ]
            </text>
          </g>
        );
      }

      case 'LED_RED':
      case 'LED_GREEN': {
        const isRed = sensor.type === 'LED_RED';
        const isLit = Boolean(values.lit);
        const glowColor = isRed ? '#ef4444' : '#22c55e';
        const darkColor = isRed ? '#7f1d1d' : '#14532d';

        return (
          <g id="led-body">
            <rect x="10" y="10" width={width - 20} height={height - 35} rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {isLit && (
              <circle
                cx={width / 2}
                cy="46"
                r="34"
                fill={glowColor}
                opacity="0.35"
                className="animate-pulse pointer-events-none"
              />
            )}
            <circle
              cx={width / 2}
              cy="46"
              r="20"
              fill={isLit ? glowColor : darkColor}
              stroke={isLit ? '#ffffff' : glowColor}
              strokeWidth="2"
            />
            <ellipse cx={width / 2 - 6} cy="40" rx="4" ry="7" fill="#ffffff" opacity={isLit ? 0.7 : 0.25} />
            <rect x={width / 2 - 14} y="76" width="28" height="10" rx="2" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />
            <text x={width / 2} y="100" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">
              {isLit ? 'HIGH (ON)' : 'LOW (OFF)'}
            </text>
          </g>
        );
      }

      case 'ACTIVE_BUZZER': {
        const isSounding = Boolean(values.sounding);
        return (
          <g id="buzzer-body">
            <rect x="10" y="10" width={width - 20} height={height - 35} rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <circle cx={width / 2} cy="48" r="26" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx={width / 2} cy="48" r="7" fill="#334155" />
            <text x={width / 2 - 14} y="38" fill="#ef4444" fontSize="12" fontWeight="bold">+</text>
            {isSounding && (
              <>
                <circle cx={width / 2} cy="48" r="32" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping" />
                <circle cx={width / 2} cy="48" r="40" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
              </>
            )}
            <text x={width / 2} y="98" fill={isSounding ? '#f59e0b' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle">
              {isSounding ? 'BEEPING 2.4kHz' : 'IDLE'}
            </text>
          </g>
        );
      }

      case 'PUSH_BUTTON': {
        const isPressed = Boolean(values.pressed);
        return (
          <g id="button-body">
            <rect x="8" y="10" width={width - 16} height={height - 35} rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <rect x="25" y="24" width={width - 50} height={width - 50} rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <circle
              cx={width / 2}
              cy={24 + (width - 50) / 2}
              r={isPressed ? 17 : 20}
              fill={isPressed ? '#15803d' : '#22c55e'}
              stroke="#166534"
              strokeWidth="2"
              className="cursor-pointer transition-all"
            />
            <text x={width / 2} y="100" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              {isPressed ? 'PRESSED' : 'RELEASED'}
            </text>
          </g>
        );
      }

      default:
        return (
          <rect x="4" y="4" width={width - 8} height={height - 8} rx="6" fill="#1e293b" stroke="#475569" />
        );
    }
  };

  return (
    <div className="relative select-none" style={{ width, height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-xl overflow-visible">
        {renderHardwareContent()}

        {/* Silkscreen Pin Headers */}
        {sensor.pins.map((pin) => {
          const px = (pin.x / 100) * width;
          const py = (pin.y / 100) * height;
          const pinKey = `${componentId}:${pin.id}`;
          const state = pinStates.get(pinKey);
          const isHigh = state?.logicState === 'HIGH';
          const isHovered = hoveredPinId === pin.id;

          let ringColor = '#eab308';
          if (pin.type === 'POWER_3V3' || pin.type === 'POWER_5V') ringColor = '#ef4444';
          else if (pin.type === 'GND') ringColor = '#0f172a';
          else if (pin.type === 'I2C_SDA' || pin.type === 'I2C_SCL') ringColor = '#3b82f6';

          return (
            <g
              key={pin.id}
              className="cursor-crosshair group"
              onMouseDown={(e) => {
                e.stopPropagation();
                onPinMouseDown(pin, e);
              }}
              onMouseEnter={(e) => onPinMouseEnter(pin, e)}
              onMouseLeave={onPinMouseLeave}
            >
              <circle
                cx={px}
                cy={py}
                r={isHovered ? 7.5 : 5.5}
                fill="#1e293b"
                stroke={ringColor}
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="transition-all duration-150"
              />

              <circle
                cx={px}
                cy={py}
                r={isHigh ? 3.5 : 2.5}
                fill={isHigh ? '#22c55e' : '#020617'}
              />

              {isHovered && (
                <circle
                  cx={px}
                  cy={py}
                  r="10.5"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="animate-spin pointer-events-none"
                />
              )}

              <text
                x={px}
                y={py > height / 2 ? py - 9 : py + 14}
                fill="#e2e8f0"
                fontSize="7.5"
                fontWeight="bold"
                textAnchor="middle"
                className="pointer-events-none"
              >
                {pin.name.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
