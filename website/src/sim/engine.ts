/**
 * Demonstration signal generator. All values are SIMULATED. The relationships between faults and
 * signals follow textbook patterns, but this is not a validated physical model of any machine.
 */
import type { PartId } from '../data/components'

export type FaultId = 'bearing' | 'misalignment' | 'imbalance' | 'overheating' | 'lubrication'
export type Readings = { vibration: number; temperature: number; current: number; rpm: number; pressure: number; acoustic: number; health: number; rul: number }

export type Fault = {
  id: FaultId; name: string; part: PartId; color: string
  /** How strongly severity (0..1) raises each reading */
  gain: { vibration: number; temperature: number; current: number; rpmDrop: number; pressure: number; acoustic: number }
  /** Spectrum components added as severity grows: [multiple of running speed, amplitude] */
  harmonics: [number, number][]
  noise: number
  primary: (keyof Readings)[]
  evidence: string
  alert: string
  recommend: string[]
  verify: string
}

export const RUN_HZ = 25 // 1,500 rpm
export const BASE: Readings = { vibration: 1.8, temperature: 58, current: 24, rpm: 1500, pressure: 3.2, acoustic: 52, health: 100, rul: 180 }
/** Healthy statistics used by the anomaly score: spread of normal variation. */
export const SIGMA: Partial<Readings> = { vibration: 0.12, temperature: 0.8, current: 0.35, pressure: 0.05, acoustic: 1 }

export const FAULTS: Fault[] = [
  { id: 'bearing', name: 'Bearing wear', part: 'bearings', color: '#ff5a5f',
    gain: { vibration: 6.2, temperature: 24, current: 2, rpmDrop: 6, pressure: 0, acoustic: 20 },
    harmonics: [[3.58, 0.8], [7.16, 0.5], [3.58 - 0.2, 0.26], [3.58 + 0.2, 0.26], [10.74, 0.28]], noise: 0.25, primary: ['vibration', 'acoustic', 'temperature'],
    evidence: 'Non-synchronous peaks with sidebands appear, and high-frequency vibration and bearing temperature rise together.',
    alert: 'Possible bearing defect on the drive end',
    recommend: ['Inspect drive-end bearing and lubrication', 'Order a replacement bearing', 'Schedule replacement in the next planned stop'],
    verify: 'Vibration, ultrasound and temperature return to baseline, and non-synchronous peaks disappear.' },
  { id: 'misalignment', name: 'Shaft misalignment', part: 'coupling', color: '#ffb13b',
    gain: { vibration: 4.8, temperature: 12, current: 2.6, rpmDrop: 3, pressure: 0, acoustic: 6 },
    harmonics: [[2, 1.1], [1, 0.45], [3, 0.3]], noise: 0.06, primary: ['vibration', 'current'],
    evidence: 'A strong peak at twice running speed appears, along with a smaller rise in motor current and coupling temperature.',
    alert: 'Possible shaft misalignment at the coupling',
    recommend: ['Check coupling condition and bolts', 'Perform a laser alignment check', 'Inspect for soft foot at the base'],
    verify: 'The 2× peak falls back to baseline after alignment, and motor current returns to normal.' },
  { id: 'imbalance', name: 'Rotor imbalance', part: 'rotor', color: '#c58bff',
    gain: { vibration: 5.4, temperature: 6, current: 1.2, rpmDrop: 2, pressure: 0, acoustic: 4 },
    harmonics: [[1, 1.5], [2, 0.12]], noise: 0.04, primary: ['vibration'],
    evidence: 'One dominant peak grows at running speed, with little change in other signals.',
    alert: 'Possible rotor imbalance',
    recommend: ['Inspect the rotor and fan for build-up or damage', 'Clean rotating parts', 'Field balance the rotor during a planned stop'],
    verify: 'The 1× peak returns to its baseline level after balancing.' },
  { id: 'overheating', name: 'Overheating', part: 'stator', color: '#ff7a3d',
    gain: { vibration: 0.9, temperature: 46, current: 6.5, rpmDrop: 10, pressure: -0.15, acoustic: 3 },
    harmonics: [[1, 0.1]], noise: 0.04, primary: ['temperature', 'current'],
    evidence: 'Winding temperature and current climb while vibration barely moves, which points away from a mechanical cause.',
    alert: 'Possible thermal overload of the stator windings',
    recommend: ['Check cooling fan and clean the fins', 'Check load and supply balance', 'Test winding insulation at the next stop'],
    verify: 'Temperature rise at the same load returns to baseline, and current is balanced.' },
  { id: 'lubrication', name: 'Lubrication failure', part: 'bearings', color: '#35e4ff',
    gain: { vibration: 2.6, temperature: 30, current: 1.4, rpmDrop: 4, pressure: 0, acoustic: 28 },
    harmonics: [[12, 0.3], [14.5, 0.28], [17, 0.25], [19.5, 0.2]], noise: 0.42, primary: ['acoustic', 'temperature'],
    evidence: 'Broadband high-frequency energy and ultrasound rise with temperature, as friction increases at the bearing.',
    alert: 'Possible inadequate bearing lubrication',
    recommend: ['Check the lubricant level and condition', 'Re-lubricate while monitoring ultrasound', 'Take a grease or oil sample for analysis'],
    verify: 'Ultrasound and temperature drop after re-lubrication and stay stable.' },
]
export const faultById = (id: FaultId) => FAULTS.find((f) => f.id === id)!

