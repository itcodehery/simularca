import { BoardDefinition, PinDefinition } from '../types/circuit';

// Helper to generate the 40 standard Raspberry Pi header pins
// header layout: two parallel rows of 20 pins along one edge
export function generateStandardPiPins(startX = 12, startY = 8, spacingX = 4.0, spacingY = 4.0): PinDefinition[] {
  const pinDetails: Array<{
    physical: number;
    name: string;
    bcm?: number;
    type: PinDefinition['type'];
    desc: string;
  }> = [
    { physical: 1, name: '3V3', type: 'POWER_3V3', desc: '3.3V DC Power' },
    { physical: 2, name: '5V', type: 'POWER_5V', desc: '5.0V DC Power' },
    { physical: 3, name: 'GPIO 2 (SDA1)', bcm: 2, type: 'I2C_SDA', desc: 'I2C Data / GPIO 2' },
    { physical: 4, name: '5V', type: 'POWER_5V', desc: '5.0V DC Power' },
    { physical: 5, name: 'GPIO 3 (SCL1)', bcm: 3, type: 'I2C_SCL', desc: 'I2C Clock / GPIO 3' },
    { physical: 6, name: 'GND', type: 'GND', desc: 'Ground' },
    { physical: 7, name: 'GPIO 4', bcm: 4, type: 'GPIO', desc: 'General Purpose Clock / 1-Wire' },
    { physical: 8, name: 'GPIO 14 (TXD)', bcm: 14, type: 'UART_TX', desc: 'UART Transmit / GPIO 14' },
    { physical: 9, name: 'GND', type: 'GND', desc: 'Ground' },
    { physical: 10, name: 'GPIO 15 (RXD)', bcm: 15, type: 'UART_RX', desc: 'UART Receive / GPIO 15' },
    { physical: 11, name: 'GPIO 17', bcm: 17, type: 'GPIO', desc: 'GPIO 17' },
    { physical: 12, name: 'GPIO 18 (PWM0)', bcm: 18, type: 'GPIO', desc: 'PWM Channel 0 / GPIO 18' },
    { physical: 13, name: 'GPIO 27', bcm: 27, type: 'GPIO', desc: 'GPIO 27' },
    { physical: 14, name: 'GND', type: 'GND', desc: 'Ground' },
    { physical: 15, name: 'GPIO 22', bcm: 22, type: 'GPIO', desc: 'GPIO 22' },
    { physical: 16, name: 'GPIO 23', bcm: 23, type: 'GPIO', desc: 'GPIO 23' },
    { physical: 17, name: '3V3', type: 'POWER_3V3', desc: '3.3V DC Power' },
    { physical: 18, name: 'GPIO 24', bcm: 24, type: 'GPIO', desc: 'GPIO 24' },
    { physical: 19, name: 'GPIO 10 (MOSI)', bcm: 10, type: 'SPI_MOSI', desc: 'SPI0 Master Out / GPIO 10' },
    { physical: 20, name: 'GND', type: 'GND', desc: 'Ground' },
    { physical: 21, name: 'GPIO 9 (MISO)', bcm: 9, type: 'SPI_MISO', desc: 'SPI0 Master In / GPIO 9' },
    { physical: 22, name: 'GPIO 25', bcm: 25, type: 'GPIO', desc: 'GPIO 25' },
    { physical: 23, name: 'GPIO 11 (SCLK)', bcm: 11, type: 'SPI_SCLK', desc: 'SPI0 Clock / GPIO 11' },
    { physical: 24, name: 'GPIO 8 (CE0)', bcm: 8, type: 'SPI_CE0', desc: 'SPI0 Chip Select 0 / GPIO 8' },
    { physical: 25, name: 'GND', type: 'GND', desc: 'Ground' },
    { physical: 26, name: 'GPIO 7 (CE1)', bcm: 7, type: 'SPI_CE1', desc: 'SPI0 Chip Select 1 / GPIO 7' },
    { physical: 27, name: 'ID_SD', type: 'I2C_SDA', desc: 'I2C ID EEPROM' },
    { physical: 28, name: 'ID_SC', type: 'I2C_SCL', desc: 'I2C ID EEPROM' },
    { physical: 29, name: 'GPIO 5', bcm: 5, type: 'GPIO', desc: 'GPIO 5' },
    { physical: 30, name: 'GND', type: 'GND', desc: 'Ground' },
    { physical: 31, name: 'GPIO 6', bcm: 6, type: 'GPIO', desc: 'GPIO 6' },
    { physical: 32, name: 'GPIO 12 (PWM0)', bcm: 12, type: 'GPIO', desc: 'PWM0 / GPIO 12' },
    { physical: 33, name: 'GPIO 13 (PWM1)', bcm: 13, type: 'GPIO', desc: 'PWM1 / GPIO 13' },
    { physical: 34, name: 'GND', type: 'GND', desc: 'Ground' },
    { physical: 35, name: 'GPIO 19 (PWM1)', bcm: 19, type: 'GPIO', desc: 'PWM1 / GPIO 19' },
    { physical: 36, name: 'GPIO 16', bcm: 16, type: 'GPIO', desc: 'GPIO 16' },
    { physical: 37, name: 'GPIO 26', bcm: 26, type: 'GPIO', desc: 'GPIO 26' },
    { physical: 38, name: 'GPIO 20', bcm: 20, type: 'GPIO', desc: 'GPIO 20' },
    { physical: 39, name: 'GND', type: 'GND', desc: 'Ground' },
    { physical: 40, name: 'GPIO 21', bcm: 21, type: 'GPIO', desc: 'GPIO 21' },
  ];

  return pinDetails.map((p) => {
    // Row 0 is odd pins (1, 3, 5...); Row 1 is even pins (2, 4, 6...)
    const isEven = p.physical % 2 === 0;
    const colIndex = Math.floor((p.physical - 1) / 2); // 0 to 19

    return {
      id: `pin_${p.physical}`,
      name: p.name,
      bcm: p.bcm,
      physicalPin: p.physical,
      type: p.type,
      description: p.desc,
      x: Number((startX + colIndex * spacingX).toFixed(2)),
      y: Number((startY + (isEven ? spacingY : 0)).toFixed(2)),
    };
  });
}

