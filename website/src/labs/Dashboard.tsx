import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Siren } from 'lucide-react'
import { Rise, Slide, cx } from '../ui/kit'
import { SimulatedTag, SpectrumCanvas, TrendCanvas, WaveCanvas } from '../ui/lab'
import { Deferred, LazyMachine, Scene3D } from '../three/Stage'
import { anomalyScore, BASE, faultById, FAULTS, magnitudeSpectrum, makeSignal, readingsAt, RUN_HZ, type FaultId } from '../sim/engine'
import { levels, MiniGauge } from './Readouts'

const MODES = [
  { id: 'normal', label: 'Normal operation', target: 0 },
  { id: 'warning', label: 'Warning condition', target: 0.5 },
  { id: 'critical', label: 'Critical condition', target: 0.95 },
] as const
type Mode = (typeof MODES)[number]['id']
const FS = 1280; const N = 512

export default function Dashboard() {
  const [mode, setMode] = useState<Mode>('normal')
  const [faultId, setFaultId] = useState<FaultId>('bearing')
  const [tick, setTick] = useState(0)
  const sev = useRef(0); const hist = useRef<number[]>(Array(90).fill(BASE.vibration)); const t0 = useRef(0)
  const fault = faultById(faultId); const target = MODES.find((m) => m.id === mode)!.target

  useEffect(() => {
    const t = setInterval(() => {
      if (document.hidden) return
      sev.current += (target - sev.current) * 0.09
      t0.current += 0.2
      setTick((x) => x + 1)
    }, 200)
    return () => clearInterval(t)
  }, [target])

  const s = sev.current
  const r = useMemo(() => { const v = readingsAt(fault, s); hist.current = [...hist.current.slice(1), v.vibration]; return v }, [tick, fault]) // eslint-disable-line
  const signal = useMemo(() => makeSignal(fault, s, N, FS, t0.current), [tick, fault]) // eslint-disable-line
  const spec = useMemo(() => magnitudeSpectrum(signal), [signal])
  const a = anomalyScore(r)
  const status = s > 0.72 ? 'crit' : s > 0.25 ? 'warn' : 'ok'
  const qSev = Math.round(s * 20) / 20
  const assembly = useMemo(() => ({ faultPart: status === 'ok' ? null : fault.part, severity: qSev, shake: qSev * 1.3, spin: 2.6 - qSev * 0.9 }), [fault.part, qSev, status])
  const responses = {
    ok: ['Signals inside the healthy baseline', 'Trend logging continues', 'No action needed'],
    warn: [`${fault.alert} (anomaly score ${a.score.toFixed(1)}σ)`, 'Alert sent to the asset owner', `Suggested: ${fault.recommend[0]}`],
    crit: [`${fault.alert}: high risk`, 'Escalated to supervisor; work order drafted', `Suggested: ${fault.recommend[2]}`],
  }[status]

  return (
    <Slide kicker="Live-style lab" title="Industrial Sensor Dashboard" tag={<SimulatedTag />}>
      <div className="flex flex-wrap items-center gap-1.5">
        <div role="group" aria-label="Operating mode" className="flex flex-wrap gap-1.5">
          {MODES.map((m) => <button key={m.id} type="button" aria-pressed={mode === m.id} onClick={() => setMode(m.id)} className={cx('rounded-full border px-3 py-1 text-[0.88rem] font-semibold', mode === m.id ? (m.id === 'normal' ? 'border-good bg-good text-black' : m.id === 'warning' ? 'border-[#ffc83d] bg-[#ffc83d] text-black' : 'border-bad bg-bad text-black') : 'border-line bg-black/25')}>{m.label}</button>)}
        </div>
        <label className="ml-auto flex items-center gap-2 text-[0.84rem] text-mute">Simulated fault
          <select value={faultId} onChange={(e) => setFaultId(e.target.value as FaultId)} className="rounded-lg border border-line bg-[#0d1224] px-2 py-1 text-[0.88rem] text-ink">
            {FAULTS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-2 grid gap-2.5 lg:grid-cols-[1fr_1.55fr]">
        <div className="flex flex-col gap-2.5">
          <Rise className="glass relative h-[13.5rem] overflow-hidden rounded-2xl">
            <Scene3D><Deferred ms={300}><LazyMachine assembly={assembly} alerts={status === 'ok' ? undefined : [fault.part]} cameraZ={14} /></Deferred></Scene3D>
            <span className={cx('absolute top-2 left-2 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.78rem] font-bold text-black', status === 'ok' ? 'bg-good' : status === 'warn' ? 'bg-[#ffc83d]' : 'bg-bad')}>{status === 'ok' ? <CheckCircle2 className="h-3.5 w-3.5" /> : status === 'warn' ? <AlertTriangle className="h-3.5 w-3.5" /> : <Siren className="h-3.5 w-3.5" />}{status === 'ok' ? 'Healthy' : status === 'warn' ? 'Warning' : 'Critical'}</span>
          </Rise>
          <Rise className={cx('flex-1 rounded-2xl border p-3', status === 'ok' ? 'border-good/40 bg-good/10' : status === 'warn' ? 'border-[#ffc83d]/50 bg-[#ffc83d]/10' : 'border-bad/60 bg-bad/15')}>
            <div className="kicker !text-ink">System response</div>
            <ul data-testid="dash-response" className="mt-1 space-y-1 text-[0.94rem] leading-snug">{responses.map((x) => <li key={x}>• {x}</li>)}</ul>
          </Rise>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-1.5 lg:grid-cols-7">
            <MiniGauge compact label="Vibration" unit="mm/s" value={r.vibration} min={0} max={9} level={levels.vibration(r.vibration)} />
            <MiniGauge compact label="Temperature" unit="°C" value={r.temperature} min={30} max={110} level={levels.temperature(r.temperature)} digits={0} />
            <MiniGauge compact label="Current" unit="A" value={r.current} min={15} max={32} level={levels.current(r.current)} />
            <MiniGauge compact label="Speed" unit="RPM" value={r.rpm} min={1480} max={1505} level={levels.rpm(r.rpm)} digits={0} />
            <MiniGauge compact label="Pressure" unit="bar" value={r.pressure} min={2.8} max={3.6} level={levels.pressure(r.pressure)} digits={2} />
            <MiniGauge compact label="Health" unit="%" value={r.health} min={0} max={100} level={levels.health(r.health)} digits={0} />
            <MiniGauge compact label="RUL" unit="days" value={r.rul} min={0} max={180} level={levels.rul(r.rul)} digits={0} />
          </div>
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            <div className="glass flex min-h-[8rem] flex-col rounded-xl p-2"><div className="text-[0.76rem] font-medium text-mute">Vibration waveform</div><div className="min-h-0 flex-1"><WaveCanvas data={signal.slice(0, 200)} label="Simulated vibration waveform" /></div></div>
            <div className="glass flex min-h-[8rem] flex-col rounded-xl p-2"><div className="text-[0.76rem] font-medium text-mute">Spectrum (FFT computed live, multiples of running speed)</div><div className="min-h-0 flex-1"><SpectrumCanvas data={spec} maxHz={520} binHz={FS / N} runHz={RUN_HZ} label="Frequency spectrum of the simulated signal" /></div></div>
          </div>
          <div className="glass flex h-[5.6rem] flex-col rounded-xl p-2"><div className="flex justify-between text-[0.76rem] font-medium text-mute"><span>Vibration trend</span><span>Dashed line: demonstration limit</span></div><div className="min-h-0 flex-1"><TrendCanvas values={hist.current} limit={5} min={0} max={9} label="Simulated vibration trend" /></div></div>
        </div>
      </div>
      <motion.div className="sr-hidden">{fault.evidence}</motion.div>
    </Slide>
  )
}
