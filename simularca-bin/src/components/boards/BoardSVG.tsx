'use client';

import React from 'react';
import { BoardDefinition, PinDefinition, PinRuntimeState } from '../../types/circuit';

interface BoardSVGProps {
  board: BoardDefinition;
  pinStates: Map<string, PinRuntimeState>;
  componentId: string;
  onPinMouseDown: (pin: PinDefinition, e: React.MouseEvent) => void;
  onPinMouseEnter: (pin: PinDefinition, e: React.MouseEvent) => void;
  onPinMouseLeave: () => void;
  hoveredPinId?: string;
}

export const BoardSVG: React.FC<BoardSVGProps> = ({
  board,
  pinStates,
  componentId,
  onPinMouseDown,
  onPinMouseEnter,
  onPinMouseLeave,
  hoveredPinId,
}) => {
  const isPico = board.family === 'pi-pico';
  const isStandard = board.family === 'pi-standard';

  return (
    <div className="relative select-none" style={{ width: board.defaultWidth, height: board.defaultHeight }}>
      <svg
        viewBox={`0 0 ${board.defaultWidth} ${board.defaultHeight}`}
        className="w-full h-full drop-shadow-2xl rounded-xl overflow-visible"
      >
        <defs>
          <linearGradient id={`pcb-grad-${componentId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isPico ? '#047857' : isStandard ? '#14532d' : '#15803d'} />
            <stop offset="100%" stopColor={isPico ? '#064e3b' : isStandard ? '#052e16' : '#14532d'} />
          </linearGradient>

          <pattern id={`ground-plane-${componentId}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.5" fill="#ca8a04" opacity="0.15" />
            <circle cx="8" cy="8" r="0.5" fill="#ca8a04" opacity="0.15" />
          </pattern>

          <filter id="metal-sheen">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feSpecularLighting surfaceScale="2" specularConstant="1" specularExponent="20" lightingColor="#ffffff">
              <fePointLight x="-50" y="-100" z="200" />
            </feSpecularLighting>
            <feComposite in2="SourceAlpha" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Board PCB Outline */}
        <rect
          x="2"
          y="2"
          width={board.defaultWidth - 4}
          height={board.defaultHeight - 4}
          rx={isPico ? "8" : "18"}
          fill={`url(#pcb-grad-${componentId})`}
          stroke="#166534"
          strokeWidth="2.5"
        />

        {/* Ground Plane Texture */}
        <rect
          x="6"
          y="6"
          width={board.defaultWidth - 12}
          height={board.defaultHeight - 12}
          rx={isPico ? "6" : "14"}
          fill={`url(#ground-plane-${componentId})`}
        />

        {/* Mounting Holes */}
        {!isPico && (
          <>
            <circle cx="16" cy="16" r="6" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
            <circle cx={board.defaultWidth - 16} cy="16" r="6" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
            <circle cx="16" cy={board.defaultHeight - 16} r="6" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
            <circle cx={board.defaultWidth - 16} cy={board.defaultHeight - 16} r="6" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
          </>
        )}

        {/* Board Specific Details */}
        {board.family === 'pi-zero' && (
          <g id="pi-zero-hardware">
            {/* Broadcom SoC Chip */}
            <rect x="180" y="70" width="85" height="85" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="222" y="105" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              BROADCOM
            </text>
            <text x="222" y="120" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">
              {board.id.includes('2') ? 'RP3A0-AU 64-bit' : 'BCM2835 1GHz'}
            </text>
            <circle cx="190" cy="80" r="2" fill="#ca8a04" />

            {/* Mini-HDMI Port */}
            <rect x="110" y="196" width="46" height="22" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            <text x="133" y="192" fill="#cbd5e1" fontSize="7" textAnchor="middle">MINI-HDMI</text>

            {/* Micro-USB Ports */}
            <rect x="230" y="196" width="36" height="22" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            <text x="248" y="192" fill="#cbd5e1" fontSize="7" textAnchor="middle">USB-OTG</text>

            <rect x="320" y="196" width="36" height="22" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            <text x="338" y="192" fill="#cbd5e1" fontSize="7" textAnchor="middle">PWR-IN</text>

            {/* CSI Camera Ribbon Connector */}
            <rect x="8" y="65" width="14" height="90" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <text x="15" y="115" fill="#475569" fontSize="7" textAnchor="middle" transform="rotate(-90 15 115)">CAMERA CSI</text>

            {/* Wireless Shield (Zero W / Zero 2 W) */}
            {board.id.includes('w') && (
              <g>
                <rect x="300" y="65" width="60" height="50" rx="3" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
                <path d="M 320 85 Q 330 75 340 85" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                <path d="M 324 90 Q 330 84 336 90" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                <circle cx="330" cy="94" r="1.5" fill="#ffffff" />
                <text x="330" y="105" fill="#f8fafc" fontSize="7" textAnchor="middle">WiFi/BT</text>
              </g>
            )}
          </g>
        )}

        {board.family === 'pi-standard' && (
          <g id="pi-4-hardware">
            {/* Broadcom SoC */}
            <rect x="190" y="115" width="95" height="95" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="237" y="155" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              BROADCOM
            </text>
            <text x="237" y="172" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
              {board.id === 'pi-5' ? 'BCM2712 Quad-Core' : 'BCM2711 1.8GHz'}
            </text>

            {/* RAM Chip */}
            <rect x="195" y="225" width="75" height="55" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="232" y="255" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">LPDDR4 RAM</text>

            {/* Ports on Right: Ethernet & 4x USB */}
            <rect x={board.defaultWidth - 55} y="40" width="52" height="70" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            <text x={board.defaultWidth - 29} y="80" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">GIGABIT</text>

            <rect x={board.defaultWidth - 55} y="130" width="52" height="70" rx="2" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
            <text x={board.defaultWidth - 29} y="170" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">2x USB 3.0</text>

            <rect x={board.defaultWidth - 55} y="220" width="52" height="70" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            <text x={board.defaultWidth - 29} y="260" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle">2x USB 2.0</text>

            {/* Bottom: USB-C Power & Dual Micro-HDMI */}
            <rect x="70" y={board.defaultHeight - 16} width="35" height="16" rx="2" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
            <text x="87" y={board.defaultHeight - 20} fill="#94a3b8" fontSize="7" textAnchor="middle">USB-C</text>

            <rect x="140" y={board.defaultHeight - 16} width="30" height="16" rx="2" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
            <text x="155" y={board.defaultHeight - 20} fill="#94a3b8" fontSize="7" textAnchor="middle">HDMI 0</text>

            <rect x="200" y={board.defaultHeight - 16} width="30" height="16" rx="2" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
            <text x="215" y={board.defaultHeight - 20} fill="#94a3b8" fontSize="7" textAnchor="middle">HDMI 1</text>
          </g>
        )}

        {board.family === 'pi-pico' && (
          <g id="pico-hardware">
            {/* RP2040 chip in center */}
            <rect x="80" y="200" width="100" height="100" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="130" y="245" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              RP2040
            </text>
            <text x="130" y="262" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Dual ARM M0+
            </text>
            <circle cx="92" cy="212" r="2.5" fill="#ca8a04" />

            {/* Micro USB Port Top */}
            <rect x="95" y="4" width="70" height="35" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="130" y="25" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">USB 1.1</text>

            {/* Bootselect Button */}
            <circle cx="85" cy="85" r="12" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="85" cy="85" r="7" fill="#ffffff" />
            <text x="85" y="108" fill="#e2e8f0" fontSize="7" textAnchor="middle">BOOTSEL</text>

            {/* Crystal Oscillator */}
            <rect x="150" y="80" width="30" height="18" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
            <text x="165" y="92" fill="#1e293b" fontSize="7" textAnchor="middle">12MHz</text>
          </g>
        )}

        {/* Board Silkscreen Text / Logo */}
        <text
          x={isPico ? 130 : 60}
          y={isPico ? 370 : 65}
          fill="#f8fafc"
          fontSize={isPico ? 12 : 14}
          fontWeight="bold"
          letterSpacing="0.05em"
          textAnchor={isPico ? "middle" : "start"}
        >
          {board.name}
        </text>
        <text
          x={isPico ? 130 : 60}
          y={isPico ? 386 : 80}
          fill="#86efac"
          fontSize="9"
          letterSpacing="0.02em"
          textAnchor={isPico ? "middle" : "start"}
        >
          Official GPIO Layout (Simularca Ready)
        </text>

        {/* GPIO Header Background Strip for Standard / Zero */}
        {!isPico && (
          <rect
            x={board.defaultWidth * 0.08}
            y={board.defaultHeight * 0.11}
            width={board.defaultWidth * 0.84}
            height={board.defaultHeight * 0.16}
            rx="3"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="1"
          />
        )}

        {/* Pin Connectors & Contact Pads */}
        {board.pins.map((pin) => {
          const px = (pin.x / 100) * board.defaultWidth;
          const py = (pin.y / 100) * board.defaultHeight;
          const pinKey = `${componentId}:${pin.id}`;
          const state = pinStates.get(pinKey);
          const isHigh = state?.logicState === 'HIGH';
          const isHovered = hoveredPinId === pin.id;

          let ringColor = '#eab308'; // gold
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
              onMouseEnter={(e) => {
                onPinMouseEnter(pin, e);
              }}
              onMouseLeave={onPinMouseLeave}
            >
              {/* Gold outer annular ring */}
              <circle
                cx={px}
                cy={py}
                r={isHovered ? 7.5 : 5.5}
                fill="#1e293b"
                stroke={ringColor}
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="transition-all duration-150"
              />

              {/* Pin Center Hole */}
              <circle
                cx={px}
                cy={py}
                r={isHigh ? 3.5 : 2.5}
                fill={isHigh ? '#22c55e' : '#020617'}
                className="transition-colors duration-100"
              />

              {/* Active glow if GPIO HIGH */}
              {isHigh && (
                <circle
                  cx={px}
                  cy={py}
                  r="6.5"
                  fill="#22c55e"
                  opacity="0.4"
                  className="animate-pulse pointer-events-none"
                />
              )}

              {/* Hover snap ring indicator */}
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
            </g>
          );
        })}
      </svg>
    </div>
  );
};