// Generate Raspberry Pi Pico 40 edge pins
export function generatePicoPins(): PinDefinition[] {
  const leftPins = [
    { physical: 1, name: 'GP0 (UART0 TX)', bcm: 0, type: 'UART_TX' as const },
    { physical: 2, name: 'GP1 (UART0 RX)', bcm: 1, type: 'UART_RX' as const },
    { physical: 3, name: 'GND', type: 'GND' as const },
    { physical: 4, name: 'GP2 (I2C1 SDA)', bcm: 2, type: 'I2C_SDA' as const },
    { physical: 5, name: 'GP3 (I2C1 SCL)', bcm: 3, type: 'I2C_SCL' as const },
    { physical: 6, name: 'GP4', bcm: 4, type: 'GPIO' as const },
    { physical: 7, name: 'GP5', bcm: 5, type: 'GPIO' as const },
    { physical: 8, name: 'GND', type: 'GND' as const },
    { physical: 9, name: 'GP6', bcm: 6, type: 'GPIO' as const },
    { physical: 10, name: 'GP7', bcm: 7, type: 'GPIO' as const },
    { physical: 11, name: 'GP8 (I2C0 SDA)', bcm: 8, type: 'I2C_SDA' as const },
    { physical: 12, name: 'GP9 (I2C0 SCL)', bcm: 9, type: 'I2C_SCL' as const },
    { physical: 13, name: 'GND', type: 'GND' as const },
    { physical: 14, name: 'GP10', bcm: 10, type: 'GPIO' as const },
    { physical: 15, name: 'GP11', bcm: 11, type: 'GPIO' as const },
    { physical: 16, name: 'GP12', bcm: 12, type: 'GPIO' as const },
    { physical: 17, name: 'GP13', bcm: 13, type: 'GPIO' as const },
    { physical: 18, name: 'GND', type: 'GND' as const },
    { physical: 19, name: 'GP14', bcm: 14, type: 'GPIO' as const },
    { physical: 20, name: 'GP15', bcm: 15, type: 'GPIO' as const },
  ];

  const rightPins = [
    { physical: 40, name: 'VBUS (5V)', type: 'POWER_5V' as const },
    { physical: 39, name: 'VSYS', type: 'POWER_5V' as const },
    { physical: 38, name: 'GND', type: 'GND' as const },
    { physical: 37, name: '3V3_EN', type: 'GPIO' as const },
    { physical: 36, name: '3V3_OUT', type: 'POWER_3V3' as const },
    { physical: 35, name: 'ADC_VREF', type: 'POWER_3V3' as const },
    { physical: 34, name: 'GP28 (ADC2)', bcm: 28, type: 'ANALOG' as const },
    { physical: 33, name: 'AGND', type: 'GND' as const },
    { physical: 32, name: 'GP27 (ADC1)', bcm: 27, type: 'ANALOG' as const },
    { physical: 31, name: 'GP26 (ADC0)', bcm: 26, type: 'ANALOG' as const },
    { physical: 30, name: 'RUN', type: 'GPIO' as const },
    { physical: 29, name: 'GP22', bcm: 22, type: 'GPIO' as const },
    { physical: 28, name: 'GND', type: 'GND' as const },
    { physical: 27, name: 'GP21', bcm: 21, type: 'GPIO' as const },
    { physical: 26, name: 'GP20', bcm: 20, type: 'GPIO' as const },
    { physical: 25, name: 'GP19', bcm: 19, type: 'GPIO' as const },
    { physical: 24, name: 'GP18', bcm: 18, type: 'GPIO' as const },
    { physical: 23, name: 'GND', type: 'GND' as const },
    { physical: 22, name: 'GP17', bcm: 17, type: 'GPIO' as const },
    { physical: 21, name: 'GP16', bcm: 16, type: 'GPIO' as const },
  ];

  const pins: PinDefinition[] = [];
  const startY = 12;
  const stepY = 4.2;

  leftPins.forEach((p, idx) => {
    pins.push({
      id: `pin_${p.physical}`,
      name: p.name,
      bcm: p.bcm,
      physicalPin: p.physical,
      type: p.type,
      x: 6.5,
      y: Number((startY + idx * stepY).toFixed(2)),
    });
  });

  rightPins.forEach((p, idx) => {
    pins.push({
      id: `pin_${p.physical}`,
      name: p.name,
      bcm: p.bcm,
      physicalPin: p.physical,
      type: p.type,
      x: 93.5,
      y: Number((startY + idx * stepY).toFixed(2)),
    });
  });

  return pins;
}

