import { lazy, Suspense, useState, type ComponentType } from 'react'
import { Activity, BrainCircuit, Cloud, Cpu, Database, TrendingUp, Wrench } from 'lucide-react'
import { Slide, Tag } from '../ui/kit'
import { CONCEPTS } from '../data/concepts'
import { clearConceptFocus, conceptFocus } from '../engine/store'
import { ArchDiagram, DeepDive, Quiz, type ArchNode } from '../ui/lab'

const MachineLab = lazy(() => import('../labs/MachineLab'))
const Dashboard = lazy(() => import('../labs/Dashboard'))
const Simulator = lazy(() => import('../labs/Simulator'))
const wrap = (C: ComponentType) => () => <Suspense fallback={<div className="grid h-full place-items-center text-mute">Loading lab…</div>}><C /></Suspense>

/** All sixteen concepts in one slide. */
function Library() {
  const ids = Object.keys(CONCEPTS)
  const [id, setId] = useState(() => { const f = conceptFocus; clearConceptFocus(); return f && CONCEPTS[f] ? f : 'vibration' })
  return <DeepDive key={id} id={id} extra={
    <label className="flex items-center gap-1.5 text-[0.82rem] text-mute">Concept
      <select aria-label="Choose a concept" value={id} onChange={(e) => setId(e.target.value)} className="rounded-lg border border-orange bg-[#0d1224] px-2 py-1 text-[0.9rem] font-medium text-ink">{ids.map((k) => <option key={k} value={k}>{CONCEPTS[k].title}</option>)}</select>
    </label>} />
}

/** Digital twin: a simple expected-versus-measured demonstration. */
function TwinDemo() {
  const [wear, setWear] = useState(0); const [flow, setFlow] = useState(60)
  const expected = 5.2 - 0.0004 * flow * flow
  const measured = expected - wear * 0.018
  const r = measured - expected
  const flagged = Math.abs(r) > 0.5
  return (
    <div>
      <label className="block text-[0.9rem] text-mute">Flow demand: <b className="num text-ink">{flow}</b>%<input type="range" min={20} max={100} value={flow} onChange={(e) => setFlow(Number(e.target.value))} aria-label="Flow demand" /></label>
      <label className="block text-[0.9rem] text-mute">Impeller wear (hidden in the real machine): <b className="num text-ink">{wear}</b>%<input type="range" min={0} max={60} value={wear} onChange={(e) => setWear(Number(e.target.value))} aria-label="Impeller wear" /></label>
      <div data-testid="twin" className="mt-2 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-hair p-2"><div className="text-[0.74rem] text-mute">Twin expects</div><div className="num font-display text-[1.3rem] font-bold">{expected.toFixed(2)} bar</div></div>
        <div className="rounded-xl border border-hair p-2"><div className="text-[0.74rem] text-mute">Sensor reads</div><div className="num font-display text-[1.3rem] font-bold">{measured.toFixed(2)} bar</div></div>
        <div className={'rounded-xl border p-2 ' + (flagged ? 'border-bad bg-bad/15' : 'border-good/50 bg-good/10')}><div className="text-[0.74rem] text-mute">Residual</div><div className="num font-display text-[1.3rem] font-bold">{r.toFixed(2)}</div></div>
      </div>
      <p className="mt-2 text-[1rem] leading-snug">{flagged ? 'Flagged: the gap has grown beyond the demonstration limit, so inspect the pump.' : 'No flag: the machine still matches the model, even when demand changes.'}</p>
      <div className="mt-1"><Tag kind="hypothetical" label="Simulated relationship, not a validated pump model" /></div>
    </div>
  )
}

