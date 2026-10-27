import { PlacedComponent, WireConnection, CircuitValidationIssue, PinDefinition } from '../types/circuit';
import { BOARDS } from '../data/boards';
import { SENSORS } from '../data/sensors';

export function getPinDefinition(
  component: PlacedComponent,
  pinId: string
): PinDefinition | undefined {
  if (component.kind === 'board') {
    const board = BOARDS[component.definitionId];
    return board?.pins.find((p) => p.id === pinId);
  } else {
    const sensor = SENSORS[component.definitionId];
    return sensor?.pins.find((p) => p.id === pinId);
  }
}

export function validateCircuit(
  components: PlacedComponent[],
  wires: WireConnection[]
): {
  issues: CircuitValidationIssue[];
  i2cDevicesFound: Array<{ address: number; name: string }>;
  isPowered: boolean;
} {
  const issues: CircuitValidationIssue[] = [];
  const i2cDevicesFound: Array<{ address: number; name: string }> = [];

  const boardComponent = components.find((c) => c.kind === 'board');
  if (!boardComponent) {
    issues.push({
      severity: 'warning',
      title: 'No Raspberry Pi Board',
      message: 'Add a Raspberry Pi board from the catalog to power your IoT circuit.',
      componentIds: [],
    });
    return { issues, i2cDevicesFound, isPowered: false };
  }

  // Check wires for direct short circuits (Power directly connected to GND)
  for (const wire of wires) {
    const fromComp = components.find((c) => c.instanceId === wire.fromComponentId);
    const toComp = components.find((c) => c.instanceId === wire.toComponentId);
    if (!fromComp || !toComp) continue;

    const fromPin = getPinDefinition(fromComp, wire.fromPinId);
    const toPin = getPinDefinition(toComp, wire.toPinId);
    if (!fromPin || !toPin) continue;

    const isFromPower = fromPin.type === 'POWER_3V3' || fromPin.type === 'POWER_5V';
    const isToPower = toPin.type === 'POWER_3V3' || toPin.type === 'POWER_5V';
    const isFromGND = fromPin.type === 'GND';
    const isToGND = toPin.type === 'GND';

    if ((isFromPower && isToGND) || (isFromGND && isToPower)) {
      issues.push({
        severity: 'error',
        title: 'Electrical Short Circuit Detected!',
        message: `Direct connection between ${fromPin.name} and ${toPin.name}. This would trigger over-current shutdown or damage hardware!`,
        componentIds: [wire.fromComponentId, wire.toComponentId],
      });
    }
  }

  // Check each sensor module
  for (const comp of components) {
    if (comp.kind !== 'sensor') continue;
    const def = SENSORS[comp.definitionId];
    if (!def) continue;

    const compWires = wires.filter(
      (w) => w.fromComponentId === comp.instanceId || w.toComponentId === comp.instanceId
    );

    // Identify which pins are wired
    const wiredPinIds = new Set<string>();
    compWires.forEach((w) => {
      if (w.fromComponentId === comp.instanceId) wiredPinIds.add(w.fromPinId);
      if (w.toComponentId === comp.instanceId) wiredPinIds.add(w.toPinId);
    });

    const hasPowerPin = def.pins.some((p) => p.type === 'POWER_3V3' || p.type === 'POWER_5V');
    const hasGNDPin = def.pins.some((p) => p.type === 'GND');

    const isPowerWired = def.pins
      .filter((p) => p.type === 'POWER_3V3' || p.type === 'POWER_5V')
      .some((p) => wiredPinIds.has(p.id));

    const isGndWired = def.pins
      .filter((p) => p.type === 'GND')
      .some((p) => wiredPinIds.has(p.id));

    if (hasPowerPin && !isPowerWired) {
      issues.push({
        severity: 'warning',
        title: `${comp.name}: Missing Power`,
        message: `VCC pin is not wired to a power source (3.3V or 5V rail).`,
        componentIds: [comp.instanceId],
      });
    }

    if (hasGNDPin && !isGndWired) {
      issues.push({
        severity: 'warning',
        title: `${comp.name}: Floating Ground`,
        message: `GND pin is disconnected. Sensors require a common ground reference with the Raspberry Pi.`,
        componentIds: [comp.instanceId],
      });
    }

    // Check I2C sensors
    if (def.i2cAddress && isPowerWired && isGndWired) {
      const isSclWired = wiredPinIds.has('scl');
      const isSdaWired = wiredPinIds.has('sda');
      if (isSclWired && isSdaWired) {
        i2cDevicesFound.push({
          address: def.i2cAddress,
          name: `${def.name} (0x${def.i2cAddress.toString(16).toUpperCase()})`,
        });
      } else {
        issues.push({
          severity: 'info',
          title: `${def.name}: I2C Bus Incomplete`,
          message: `Connect both SDA and SCL pins to Raspberry Pi I2C pins (GPIO 2 and GPIO 3).`,
          componentIds: [comp.instanceId],
        });
      }
    }
  }

  if (issues.length === 0) {
    issues.push({
      severity: 'info',
      title: 'Circuit Healthy',
      message: 'All wired components have valid power and ground paths. Ready for logic simulation!',
      componentIds: [],
    });
  }

  return { issues, i2cDevicesFound, isPowered: true };
}
