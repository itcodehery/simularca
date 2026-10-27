import { SensorDefinition } from '../types/circuit';

export const BREADBOARD_INTERNAL_BUSES: string[][] = [
  ['rail_3v3_1', 'rail_3v3_2', 'rail_3v3_3', 'rail_3v3_4', 'rail_3v3_5', 'rail_3v3_6'],
  ['rail_gnd1_1', 'rail_gnd1_2', 'rail_gnd1_3', 'rail_gnd1_4', 'rail_gnd1_5', 'rail_gnd1_6'],
  ['rail_5v_1', 'rail_5v_2', 'rail_5v_3', 'rail_5v_4', 'rail_5v_5', 'rail_5v_6'],
  ['rail_gnd2_1', 'rail_gnd2_2', 'rail_gnd2_3', 'rail_gnd2_4', 'rail_gnd2_5', 'rail_gnd2_6'],
  ['row_1_a', 'row_1_b'],
  ['row_2_a', 'row_2_b'],
  ['row_3_a', 'row_3_b'],
  ['row_4_a', 'row_4_b'],
  ['row_5_a', 'row_5_b'],
];

export const SENSORS: Record<string, SensorDefinition> = {
  'module-breadboard': {
    id: 'module-breadboard',
    type: 'BREADBOARD',
    name: 'Solderless Breadboard',
    category: 'prototyping',
    description: 'Half-size breadboard with dual 3.3V/5V power buses, common ground distribution rails, and terminal tie rows.',
    defaultWidth: 460,
    defaultHeight: 210,
    pins: [
      // Top 3.3V Rail (+)
      { id: 'rail_3v3_1', name: '+3V3 (1)', type: 'POWER_3V3', x: 14, y: 13, description: '3.3V Power Rail - Point 1' },
      { id: 'rail_3v3_2', name: '+3V3 (2)', type: 'POWER_3V3', x: 28, y: 13, description: '3.3V Power Rail - Point 2' },
      { id: 'rail_3v3_3', name: '+3V3 (3)', type: 'POWER_3V3', x: 42, y: 13, description: '3.3V Power Rail - Point 3' },
      { id: 'rail_3v3_4', name: '+3V3 (4)', type: 'POWER_3V3', x: 56, y: 13, description: '3.3V Power Rail - Point 4' },
      { id: 'rail_3v3_5', name: '+3V3 (5)', type: 'POWER_3V3', x: 70, y: 13, description: '3.3V Power Rail - Point 5' },
      { id: 'rail_3v3_6', name: '+3V3 (6)', type: 'POWER_3V3', x: 84, y: 13, description: '3.3V Power Rail - Point 6' },

      // Top Ground Rail (-)
      { id: 'rail_gnd1_1', name: 'GND1 (1)', type: 'GND', x: 14, y: 25, description: 'Ground Rail 1 - Point 1' },
      { id: 'rail_gnd1_2', name: 'GND1 (2)', type: 'GND', x: 28, y: 25, description: 'Ground Rail 1 - Point 2' },
      { id: 'rail_gnd1_3', name: 'GND1 (3)', type: 'GND', x: 42, y: 25, description: 'Ground Rail 1 - Point 3' },
      { id: 'rail_gnd1_4', name: 'GND1 (4)', type: 'GND', x: 56, y: 25, description: 'Ground Rail 1 - Point 4' },
      { id: 'rail_gnd1_5', name: 'GND1 (5)', type: 'GND', x: 70, y: 25, description: 'Ground Rail 1 - Point 5' },
      { id: 'rail_gnd1_6', name: 'GND1 (6)', type: 'GND', x: 84, y: 25, description: 'Ground Rail 1 - Point 6' },

      // Center Terminal Strips (Rows A & B)
      { id: 'row_1_a', name: 'Row 1 (A)', type: 'GPIO', x: 18, y: 44, description: 'Terminal Strip 1 - Upper Pin' },
      { id: 'row_1_b', name: 'Row 1 (B)', type: 'GPIO', x: 18, y: 56, description: 'Terminal Strip 1 - Lower Pin' },

      { id: 'row_2_a', name: 'Row 2 (A)', type: 'GPIO', x: 34, y: 44, description: 'Terminal Strip 2 - Upper Pin' },
      { id: 'row_2_b', name: 'Row 2 (B)', type: 'GPIO', x: 34, y: 56, description: 'Terminal Strip 2 - Lower Pin' },

      { id: 'row_3_a', name: 'Row 3 (A)', type: 'GPIO', x: 50, y: 44, description: 'Terminal Strip 3 - Upper Pin' },
      { id: 'row_3_b', name: 'Row 3 (B)', type: 'GPIO', x: 50, y: 56, description: 'Terminal Strip 3 - Lower Pin' },

      { id: 'row_4_a', name: 'Row 4 (A)', type: 'GPIO', x: 66, y: 44, description: 'Terminal Strip 4 - Upper Pin' },
      { id: 'row_4_b', name: 'Row 4 (B)', type: 'GPIO', x: 66, y: 56, description: 'Terminal Strip 4 - Lower Pin' },

      { id: 'row_5_a', name: 'Row 5 (A)', type: 'GPIO', x: 82, y: 44, description: 'Terminal Strip 5 - Upper Pin' },
      { id: 'row_5_b', name: 'Row 5 (B)', type: 'GPIO', x: 82, y: 56, description: 'Terminal Strip 5 - Lower Pin' },

      // Bottom 5V Rail (+)
      { id: 'rail_5v_1', name: '+5V (1)', type: 'POWER_5V', x: 14, y: 75, description: '5.0V Power Rail - Point 1' },
      { id: 'rail_5v_2', name: '+5V (2)', type: 'POWER_5V', x: 28, y: 75, description: '5.0V Power Rail - Point 2' },
      { id: 'rail_5v_3', name: '+5V (3)', type: 'POWER_5V', x: 42, y: 75, description: '5.0V Power Rail - Point 3' },
      { id: 'rail_5v_4', name: '+5V (4)', type: 'POWER_5V', x: 56, y: 75, description: '5.0V Power Rail - Point 4' },
      { id: 'rail_5v_5', name: '+5V (5)', type: 'POWER_5V', x: 70, y: 75, description: '5.0V Power Rail - Point 5' },
      { id: 'rail_5v_6', name: '+5V (6)', type: 'POWER_5V', x: 84, y: 75, description: '5.0V Power Rail - Point 6' },

      // Bottom Ground Rail (-)
      { id: 'rail_gnd2_1', name: 'GND2 (1)', type: 'GND', x: 14, y: 87, description: 'Ground Rail 2 - Point 1' },
      { id: 'rail_gnd2_2', name: 'GND2 (2)', type: 'GND', x: 28, y: 87, description: 'Ground Rail 2 - Point 2' },
      { id: 'rail_gnd2_3', name: 'GND2 (3)', type: 'GND', x: 42, y: 87, description: 'Ground Rail 2 - Point 3' },
      { id: 'rail_gnd2_4', name: 'GND2 (4)', type: 'GND', x: 56, y: 87, description: 'Ground Rail 2 - Point 4' },
      { id: 'rail_gnd2_5', name: 'GND2 (5)', type: 'GND', x: 70, y: 87, description: 'Ground Rail 2 - Point 5' },
      { id: 'rail_gnd2_6', name: 'GND2 (6)', type: 'GND', x: 84, y: 87, description: 'Ground Rail 2 - Point 6' },
    ],
    defaultValues: {},
  },
  'sensor-dht22': {
    id: 'sensor-dht22',
    type: 'DHT22',
    name: 'DHT22 Temp & Humidity',
    category: 'environmental',
    description: 'High-accuracy digital sensor for ambient temperature (-40°C to 80°C) and relative humidity (0-100%).',
    defaultWidth: 160,
    defaultHeight: 180,
    pins: [
      { id: 'vcc', name: 'VCC (3-5V)', type: 'POWER_3V3', x: 22, y: 92, description: 'Power supply (3.3V to 5V)' },
      { id: 'data', name: 'DATA', type: 'GPIO', x: 41, y: 92, description: 'Single-bus digital data communication' },
      { id: 'nc', name: 'NC', type: 'GPIO', x: 60, y: 92, description: 'Not connected' },
      { id: 'gnd', name: 'GND', type: 'GND', x: 79, y: 92, description: 'Ground' },
    ],
    defaultValues: {
      temperature: 24.5,
      humidity: 55.0,
    },
  },

  'sensor-ds18b20': {
    id: 'sensor-ds18b20',
    type: 'DS18B20',
    name: 'DS18B20 Temp Probe',
    category: 'environmental',
    description: 'Precision digital thermometer with 9 to 12-bit resolution over Dallas 1-Wire protocol (-55°C to +125°C).',
    defaultWidth: 150,
    defaultHeight: 170,
    pins: [
      { id: 'gnd', name: 'GND', type: 'GND', x: 25, y: 90, description: 'Ground (Black wire)' },
      { id: 'data', name: 'DATA (DQ)', type: 'GPIO', x: 50, y: 90, description: '1-Wire Data bus with 4.7k pullup (Yellow wire)' },
      { id: 'vcc', name: 'VCC (3-5V)', type: 'POWER_3V3', x: 75, y: 90, description: 'Power 3.0V - 5.5V (Red wire)' },
    ],
    defaultValues: {
      temperature: 26.8, // °C
    },
  },

  'sensor-mpu6050': {
    id: 'sensor-mpu6050',
    type: 'MPU6050',
    name: 'MPU6050 6-Axis IMU',
    category: 'motion',
    description: 'Triple-axis accelerometer (±2g to ±16g) and 3-axis gyroscope with integrated I2C Digital Motion Processor.',
    i2cAddress: 0x68,
    defaultWidth: 190,
    defaultHeight: 170,
    pins: [
      { id: 'vcc', name: 'VCC', type: 'POWER_3V3', x: 12.5, y: 88, description: 'Power 3.3V - 5V' },
      { id: 'gnd', name: 'GND', type: 'GND', x: 25.0, y: 88, description: 'Ground' },
      { id: 'scl', name: 'SCL', type: 'I2C_SCL', x: 37.5, y: 88, description: 'I2C Clock' },
      { id: 'sda', name: 'SDA', type: 'I2C_SDA', x: 50.0, y: 88, description: 'I2C Data' },
      { id: 'xda', name: 'XDA', type: 'GPIO', x: 62.5, y: 88, description: 'Aux I2C Data' },
      { id: 'xcl', name: 'XCL', type: 'GPIO', x: 75.0, y: 88, description: 'Aux I2C Clock' },
      { id: 'ad0', name: 'AD0', type: 'GPIO', x: 87.5, y: 88, description: 'I2C Address Select (LOW=0x68, HIGH=0x69)' },
      { id: 'int', name: 'INT', type: 'GPIO', x: 95.0, y: 88, description: 'Interrupt Output' },
    ],
    defaultValues: {
      accelX: 0.05,
      accelY: -0.12,
      accelZ: 0.98,
      gyroX: 0.0,
      gyroY: 0.0,
      gyroZ: 0.0,
      pitch: 0,
      roll: 0,
    },
  },

  'sensor-adxl345': {
    id: 'sensor-adxl345',
    type: 'ADXL345',
    name: 'ADXL345 3-Axis Accel',
    category: 'motion',
    description: 'Ultra-low power 3-axis MEMS accelerometer with 13-bit high-resolution measurement up to ±16g over I2C or SPI.',
    i2cAddress: 0x53,
    defaultWidth: 190,
    defaultHeight: 170,
    pins: [
      { id: 'vcc', name: 'GND', type: 'GND', x: 12.5, y: 88, description: 'Ground' },
      { id: 'vcc_in', name: 'VCC (3.3V)', type: 'POWER_3V3', x: 25.0, y: 88, description: 'Power Supply 3.3V' },
      { id: 'cs', name: 'CS', type: 'GPIO', x: 37.5, y: 88, description: 'Chip Select (Pull HIGH for I2C)' },
      { id: 'int1', name: 'INT1', type: 'GPIO', x: 50.0, y: 88, description: 'Interrupt 1 Output' },
      { id: 'int2', name: 'INT2', type: 'GPIO', x: 62.5, y: 88, description: 'Interrupt 2 Output' },
      { id: 'sdo', name: 'SDO', type: 'GPIO', x: 75.0, y: 88, description: 'Alt Address / SPI MISO' },
      { id: 'sda', name: 'SDA', type: 'I2C_SDA', x: 87.5, y: 88, description: 'I2C Data / SPI MOSI' },
      { id: 'scl', name: 'SCL', type: 'I2C_SCL', x: 95.0, y: 88, description: 'I2C Clock / SPI SCLK' },
    ],
    defaultValues: {
      accelX: 0.0,
      accelY: 0.0,
      accelZ: 1.0,
      pitch: 0,
      roll: 0,
      range: '±16g',
    },
  },

  'sensor-mic': {
    id: 'sensor-mic',
    type: 'MICROPHONE',
    name: 'Microphone Sound Sensor',
    category: 'audio',
    description: 'Electret microphone module with onboard LM393 comparator, sensitivity trimmer, and analog/digital output.',
    defaultWidth: 170,
    defaultHeight: 160,
    pins: [
      { id: 'vcc', name: 'VCC', type: 'POWER_3V3', x: 20, y: 88, description: 'Power supply (3.3V-5V)' },
      { id: 'gnd', name: 'GND', type: 'GND', x: 40, y: 88, description: 'Ground' },
      { id: 'do', name: 'DO', type: 'GPIO', x: 60, y: 88, description: 'Digital Output (High when dB > threshold)' },
      { id: 'ao', name: 'AO', type: 'ANALOG', x: 80, y: 88, description: 'Analog sound level waveform' },
    ],
    defaultValues: {
      soundLevel: 42,
      threshold: 65,
      triggered: false,
    },
  },

  'sensor-inmp441': {
    id: 'sensor-inmp441',
    type: 'INMP441',
    name: 'INMP441 I2S MEMS Mic',
    category: 'audio',
    description: 'High-performance digital bottom-port MEMS microphone with 24-bit direct I2S audio interface and 61 dBA SNR.',
    defaultWidth: 170,
    defaultHeight: 160,
    pins: [
      { id: 'sck', name: 'SCK', type: 'GPIO', x: 15, y: 88, description: 'Serial Data Clock for I2S' },
      { id: 'ws', name: 'WS', type: 'GPIO', x: 30, y: 88, description: 'Word Select (Left/Right Clock)' },
      { id: 'sd', name: 'SD', type: 'GPIO', x: 45, y: 88, description: 'Serial Data Output' },
      { id: 'l_r', name: 'L/R', type: 'GND', x: 60, y: 88, description: 'Channel select (LOW=Left, HIGH=Right)' },
      { id: 'gnd', name: 'GND', type: 'GND', x: 75, y: 88, description: 'Ground' },
      { id: 'vdd', name: 'VDD (3.3V)', type: 'POWER_3V3', x: 90, y: 88, description: 'Power Supply 3.3V' },
    ],
    defaultValues: {
      soundLevel: 40,
      i2sSampleRate: 44100,
      triggered: false,
    },
  },

  'sensor-ir': {
    id: 'sensor-ir',
    type: 'IR_SENSOR',
    name: 'IR Obstacle Sensor',
    category: 'distance',
    description: 'Infrared proximity avoidance sensor with emitter & receiver diodes, LM393 comparator, and digital detection output.',
    defaultWidth: 160,
    defaultHeight: 160,
    pins: [
      { id: 'vcc', name: 'VCC (3.3-5V)', type: 'POWER_3V3', x: 22, y: 88, description: 'Power Supply' },
      { id: 'gnd', name: 'GND', type: 'GND', x: 44, y: 88, description: 'Ground' },
      { id: 'out', name: 'OUT', type: 'GPIO', x: 66, y: 88, description: 'Digital Output (Active LOW on obstacle)' },
      { id: 'en', name: 'EN', type: 'GPIO', x: 88, y: 88, description: 'Enable control pin' },
    ],
    defaultValues: {
      obstacleDetected: false,
      distance: 14.0, // cm
    },
  },

  'sensor-ultrasonic': {
    id: 'sensor-ultrasonic',
    type: 'HC_SR04',
    name: 'HC-SR04 Ultrasonic Sensor',
    category: 'distance',
    description: 'Sonar distance measuring module providing 2cm - 400cm non-contact measurement range with 3mm precision.',
    defaultWidth: 200,
    defaultHeight: 150,
    pins: [
      { id: 'vcc', name: 'VCC (5V)', type: 'POWER_5V', x: 20, y: 88, description: '5V Power Supply' },
      { id: 'trig', name: 'TRIG', type: 'GPIO', x: 40, y: 88, description: 'Trigger input pulse (10us TTL)' },
      { id: 'echo', name: 'ECHO', type: 'GPIO', x: 60, y: 88, description: 'Echo pulse output (proportional to distance)' },
      { id: 'gnd', name: 'GND', type: 'GND', x: 80, y: 88, description: 'Ground' },
    ],
    defaultValues: {
      distance: 35.0,
    },
  },

  'module-oled': {
    id: 'module-oled',
    type: 'SSD1306',
    name: 'SSD1306 0.96" OLED Display',
    category: 'display',
    description: '128x64 monochrome OLED screen with high contrast, fast refresh rate, and I2C communication interface.',
    i2cAddress: 0x3C,
    defaultWidth: 190,
    defaultHeight: 180,
    pins: [
      { id: 'gnd', name: 'GND', type: 'GND', x: 25, y: 12, description: 'Ground' },
      { id: 'vcc', name: 'VCC', type: 'POWER_3V3', x: 42, y: 12, description: 'Power 3.3V or 5V' },
      { id: 'scl', name: 'SCL', type: 'I2C_SCL', x: 59, y: 12, description: 'I2C Clock' },
      { id: 'sda', name: 'SDA', type: 'I2C_SDA', x: 76, y: 12, description: 'I2C Data' },
    ],
    defaultValues: {
      line1: 'SIMULARCA IoT',
      line2: 'Raspberry Pi Zero W',
      line3: 'Status: ONLINE',
      line4: '',
    },
  },

  'module-led-red': {
    id: 'module-led-red',
    type: 'LED_RED',
    name: 'Red LED Module',
    category: 'actuator',
    description: '5mm high-efficiency Red LED with built-in current limiting resistor.',
    defaultWidth: 120,
    defaultHeight: 140,
    pins: [
      { id: 'anode', name: 'Anode (+)', type: 'GPIO', x: 35, y: 88, description: 'Positive leg / GPIO signal' },
      { id: 'cathode', name: 'Cathode (-)', type: 'GND', x: 65, y: 88, description: 'Ground' },
    ],
    defaultValues: {
      lit: false,
      brightness: 0,
    },
  },

  'module-led-green': {
    id: 'module-led-green',
    type: 'LED_GREEN',
    name: 'Green LED Module',
    category: 'actuator',
    description: '5mm high-efficiency Green LED with built-in resistor.',
    defaultWidth: 120,
    defaultHeight: 140,
    pins: [
      { id: 'anode', name: 'Anode (+)', type: 'GPIO', x: 35, y: 88, description: 'Positive leg / GPIO signal' },
      { id: 'cathode', name: 'Cathode (-)', type: 'GND', x: 65, y: 88, description: 'Ground' },
    ],
    defaultValues: {
      lit: false,
      brightness: 0,
    },
  },

  'module-buzzer': {
    id: 'module-buzzer',
    type: 'ACTIVE_BUZZER',
    name: 'Active Piezo Buzzer',
    category: 'actuator',
    description: 'Piezo buzzer module with internal oscillation circuit generating clear 2.3kHz audio tone when energized.',
    defaultWidth: 130,
    defaultHeight: 140,
    pins: [
      { id: 'vcc', name: 'VCC (+)', type: 'GPIO', x: 35, y: 88, description: 'Signal / Power (Active HIGH)' },
      { id: 'gnd', name: 'GND (-)', type: 'GND', x: 65, y: 88, description: 'Ground' },
    ],
    defaultValues: {
      sounding: false,
    },
  },

  'module-button': {
    id: 'module-button',
    type: 'PUSH_BUTTON',
    name: 'Tactile Push Button',
    category: 'input',
    description: 'Momentary tactile push button switch with pull-down resistor.',
    defaultWidth: 120,
    defaultHeight: 130,
    pins: [
      { id: 'pin1', name: 'OUT', type: 'GPIO', x: 35, y: 88, description: 'Signal to GPIO input' },
      { id: 'pin2', name: 'VCC', type: 'POWER_3V3', x: 65, y: 88, description: 'Power 3.3V' },
    ],
    defaultValues: {
      pressed: false,
    },
  },
};
