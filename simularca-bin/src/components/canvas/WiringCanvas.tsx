'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  PlacedComponent,
  WireConnection,
  PinDefinition,
  PinRuntimeState,
} from '../../types/circuit';
import { BOARDS } from '../../data/boards';
import { SENSORS } from '../../data/sensors';
import { BoardSVG } from '../boards/BoardSVG';
import { SensorSVG } from '../sensors/SensorSVG';
import { Trash2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface WiringCanvasProps {
  components: PlacedComponent[];
  wires: WireConnection[];
  pinStates: Map<string, PinRuntimeState>;
  onComponentsChange: (components: PlacedComponent[]) => void;
  onWiresChange: (wires: WireConnection[]) => void;
  onComponentValuesChange: (instanceId: string, values: Record<string, any>) => void;
  activeWireColor: string;
}

export const WiringCanvas: React.FC<WiringCanvasProps> = ({
  components,
  wires,
  pinStates,
  onComponentsChange,
  onWiresChange,
  onComponentValuesChange,
  activeWireColor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom and pan state
  const [scale, setScale] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 25 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dragging component state
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Wiring state
  const [pendingWire, setPendingWire] = useState<{
    fromComponentId: string;
    fromPin: PinDefinition;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Hovered pin & tooltip
  const [hoveredPin, setHoveredPin] = useState<{
    componentId: string;
    pin: PinDefinition;
    screenX: number;
    screenY: number;
  } | null>(null);

  // Hovered wire for deletion
  const [hoveredWireId, setHoveredWireId] = useState<string | null>(null);

  // Helper to compute absolute pin position on canvas
  const getPinCanvasCoords = useCallback(
    (componentId: string, pinId: string): { x: number; y: number } | null => {
      const comp = components.find((c) => c.instanceId === componentId);
      if (!comp) return null;

      let pinDef: PinDefinition | undefined;
      let width = 200;
      let height = 200;

      if (comp.kind === 'board') {
        const board = BOARDS[comp.definitionId];
        if (!board) return null;
        pinDef = board.pins.find((p) => p.id === pinId);
        width = board.defaultWidth;
        height = board.defaultHeight;
      } else {
        const sensor = SENSORS[comp.definitionId];
        if (!sensor) return null;
        pinDef = sensor.pins.find((p) => p.id === pinId);
        width = sensor.defaultWidth;
        height = sensor.defaultHeight;
      }

      if (!pinDef) return null;
      return {
        x: comp.x + (pinDef.x / 100) * width,
        y: comp.y + (pinDef.y / 100) * height,
      };
    },
    [components]
  );

  // Canvas Mouse down
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggingCompId && !pendingWire) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (pendingWire) {
      setPendingWire(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - pan.x) / scale;
    const canvasY = (e.clientY - rect.top - pan.y) / scale;

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (draggingCompId) {
      onComponentsChange(
        components.map((c) =>
          c.instanceId === draggingCompId
            ? { ...c, x: Math.max(10, canvasX - dragOffset.x), y: Math.max(10, canvasY - dragOffset.y) }
            : c
        )
      );
    } else if (pendingWire) {
      setPendingWire((prev) =>
        prev
          ? {
              ...prev,
              currentX: canvasX,
              currentY: canvasY,
            }
          : null
      );
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingCompId(null);
  };

  const handleComponentDragStart = (e: React.MouseEvent, component: PlacedComponent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - pan.x) / scale;
    const canvasY = (e.clientY - rect.top - pan.y) / scale;

    setDraggingCompId(component.instanceId);
    setDragOffset({
      x: canvasX - component.x,
      y: canvasY - component.y,
    });
  };

  const handlePinMouseDown = (componentId: string, pin: PinDefinition, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!pendingWire) {
      const startCoords = getPinCanvasCoords(componentId, pin.id);
      if (startCoords) {
        setPendingWire({
          fromComponentId: componentId,
          fromPin: pin,
          currentX: startCoords.x,
          currentY: startCoords.y,
        });
      }
    } else {
      if (pendingWire.fromComponentId === componentId && pendingWire.fromPin.id === pin.id) {
        setPendingWire(null);
        return;
      }

      const newWire: WireConnection = {
        id: `wire_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fromComponentId: pendingWire.fromComponentId,
        fromPinId: pendingWire.fromPin.id,
        toComponentId: componentId,
        toPinId: pin.id,
        color: activeWireColor,
      };

      onWiresChange([...wires, newWire]);
      setPendingWire(null);
    }
  };

  const deleteWire = (wireId: string) => {
    onWiresChange(wires.filter((w) => w.id !== wireId));
  };

  const deleteComponent = (instanceId: string) => {
    onComponentsChange(components.filter((c) => c.instanceId !== instanceId));
    onWiresChange(wires.filter((w) => w.fromComponentId !== instanceId && w.toComponentId !== instanceId));
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      className="relative w-full h-full bg-[#121215] overflow-hidden select-none cursor-default font-sans"
    >
      {/* Zoom Controls Pill (Refined style from reference image) */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1 bg-[#1a1a1e] border border-[#27272f] p-1 rounded-xl shadow-lg text-white">
        <button
          onClick={() => setScale((s) => Math.min(1.8, s + 0.15))}
          className="p-1.5 hover:bg-[#25252c] rounded-lg text-[#9ca3af] hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono font-medium w-11 text-center text-[#d1d5db]">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.max(0.4, s - 0.15))}
          className="p-1.5 hover:bg-[#25252c] rounded-lg text-[#9ca3af] hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setScale(0.95);
            setPan({ x: 30, y: 25 });
          }}
          className="p-1.5 hover:bg-[#25252c] rounded-lg text-[#9ca3af] hover:text-white transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Canvas Workspace */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Subtle Circuit Blueprint Grid */}
        <div
          className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #25252d 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Layer for Wires */}
        <svg className="absolute inset-0 w-[5000px] h-[5000px] overflow-visible pointer-events-auto">
          <defs>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Render Committed Wires */}
          {wires.map((wire) => {
            const from = getPinCanvasCoords(wire.fromComponentId, wire.fromPinId);
            const to = getPinCanvasCoords(wire.toComponentId, wire.toPinId);
            if (!from || !to) return null;

            const fromState = pinStates.get(`${wire.fromComponentId}:${wire.fromPinId}`);
            const isHigh = fromState?.logicState === 'HIGH';
            const isHovered = hoveredWireId === wire.id;

            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const sag = Math.min(130, Math.max(35, dist * 0.22));

            const cp1X = from.x;
            const cp1Y = from.y + sag;
            const cp2X = to.x;
            const cp2Y = to.y + sag;
            const pathData = `M ${from.x} ${from.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${to.x} ${to.y}`;

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 + sag * 0.75;

            return (
              <g
                key={wire.id}
                onMouseEnter={() => setHoveredWireId(wire.id)}
                onMouseLeave={() => setHoveredWireId(null)}
                className="cursor-pointer group"
              >
                {/* Hit target */}
                <path d={pathData} fill="none" stroke="transparent" strokeWidth="20" />

                {/* Wire Body */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={wire.color}
                  strokeWidth={isHovered ? 4.5 : 3.0}
                  strokeLinecap="round"
                  filter="url(#neon-glow)"
                  className="transition-all duration-150"
                />

                {/* Animated active current signal */}
                {isHigh && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                    className="animate-[dash_0.8s_linear_infinite]"
                  />
                )}

                {/* Pin Terminal Endpoints */}
                <circle cx={from.x} cy={from.y} r="4" fill="#141416" stroke={wire.color} strokeWidth="2" />
                <circle cx={to.x} cy={to.y} r="4" fill="#141416" stroke={wire.color} strokeWidth="2" />

                {/* Delete button on hover */}
                {isHovered && (
                  <g
                    transform={`translate(${midX - 10}, ${midY - 10})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWire(wire.id);
                    }}
                    className="cursor-pointer hover:scale-115 transition-transform"
                  >
                    <rect width="20" height="20" rx="10" fill="#ffffff" />
                    <text x="10" y="14" fill="#000000" fontSize="12" fontWeight="bold" textAnchor="middle">
                      ×
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Pending Wire being drawn */}
          {pendingWire && (
            (() => {
              const fromCoords = getPinCanvasCoords(pendingWire.fromComponentId, pendingWire.fromPin.id);
              if (!fromCoords) return null;
              const toX = pendingWire.currentX;
              const toY = pendingWire.currentY;
              const sag = 40;
              const pathData = `M ${fromCoords.x} ${fromCoords.y} C ${fromCoords.x} ${fromCoords.y + sag}, ${toX} ${toY + sag}, ${toX} ${toY}`;

              return (
                <g className="pointer-events-none">
                  <path
                    d={pathData}
                    fill="none"
                    stroke={activeWireColor}
                    strokeWidth="3.0"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  <circle cx={toX} cy={toY} r="4.5" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                </g>
              );
            })()
          )}
        </svg>

        {/* Placed Hardware Components Layer */}
        {components.map((comp) => {
          const isDragging = draggingCompId === comp.instanceId;

          return (
            <div
              key={comp.instanceId}
              style={{
                left: comp.x,
                top: comp.y,
                zIndex: isDragging ? 25 : 10,
              }}
              className="absolute pointer-events-auto"
            >
              <div className="group relative">
                {/* Refined Pill Component Header Bar */}
                <div
                  onMouseDown={(e) => handleComponentDragStart(e, comp)}
                  className="flex items-center justify-between px-3 py-1.5 mb-1.5 bg-[#1b1b20]/95 border border-[#2b2b34] rounded-xl backdrop-blur-md cursor-grab active:cursor-grabbing text-xs font-semibold text-white shadow-md hover:border-[#383844] transition-colors"
                >
                  <span className="truncate max-w-[170px] tracking-tight">{comp.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteComponent(comp.instanceId);
                    }}
                    className="p-1 text-[#8e8e93] hover:text-rose-400 rounded-md hover:bg-[#25252c] transition-colors"
                    title="Remove Component"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Component Visual SVG Render */}
                {comp.kind === 'board' ? (
                  <BoardSVG
                    board={BOARDS[comp.definitionId]}
                    pinStates={pinStates}
                    componentId={comp.instanceId}
                    onPinMouseDown={(pin, e) => handlePinMouseDown(comp.instanceId, pin, e)}
                    onPinMouseEnter={(pin, e) =>
                      setHoveredPin({
                        componentId: comp.instanceId,
                        pin,
                        screenX: e.clientX,
                        screenY: e.clientY,
                      })
                    }
                    onPinMouseLeave={() => setHoveredPin(null)}
                    hoveredPinId={hoveredPin?.componentId === comp.instanceId ? hoveredPin.pin.id : undefined}
                  />
                ) : (
                  <SensorSVG
                    sensor={SENSORS[comp.definitionId]}
                    values={comp.values}
                    pinStates={pinStates}
                    componentId={comp.instanceId}
                    onPinMouseDown={(pin, e) => handlePinMouseDown(comp.instanceId, pin, e)}
                    onPinMouseEnter={(pin, e) =>
                      setHoveredPin({
                        componentId: comp.instanceId,
                        pin,
                        screenX: e.clientX,
                        screenY: e.clientY,
                      })
                    }
                    onPinMouseLeave={() => setHoveredPin(null)}
                    hoveredPinId={hoveredPin?.componentId === comp.instanceId ? hoveredPin.pin.id : undefined}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Contrast White Tooltip Popover (Matching reference Image 1 popover style) */}
      {hoveredPin && (
        <div
          style={{
            left: hoveredPin.screenX + 16,
            top: hoveredPin.screenY - 24,
          }}
          className="fixed z-50 pointer-events-none bg-white text-black shadow-2xl rounded-xl px-3 py-2 text-xs font-sans min-w-[200px] animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
            <span className="font-bold text-black font-mono">{hoveredPin.pin.name}</span>
            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-black text-white">
              {hoveredPin.pin.type}
            </span>
          </div>
          {hoveredPin.pin.physicalPin && (
            <div className="flex justify-between text-[#64748b] text-[11px] font-mono">
              <span>Header Pin:</span>
              <span className="text-black font-bold">#{hoveredPin.pin.physicalPin}</span>
            </div>
          )}
          {hoveredPin.pin.bcm !== undefined && (
            <div className="flex justify-between text-[#64748b] text-[11px] font-mono">
              <span>BCM GPIO:</span>
              <span className="text-black font-bold">GPIO {hoveredPin.pin.bcm}</span>
            </div>
          )}
          {(() => {
            const state = pinStates.get(`${hoveredPin.componentId}:${hoveredPin.pin.id}`);
            return (
              <div className="flex justify-between text-[#64748b] text-[11px] font-mono mt-0.5">
                <span>Signal:</span>
                <span className="font-bold text-black">
                  {state?.logicState ?? 'FLOATING'} ({state?.voltage.toFixed(1) ?? '0.0'}V)
                </span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
