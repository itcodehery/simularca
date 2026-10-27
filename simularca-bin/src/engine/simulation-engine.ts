import {
  PlacedComponent,
  WireConnection,
  PinRuntimeState,
  TelemetryPoint,
} from '../types/circuit';
import { BOARDS } from '../data/boards';
import { SENSORS, BREADBOARD_INTERNAL_BUSES } from '../data/sensors';

export interface LogMessage {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  text: string;
}

export class SimulationEngine {
  private pinStates: Map<string, PinRuntimeState> = new Map();
  private isRunning: boolean = false;
  private abortController: AbortController | null = null;
  private audioContext: AudioContext | null = null;
  private buzzerOscillator: OscillatorNode | null = null;
  private buzzerGain: GainNode | null = null;

  private onLogCallback?: (log: LogMessage) => void;
  private onPinStateChangeCallback?: (states: Map<string, PinRuntimeState>) => void;
  private onTelemetryCallback?: (point: TelemetryPoint) => void;
  private onComponentValueChange?: (instanceId: string, values: Record<string, any>) => void;

  constructor() {}

  public setCallbacks(callbacks: {
    onLog?: (log: LogMessage) => void;
    onPinStateChange?: (states: Map<string, PinRuntimeState>) => void;
    onTelemetry?: (point: TelemetryPoint) => void;
    onComponentValueChange?: (instanceId: string, values: Record<string, any>) => void;
  }) {
    this.onLogCallback = callbacks.onLog;
    this.onPinStateChangeCallback = callbacks.onPinStateChange;
    this.onTelemetryCallback = callbacks.onTelemetry;
    this.onComponentValueChange = callbacks.onComponentValueChange;
  }

  // Initialize pin states based on placed components and default power rails
  public resetPins(components: PlacedComponent[], wires: WireConnection[]) {
    this.pinStates.clear();

    const board = components.find((c) => c.kind === 'board');
    if (!board) return;

    const boardDef = BOARDS[board.definitionId];
    if (boardDef) {
      for (const pin of boardDef.pins) {
        const key = `${board.instanceId}:${pin.id}`;
        let initialVoltage = 0;
        let logic: PinRuntimeState['logicState'] = 'FLOATING';

        if (pin.type === 'POWER_3V3') {
          initialVoltage = 3.3;
          logic = 'HIGH';
        } else if (pin.type === 'POWER_5V') {
          initialVoltage = 5.0;
          logic = 'HIGH';
        } else if (pin.type === 'GND') {
          initialVoltage = 0.0;
          logic = 'LOW';
        }

        this.pinStates.set(key, {
          componentId: board.instanceId,
          pinId: pin.id,
          voltage: initialVoltage,
          logicState: logic,
          mode: 'INPUT',
        });
      }
    }

    // Initialize sensor pins
    for (const comp of components) {
      if (comp.kind !== 'sensor') continue;
      const sensorDef = SENSORS[comp.definitionId];
      if (!sensorDef) continue;

      for (const pin of sensorDef.pins) {
        const key = `${comp.instanceId}:${pin.id}`;
        this.pinStates.set(key, {
          componentId: comp.instanceId,
          pinId: pin.id,
          voltage: 0,
          logicState: 'FLOATING',
          mode: pin.type === 'GPIO' || pin.type === 'ANALOG' ? 'OUTPUT' : 'INPUT',
        });
      }
    }

    this.propagateWires(components, wires);
    this.notifyPinUpdate();
  }

