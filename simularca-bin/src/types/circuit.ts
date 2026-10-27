export type PinType =
  | 'POWER_3V3'
  | 'POWER_5V'
  | 'GND'
  | 'GPIO'
  | 'I2C_SDA'
  | 'I2C_SCL'
  | 'SPI_MOSI'
  | 'SPI_MISO'
  | 'SPI_SCLK'
  | 'SPI_CE0'
  | 'SPI_CE1'
  | 'UART_TX'
  | 'UART_RX'
  | 'ANALOG';

export interface PinDefinition {
  id: string; // unique within component, e.g. "pin_1", "gpio_4", "vcc"
  name: string; // e.g. "3V3", "GPIO 4", "SDA1", "GND"
  bcm?: number; // e.g. 4 for GPIO4
  physicalPin?: number; // 1 to 40
  type: PinType;
  description?: string;
  // Relative position percentage (0 to 100) on component visual canvas
  x: number;
  y: number;
}

export type BoardFamily = 'pi-zero' | 'pi-standard' | 'pi-pico';

export interface BoardDefinition {
  id: string;
  name: string;
  family: BoardFamily;
  tagline: string;
  specs: {
    cpu: string;
    ram: string;
    wireless: string;
    ports: string;
    dimensions: string;
  };
  defaultWidth: number;
  defaultHeight: number;
  pins: PinDefinition[];
}

export type SensorCategory = 'environmental' | 'motion' | 'audio' | 'distance' | 'display' | 'actuator' | 'input';

export interface SensorDefinition {
  id: string;
  type: string;
  name: string;
  category: SensorCategory;
  description: string;
  i2cAddress?: number; // e.g. 0x68 for MPU6050, 0x3C for SSD1306
  defaultWidth: number;
  defaultHeight: number;
  pins: PinDefinition[];
  defaultValues: Record<string, number | boolean | string>;
}

export interface PlacedComponent {
  instanceId: string;
  definitionId: string;
  kind: 'board' | 'sensor';
  name: string;
  x: number;
  y: number;
  values: Record<string, number | boolean | string>; // interactive sensor values (e.g. temp: 24.5)
}

export interface WireConnection {
  id: string;
  fromComponentId: string;
  fromPinId: string;
  toComponentId: string;
  toPinId: string;
  color: string;
}

export type PinLogicState = 'HIGH' | 'LOW' | 'FLOATING' | 'SHORT' | 'PWM';

export interface PinRuntimeState {
  componentId: string;
  pinId: string;
  voltage: number; // e.g. 0, 3.3, 5.0
  logicState: PinLogicState;
  mode: 'INPUT' | 'OUTPUT';
  pwmDuty?: number; // 0 to 1
}

export interface CircuitValidationIssue {
  severity: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  componentIds: string[];
}

export interface TelemetryPoint {
  timestamp: number;
  channel: string;
  value: number;
  unit: string;
}

export interface PresetCircuit {
  id: string;
  title: string;
  description: string;
  boardId: string;
  components: Array<{
    definitionId: string;
    kind: 'board' | 'sensor';
    x: number;
    y: number;
    values?: Record<string, number | boolean | string>;
  }>;
  wires: Array<{
    fromIndex: number;
    fromPinId: string;
    toIndex: number;
    toPinId: string;
    color: string;
  }>;
  code: string;
}