export const BOARDS: Record<string, BoardDefinition> = {
  'pi-zero-w': {
    id: 'pi-zero-w',
    name: 'Raspberry Pi Zero W',
    family: 'pi-zero',
    tagline: 'Ultra-compact single-board computer with 802.11n Wi-Fi & Bluetooth 4.1',
    specs: {
      cpu: '1GHz single-core ARM1176JZF-S (BCM2835)',
      ram: '512MB LPDDR2 SDRAM',
      wireless: '802.11 b/g/n Wi-Fi, Bluetooth 4.1, BLE',
      ports: 'Mini-HDMI, 2x Micro-USB (Data/Power), CSI camera',
      dimensions: '65mm × 30mm × 5mm',
    },
    defaultWidth: 420,
    defaultHeight: 220,
    pins: generateStandardPiPins(10, 15, 4.2, 8.5),
  },
  'pi-zero-2-w': {
    id: 'pi-zero-2-w',
    name: 'Raspberry Pi Zero 2 W',
    family: 'pi-zero',
    tagline: 'Quad-core 64-bit powerhouse in the tiny Zero form factor (5x speedup)',
    specs: {
      cpu: 'Quad-core 64-bit ARM Cortex-A53 @ 1GHz (RP3A0-AU)',
      ram: '512MB LPDDR2 SDRAM',
      wireless: '2.4GHz 802.11 b/g/n Wi-Fi, Bluetooth 4.2, BLE',
      ports: 'Mini-HDMI, 2x Micro-USB, CSI camera connector',
      dimensions: '65mm × 30mm × 5mm',
    },
    defaultWidth: 420,
    defaultHeight: 220,
    pins: generateStandardPiPins(10, 15, 4.2, 8.5),
  },
  'pi-zero': {
    id: 'pi-zero',
    name: 'Raspberry Pi Zero (v1.3)',
    family: 'pi-zero',
    tagline: 'The classic minimal Raspberry Pi without wireless networking',
    specs: {
      cpu: '1GHz single-core ARM1176JZF-S (BCM2835)',
      ram: '512MB LPDDR2 SDRAM',
      wireless: 'None (Standalone / USB OTG ethernet)',
      ports: 'Mini-HDMI, 2x Micro-USB, CSI camera connector',
      dimensions: '65mm × 30mm × 5mm',
    },
    defaultWidth: 420,
    defaultHeight: 220,
    pins: generateStandardPiPins(10, 15, 4.2, 8.5),
  },
  'pi-4b': {
    id: 'pi-4b',
    name: 'Raspberry Pi 4 Model B',
    family: 'pi-standard',
    tagline: 'High-performance desktop-class single board computer with dual 4K display',
    specs: {
      cpu: 'Quad-core 64-bit ARM Cortex-A72 @ 1.8GHz (BCM2711)',
      ram: '2GB / 4GB / 8GB LPDDR4',
      wireless: 'Dual-band 2.4/5.0GHz 802.11ac Wi-Fi, BLE 5.0',
      ports: '2x Micro-HDMI, Gigabit Ethernet, 2x USB 3.0, 2x USB 2.0, USB-C Power',
      dimensions: '85mm × 56mm × 17mm',
    },
    defaultWidth: 480,
    defaultHeight: 310,
    pins: generateStandardPiPins(8, 12, 4.3, 7.5),
  },
  'pi-5': {
    id: 'pi-5',
    name: 'Raspberry Pi 5',
    family: 'pi-standard',
    tagline: 'Next-generation flagship Pi powered by RP1 custom I/O controller & Cortex-A76',
    specs: {
      cpu: 'Quad-core 64-bit ARM Cortex-A76 @ 2.4GHz (BCM2712)',
      ram: '4GB / 8GB / 16GB LPDDR4X',
      wireless: 'Dual-band Wi-Fi 802.11ac, Bluetooth 5.0 / BLE',
      ports: 'PCIe 2.0 x1, Dual 4Kp60 micro-HDMI, Gigabit Ethernet with PoE+ support',
      dimensions: '85mm × 56mm × 17mm',
    },
    defaultWidth: 480,
    defaultHeight: 310,
    pins: generateStandardPiPins(8, 12, 4.3, 7.5),
  },
  'pi-pico': {
    id: 'pi-pico',
    name: 'Raspberry Pi Pico',
    family: 'pi-pico',
    tagline: 'Versatile RP2040 microcontroller board with 30 GPIOs and programmable PIO',
    specs: {
      cpu: 'Dual-core ARM Cortex-M0+ @ 133MHz (RP2040)',
      ram: '264KB on-chip SRAM + 2MB on-board QSPI Flash',
      wireless: 'None',
      ports: 'Micro-USB 1.1 with USB Mass-Storage boot & CDC serial',
      dimensions: '51mm × 21mm × 3.9mm',
    },
    defaultWidth: 260,
    defaultHeight: 460,
    pins: generatePicoPins(),
  },
  'pi-pico-w': {
    id: 'pi-pico-w',
    name: 'Raspberry Pi Pico W',
    family: 'pi-pico',
    tagline: 'Connected RP2040 board with Infineon CYW43439 Wi-Fi & Bluetooth 5.2',
    specs: {
      cpu: 'Dual-core ARM Cortex-M0+ @ 133MHz (RP2040)',
      ram: '264KB on-chip SRAM + 2MB on-board Flash',
      wireless: '2.4GHz 802.11b/g/n Wi-Fi, Bluetooth 5.2',
      ports: 'Micro-USB 1.1, On-board antenna',
      dimensions: '51mm × 21mm × 3.9mm',
    },
    defaultWidth: 260,
    defaultHeight: 460,
    pins: generatePicoPins(),
  },
};
