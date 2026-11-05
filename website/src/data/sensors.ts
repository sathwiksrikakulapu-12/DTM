/**
 * Sensor explanations are taken from the Engineering Foundations deck:
 * slide 8 (sensor types), slide 11 (other diagnostics), slide 2 (hazards), slide 20 (case study).
 */
export type SensorInfo = {
  id: string
  name: string
  device: string
  position: [number, number, number]
  measures: string
  why: string
  failures: string
  ref: string
}

export const SENSORS: SensorInfo[] = [
  {
    id: 'vibration', name: 'Vibration', device: 'Vibration accelerometer', position: [1.5, 1.14, 0.35],
    measures: 'Machine vibration at the bearing housing. Features such as vibration RMS and spectral peaks feed the anomaly models.',
    why: 'Each signal type reveals a distinct failure mode. In the deck’s case study, rising vibration (8 mm/s RMS) helped flag early-stage bearing wear.',
    failures: 'Imbalance, misalignment, bearing faults.',
    ref: 'Engineering Students deck, slides 8, 13, 20',
  },
  {
    id: 'temperature', name: 'Temperature', device: 'Thermocouples and IR sensors', position: [-0.2, 1.17, 0.5],
    measures: 'Surface and bearing temperatures.',
    why: 'Infrared thermography detects heat anomalies before failure. In the case study, bearing temperature rose +22°C above baseline over 3 weeks.',
    failures: 'Heat anomalies in electrical panels, motors, and bearings.',
    ref: 'Engineering Students deck, slides 8, 11, 20',
  },
  {
    id: 'current', name: 'Current', device: 'Current transformers', position: [-1.05, 1.74, 0],
    measures: 'Motor load and efficiency.',
    why: 'Motor current signature analysis (MCSA) works without physical contact, adding a view that other sensors do not provide.',
    failures: 'Rotor faults and misalignment, uncovered through MCSA.',
    ref: 'Engineering Students deck, slides 8, 11',
  },
  {
    id: 'pressure', name: 'Pressure', device: 'Pressure transducers', position: [4.55, 1.5, 0.28],
    measures: 'Pressure in fluid and gas systems.',
    why: 'Sudden failures can expose workers to serious hazards, including high-pressure releases. Pressure is also one of the baseline signatures engineers establish under healthy conditions.',
    failures: 'Deviation from the healthy pressure baseline in fluid and gas systems.',
    ref: 'Engineering Students deck, slides 2, 8, 9',
  },
  {
    id: 'acoustic', name: 'Acoustic', device: 'Acoustic emission sensors', position: [4.12, 0.42, 0.78],
    measures: 'Acoustic emissions from the asset. Ultrasound sensing extends this into early-stage friction and arcing.',
    why: 'Acoustic and ultrasound sensing can identify emerging problems at an early stage.',
    failures: 'Crack propagation and leaks; ultrasound also identifies arcing and early-stage friction.',
    ref: 'Engineering Students deck, slides 8, 11',
  },
  {
    id: 'speed', name: 'Speed', device: 'Tachometers', position: [2.95, 0.72, 0.34],
    measures: 'Rotational speed.',
    why: 'Combining multiple streams dramatically improves diagnostic accuracy. Speed gives the rotating signals their operating context.',
    failures: 'The deck lists no fault mode for this sensor on its own; it strengthens diagnosis when combined with other streams.',
    ref: 'Engineering Students deck, slide 8',
  },
  {
    id: 'process', name: 'Process context', device: 'Process context signals', position: [5.85, 0.3, 0.4],
    measures: 'Flow rate, torque, and load.',
    why: 'Context signals help interpret the machine signals; combining multiple streams dramatically improves diagnostic accuracy.',
    failures: 'The deck lists no fault mode for these signals on their own; they support sensor fusion.',
    ref: 'Engineering Students deck, slide 8',
  },
]
