# Simularca — Interactive IoT & Raspberry Pi Simulator

**Simularca** is an interactive browser-based IoT circuit simulation studio. Connect Raspberry Pi boards (Zero W, Zero 2 W, Pi 4B, Pi 5, Pico) with real-world sensors and actuators, wire pins interactively, adjust physical environment values, and run Python logic with real-time serial telemetry and oscilloscope plotting.

The Next.js application is located in [`simularca-bin/`](./simularca-bin/).

---

## Quick Start

```bash
cd simularca-bin
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features

- **Raspberry Pi Boards**: Zero, Zero W, Zero 2 W, 4 Model B, 5, Pico, and Pico W with authentic 40-pin header mapping.
- **Sensors & Modules**: DS18B20 1-Wire Temp, ADXL345 3-Axis Accel, IR Obstacle Sensor, INMP441 I2S MEMS Mic, DHT22, MPU6050, HC-SR04, SSD1306 OLED, LEDs, Piezo Buzzer (with Web Audio tone), and Tactile Button.
- **Interactive Wiring Canvas**: Pin snapping, color-coded jumper wires, live signal current animation, and hover pin inspection.
- **Physical Environment Controls**: Sliders, 3D rotary angle dials, sound burst clapper, and proximity triggers.
- **In-Browser Python Execution**: Virtualized `RPi.GPIO` and `smbus2` (I2C) runtime with Monaco Editor, Serial Console, and Oscilloscope.

For full technical documentation, see the [simularca-bin README](./simularca-bin/README.md).
