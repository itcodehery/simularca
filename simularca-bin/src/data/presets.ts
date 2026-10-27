import { PresetCircuit } from '../types/circuit';

export const PRESETS: Record<string, PresetCircuit> = {
  'default-iot-lab': {
    id: 'default-iot-lab',
    title: 'Raspberry Pi Zero W Multi-Sensor Hub',
    description: 'Full IoT simulation featuring DS18B20 1-Wire temperature, ADXL345 I2C 3-axis accelerometer, IR obstacle sensor, and INMP441 I2S digital MEMS microphone.',
    boardId: 'pi-zero-w',
    components: [
      {
        definitionId: 'pi-zero-w',
        kind: 'board',
        x: 35,
        y: 45,
      },
      {
        definitionId: 'sensor-ds18b20',
        kind: 'sensor',
        x: 510,
        y: 35,
        values: {
          temperature: 26.8,
        },
      },
      {
        definitionId: 'sensor-adxl345',
        kind: 'sensor',
        x: 710,
        y: 35,
        values: {
          pitch: 12,
          roll: -5,
          accelX: 0.21,
          accelY: -0.09,
          accelZ: 0.97,
          range: '±16g',
        },
      },
      {
        definitionId: 'sensor-ir',
        kind: 'sensor',
        x: 510,
        y: 245,
        values: {
          obstacleDetected: true,
          distance: 9.0,
        },
      },
      {
        definitionId: 'sensor-inmp441',
        kind: 'sensor',
        x: 710,
        y: 245,
        values: {
          soundLevel: 44,
          triggered: false,
        },
      },
    ],
    wires: [
      // 1. DS18B20 Temp Probe
      { fromIndex: 1, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_1', color: '#ef4444' }, // 3.3V
      { fromIndex: 1, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_6', color: '#18181b' }, // GND
      { fromIndex: 1, fromPinId: 'data', toIndex: 0, toPinId: 'pin_7', color: '#eab308' }, // GPIO 4 (1-Wire)

      // 2. ADXL345 Accelerometer (I2C at 0x53)
      { fromIndex: 2, fromPinId: 'vcc_in', toIndex: 0, toPinId: 'pin_17', color: '#ef4444' }, // 3.3V
      { fromIndex: 2, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_9', color: '#18181b' }, // GND
      { fromIndex: 2, fromPinId: 'sda', toIndex: 0, toPinId: 'pin_3', color: '#3b82f6' }, // GPIO 2 (SDA)
      { fromIndex: 2, fromPinId: 'scl', toIndex: 0, toPinId: 'pin_5', color: '#f59e0b' }, // GPIO 3 (SCL)

      // 3. IR Obstacle Sensor
      { fromIndex: 3, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_2', color: '#ef4444' }, // 5V
      { fromIndex: 3, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_14', color: '#18181b' }, // GND
      { fromIndex: 3, fromPinId: 'out', toIndex: 0, toPinId: 'pin_11', color: '#22c55e' }, // GPIO 17

      // 4. INMP441 I2S Digital MEMS Microphone
      { fromIndex: 4, fromPinId: 'vdd', toIndex: 0, toPinId: 'pin_1', color: '#ef4444' }, // 3.3V
      { fromIndex: 4, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_20', color: '#18181b' }, // GND
      { fromIndex: 4, fromPinId: 'sck', toIndex: 0, toPinId: 'pin_12', color: '#a855f7' }, // GPIO 18 (PCM_CLK)
      { fromIndex: 4, fromPinId: 'ws', toIndex: 0, toPinId: 'pin_35', color: '#c084fc' }, // GPIO 19 (PCM_FS)
      { fromIndex: 4, fromPinId: 'sd', toIndex: 0, toPinId: 'pin_38', color: '#06b6d4' }, // GPIO 20 (PCM_DIN)
    ],
    code: `# Simularca IoT: Raspberry Pi Zero W Multi-Sensor Hub
# Integrated: DS18B20 (1-Wire), ADXL345 (I2C: 0x53), IR Sensor (GPIO 17), INMP441 (I2S)

import time
import math
import RPi.GPIO as GPIO
from smbus2 import SMBus

ONE_WIRE_PIN = 4
IR_SENSOR_PIN = 17
ADXL_I2C_ADDR = 0x53

GPIO.setmode(GPIO.BCM)
GPIO.setup(ONE_WIRE_PIN, GPIO.IN)
GPIO.setup(IR_SENSOR_PIN, GPIO.IN)

print(">>> [INIT] Raspberry Pi Zero W IoT Multi-Sensor Hub")
print(">>> [BUS] 1-Wire DQ active on GPIO 4 (w1-gpio)")
print(f">>> [BUS] I2C-1 bus connected to ADXL345 at 0x{ADXL_I2C_ADDR:02X}")
print(">>> [BUS] I2S digital audio clock locked (GPIO 18 / 19 / 20)")
print(">>> [BUS] GPIO 17 monitoring IR obstacle proximity")
print("----------------------------------------------------------------------")

for cycle in range(15):
    # 1. Read Dallas DS18B20 digital temperature
    temp = read_sensor_temp(ONE_WIRE_PIN)
    
    # 2. Read ADXL345 triple-axis acceleration & compute tilt
    ax, ay, az = read_mpu_accel()
    pitch = math.atan2(ay, math.sqrt(ax*ax + az*az)) * 57.2958
    roll = math.atan2(-ax, az) * 57.2958
    
    # 3. Read IR Obstacle Avoidance Sensor (Active LOW)
    ir_raw = GPIO.input(IR_SENSOR_PIN)
    obstacle = (ir_raw == 0)
    
    # 4. Sample INMP441 24-bit I2S MEMS microphone amplitude
    sound_db = read_sensor_sound(18)
    
    # Status badges
    obs_badge = "🔴 DETECTED" if obstacle else "🟢 CLEAR"
    mic_badge = "⚡ SPIKE" if sound_db > 65 else "✓ NORMAL"
    
    print(f"[{cycle+1:02d}] DS18B20: {temp:.1f}°C | ADXL345: X={ax:+.2f}g Y={ay:+.2f}g Z={az:+.2f}g (Pitch={pitch:+.0f}°) | IR: {obs_badge} | INMP441: {sound_db}dB {mic_badge}")
    time.sleep(1.0)

print("----------------------------------------------------------------------")
print(">>> [SHUTDOWN] Multi-sensor telemetry loop completed. Cleaned GPIO.")
GPIO.cleanup()
`,
  },

  'ds18b20-adxl': {
    id: 'ds18b20-adxl',
    title: 'DS18B20 1-Wire & ADXL345 Lab',
    description: 'Precision Dallas 1-Wire temperature probe on GPIO 4 with ADXL345 3-axis accelerometer and IR obstacle avoidance sensor.',
    boardId: 'pi-zero-w',
    components: [
      {
        definitionId: 'pi-zero-w',
        kind: 'board',
        x: 40,
        y: 40,
      },
      {
        definitionId: 'sensor-ds18b20',
        kind: 'sensor',
        x: 520,
        y: 40,
        values: {
          temperature: 27.4,
        },
      },
      {
        definitionId: 'sensor-adxl345',
        kind: 'sensor',
        x: 520,
        y: 240,
        values: {
          pitch: 15,
          roll: -8,
          accelX: 0.25,
          accelY: -0.14,
          accelZ: 0.96,
        },
      },
      {
        definitionId: 'sensor-ir',
        kind: 'sensor',
        x: 740,
        y: 40,
        values: {
          obstacleDetected: true,
          distance: 8.0,
        },
      },
    ],
    wires: [
      // DS18B20 VCC -> Pi Pin 1 (3V3)
      { fromIndex: 1, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_1', color: '#ef4444' },
      // DS18B20 GND -> Pi Pin 6 (GND)
      { fromIndex: 1, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_6', color: '#18181b' },
      // DS18B20 DATA -> Pi Pin 7 (GPIO 4)
      { fromIndex: 1, fromPinId: 'data', toIndex: 0, toPinId: 'pin_7', color: '#eab308' },
      // ADXL345 VCC -> Pi Pin 17 (3V3)
      { fromIndex: 2, fromPinId: 'vcc_in', toIndex: 0, toPinId: 'pin_17', color: '#ef4444' },
      // ADXL345 GND -> Pi Pin 9 (GND)
      { fromIndex: 2, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_9', color: '#18181b' },
      // ADXL345 SDA -> Pi Pin 3 (GPIO 2 / SDA)
      { fromIndex: 2, fromPinId: 'sda', toIndex: 0, toPinId: 'pin_3', color: '#3b82f6' },
      // ADXL345 SCL -> Pi Pin 5 (GPIO 3 / SCL)
      { fromIndex: 2, fromPinId: 'scl', toIndex: 0, toPinId: 'pin_5', color: '#f59e0b' },
      // IR Sensor OUT -> Pi Pin 11 (GPIO 17)
      { fromIndex: 3, fromPinId: 'out', toIndex: 0, toPinId: 'pin_11', color: '#22c55e' },
      // IR Sensor VCC -> Pi Pin 2 (5V)
      { fromIndex: 3, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_2', color: '#ef4444' },
      // IR Sensor GND -> Pi Pin 14 (GND)
      { fromIndex: 3, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_14', color: '#18181b' },
    ],
    code: `# Simularca IoT: Dallas DS18B20 + ADXL345 + IR Sensor
from smbus2 import SMBus
import RPi.GPIO as GPIO
import time

ONE_WIRE_PIN = 4
IR_PIN = 17
ADXL_I2C_ADDR = 0x53

GPIO.setmode(GPIO.BCM)
GPIO.setup(ONE_WIRE_PIN, GPIO.IN)
GPIO.setup(IR_PIN, GPIO.IN)

print(">>> Initializing 1-Wire kernel w1-gpio on GPIO 4...")
print(f">>> Connecting to ADXL345 on I2C address 0x{ADXL_I2C_ADDR:02X}...")
print(">>> Listening on GPIO 17 for Infrared obstacle triggers...")

for cycle in range(12):
    # Read DS18B20 temperature
    temp = read_sensor_temp(ONE_WIRE_PIN)
    
    # Read ADXL345 acceleration vectors
    ax, ay, az = read_mpu_accel()
    
    # Read IR Sensor (Active LOW)
    ir_val = GPIO.input(IR_PIN)
    has_obstacle = (ir_val == 0)
    
    print(f"[{cycle+1:02d}] DS18B20: {temp:.2f}°C | ADXL345: X={ax:+.2f}g Y={ay:+.2f}g Z={az:+.2f}g | IR: {'🔴 OBSTACLE!' if has_obstacle else '🟢 CLEAR'}")
    time.sleep(1.0)

print(">>> Sequence completed. Cleaned up GPIO pins.")
GPIO.cleanup()
`,
  },

  'dht22-weather': {
    id: 'dht22-weather',
    title: 'DHT22 Digital Weather Station',
    description: 'Measures ambient temperature & humidity on GPIO 4 with real-time serial logging and comfort alerts.',
    boardId: 'pi-zero-w',
    components: [
      {
        definitionId: 'pi-zero-w',
        kind: 'board',
        x: 40,
        y: 40,
      },
      {
        definitionId: 'sensor-dht22',
        kind: 'sensor',
        x: 520,
        y: 70,
        values: {
          temperature: 23.8,
          humidity: 48.0,
        },
      },
      {
        definitionId: 'module-led-green',
        kind: 'sensor',
        x: 540,
        y: 280,
      },
    ],
    wires: [
      // DHT22 VCC -> Pi Pin 1 (3V3)
      { fromIndex: 1, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_1', color: '#ef4444' },
      // DHT22 GND -> Pi Pin 6 (GND)
      { fromIndex: 1, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_6', color: '#1e293b' },
      // DHT22 DATA -> Pi Pin 7 (GPIO 4)
      { fromIndex: 1, fromPinId: 'data', toIndex: 0, toPinId: 'pin_7', color: '#eab308' },
      // LED Anode -> Pi Pin 11 (GPIO 17)
      { fromIndex: 2, fromPinId: 'anode', toIndex: 0, toPinId: 'pin_11', color: '#22c55e' },
      // LED Cathode -> Pi Pin 9 (GND)
      { fromIndex: 2, fromPinId: 'cathode', toIndex: 0, toPinId: 'pin_9', color: '#1e293b' },
    ],
    code: `# Simularca IoT: DHT22 Weather Station on Raspberry Pi Zero W
import time
import RPi.GPIO as GPIO

DHT_PIN = 4
LED_PIN = 17

GPIO.setmode(GPIO.BCM)
GPIO.setup(DHT_PIN, GPIO.IN)
GPIO.setup(LED_PIN, GPIO.OUT)

print(">>> Initializing DHT22 on Raspberry Pi Zero W...")
print(">>> Sampling ambient environment every 1.5 seconds...")

for i in range(15):
    # Virtual sensor reading queried through simulation bus
    temp = read_sensor_temp(DHT_PIN)
    hum = read_sensor_humidity(DHT_PIN)
    
    # Indicate data acquisition with LED pulse
    GPIO.output(LED_PIN, GPIO.HIGH)
    time.sleep(0.1)
    GPIO.output(LED_PIN, GPIO.LOW)
    
    print(f"[{i+1:02d}] Temperature: {temp:.1f} °C | Humidity: {hum:.1f} % RH")
    
    if temp > 28.0:
        print("  WARNING: High temperature alert!")
    elif hum < 30.0:
        print("  NOTICE: Dry atmosphere detected.")
    else:
        print("  STATUS: Optimal climate conditions.")
        
    time.sleep(1.2)

print(">>> Session completed. Cleaning up GPIO...")
GPIO.cleanup()
`,
  },

  'mpu6050-motion': {
    id: 'mpu6050-motion',
    title: 'MPU6050 6-DOF Orientation & Tilt',
    boardId: 'pi-zero-w',
    description: 'Communicates over I2C bus (0x68) at GPIO 2 (SDA) and GPIO 3 (SCL) to compute dynamic roll and pitch.',
    components: [
      {
        definitionId: 'pi-zero-w',
        kind: 'board',
        x: 40,
        y: 40,
      },
      {
        definitionId: 'sensor-mpu6050',
        kind: 'sensor',
        x: 520,
        y: 60,
        values: {
          pitch: 12,
          roll: -4,
          accelX: 0.21,
          accelY: -0.07,
          accelZ: 0.97,
        },
      },
      {
        definitionId: 'module-led-red',
        kind: 'sensor',
        x: 540,
        y: 280,
      },
    ],
    wires: [
      // MPU6050 VCC -> Pi Pin 1 (3V3)
      { fromIndex: 1, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_1', color: '#ef4444' },
      // MPU6050 GND -> Pi Pin 9 (GND)
      { fromIndex: 1, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_9', color: '#1e293b' },
      // MPU6050 SDA -> Pi Pin 3 (GPIO 2 / SDA1)
      { fromIndex: 1, fromPinId: 'sda', toIndex: 0, toPinId: 'pin_3', color: '#3b82f6' },
      // MPU6050 SCL -> Pi Pin 5 (GPIO 3 / SCL1)
      { fromIndex: 1, fromPinId: 'scl', toIndex: 0, toPinId: 'pin_5', color: '#f59e0b' },
      // LED Anode -> Pi Pin 12 (GPIO 18)
      { fromIndex: 2, fromPinId: 'anode', toIndex: 0, toPinId: 'pin_12', color: '#ef4444' },
      // LED Cathode -> Pi Pin 14 (GND)
      { fromIndex: 2, fromPinId: 'cathode', toIndex: 0, toPinId: 'pin_14', color: '#1e293b' },
    ],
    code: `# Simularca IoT: MPU6050 Inertial Measurement Unit over I2C
from smbus2 import SMBus
import RPi.GPIO as GPIO
import time
import math

I2C_ADDR = 0x68
TILT_LED = 18

GPIO.setmode(GPIO.BCM)
GPIO.setup(TILT_LED, GPIO.OUT)

print(">>> Scanning I2C Bus 1 at GPIO 2 (SDA) / GPIO 3 (SCL)...")
print(f">>> Found MPU6050 at hardware address 0x{I2C_ADDR:02X}")

bus = SMBus(1)
# Wake up MPU6050 (PWR_MGMT_1 register = 0)
bus.write_byte_data(I2C_ADDR, 0x6B, 0x00)

for step in range(12):
    ax, ay, az = read_mpu_accel()
    gx, gy, gz = read_mpu_gyro()
    
    pitch = math.atan2(ay, math.sqrt(ax*ax + az*az)) * 57.2958
    roll = math.atan2(-ax, az) * 57.2958
    
    # Check if tilted beyond threshold
    is_tilted = abs(pitch) > 15.0 or abs(roll) > 15.0
    GPIO.output(TILT_LED, GPIO.HIGH if is_tilted else GPIO.LOW)
    
    print(f"[{step+1:02d}] Accel: X={ax:+.2f}g Y={ay:+.2f}g Z={az:+.2f}g | Pitch={pitch:+.1f}° Roll={roll:+.1f}° {'⚠️ TILT!' if is_tilted else '✓ LEVEL'}")
    time.sleep(1.0)

GPIO.cleanup()
`,
  },

  'sound-alarm': {
    id: 'sound-alarm',
    title: 'Sound-Activated Security Alarm',
    description: 'Microphone detection triggers synchronized buzzer acoustic alarm and pulsing warning LED on Raspberry Pi.',
    boardId: 'pi-zero-w',
    components: [
      {
        definitionId: 'pi-zero-w',
        kind: 'board',
        x: 40,
        y: 40,
      },
      {
        definitionId: 'sensor-mic',
        kind: 'sensor',
        x: 520,
        y: 40,
        values: {
          soundLevel: 72,
          threshold: 60,
          triggered: true,
        },
      },
      {
        definitionId: 'module-buzzer',
        kind: 'sensor',
        x: 530,
        y: 220,
      },
      {
        definitionId: 'module-led-red',
        kind: 'sensor',
        x: 680,
        y: 220,
      },
    ],
    wires: [
      // Mic VCC -> Pi Pin 1 (3V3)
      { fromIndex: 1, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_1', color: '#ef4444' },
      // Mic GND -> Pi Pin 6 (GND)
      { fromIndex: 1, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_6', color: '#1e293b' },
      // Mic DO -> Pi Pin 11 (GPIO 17)
      { fromIndex: 1, fromPinId: 'do', toIndex: 0, toPinId: 'pin_11', color: '#a855f7' },
      // Buzzer VCC -> Pi Pin 13 (GPIO 27)
      { fromIndex: 2, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_13', color: '#ef4444' },
      // Buzzer GND -> Pi Pin 9 (GND)
      { fromIndex: 2, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_9', color: '#1e293b' },
      // LED Anode -> Pi Pin 15 (GPIO 22)
      { fromIndex: 3, fromPinId: 'anode', toIndex: 0, toPinId: 'pin_15', color: '#f97316' },
      // LED Cathode -> Pi Pin 14 (GND)
      { fromIndex: 3, fromPinId: 'cathode', toIndex: 0, toPinId: 'pin_14', color: '#1e293b' },
    ],
    code: `# Simularca IoT: Microphone Acoustic Trigger Alarm
import RPi.GPIO as GPIO
import time

MIC_PIN = 17
BUZZER_PIN = 27
LED_PIN = 22

GPIO.setmode(GPIO.BCM)
GPIO.setup(MIC_PIN, GPIO.IN)
GPIO.setup(BUZZER_PIN, GPIO.OUT)
GPIO.setup(LED_PIN, GPIO.OUT)

print(">>> Security sound detector armed...")
print(">>> Listening on GPIO 17 for sound spikes above threshold...")

for tick in range(12):
    sound_val = read_sensor_sound(MIC_PIN)
    is_triggered = GPIO.input(MIC_PIN) == GPIO.HIGH or sound_val > 65
    
    if is_triggered:
        print(f"[{tick+1:02d}] 🚨 SOUND DETECTED ({sound_val} dB)! Activating alarm...")
        # Strobe LED & beep buzzer
        for _ in range(2):
            GPIO.output(LED_PIN, GPIO.HIGH)
            GPIO.output(BUZZER_PIN, GPIO.HIGH)
            time.sleep(0.15)
            GPIO.output(LED_PIN, GPIO.LOW)
            GPIO.output(BUZZER_PIN, GPIO.LOW)
            time.sleep(0.1)
    else:
        print(f"[{tick+1:02d}] Ambient sound: {sound_val} dB. All secure.")
        GPIO.output(LED_PIN, GPIO.LOW)
        GPIO.output(BUZZER_PIN, GPIO.LOW)
        
    time.sleep(0.8)

GPIO.cleanup()
`,
  },

  'smart-oled-hub': {
    id: 'smart-oled-hub',
    title: 'Smart OLED IoT Dashboard',
    description: 'Raspberry Pi 4 Model B driving SSD1306 128x64 OLED display alongside DHT22 climate sensors.',
    boardId: 'pi-4b',
    components: [
      {
        definitionId: 'pi-4b',
        kind: 'board',
        x: 40,
        y: 40,
      },
      {
        definitionId: 'module-oled',
        kind: 'sensor',
        x: 560,
        y: 50,
      },
      {
        definitionId: 'sensor-dht22',
        kind: 'sensor',
        x: 570,
        y: 260,
        values: {
          temperature: 25.4,
          humidity: 62.0,
        },
      },
    ],
    wires: [
      // OLED GND -> Pi Pin 6
      { fromIndex: 1, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_6', color: '#1e293b' },
      // OLED VCC -> Pi Pin 1
      { fromIndex: 1, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_1', color: '#ef4444' },
      // OLED SCL -> Pi Pin 5 (GPIO 3)
      { fromIndex: 1, fromPinId: 'scl', toIndex: 0, toPinId: 'pin_5', color: '#f59e0b' },
      // OLED SDA -> Pi Pin 3 (GPIO 2)
      { fromIndex: 1, fromPinId: 'sda', toIndex: 0, toPinId: 'pin_3', color: '#3b82f6' },
      // DHT22 VCC -> Pi Pin 17 (3V3)
      { fromIndex: 2, fromPinId: 'vcc', toIndex: 0, toPinId: 'pin_17', color: '#ef4444' },
      // DHT22 GND -> Pi Pin 9 (GND)
      { fromIndex: 2, fromPinId: 'gnd', toIndex: 0, toPinId: 'pin_9', color: '#1e293b' },
      // DHT22 DATA -> Pi Pin 7 (GPIO 4)
      { fromIndex: 2, fromPinId: 'data', toIndex: 0, toPinId: 'pin_7', color: '#10b981' },
    ],
    code: `# Simularca IoT: OLED Dashboard on Raspberry Pi 4 Model B
from smbus2 import SMBus
import time

OLED_ADDR = 0x3C
DHT_PIN = 4

print(">>> Initializing SSD1306 OLED (128x64) via I2C at 0x3C...")
print(">>> Connecting to telemetry stream...")

oled_clear()
oled_print(0, "SIMULARCA RPi 4B")
oled_print(1, "Status: ONLINE")

for cycle in range(8):
    temp = read_sensor_temp(DHT_PIN)
    hum = read_sensor_humidity(DHT_PIN)
    
    oled_print(2, f"Temp: {temp:.1f} C")
    oled_print(3, f"Hum:  {hum:.1f} %")
    
    print(f"Cycle {cycle+1}: Display updated with Temp={temp:.1f}°C, Hum={hum:.1f}%")
    time.sleep(1.2)

oled_print(3, "Session Done!")
print(">>> Telemetry loop finished.")
`,
  },
};
