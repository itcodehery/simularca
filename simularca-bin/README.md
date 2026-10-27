# Simularca — Interactive IoT & Raspberry Pi Simulator

**Simularca** is an interactive, browser-based hardware and IoT simulation platform. It allows developers, students, and makers to connect Raspberry Pi boards with common IoT sensors and actuators, wire them together on an interactive canvas, manipulate physical environmental parameters in real-time, and run Python logic with live serial telemetry and waveform instrumentation.

---

## Key Features

### 1. Board Roster & Precision 40-Pin Header
- **Raspberry Pi Zero W / Zero 2 W / Zero v1.3**: Ultra-compact form factor with Broadcom SoC, WiFi/BLE shield, CSI camera ribbon, and micro-USB ports.
- **Raspberry Pi 4 Model B / Pi 5**: Flagship desktop-class boards with dual micro-HDMI, USB 3.0/2.0 ports, USB-C power, and Gigabit Ethernet.
- **Raspberry Pi Pico / Pico W**: RP2040 dual-core microcontroller with 40 castellated edge pins and 12-bit ADC channels.
- Full 40-pin header mapping: 3.3V, 5.0V, Ground, BCM GPIOs, I2C (`SDA1`/`SCL1`), SPI (`MOSI`/`MISO`/`SCLK`/`CE0`), UART (`TXD`/`RXD`), and hardware PWM.

### 2. Comprehensive IoT Sensor & Actuator Library
- **DS18B20 Temp Probe**: Dallas 1-Wire precision thermometer (-55°C to +125°C) on GPIO 4 with thermal benchmark presets (0°C Ice, 25°C Room, 40°C Body, 100°C Boiling).
- **ADXL345 3-Axis Accelerometer**: Ultra-low power 13-bit MEMS accelerometer over I2C (`0x53`) or SPI with range selection pills (`±2g`, `±4g`, `±8g`, `±16g`).
- **IR Obstacle Avoidance Sensor**: Dual infrared TX/RX diodes with onboard LM393 comparator and active-LOW digital trigger output.
- **INMP441 Digital MEMS Microphone**: Omnidirectional bottom-port microphone with direct 24-bit I2S digital audio output and 61 dBA SNR.
- **DHT22 / DHT11**: Digital temperature & relative humidity sensor.
- **MPU6050 6-Axis IMU**: Triple-axis gyroscope and accelerometer over I2C (`0x68`).
- **HC-SR04**: Sonar distance measuring module (2 cm to 400 cm).
- **SSD1306 0.96" OLED**: 128x64 pixel monochrome virtual screen rendering live graphics and text over I2C (`0x3C`).
- **Active Piezo Buzzer**: Synthesizes genuine 2.4 kHz acoustic tones via the Web Audio API when energized.
- **LED Modules (Red / Green)**: Dynamic glow halos and state tracking when driven HIGH.
- **Tactile Push Button**: Momentary interactive input with pull-down logic.

### 3. Interactive Wiring Canvas
- **Pan & Zoom**: Smooth infinite navigation with circuit blueprint grid.
- **Pin Snapping**: Click any pin to initiate a jumper wire; hover over a target pin to snap and connect.
- **Color Palette**: Jumper wires in Red (Power), Black (GND), Blue (I2C SDA), Yellow (I2C SCL), Green (Signal), Orange, Purple, and White.
- **Live Current Animation**: Active high signals illuminate wires with pulsing animated current traces.
- **Hover Inspection Tooltips**: High-contrast popovers detailing pin physical number, BCM GPIO index, live voltage, and logic state.

### 4. Physical Environment Controls
- Real-time sliders for temperature, humidity, noise gain, and sonar target proximity.
- **Rotary Angle Dial**: Tactile circular dial with needle indicator to simulate pitch & roll tilt.
- **Clap / Noise Trigger Spike**: Momentarily injects acoustic sound spikes into microphone modules.
- **IR Obstacle Toggle**: Injects reflective objects in front of the IR sensor.
- **Tactile Button Press**: Click or press & hold.