const PIPELINE: ArchNode[] = [
  { k: 'Sensors', icon: Activity, purpose: 'Convert physical behaviour into electrical signals.', how: 'Accelerometers, thermocouples and current transformers mounted on or near the asset.', inputs: 'Vibration, heat, current and pressure from the machine.', outputs: 'Raw analogue or digital signals.', next: 'Signals pass to acquisition hardware at a suitable sampling rate.' },
  { k: 'Data Acquisition', icon: Database, purpose: 'Sample signals reliably and time-stamp them.', how: 'Conditions the signal and samples above twice the highest frequency of interest.', inputs: 'Raw sensor signals.', outputs: 'Time-stamped digital samples.', next: 'Samples go to edge processing, as sending all of them onward would be costly.' },
  { k: 'Edge Processing', icon: Cpu, purpose: 'Reduce data and react quickly near the machine.', how: 'Filters noise, computes features such as RMS and FFT peaks, and buffers during outages.', inputs: 'High-rate digital samples.', outputs: 'Features, summaries and fast local alarms.', next: 'Features are sent securely, for example over MQTT or OPC-UA.' },
  { k: 'Cloud', icon: Cloud, purpose: 'Store history and provide scalable computing.', how: 'Time-series databases retain data per asset and link it to asset identity and context.', inputs: 'Features and events from many edge devices.', outputs: 'Clean, organised historical datasets.', next: 'Datasets feed model training and live scoring.' },
  { k: 'AI Analytics', icon: BrainCircuit, purpose: 'Find patterns that indicate developing faults.', how: 'Compares new data with learned normal behaviour, and classifies known fault patterns.', inputs: 'Historical and live features.', outputs: 'Anomaly scores and likely fault types.', next: 'Scores feed a forecast of risk and remaining life.' },
  { k: 'Failure Prediction', icon: TrendingUp, purpose: 'Turn evidence into risk and time.', how: 'Projects degradation to a failure limit and reports the uncertainty.', inputs: 'Anomaly scores, trends and failure history.', outputs: 'Failure risk and RUL estimate with a confidence range.', next: 'The forecast is ranked by criticality and becomes a recommendation.' },
  { k: 'Maintenance Action', icon: Wrench, purpose: 'Convert a prediction into safe, timely work.', how: 'An alert is validated, a work order is raised in the CMMS, and the job is planned and verified.', inputs: 'Prioritised recommendation and resource availability.', outputs: 'Completed work and a confirmed outcome.', next: 'Outcomes feed back to label data and improve the models.' },
]

function Arch() {
  return <Slide kicker="Interactive architecture" title="From Sensor to Maintenance Action" sub="Select a stage to see what it does, what goes in and what comes out." tag={<Tag kind="web" label="Added explainer" />}><ArchDiagram nodes={PIPELINE} /></Slide>
}

/* Simple vibration spectrum used as a quiz visual. */
const SpectrumFigure = () => (
  <svg viewBox="0 0 320 76" className="h-[5.2rem] w-full max-w-[26rem] rounded-lg border border-hair bg-black/25" role="img" aria-label="Spectrum with one dominant peak at 1 times running speed">
    {[[40, 58], [74, 8], [108, 5], [142, 4], [176, 3], [210, 3], [244, 2], [278, 2]].map(([x, h], i) => <rect key={x} x={x - 4} y={62 - h} width="8" height={h} rx="1" fill={i === 0 ? 'var(--color-orange)' : 'rgba(255,255,255,.35)'} />)}
    {['1×', '2×', '3×', '4×', '5×', '6×', '7×', '8×'].map((l, i) => <text key={l} x={40 + i * 34} y="73" textAnchor="middle" fontSize="8" fill="#aab3c5">{l}</text>)}
  </svg>
)

const Q = () => <Quiz title="Check your understanding: the technology" questions={[
  { q: 'A vibration spectrum shows one dominant peak at running speed, as below. Which fault does this most suggest?', visual: <SpectrumFigure />, options: ['Rotor imbalance', 'Bearing outer-race defect', 'Lubrication failure', 'Stator winding fault'], correct: 0, why: 'Imbalance creates a force that rotates once per revolution, so its energy appears mainly at 1× running speed.' },
  { q: 'Which sensor suits detecting a compressed-air leak?', options: ['Current transformer', 'Tachometer', 'Ultrasound sensor', 'Thermocouple'], correct: 2, why: 'The turbulence at a leak produces high-frequency sound, which ultrasound instruments can detect and locate.' },
  { q: 'A non-critical, inexpensive part fails randomly with no warning. Which strategy is most sensible?', options: ['Predictive, with high-rate sensing', 'Reactive: replace it when it fails', 'Replace it weekly', 'Build a digital twin of it'], correct: 1, why: 'If failure has little consequence and gives no warning, monitoring may cost more than it saves.' },
  { q: 'RUL is estimated with a wide uncertainty band. When should engineers act?', options: ['When the average estimate reaches zero', 'After the part fails', 'When the lower bound enters the planning window', 'Never: wide bands make it useless'], correct: 2, why: 'Using the pessimistic edge of the estimate builds in a safety margin, as described on the RUL slide.' },
  { q: 'Why process data at the edge instead of sending everything to the cloud?', options: ['Edge devices have more storage', 'To reduce latency and bandwidth and to survive outages', 'Cloud platforms cannot store time series', 'Edge processing removes the need for sensors'], correct: 1, why: 'Fast alarms should not depend on a network connection, and raw high-rate signals are costly to transmit.' },
]} />

const extras: Record<string, ComponentType> = {
  machine: wrap(MachineLab), dashboard: wrap(Dashboard), simulator: wrap(Simulator), arch: Arch, quiz: Q, library: Library,
  twin: () => <DeepDive id="twin" demo={<TwinDemo />} demoLabel="Twin demonstration" />,
}
export default extras