let seed = 1
const noise = () => { seed = (seed * 16807) % 2147483647; return (seed / 2147483647) * 2 - 1 }

export function readingsAt(f: Fault, sev: number, jitter = 1): Readings {
  const s = Math.max(0, Math.min(1, sev))
  const curve = s ** 1.6 // faults start slowly, then accelerate
  const vibration = BASE.vibration + f.gain.vibration * curve + noise() * 0.06 * jitter
  const temperature = BASE.temperature + f.gain.temperature * curve + noise() * 0.3 * jitter
  const current = BASE.current + f.gain.current * curve + noise() * 0.12 * jitter
  const rpm = BASE.rpm - f.gain.rpmDrop * curve + noise() * 0.5 * jitter
  const pressure = BASE.pressure + f.gain.pressure * curve + noise() * 0.015 * jitter
  const acoustic = BASE.acoustic + f.gain.acoustic * curve + noise() * 0.4 * jitter
  const health = Math.max(0, 100 - 100 * s ** 1.35)
  const rul = Math.max(0, 180 * (1 - s) ** 1.8)
  return { vibration, temperature, current, rpm, pressure, acoustic, health, rul }
}

/** Anomaly score: the largest absolute z-score across monitored signals, relative to healthy statistics. */
export function anomalyScore(r: Readings) {
  const zs = {
    vibration: (r.vibration - BASE.vibration) / SIGMA.vibration!,
    temperature: (r.temperature - BASE.temperature) / SIGMA.temperature!,
    current: (r.current - BASE.current) / SIGMA.current!,
    pressure: (r.pressure - BASE.pressure) / SIGMA.pressure!,
    acoustic: (r.acoustic - BASE.acoustic) / SIGMA.acoustic!,
  }
  let top: keyof typeof zs = 'vibration'; let max = 0
  for (const k of Object.keys(zs) as (keyof typeof zs)[]) if (Math.abs(zs[k]) > max) { max = Math.abs(zs[k]); top = k }
  return { score: max, driver: top, zs }
}

/** Time-domain signal in which the fault adds real frequency components. */
export function makeSignal(f: Fault, sev: number, N = 512, fs = 1280, t0 = 0) {
  const curve = Math.max(0, Math.min(1, sev)) ** 1.6
  const x = new Float32Array(N)
  for (let n = 0; n < N; n++) {
    const t = t0 + n / fs
    let v = 0.42 * Math.sin(2 * Math.PI * RUN_HZ * t) + 0.08 * Math.sin(2 * Math.PI * 2 * RUN_HZ * t + 0.6)
    for (const [m, a] of f.harmonics) v += a * curve * Math.sin(2 * Math.PI * m * RUN_HZ * t + m)
    v += (0.03 + f.noise * curve) * noise()
    x[n] = v
  }
  return x
}

/** Radix-2 FFT: the spectrum on screen is genuinely computed from the signal in the browser. */
export function magnitudeSpectrum(x: Float32Array) {
  const N = x.length
  const re = new Float32Array(N); const im = new Float32Array(N)
  for (let i = 0; i < N; i++) { const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1)); re[i] = x[i] * w }
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) { const t = re[i]; re[i] = re[j]; re[j] = t }
  }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = (-2 * Math.PI) / len; const wr = Math.cos(ang); const wi = Math.sin(ang)
    for (let i = 0; i < N; i += len) {
      let cr = 1; let ci = 0
      for (let k = 0; k < len / 2; k++) {
        const a = i + k; const b = a + len / 2
        const tr = re[b] * cr - im[b] * ci; const ti = re[b] * ci + im[b] * cr
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti
        const nc = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nc
      }
    }
  }
  const out = new Float32Array(N / 2)
  for (let i = 0; i < N / 2; i++) out[i] = (Math.hypot(re[i], im[i]) * 4) / N
  return out
}
