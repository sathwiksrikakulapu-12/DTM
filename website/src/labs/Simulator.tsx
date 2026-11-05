import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Pause, Play, RotateCcw, Siren, StepForward, Wrench, XOctagon } from 'lucide-react'
import { Rise, Slide, cx } from '../ui/kit'
import { SimulatedTag, SpectrumCanvas, TrendCanvas, WaveCanvas } from '../ui/lab'
import { Deferred, LazyMachine, Scene3D } from '../three/Stage'
import { anomalyScore, faultById, FAULTS, magnitudeSpectrum, makeSignal, readingsAt, RUN_HZ, type FaultId } from '../sim/engine'
import { levels, MiniGauge } from './Readouts'

const STAGES = ['Normal operation', 'Fault development', 'Sensor response', 'Anomaly detection', 'Alert generation', 'Maintenance recommendation', 'Verification']
const FS = 1280; const N = 512
type Phase = 'run' | 'decision' | 'ignored' | 'failed' | 'repairing' | 'verified'

export default function Simulator() {
  const [faultId, setFaultId] = useState<FaultId>('bearing')
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [sev, setSev] = useState(0)
  const [phase, setPhase] = useState<Phase>('run')
  const [reactive, setReactive] = useState(false)
  const [tick, setTick] = useState(0)
  const hist = useRef<number[]>([])
  const t0 = useRef(0)
  const maxStage = useRef(1)
  const fault = faultById(faultId)

  const reset = (keepFault = true) => { setPlaying(false); setSev(0); setPhase('run'); setReactive(false); hist.current = []; maxStage.current = 1; if (!keepFault) setFaultId('bearing') }

  useEffect(() => {
    const t = setInterval(() => {
      if (document.hidden) return
      t0.current += 0.2
      setTick((x) => x + 1)
      setSev((s) => {
        if (phase === 'repairing') return Math.max(0, s - 0.03)
        if (playing && (phase === 'run' || phase === 'ignored')) return Math.min(1, s + 0.0075 * speed)
        return s
      })
    }, 150)
    return () => clearInterval(t)
  }, [playing, speed, phase])

  const r = useMemo(() => readingsAt(fault, sev), [tick, fault, sev]) // eslint-disable-line
  const a = anomalyScore(r)
  const signal = useMemo(() => makeSignal(fault, sev, N, FS, t0.current), [tick, fault, sev]) // eslint-disable-line
  const spec = useMemo(() => magnitudeSpectrum(signal), [signal])
  useEffect(() => { hist.current = [...hist.current.slice(-120), Math.min(40, a.score)] }, [tick]) // eslint-disable-line

  // Stage comes from what the analytics actually sees, so it reacts to any fault or manual severity.
  let computed = 1
  if (sev > 0.001) computed = 2
  if (a.score >= 3 && sev > 0.001) computed = 3
  if (a.score >= 7) computed = 4
  if (a.score >= 12) computed = 5
  if (a.score >= 18) computed = 6
  if (phase === 'repairing' || phase === 'verified') computed = 7
  if (playing) maxStage.current = Math.max(maxStage.current, computed)
  const stage = phase === 'repairing' || phase === 'verified' ? 7 : phase === 'failed' || phase === 'ignored' ? 6 : playing ? maxStage.current : computed

  useEffect(() => {
    if (phase === 'run' && computed >= 6) { setPlaying(false); setPhase('decision') }
    if (phase === 'ignored' && sev >= 1) { setPlaying(false); setPhase('failed') }
    if (phase === 'repairing' && sev <= 0) setPhase('verified')
  }, [phase, computed, sev])

  const q = Math.round(sev * 25) / 25
  const assembly = useMemo(() => ({
    faultPart: q > 0.02 && phase !== 'verified' ? fault.part : null, severity: q, shake: phase === 'failed' ? 0 : q * 1.5, spin: phase === 'failed' ? 0 : 2.6 - q * 1.1,
  }), [fault.part, q, phase])

  const explain: Record<number, { h: string; b: string }> = {
    1: { h: 'The machine is running within its healthy baseline.', b: 'Press Run to introduce the selected fault, or drag the severity slider yourself.' },
    2: { h: `${fault.name} has begun, but it is still within normal scatter.`, b: `Fault severity is growing. The largest deviation is ${a.score.toFixed(1)}σ, which is too small to separate from normal variation.` },
    3: { h: 'Sensors now show a measurable change.', b: `${fault.evidence} Largest deviation: ${a.driver} at ${a.score.toFixed(1)}σ.` },
    4: { h: 'The analytics flags an unusual pattern.', b: `The anomaly score of ${a.score.toFixed(1)}σ stays well outside normal behaviour, with ${a.driver} as the strongest driver. It is computed as a z-score: (x − μ) ÷ σ.` },
    5: { h: `Alert: ${fault.alert}.`, b: 'The alert names the asset, the likely cause and the evidence, and it is sent to a named owner for triage.' },
    6: { h: phase === 'failed' ? 'Functional failure: unplanned stop (simulated).' : phase === 'ignored' ? 'The alert was ignored, so degradation continues.' : 'Recommendation ready: your decision.', b: phase === 'failed' ? 'The warning time was not used. Compare this with acting at the recommendation stage.' : fault.recommend.join(' · ') },
    7: { h: phase === 'verified' ? (reactive ? 'Repaired after failure, and readings verified.' : 'Verified: the planned repair worked.') : 'Maintenance in progress, with readings being checked.', b: fault.verify + (phase === 'verified' ? ' The confirmed outcome is fed back to improve future alerts.' : '') },
  }
  const ex = explain[stage]

  return (
    <Slide kicker="Interactive lab" title="Machine Failure Simulator" tag={<SimulatedTag />}>
      <div className="flex flex-wrap items-center gap-1.5">
        {FAULTS.map((f) => <button key={f.id} type="button" aria-pressed={faultId === f.id} onClick={() => { setFaultId(f.id); reset() }} className={cx('rounded-full border px-2.5 py-0.5 text-[0.84rem] font-medium', faultId === f.id ? 'border-orange bg-orange text-black' : 'border-line bg-black/25 hover:border-orange')}>{f.name}</button>)}
        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" disabled={phase === 'decision' || phase === 'failed' || phase === 'verified' || phase === 'repairing'} onClick={() => setPlaying(!playing)} className="btn-primary flex items-center gap-1 rounded-full px-3 py-1 text-[0.86rem] disabled:opacity-40">{playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{playing ? 'Pause' : 'Run'}</button>
          <button type="button" disabled={phase !== 'run'} onClick={() => setSev((s) => Math.min(1, s + 0.06))} aria-label="Advance the fault one step" className="btn-ghost grid h-7 w-7 place-items-center rounded-full disabled:opacity-40"><StepForward className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => reset()} className="btn-ghost flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.84rem]"><RotateCcw className="h-3.5 w-3.5" />Reset</button>
          <label className="flex items-center gap-1 text-[0.78rem] text-mute">Speed<select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-md border border-line bg-[#0d1224] px-1 py-0.5 text-ink"><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option></select></label>
        </div>
      </div>

      <ol aria-label="Simulation stages" className="mt-2 grid grid-cols-7 gap-1">
        {STAGES.map((s, i) => (
          <li key={s} aria-current={stage === i + 1 ? 'step' : undefined} className={cx('rounded-lg border px-1 py-1 text-center text-[0.7rem] leading-[1.1] font-medium transition-colors sm:text-[0.76rem]', stage === i + 1 ? 'border-orange bg-orange text-black' : i + 1 < stage ? 'border-orange/60 bg-orange/15' : 'border-hair text-mute')}><span className="num font-bold">{i + 1}</span> <span className="hidden sm:inline">{s}</span></li>
        ))}
      </ol>

      <div className="mt-2 grid gap-2 lg:grid-cols-[1.08fr_1.25fr]">
        <Rise className="glass relative h-[14.5rem] overflow-hidden rounded-2xl">
          <Scene3D><Deferred ms={300}><LazyMachine assembly={assembly} alerts={q > 0.1 && phase !== 'verified' ? [fault.part] : undefined} cameraZ={13.5} /></Deferred></Scene3D>
          {phase === 'failed' && <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-bad px-2.5 py-0.5 text-[0.8rem] font-bold text-black"><XOctagon className="h-4 w-4" />Machine stopped</span>}
          <label className="absolute right-2 bottom-1.5 left-2 flex items-center gap-2 rounded-lg bg-black/55 px-2 text-[0.76rem] text-mute">Fault severity
            <input type="range" aria-label="Fault severity" min={0} max={100} value={Math.round(sev * 100)} disabled={phase !== 'run'} onChange={(e) => { setPlaying(false); setSev(Number(e.target.value) / 100); maxStage.current = 1 }} />
            <span className="num w-9 text-right text-ink">{Math.round(sev * 100)}%</span>
          </label>
        </Rise>
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="grid grid-cols-5 gap-1.5">
            <MiniGauge compact label="Vibration" unit="mm/s" value={r.vibration} min={0} max={9} level={levels.vibration(r.vibration)} />
            <MiniGauge compact label="Temp." unit="°C" value={r.temperature} min={30} max={110} level={levels.temperature(r.temperature)} digits={0} />
            <MiniGauge compact label="Current" unit="A" value={r.current} min={15} max={32} level={levels.current(r.current)} />
            <MiniGauge compact label="Acoustic" unit="dB" value={r.acoustic} min={40} max={85} level={levels.acoustic(r.acoustic)} digits={0} />
            <MiniGauge compact label="RUL" unit="days" value={r.rul} min={0} max={180} level={levels.rul(r.rul)} digits={0} />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-1.5">
            <div className="glass flex h-[6.7rem] flex-col rounded-lg p-1.5"><div className="text-[0.7rem] text-mute">Waveform</div><div className="min-h-0 flex-1"><WaveCanvas data={signal.slice(0, 180)} label="Simulated waveform" /></div></div>
            <div className="glass flex h-[6.7rem] flex-col rounded-lg p-1.5"><div className="text-[0.7rem] text-mute">Spectrum (live FFT)</div><div className="min-h-0 flex-1"><SpectrumCanvas data={spec} maxHz={520} binHz={FS / N} runHz={RUN_HZ} label="Simulated spectrum" /></div></div>
            <div className="glass flex h-[6.7rem] flex-col rounded-lg p-1.5"><div className="text-[0.7rem] text-mute">Anomaly score (σ)</div><div className="min-h-0 flex-1"><TrendCanvas values={hist.current} limit={12} min={0} max={40} label="Anomaly score trend" /></div></div>
          </div>
        </div>
      </div>

      <Rise className={cx('mt-2 flex flex-wrap items-center gap-3 rounded-xl border p-2.5', phase === 'failed' ? 'border-bad/70 bg-bad/15' : phase === 'verified' ? 'border-good/60 bg-good/10' : stage >= 5 ? 'border-[#ffc83d]/60 bg-[#ffc83d]/10' : 'glass')}>
        {phase === 'failed' ? <Siren className="h-6 w-6 shrink-0 text-[#ff8a8e]" /> : phase === 'verified' ? <CheckCircle2 className="h-6 w-6 shrink-0 text-good" /> : stage >= 4 ? <AlertTriangle className="h-6 w-6 shrink-0 text-[#ffc83d]" /> : <Play className="h-6 w-6 shrink-0 text-amber" />}
        <div data-testid="sim-stage" className="min-w-[18rem] flex-1"><div className="font-display text-[1.06rem] leading-tight font-bold">{ex.h}</div><p className="mt-0.5 text-[0.9rem] leading-snug text-ink/85">{ex.b}</p></div>
        {phase === 'decision' && <>
          <button type="button" onClick={() => setPhase('repairing')} className="btn-primary flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.9rem]"><Wrench className="h-4 w-4" />Carry out maintenance</button>
          <button type="button" onClick={() => { setPhase('ignored'); setPlaying(true) }} className="btn-ghost rounded-full px-3 py-1.5 text-[0.88rem]">Ignore the alert</button>
        </>}
        {phase === 'failed' && <button type="button" onClick={() => { setReactive(true); setPhase('repairing') }} className="btn-primary flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.9rem]"><Wrench className="h-4 w-4" />Emergency repair</button>}
        {phase === 'verified' && <button type="button" onClick={() => reset()} className="btn-ghost rounded-full px-3 py-1.5 text-[0.88rem]">Try another fault</button>}
      </Rise>
    </Slide>
  )
}