### 5. In-Browser Python Execution Engine
- Virtualized `RPi.GPIO` (`GPIO.setmode`, `GPIO.setup`, `GPIO.output`, `GPIO.input`, `GPIO.cleanup`, `GPIO.HIGH`, `GPIO.LOW`, `BCM`).
- Virtualized `smbus2` (I2C register communication to `0x53`, `0x68`, and `0x3C`).
- Non-blocking execution loop with instant cancellation and line-by-line stepping.
- **Monaco Code Editor**: Syntax-highlighted Python editor with auto-layout.
- **Serial Console (ttyAMA0)**: Formatted serial logs with timestamps, color-coded levels, and one-click copy.
- **40-Pin Header Matrix**: Dual-column live voltage and pin state monitor.
- **Waveform Oscilloscope**: Multi-channel canvas oscilloscope plotting real-time telemetry.

### 6. Pre-Configured Circuit Presets
1. **Multi-Sensor Hub (Default)**: Raspberry Pi Zero W + DS18B20 + ADXL345 + IR Sensor + INMP441 Microphone.
2. **DHT22 Weather Station**: Pi Zero W + DHT22 on GPIO 4 + Status LED.
3. **MPU6050 Orientation Lab**: Pi Zero W + MPU6050 on I2C + Tilt Warning LED.
4. **Sound-Activated Alarm**: Pi Zero W + Microphone + Active Buzzer + LED.
5. **Smart OLED Dashboard**: Pi 4B + SSD1306 OLED + Climate sensors.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 with Turbopack (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Typography**: Genova / Plus Jakarta Sans & JetBrains Mono (Google Fonts)
- **Audio Engine**: Web Audio API (real-time piezo buzzer tone synthesis)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript 5 (Strict Mode)

---

## Project Structure

```
simularca-bin/
├── app/
│   ├── globals.css          # Theme variables, custom sliders, scrollbars
│   ├── layout.tsx           # Root layout, Google Fonts links, dark styling
│   └── page.tsx             # Main workspace assembling Canvas, Sidebar, and Drawers
├── src/
│   ├── types/
│   │   └── circuit.ts       # TypeScript interfaces for boards, pins, sensors, wires
│   ├── data/
│   │   ├── boards.ts        # Raspberry Pi Zero W, Zero 2 W, 4B, 5, Pico definitions
│   │   ├── sensors.ts       # DS18B20, ADXL345, IR, INMP441, DHT22, OLED, etc.
│   │   └── presets.ts       # Pre-wired circuit configurations & Python scripts
│   ├── engine/
│   │   ├── circuit-validator.ts # Short-circuit, floating ground, and I2C checks
│   │   └── simulation-engine.ts # In-browser Python runtime & Web Audio synthesizer
│   └── components/
│       ├── layout/
│       │   ├── StudioHeader.tsx # Top window chrome, traffic lights, transport controls
│       │   ├── LeftToolDock.tsx # Vertical icon strip with popover tooltips
│       │   └── CatalogSidebar.tsx # Board shelf, sensor shelf, and I2C diagnostics
│       ├── canvas/
│       │   └── WiringCanvas.tsx # SVG jumper wires, pan/zoom, pin snapping
│       ├── boards/
│       │   └── BoardSVG.tsx     # Vector hardware renderings of Pi boards
│       ├── sensors/
│       │   └── SensorSVG.tsx    # Vector hardware renderings of IoT modules
│       ├── controls/
│       │   └── SensorControlPanel.tsx # Sliders, rotary dials, clap triggers
│       ├── editor/
│       │   └── CodeEditor.tsx   # Monaco Python editor with preset loader
│       └── telemetry/
│           ├── TerminalOutput.tsx   # Serial console (ttyAMA0)
│           ├── PinoutInspector.tsx  # 40-pin header matrix monitor
│           └── WaveformPlotter.tsx  # Multi-channel oscilloscope graph
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or your preferred package manager

### Installation

```bash
# Navigate to the project directory
cd simularca-bin

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verifying Build and Types

```bash
# Type check with TypeScript compiler
npx tsc --noEmit

# Production build with Turbopack
npm run build
```

---

## License

This project is licensed under the MIT License.