  private propagateWires(components: PlacedComponent[], wires: WireConnection[]) {
    const breadboardComps = components.filter(
      (c) => c.kind === 'sensor' && c.definitionId === 'module-breadboard'
    );

    let changed = true;
    let iterations = 0;
    const maxIterations = 8;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      // 1. Propagate across jumper wires
      for (const wire of wires) {
        const fromKey = `${wire.fromComponentId}:${wire.fromPinId}`;
        const toKey = `${wire.toComponentId}:${wire.toPinId}`;

        const fromState = this.pinStates.get(fromKey);
        const toState = this.pinStates.get(toKey);

        if (fromState && toState) {
          if (fromState.voltage > 0 || fromState.logicState === 'HIGH') {
            if (toState.voltage !== fromState.voltage || toState.logicState !== fromState.logicState) {
              toState.voltage = fromState.voltage;
              toState.logicState = fromState.logicState;
              changed = true;
            }
          } else if (toState.voltage > 0 || toState.logicState === 'HIGH') {
            if (fromState.voltage !== toState.voltage || fromState.logicState !== toState.logicState) {
              fromState.voltage = toState.voltage;
              fromState.logicState = toState.logicState;
              changed = true;
            }
          } else if (fromState.logicState === 'LOW' && toState.logicState !== 'LOW') {
            toState.voltage = 0;
            toState.logicState = 'LOW';
            changed = true;
          } else if (toState.logicState === 'LOW' && fromState.logicState !== 'LOW') {
            fromState.voltage = 0;
            fromState.logicState = 'LOW';
            changed = true;
          }
        }
      }

      // 2. Propagate across breadboard internal buses
      for (const bb of breadboardComps) {
        for (const bus of BREADBOARD_INTERNAL_BUSES) {
          let maxVoltage = 0;
          let busLogic: PinRuntimeState['logicState'] = 'FLOATING';

          for (const pinId of bus) {
            const st = this.pinStates.get(`${bb.instanceId}:${pinId}`);
            if (st) {
              if (st.voltage > maxVoltage) {
                maxVoltage = st.voltage;
              }
              if (st.logicState === 'HIGH') {
                busLogic = 'HIGH';
              } else if (st.logicState === 'LOW' && busLogic === 'FLOATING') {
                busLogic = 'LOW';
              }
            }
          }

          if (maxVoltage > 0 || busLogic !== 'FLOATING') {
            for (const pinId of bus) {
              const st = this.pinStates.get(`${bb.instanceId}:${pinId}`);
              if (st) {
                if (st.voltage !== maxVoltage || (st.logicState !== busLogic && maxVoltage > 0)) {
                  st.voltage = maxVoltage;
                  st.logicState = busLogic;
                  changed = true;
                }
              }
            }
          }
        }
      }
    }
  }

  public getPinState(componentId: string, pinId: string): PinRuntimeState | undefined {
    return this.pinStates.get(`${componentId}:${pinId}`);
  }

  public getAllPinStates(): Map<string, PinRuntimeState> {
    return new Map(this.pinStates);
  }

  private notifyPinUpdate() {
    if (this.onPinStateChangeCallback) {
      this.onPinStateChangeCallback(new Map(this.pinStates));
    }
  }

  private log(text: string, level: LogMessage['level'] = 'info') {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    if (this.onLogCallback) {
      this.onLogCallback({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: time,
        level,
        text,
      });
    }
  }

  // Web Audio for active buzzer
  private startBuzzerSound() {
    try {
      if (typeof window === 'undefined') return;
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      if (!this.buzzerOscillator) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(2400, this.audioContext.currentTime); // 2.4 kHz piezo tone
        gain.gain.setValueAtTime(0.04, this.audioContext.currentTime); // gentle volume
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start();
        this.buzzerOscillator = osc;
        this.buzzerGain = gain;
      }
    } catch {
      // Audio might be blocked by browser autoplay policy until user gesture
    }
  }

  private stopBuzzerSound() {
    if (this.buzzerOscillator) {
      try {
        this.buzzerOscillator.stop();
        this.buzzerOscillator.disconnect();
      } catch {}
      this.buzzerOscillator = null;
      this.buzzerGain = null;
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.stopBuzzerSound();
    this.log('Simulation stopped.', 'warn');
  }

  public async runCode(
    code: string,
    components: PlacedComponent[],
    wires: WireConnection[]
  ): Promise<void> {
    if (this.isRunning) {
      this.stop();
    }

    this.isRunning = true;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    this.log('🚀 Starting simulation runner...', 'info');
    this.resetPins(components, wires);

    const board = components.find((c) => c.kind === 'board');
    if (!board) {
      this.log('Error: No Raspberry Pi board found in circuit.', 'error');
      this.isRunning = false;
      return;
    }

    // Helper map of BCM number to board pin id
    const boardDef = BOARDS[board.definitionId];
    const bcmToPinId = new Map<number, string>();
    boardDef.pins.forEach((p) => {
      if (p.bcm !== undefined) bcmToPinId.set(p.bcm, p.id);
    });

    // Helper to find connected sensor given a board BCM pin
    const findConnectedSensorPin = (bcm: number) => {
      const pinId = bcmToPinId.get(bcm);
      if (!pinId) return null;
      const wire = wires.find(
        (w) =>
          (w.fromComponentId === board.instanceId && w.fromPinId === pinId) ||
          (w.toComponentId === board.instanceId && w.toPinId === pinId)
      );
      if (!wire) return null;

      let sensorInstanceId =
        wire.fromComponentId === board.instanceId ? wire.toComponentId : wire.fromComponentId;
      let sensorPinId =
        wire.fromComponentId === board.instanceId ? wire.toPinId : wire.fromPinId;
      let sensorComp = components.find((c) => c.instanceId === sensorInstanceId);

      // If connected to a breadboard, trace through its internal buses
      if (sensorComp?.definitionId === 'module-breadboard') {
        const bus = BREADBOARD_INTERNAL_BUSES.find((b) => b.includes(sensorPinId));
        if (bus) {
          for (const busPinId of bus) {
            if (busPinId === sensorPinId) continue;
            const nextWire = wires.find(
              (w) =>
                (w.fromComponentId === sensorInstanceId && w.fromPinId === busPinId) ||
                (w.toComponentId === sensorInstanceId && w.toPinId === busPinId)
            );
            if (nextWire) {
              const nextCompId =
                nextWire.fromComponentId === sensorInstanceId ? nextWire.toComponentId : nextWire.fromComponentId;
              const nextPin =
                nextWire.fromComponentId === sensorInstanceId ? nextWire.toPinId : nextWire.fromPinId;
              const nextComp = components.find((c) => c.instanceId === nextCompId);
              if (nextComp && nextComp.kind === 'sensor' && nextComp.definitionId !== 'module-breadboard') {
                return { sensorComp: nextComp, sensorPinId: nextPin };
              }
            }
          }
        }
      }

      return { sensorComp, sensorPinId };
    };

    // Virtual GPIO driver
    const setGpioOutput = (bcm: number, state: 'HIGH' | 'LOW') => {
      const pinId = bcmToPinId.get(bcm);
      if (!pinId) return;

      const key = `${board.instanceId}:${pinId}`;
      const current = this.pinStates.get(key);
      const isHigh = state === 'HIGH';
      if (current) {
        current.voltage = isHigh ? 3.3 : 0.0;
        current.logicState = isHigh ? 'HIGH' : 'LOW';
        current.mode = 'OUTPUT';
      }

      // Propagate along wires
      for (const wire of wires) {
        if (
          (wire.fromComponentId === board.instanceId && wire.fromPinId === pinId) ||
          (wire.toComponentId === board.instanceId && wire.toPinId === pinId)
        ) {
          const targetCompId =
            wire.fromComponentId === board.instanceId
              ? wire.toComponentId
              : wire.fromComponentId;
          const targetPinId =
            wire.fromComponentId === board.instanceId ? wire.toPinId : wire.fromPinId;

          const targetState = this.pinStates.get(`${targetCompId}:${targetPinId}`);
          if (targetState) {
            targetState.voltage = isHigh ? 3.3 : 0.0;
            targetState.logicState = isHigh ? 'HIGH' : 'LOW';
          }

          // Check if connected to LED or Buzzer
          const targetComp = components.find((c) => c.instanceId === targetCompId);
          if (targetComp) {
            if (
              targetComp.definitionId === 'module-led-red' ||
              targetComp.definitionId === 'module-led-green'
            ) {
              this.onComponentValueChange?.(targetCompId, {
                ...targetComp.values,
                lit: isHigh,
                brightness: isHigh ? 1 : 0,
              });
            } else if (targetComp.definitionId === 'module-buzzer') {
              this.onComponentValueChange?.(targetCompId, {
                ...targetComp.values,
                sounding: isHigh,
              });
              if (isHigh) {
                this.startBuzzerSound();
              } else {
                this.stopBuzzerSound();
              }
            }
          }
        }
      }

      this.notifyPinUpdate();
    };

    const getGpioInput = (bcm: number): number => {
      const pinId = bcmToPinId.get(bcm);
      if (!pinId) return 0;

      // Check if connected to an IR sensor OUT pin (Active LOW)
      const connected = findConnectedSensorPin(bcm);
      if (connected?.sensorComp?.definitionId === 'sensor-ir' && connected.sensorPinId === 'out') {
        const isDetected = Boolean(connected.sensorComp.values.obstacleDetected);
        return isDetected ? 0 : 1; // Active LOW
      }

      const key = `${board.instanceId}:${pinId}`;
      const state = this.pinStates.get(key);
      return state?.logicState === 'HIGH' ? 1 : 0;
    };

    // Helper functions for sensors
    const readSensorTemp = (bcm: number): number => {
      const found = findConnectedSensorPin(bcm);
      const ds18b20 = components.find((c) => c.definitionId === 'sensor-ds18b20');
      const dht = components.find((c) => c.definitionId === 'sensor-dht22');
      const temp = Number(
        found?.sensorComp?.values?.temperature ??
          ds18b20?.values?.temperature ??
          dht?.values?.temperature ??
          25.5
      );
      this.onTelemetryCallback?.({
        timestamp: Date.now(),
        channel: 'Temperature (°C)',
        value: temp,
        unit: '°C',
      });
      return temp;
    };

    const readSensorHumidity = (bcm: number): number => {
      const found = findConnectedSensorPin(bcm);
      const hum = Number(found?.sensorComp?.values?.humidity ?? 50.0);
      this.onTelemetryCallback?.({
        timestamp: Date.now(),
        channel: 'Humidity (%)',
        value: hum,
        unit: '%',
      });
      return hum;
    };

    const readMpuAccel = (): [number, number, number] => {
      const mpu = components.find((c) => c.definitionId === 'sensor-mpu6050');
      const adxl = components.find((c) => c.definitionId === 'sensor-adxl345');
      const comp = adxl || mpu;
      const ax = Number(comp?.values?.accelX ?? 0.05);
      const ay = Number(comp?.values?.accelY ?? -0.12);
      const az = Number(comp?.values?.accelZ ?? 0.98);

      this.onTelemetryCallback?.({
        timestamp: Date.now(),
        channel: 'Accel Z (g)',
        value: az,
        unit: 'g',
      });
      return [ax, ay, az];
    };

    const readMpuGyro = (): [number, number, number] => {
      const mpu = components.find((c) => c.definitionId === 'sensor-mpu6050');
      return [
        Number(mpu?.values?.gyroX ?? 0.0),
        Number(mpu?.values?.gyroY ?? 0.0),
        Number(mpu?.values?.gyroZ ?? 0.0),
      ];
    };

    const readSensorSound = (bcm: number): number => {
      const mic = components.find((c) => c.definitionId === 'sensor-mic');
      const inmp = components.find((c) => c.definitionId === 'sensor-inmp441');
      const val = Number(inmp?.values?.soundLevel ?? mic?.values?.soundLevel ?? 42);
      this.onTelemetryCallback?.({
        timestamp: Date.now(),
        channel: 'Sound Level (dB)',
        value: val,
        unit: 'dB',
      });
      return val;
    };

    const oledPrint = (line: number, text: string) => {
      const oled = components.find((c) => c.definitionId === 'module-oled');
      if (!oled) return;
      const key = `line${line + 1}`;
      this.onComponentValueChange?.(oled.instanceId, {
        ...oled.values,
        [key]: text,
      });
    };

    const oledClear = () => {
      const oled = components.find((c) => c.definitionId === 'module-oled');
      if (!oled) return;
      this.onComponentValueChange?.(oled.instanceId, {
        line1: '',
        line2: '',
        line3: '',
        line4: '',
      });
    };

    const sleepAsync = (seconds: number) => {
      return new Promise<void>((resolve, reject) => {
        const ms = Math.max(50, Math.floor(seconds * 1000));
        const timer = setTimeout(() => {
          resolve();
        }, ms);
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('Simulation aborted'));
        });
      });
    };

    // Execution environment sandbox
    try {
      this.log('Execution started.', 'info');
      await this.executeCodePattern(
        code,
        {
          setGpioOutput,
          getGpioInput,
          readSensorTemp,
          readSensorHumidity,
          readMpuAccel,
          readMpuGyro,
          readSensorSound,
          oledPrint,
          oledClear,
          sleepAsync,
          log: (t: string, lvl?: LogMessage['level']) => this.log(t, lvl),
          signal,
        }
      );
      this.log('Simulation finished successfully.', 'success');
    } catch (err: any) {
      if (err.message !== 'Simulation aborted') {
        this.log(`Runtime Error: ${err.message}`, 'error');
      }
    } finally {
      this.stopBuzzerSound();
      this.isRunning = false;
    }
  }

  // Parses & runs Python-like logic loops & commands interactively
  private async executeCodePattern(
    code: string,
    env: {
      setGpioOutput: (bcm: number, state: 'HIGH' | 'LOW') => void;
      getGpioInput: (bcm: number) => number;
      readSensorTemp: (bcm: number) => number;
      readSensorHumidity: (bcm: number) => number;
      readMpuAccel: () => [number, number, number];
      readMpuGyro: () => [number, number, number];
      readSensorSound: (bcm: number) => number;
      oledPrint: (line: number, text: string) => void;
      oledClear: () => void;
      sleepAsync: (sec: number) => Promise<void>;
      log: (t: string, lvl?: LogMessage['level']) => void;
      signal: AbortSignal;
    }
  ) {
    const lines = code.split('\n');

    // Detect loops and commands
    // Simple line runner that evaluates high-level instructions
    let inLoop = false;
    let loopCount = 10;
    let loopLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (env.signal.aborted) break;
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed || trimmed.startsWith('#')) continue;

      // Detect "for ... in range(N):"
      const loopMatch = trimmed.match(/for\s+\w+\s+in\s+range\((\d+)\):/);
      if (loopMatch) {
        inLoop = true;
        loopCount = parseInt(loopMatch[1], 10);
        loopLines = [];
        continue;
      }

      if (inLoop) {
        if (rawLine.startsWith('    ') || rawLine.startsWith('\t')) {
          loopLines.push(trimmed);
          if (i < lines.length - 1) continue;
        } else {
          // Finished loop definition; execute the loop
          await this.executeLoopBlock(loopCount, loopLines, env);
          inLoop = false;
          loopLines = [];
        }
      }

      await this.executeSingleStatement(trimmed, env);
    }

    if (inLoop && loopLines.length > 0) {
      await this.executeLoopBlock(loopCount, loopLines, env);
    }
  }

  private async executeLoopBlock(
    count: number,
    block: string[],
    env: {
      setGpioOutput: (bcm: number, state: 'HIGH' | 'LOW') => void;
      getGpioInput: (bcm: number) => number;
      readSensorTemp: (bcm: number) => number;
      readSensorHumidity: (bcm: number) => number;
      readMpuAccel: () => [number, number, number];
      readMpuGyro: () => [number, number, number];
      readSensorSound: (bcm: number) => number;
      oledPrint: (line: number, text: string) => void;
      oledClear: () => void;
      sleepAsync: (sec: number) => Promise<void>;
      log: (t: string, lvl?: LogMessage['level']) => void;
      signal: AbortSignal;
    }
  ) {
    for (let step = 0; step < count; step++) {
      if (env.signal.aborted) break;
      for (const line of block) {
        if (env.signal.aborted) break;
        await this.executeSingleStatement(line, env, step);
      }
    }
  }

  private async executeSingleStatement(
    statement: string,
    env: any,
    currentStep: number = 0
  ) {
    // 1. GPIO.output(PIN, GPIO.HIGH / GPIO.LOW)
    const gpioOutMatch = statement.match(/GPIO\.output\((\d+|\w+),\s*GPIO\.(HIGH|LOW)\)/);
    if (gpioOutMatch) {
      const pin = parseInt(gpioOutMatch[1], 10) || 17;
      const state = gpioOutMatch[2] as 'HIGH' | 'LOW';
      env.setGpioOutput(pin, state);
      return;
    }

    // 2. time.sleep(N)
    const sleepMatch = statement.match(/time\.sleep\(([0-9.]+)\)/);
    if (sleepMatch) {
      const sec = parseFloat(sleepMatch[1]);
      await env.sleepAsync(sec);
      return;
    }

    // 3. oled_print(line, text)
    const oledMatch = statement.match(/oled_print\((\d+),\s*["'f](.+)["']\)/);
    if (oledMatch) {
      const line = parseInt(oledMatch[1], 10);
      let text = oledMatch[2];
      text = text.replace('{temp:.1f}', '24.5').replace('{hum:.1f}', '52.0');
      env.oledPrint(line, text);
      return;
    }

    // 4. oled_clear()
    if (statement.includes('oled_clear()')) {
      env.oledClear();
      return;
    }

    // 5. print(...)
    const printMatch = statement.match(/^print\((.+)\)$/);
    if (printMatch) {
      let content = printMatch[1].trim();
      // Clean string quotes
      if (
        (content.startsWith('"') && content.endsWith('"')) ||
        (content.startsWith("'") && content.endsWith("'"))
      ) {
        content = content.slice(1, -1);
      } else if (content.startsWith('f"') || content.startsWith("f'")) {
        // Interpolate basic format strings
        content = content.slice(2, -1);
        content = content.replace(/\{(\w+)\+1:02d\}/g, `${currentStep + 1}`.padStart(2, '0'));
        content = content.replace(/\{(\w+):02d\}/g, `${currentStep}`.padStart(2, '0'));

        const temp = env.readSensorTemp(4);
        const hum = env.readSensorHumidity(4);
        const sound = env.readSensorSound(17);
        const [ax, ay, az] = env.readMpuAccel();

        content = content
          .replace('{temp:.1f}', temp.toFixed(1))
          .replace('{hum:.1f}', hum.toFixed(1))
          .replace('{sound_val}', sound.toString())
          .replace('{ax:+.2f}', ax >= 0 ? `+${ax.toFixed(2)}` : ax.toFixed(2))
          .replace('{ay:+.2f}', ay >= 0 ? `+${ay.toFixed(2)}` : ay.toFixed(2))
          .replace('{az:+.2f}', az >= 0 ? `+${az.toFixed(2)}` : az.toFixed(2));
      }
      env.log(content, 'info');
      return;
    }
  }
}
