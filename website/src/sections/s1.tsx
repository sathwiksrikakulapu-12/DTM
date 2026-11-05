import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowRight, BrainCircuit, Building2, Camera, Check, ClipboardCheck, Cloud, Cog, Cpu, Database, DollarSign, Droplets, Eye, Factory, Gauge, HardHat,
  Lock, MonitorDot, Network, Radio, Scale, ScanSearch, Search, Shield, ShieldAlert, Tractor, TrainFront, Thermometer, Timer, TrendingDown, Users, Volume2, Wind, Wrench, Zap,
} from 'lucide-react'
import { Area, AreaChart, Line, LineChart, ReferenceArea, ReferenceDot, ReferenceLine, Scatter, ScatterChart, ZAxis, Bar, BarChart, Cell, ComposedChart } from 'recharts'
import { Expand, Flow, IconBadge, Panel, Photo, Rise, RunButton, Slide, Stagger, Tag, useAutoSelect, useRunner, Wave, cx, Sr } from '../ui/kit'
import { axis, ChartTip, Grid, Legend, legendStyle, ResponsiveContainer, SERIES, Tooltip, XAxis, YAxis } from '../ui/charts'
import { Deferred, LazyExplorer, Scene3D } from '../three/Stage'
import { SENSORS } from '../data/sensors'

/* ---------- 1. Title ---------- */
function S1() {
  return (
    <div className="relative grid min-h-full items-center overflow-hidden lg:grid-cols-[1fr_1.25fr]">
      <Stagger className="relative z-10">
        <Rise className="kicker">Engineering Education</Rise>
        <Rise><h1 className="mt-3 font-display text-[3.6rem] leading-[0.98] font-bold tracking-tight lg:text-[4.6rem]">PREDICTIVE<br /><span className="text-orange">MAINTENANCE</span></h1></Rise>
        <Rise><p className="mt-5 max-w-[30rem] text-[1.25rem] leading-snug text-ink/85">From Sensor Data to Safer, Smarter Maintenance — An Engineering Student's Guide</p></Rise>
        <Rise className="mt-6 flex gap-2">
          {[['Vibration', Activity], ['Temperature', Thermometer], ['Current', Zap]].map(([l, I]: any) => <span key={l} className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.82rem]"><I className="h-3.5 w-3.5 text-amber" />{l}</span>)}
        </Rise>
      </Stagger>
      <div className="relative h-[20rem] [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_92%,transparent),linear-gradient(180deg,#000_82%,transparent)] [mask-composite:intersect] lg:h-[34rem]">
        <Scene3D><Deferred ms={320}><LazyExplorer interactive autoRotate showSensors={false} /></Deferred></Scene3D>
      </div>
    </div>
  )
}

/* ---------- 2. Problem ---------- */
function S2() {
  const rows = [
    { i: DollarSign, t: 'Unplanned equipment failures cost industrial facilities billions annually.' },
    { i: Factory, t: 'Unexpected breakdowns halt production lines, causing cascading delays and missed delivery targets.' },
    { i: HardHat, t: 'Beyond lost output, sudden failures expose workers to serious safety hazards — from high-pressure releases to electrical faults.' },
    { i: Wrench, t: 'Emergency repairs demand premium labour rates, expedited parts, and extended downtime.' },
    { i: TrendingDown, t: 'As assets age and systems grow more complex, reactive maintenance cycles become unsustainable, driving up costs and eroding competitiveness.' },
  ]
  return (
    <Slide kicker="The Maintenance Problem" title="Why Maintenance Strategy Matters">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative flex flex-col gap-2">
          <div aria-hidden className="absolute top-6 bottom-6 left-[1.2rem] w-px bg-gradient-to-b from-orange via-orange/40 to-transparent" />
          {rows.map(({ i, t }, k) => (
            <Panel key={k} className="lift relative flex items-center gap-3 !py-2.5"><IconBadge icon={i} className="relative z-10 !bg-[color-mix(in_srgb,var(--color-orange)_14%,#0b1020)]" /><p className="text-[1.04rem] leading-snug">{t}</p></Panel>
          ))}
        </div>
        <Photo src="/img/s1-02.webp" alt="Technician inspecting an open machine with warning lamps lit" className="min-h-[16rem] lg:h-[27rem]" />
      </div>
    </Slide>
  )
}

/* ---------- 3. Definition ---------- */
function S3() {
  const sig = [['Vibration', Activity, 1.1], ['Temperature', Thermometer, 0.6], ['Pressure', Gauge, 0.75], ['Current', Zap, 1.4]] as const
  return (
    <Slide kicker="Definition & Core Idea" title="What Is Predictive Maintenance?">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <Rise className="flex flex-col gap-3">
          <p className="text-[1.2rem] leading-snug">Predictive maintenance (PdM) uses real-time condition data — vibration, temperature, pressure, current — combined with analytics to anticipate equipment failures before they occur.</p>
          <p className="text-[1.05rem] leading-snug text-mute">Rather than reacting to breakdowns or following fixed schedules, PdM continuously monitors asset health, establishes normal baselines, and triggers intervention only when data signals an emerging fault.</p>
          <Panel orange className="mt-1"><div className="text-[0.76rem] tracking-widest text-amber uppercase">The result</div><p className="mt-1 font-display text-[1.45rem] leading-tight font-semibold">the right action, on the right asset, at exactly the right time.</p></Panel>
        </Rise>
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
          <div className="flex flex-col gap-2">
            {sig.map(([l, I, a], k) => (
              <Panel key={l} className="!p-2.5">
                <div className="flex items-center gap-1.5 text-[0.86rem]"><I className="h-4 w-4 text-amber" />{l}</div>
                <Wave seed={k + 1} amp={a} className="mt-1 h-8 w-full" speed={2 + k} />
              </Panel>
            ))}
          </div>
          <svg viewBox="0 0 40 200" className="h-[18rem] w-8" aria-hidden><path d="M0 30C25 30 15 100 40 100M0 80C25 80 15 100 40 100M0 125C25 125 15 100 40 100M0 170C25 170 15 100 40 100" stroke="var(--color-orange)" fill="none" strokeWidth="1.5" className="flow-dash" /></svg>
          <Rise className="glass-o grid h-[11rem] w-[9.5rem] place-items-center rounded-2xl p-3 text-center">
            <div><BrainCircuit className="mx-auto h-9 w-9 text-orange" strokeWidth={1.4} /><div className="mt-1 font-display text-[1.02rem] font-semibold">Analytics</div><div className="text-[0.8rem] leading-tight text-mute">baseline vs live condition</div></div>
          </Rise>
        </div>
      </div>
    </Slide>
  )
}

/* ---------- 4. Strategies ---------- */
const STRATEGY = [
  { name: 'Reactive', lead: 'Fix it after it breaks', rest: 'low upfront cost, high downtime risk.', mark: 96, note: 'Work starts at failure' },
  { name: 'Preventive', lead: 'Schedule maintenance by time or usage', rest: 'reduces failures but wastes resources on healthy assets.', mark: 28, note: 'Work follows the calendar', many: [28, 56, 84] },
  { name: 'Predictive', lead: 'Monitor real-time condition data to intervene only when needed', rest: 'maximising uptime, minimising waste, and preventing unplanned failures before they occur.', mark: 72, note: 'Work follows the condition' },
]
const healthCurve = Array.from({ length: 51 }, (_, i) => { const t = i * 2; return { t, h: Math.max(4, Math.round(100 - 0.00009 * t ** 3 - t * 0.04 - (t > 90 ? (t - 90) * 3.6 : 0))) } })
function S4() {
  const { active, select } = useAutoSelect(3, 3400, 2)
  const s = STRATEGY[active]
  const marks = s.many ?? [s.mark]
  return (
    <Slide kicker="Reactive vs Preventive vs Predictive" title="Comparing Maintenance Strategies" tag={<Tag kind="illustrative" label="Curve is illustrative" />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-2.5">
          {STRATEGY.map((x, i) => (
            <Panel key={x.name} hot={i === active} onClick={() => select(i)} className={cx(i === active && 'glass-o')}>
              <div className="font-display text-[1.2rem] font-bold text-amber">{x.name}</div>
              <p className="mt-0.5 text-[1rem] leading-snug"><span className="font-semibold">{x.lead}</span> — <span className="text-mute">{x.rest}</span></p>
            </Panel>
          ))}
          <Photo src="/img/s1-04.webp" alt="Machine with warning sign, technician at work, and a monitoring screen" className="h-[5.6rem]" pos="50% 40%" />
        </div>
        <Panel className="flex flex-col">
          <div className="flex items-baseline justify-between gap-2"><div className="font-display text-[1.05rem] font-semibold">When does each strategy act?</div><motion.div key={s.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[0.88rem] text-amber">{s.note}</motion.div></div>
          <div className="mt-2 h-[20.5rem]">
            <ResponsiveContainer>
              <AreaChart data={healthCurve} margin={{ top: 22, right: 18, left: 6, bottom: 18 }}>
                <defs><linearGradient id="hc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-orange)" stopOpacity={0.32} /><stop offset="100%" stopColor="var(--color-orange)" stopOpacity={0} /></linearGradient></defs>
                <Grid />
                <XAxis dataKey="t" type="number" domain={[0, 100]} {...axis} tick={false} label={{ value: 'Time in service →', fill: '#A6ADB7', fontSize: '0.82rem', position: 'insideBottom', offset: -6 }} />
                <YAxis {...axis} tick={false} domain={[0, 100]} label={{ value: 'Asset health', angle: -90, fill: '#A6ADB7', fontSize: '0.82rem' }} width={28} />
                <Area dataKey="h" stroke="var(--color-orange)" strokeWidth={2} fill="url(#hc)" isAnimationActive={false} dot={false} />
                {marks.map((m) => <ReferenceLine key={m} x={m} stroke="var(--color-cool)" strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Maintain', fill: 'var(--color-cool)', fontSize: '0.8rem', position: 'top' }} />)}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </Slide>
  )
}

/* ---------- 5. Why it matters ---------- */
const VALUE = [
  { k: 'Uptime', i: Timer, t: 'maximising equipment uptime by catching faults before failure' },
  { k: 'Quality', i: Check, t: 'protecting product quality through consistent process conditions' },
  { k: 'Safety', i: HardHat, t: 'safeguarding worker safety by preventing catastrophic breakdowns' },
  { k: 'Cost', i: DollarSign, t: 'reducing maintenance costs by eliminating unnecessary interventions' },
  { k: 'Resources', i: Users, t: 'optimising resource allocation so skilled technicians focus where they are needed most' },
]
function S5() {
  const { active, select } = useAutoSelect(5, 2600)
  const R = 40
  return (
    <Slide kicker="Why It Matters" title="Uptime, Quality, Safety, Cost & Resources" sub="Predictive maintenance delivers measurable value across five dimensions:">
      <div className="grid items-center gap-5 lg:grid-cols-[1fr_1.05fr_0.7fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[25rem]">
          <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden>
            {VALUE.map((_, i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return <line key={i} x1="50" y1="50" x2={50 + R * Math.cos(a)} y2={50 + R * Math.sin(a)} stroke={i === active ? 'var(--color-orange)' : 'rgba(255,255,255,.12)'} strokeWidth={i === active ? 0.8 : 0.4} /> })}
            <polygon points={VALUE.map((_, i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return `${50 + R * Math.cos(a)},${50 + R * Math.sin(a)}` }).join(' ')} fill="color-mix(in srgb, var(--color-orange) 7%, transparent)" stroke="color-mix(in srgb, var(--color-orange) 40%, transparent)" strokeWidth=".5" />
          </svg>
          <div className="absolute inset-0 grid place-items-center"><div className="grid h-[5.4rem] w-[5.4rem] place-items-center rounded-full border border-line bg-black/40 text-center font-display text-[0.88rem] leading-tight font-semibold">PdM<br />value</div></div>
          {VALUE.map(({ k, i: I }, i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2
            return (
              <button key={k} type="button" aria-pressed={i === active} onClick={() => select(i)} style={{ left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%`, transform: 'translate(-50%,-50%)' }}
                className={cx('glass lift absolute flex w-[5.6rem] flex-col items-center rounded-xl py-1.5', i === active && 'hot glass-o')}>
                <I className="h-5 w-5 text-amber" strokeWidth={1.6} /><span className="font-display text-[0.86rem] font-semibold">{k}</span>
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-2">
          {VALUE.map(({ k, t }, i) => (
            <Panel key={k} hot={i === active} onClick={() => select(i)} className="!py-2.5"><span className="font-display font-semibold text-amber">{k}: </span><span className="text-[1rem] leading-snug">{t}</span></Panel>
          ))}
        </div>
        <Photo src="/img/s1-05.webp" alt="Engineer reviewing a large analytics wall display" className="h-[18rem] lg:h-[26rem]" pos="50% 30%" />
      </div>
    </Slide>
  )
}

/* ---------- 6. Workflow ---------- */
const WF = [
  { l: 'Sense', i: Activity, t: 'transducers capture vibration, temperature, pressure, and current' },
  { l: 'Collect', i: Cpu, t: 'edge devices aggregate raw signals' },
  { l: 'Transmit', i: Radio, t: 'data streams to the cloud or on-premise server' },
  { l: 'Analyze', i: BrainCircuit, t: 'algorithms extract features and identify patterns' },
  { l: 'Detect', i: ScanSearch, t: 'anomaly models flag deviations from baselines' },
  { l: 'Decide', i: Scale, t: 'severity scoring prioritises alerts' },
  { l: 'Schedule', i: ClipboardCheck, t: 'work orders are automatically raised in the CMMS' },
  { l: 'Act & Learn', i: Wrench, t: 'technicians intervene and outcomes feed back to retrain models' },
]
function S6() {
  const r = useRunner(8, 750)
  return (
    <Slide kicker="End-to-End Workflow" title="From Sensor to Safe Action" sub="The predictive maintenance cycle follows eight linked steps:" tag={<RunButton running={r.running} onClick={r.run} />}>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {WF.map(({ l, i: I, t }, k) => {
          const lit = k <= r.index
          return (
            <Panel key={l} hot={k === r.index} onClick={() => r.select(k)} className={cx('min-h-[8.6rem]', lit && 'glass-o')}>
              <div className="flex items-center gap-2"><span className={cx('num grid h-7 w-7 place-items-center rounded-full border text-[0.82rem] font-bold', lit ? 'border-orange bg-orange text-black' : 'border-line text-amber')}>{k + 1}</span><I className={cx('h-5 w-5', lit ? 'text-amber' : 'text-mute')} strokeWidth={1.6} /><span className="font-display text-[1.1rem] font-semibold">{l}</span></div>
              <p className="mt-2 text-[0.98rem] leading-snug text-ink/85">{t}</p>
            </Panel>
          )
        })}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <div className="relative h-2 self-center overflow-hidden rounded-full bg-white/10 lg:col-span-2"><motion.div className="h-full rounded-full bg-gradient-to-r from-orange to-amber" animate={{ width: `${((r.index + 1) / 8) * 100}%` }} transition={{ duration: 0.3 }} /></div>
        <Photo src="/img/s1-06.webp" alt="Control room operators in front of a wall of system dashboards" className="h-[6.8rem] lg:col-span-2" pos="50% 40%" />
      </div>
    </Slide>
  )
}

/* ---------- 7. Divider ---------- */
function S7() {
  return (
    <div className="relative grid min-h-full place-items-center overflow-hidden text-center">
      <div aria-hidden className="absolute inset-0 flex flex-col justify-center gap-7 opacity-45">
        {[1, 2, 3, 4].map((k) => <Wave key={k} seed={k * 1.3} amp={k === 2 ? 1.2 : 0.75} speed={2 + k} color={k % 2 ? 'var(--color-orange)' : 'var(--color-cool)'} className="h-14 w-full" />)}
      </div>
      <Stagger className="glass relative rounded-3xl px-10 py-9">
        <Rise className="kicker">Sensors & Signals</Rise>
        <Rise><h1 className="mt-2 font-display text-[3rem] leading-none font-bold lg:text-[3.8rem]">TECHNICAL <span className="text-orange">FOUNDATIONS</span></h1></Rise>
        <Rise><p className="mt-4 text-[1.35rem] text-ink/85">What Machines Reveal Through Their Signals</p></Rise>
      </Stagger>
    </div>
  )
}

/* ---------- 8. Sensors ---------- */
const SENSOR_LINES = [
  { id: 'vibration', n: 'vibration accelerometers', d: 'detecting imbalance, misalignment, bearing faults' },
  { id: 'temperature', n: 'thermocouples and IR sensors', d: 'surface and bearing temperatures' },
  { id: 'pressure', n: 'pressure transducers', d: 'fluid and gas systems' },
  { id: 'current', n: 'current transformers', d: 'motor load and efficiency' },
  { id: 'acoustic', n: 'acoustic emission sensors', d: 'crack propagation, leaks' },
  { id: 'speed', n: 'tachometers', d: 'rotational speed' },
  { id: 'process', n: 'process context signals', d: 'flow rate, torque, load' },
]
function S8() {
  const [active, setActive] = useState('vibration')
  const info = SENSORS.find((s) => s.id === active)!
  return (
    <Slide kicker="Sensors & Signals" title="The Eyes and Ears of the Machine" sub="Predictive maintenance begins with data. Key sensor types include:">
      <div className="grid gap-3 lg:grid-cols-[0.95fr_1.5fr]">
        <div className="flex flex-col gap-1.5">
          {SENSOR_LINES.map((s) => (
            <Panel key={s.id} hot={active === s.id} onClick={() => setActive(s.id)} className="!px-3 !py-1"><div className="text-[0.96rem] font-semibold first-letter:uppercase">{s.n}</div><div className="text-[0.86rem] leading-tight text-mute">{s.d}</div></Panel>
          ))}
          <p className="text-[0.92rem] leading-tight text-ink/85">Each signal type reveals a distinct failure mode, and combining multiple streams dramatically improves diagnostic accuracy.</p>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="glass relative h-[14.2rem] overflow-hidden rounded-2xl">
            <Scene3D><Deferred ms={320}><LazyExplorer active={active} onSelect={setActive} /></Deferred></Scene3D>
            <span className="pointer-events-none absolute top-2 left-3 text-[0.74rem] text-mute">Drag to rotate · scroll to zoom · click a glowing sensor</span>
          </div>
          <Panel orange className="!py-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2"><div className="font-display text-[1.1rem] font-bold">{info.device}</div><div className="text-[0.74rem] text-dim">{info.ref}</div></div>
            <div className="mt-1 grid gap-2 text-[0.88rem] leading-snug sm:grid-cols-3">
              {[['Measures', info.measures], ['Why it matters', info.why], ['Failures it reveals', info.failures]].map(([h, t]) => <div key={h}><div className="font-semibold text-amber">{h}</div><p className="text-ink/85">{t}</p></div>)}
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}

/* ---------- 9. Baselines ---------- */
function S9() {
  const [fault, setFault] = useState(false)
  const [data, setData] = useState(() => Array.from({ length: 60 }, (_, i) => ({ i, v: 50 + Math.sin(i * 0.7) * 3 + Math.sin(i * 2.1) * 2 })))
  const [band, setBand] = useState(14)
  useEffect(() => {
    let k = 60; let drift = 0
    const t = setInterval(() => {
      k++; drift = fault ? Math.min(drift + 0.9, 30) : Math.max(0, drift - 2)
      setData((d) => [...d.slice(1), { i: k, v: 50 + Math.sin(k * 0.7) * 3 + Math.sin(k * 2.1) * 2 + drift }])
    }, 140)
    return () => clearInterval(t)
  }, [fault])
  const latest = data[data.length - 1].v
  const alert = latest > 50 + band
  return (
    <Slide kicker="Condition Monitoring & Baselines" title="Establishing Normal Behavior" tag={<Tag kind="illustrative" label="Simulated signal, no measured values" />}>
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.5fr]">
        <div className="flex flex-col gap-2.5">
          <Panel className="!py-2.5 text-[1rem] leading-snug">Condition monitoring captures continuous sensor data to define an asset's normal operating state.</Panel>
          <Panel className="!py-2.5 text-[1rem] leading-snug">Engineers establish baseline signatures — vibration, temperature, pressure, current — under known healthy conditions.</Panel>
          <Panel className="!py-2.5 text-[1rem] leading-snug">Statistical thresholds and trend bands are then set so that any deviation triggers an alert.</Panel>
          <Panel orange className="!py-2.5 text-[1rem] leading-snug">Comparing real-time readings against reference signatures reveals emerging faults before failure occurs.</Panel>
          <Photo src="/img/s1-09.webp" alt="Waveforms on a monitoring screen beside gauges" className="h-[3.6rem]" pos="50% 30%" />
        </div>
        <Panel className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2.5">
            <button type="button" aria-pressed={fault} onClick={() => setFault(!fault)} className={cx('rounded-full px-3.5 py-1.5 text-[0.88rem] font-semibold', fault ? 'btn-ghost' : 'btn-primary')}>{fault ? 'Restore healthy state' : 'Inject developing fault'}</button>
            <label className="flex min-w-[12rem] flex-1 items-center gap-2 text-[0.84rem] text-mute">Threshold band<input type="range" min={6} max={26} value={band} onChange={(e) => setBand(Number(e.target.value))} aria-label="Threshold band width" /></label>
            <span className={cx('flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.84rem] font-semibold', alert ? 'border-bad/60 bg-bad/15 text-[#ff8b7c]' : 'border-good/50 bg-good/10 text-good')}>{alert ? <AlertTriangle className="h-4 w-4" /> : <Check className="h-4 w-4" />}{alert ? 'Deviation: alert triggered' : 'Within baseline'}</span>
          </div>
          <div className="mt-2 h-[21rem]">
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
                <Grid />
                <XAxis dataKey="i" hide />
                <YAxis domain={[20, 95]} {...axis} tick={false} width={10} />
                <ReferenceArea y1={50 - band} y2={50 + band} fill="var(--color-cool)" fillOpacity={0.09} stroke="var(--color-cool)" strokeOpacity={0.35} strokeDasharray="4 4" label={{ value: 'Baseline trend band', fill: 'var(--color-cool)', fontSize: '0.8rem', position: 'insideBottomLeft' }} />
                <ReferenceLine y={50} stroke="var(--color-cool)" strokeOpacity={0.6} />
                <Line dataKey="v" stroke="var(--color-orange)" dot={false} strokeWidth={2} isAnimationActive={false} name="Live reading" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </Slide>
  )
}

/* ---------- 10. Vibration ---------- */
const VIB = [
  { k: 'Imbalance', h: [{ f: 1, a: 92 }, { f: 2, a: 12 }, { f: 3, a: 6 }], note: 'A dominant peak at 1× running speed is the textbook signature.' },
  { k: 'Misalignment', h: [{ f: 1, a: 55 }, { f: 2, a: 78 }, { f: 3, a: 30 }], note: 'Elevated 2× (and often 1×) running-speed peaks are the textbook signature.' },
  { k: 'Looseness', h: [{ f: 1, a: 44 }, { f: 2, a: 38 }, { f: 3, a: 34 }, { f: 4, a: 30 }, { f: 5, a: 25 }, { f: 6, a: 20 }, { f: 7, a: 16 }], note: 'A long series of running-speed harmonics is the textbook signature.' },
  { k: 'Bearing Defects', h: [{ f: 1, a: 18 }, { f: 2, a: 8 }, { f: 7.2, a: 40 }, { f: 8.2, a: 26 }, { f: 6.2, a: 24 }, { f: 9.2, a: 14 }], note: 'Non-synchronous, higher-frequency peaks with sidebands are the textbook signature.' },
  { k: 'Frequency Spectra', h: [{ f: 1, a: 30 }, { f: 2, a: 18 }, { f: 3, a: 12 }, { f: 5, a: 8 }, { f: 7, a: 10 }], note: 'A spectrum separates a vibration signal into frequency components, so different faults can be told apart.' },
]
function S10() {
  const [k, setK] = useState(0)
  const v = VIB[k]
  const spectrum = useMemo(() => Array.from({ length: 41 }, (_, i) => {
    const f = i / 4
    const peak = v.h.reduce((m, p) => Math.max(m, Math.abs(p.f - f) < 0.01 ? p.a : 0), 0)
    return { f, a: peak || 1.5 + ((i * 7) % 4) * 0.5 }
  }), [v])
  const wave = useMemo(() => {
    const pts = Array.from({ length: 220 }, (_, i) => {
      const t = i / 220
      const y = v.h.reduce((s, p) => s + (p.a / 100) * Math.sin(2 * Math.PI * p.f * 4 * t), 0)
      return `${i ? 'L' : 'M'}${(t * 600).toFixed(1)} ${(50 - y * 26).toFixed(1)}`
    })
    return pts.join('')
  }, [v])
  return (
    <Slide kicker="Vibration Diagnostics" title="Imbalance · Misalignment · Looseness · Bearing Defects · Frequency Spectra" tag={<Tag kind="web" />}>
      <div className="flex flex-wrap gap-2">
        {VIB.map((x, i) => (
          <motion.button key={x.k} type="button" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} aria-pressed={i === k} onClick={() => setK(i)} className={cx('rounded-full border px-4 py-1.5 font-display text-[0.98rem] font-semibold transition-colors', i === k ? 'border-orange bg-orange text-black' : 'border-line bg-black/30 hover:border-orange/80')}>{x.k}</motion.button>
        ))}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between"><div className="font-display font-semibold">Time waveform</div><Tag kind="illustrative" label="Synthetic" /></div>
          <svg viewBox="0 0 600 100" className="mt-2 h-[14.4rem] w-full" preserveAspectRatio="none" role="img" aria-label={`Synthetic time waveform for ${v.k}`}>
            <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,.14)" />
            <motion.path key={v.k} d={wave} fill="none" stroke="var(--color-orange)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
          </svg>
          <div className="mt-1 text-right text-[0.8rem] text-dim">Time →</div>
        </Panel>
        <Panel>
          <div className="flex items-center justify-between"><div className="font-display font-semibold">Frequency spectrum</div><Tag kind="illustrative" label="Synthetic" /></div>
          <div className="mt-2 h-[15.2rem]">
            <ResponsiveContainer>
              <BarChart data={spectrum} margin={{ top: 8, right: 8, left: 0, bottom: 16 }} barCategoryGap={1}>
                <Grid />
                <XAxis dataKey="f" {...axis} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} tickFormatter={(x) => `${x}×`} interval={0} label={{ value: 'Multiples of running speed', fill: '#A6ADB7', fontSize: '0.78rem', position: 'insideBottom', offset: -10 }} />
                <YAxis {...axis} tick={false} width={8} />
                <Bar dataKey="a" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={350}>
                  {spectrum.map((d, i) => <Cell key={i} fill={d.a > 6 ? 'var(--color-orange)' : 'rgba(255,255,255,.2)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <Panel orange className="mt-3 !py-2.5 text-[1.02rem] leading-snug"><span className="font-semibold text-amber">{v.k}: </span>{v.note}</Panel>
    </Slide>
  )
}

/* ---------- 11. Other diagnostics ---------- */
const TOOLS = [
  { k: 'Infrared thermography', i: Thermometer, t: 'detects heat anomalies in electrical panels, motors, and bearings before failure.' },
  { k: 'Oil analysis', i: Droplets, t: 'reveals wear particles, contamination, and degradation trends.' },
  { k: 'Ultrasound sensing', i: Volume2, t: 'identifies leaks, arcing, and early-stage friction.' },
  { k: 'Motor current signature analysis (MCSA)', i: Zap, t: 'uncovers rotor faults and misalignment without physical contact.' },
  { k: 'Visual inspection, augmented by cameras and AI,', i: Camera, t: 'catches surface cracks, corrosion, and misalignment.' },
]
function S11() {
  const { active, select } = useAutoSelect(5, 2800)
  return (
    <Slide kicker="Thermal & Other Diagnostics" title="Broadening the Diagnostic Toolkit">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-2">
          {TOOLS.map(({ k, i, t }, x) => (
            <Panel key={k} hot={x === active} onClick={() => select(x)} className="flex items-center gap-3 !py-2.5"><IconBadge icon={i} /><p className="text-[1.05rem] leading-snug"><span className="font-semibold text-amber">{k}</span> {t}</p></Panel>
          ))}
          <Panel orange className="text-[1.05rem] leading-snug">Together, these complementary techniques provide a multi-layered view of asset health that no single method can achieve alone.</Panel>
        </div>
        <Photo src={active === 0 ? '/img/s1-11.webp' : active === 3 ? '/img/s3-11.webp' : active === 2 ? '/img/s3-09.webp' : active === 4 ? '/img/s1-03.webp' : '/img/s1-08.webp'} alt="Diagnostic technique in use" className="min-h-[16rem] lg:h-[27.5rem]" />
      </div>
    </Slide>
  )
}

/* ---------- 12. Architecture ---------- */
const LAYERS = [
  { k: 'Sensors', i: Activity, t: 'sensors capture raw signals at the machine level' },
  { k: 'Edge gateways', i: Cpu, t: 'edge gateways pre-process and filter data locally to reduce latency and bandwidth' },
  { k: 'Connectivity', i: Network, t: 'connectivity protocols (MQTT, OPC-UA) transmit data securely' },
  { k: 'Cloud platforms', i: Cloud, t: 'cloud platforms host advanced analytics, AI models, and historian databases' },
  { k: 'Dashboards & CMMS', i: MonitorDot, t: 'Dashboards and CMMS systems then deliver actionable alerts to maintenance teams in real time.' },
]
function S12() {
  const { active, select } = useAutoSelect(5, 2500)
  return (
    <Slide kicker="IoT / Edge / Cloud Architecture" title="From Sensor to Decision: The Data Pipeline" sub="Predictive maintenance relies on a layered architecture:">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative flex flex-col gap-2">
          {LAYERS.map(({ k, i: I, t }, x) => (
            <Panel key={k} hot={x === active} onClick={() => select(x)} className={cx('relative flex items-center gap-3 overflow-hidden !py-2.5', x === active && 'glass-o')} >
              <IconBadge icon={I} />
              <div className="min-w-0"><div className="font-display text-[1.1rem] font-semibold">{k}</div><div className="text-[0.98rem] leading-snug text-ink/80">{t}</div></div>
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden">
                {x <= active && <motion.span className="block h-full w-1/5 bg-amber" animate={{ x: ['-100%', '520%'] }} transition={{ repeat: Infinity, duration: 1.7, ease: 'linear', delay: x * 0.12 }} />}
              </div>
            </Panel>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Photo src="/img/s1-12.webp" alt="Rows of server racks with status lights" className="h-[8.5rem]" />
          <Panel className="flex-1">
            <div className="font-display font-semibold">Layer in focus</div>
            <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mt-2 font-display text-[1.6rem] leading-tight font-bold text-amber">{LAYERS[active].k}</div>
              <p className="mt-1.5 text-[1.02rem] leading-snug">{LAYERS[active].t}</p>
              <div className="num mt-3 text-[0.82rem] text-mute">Layer {active + 1} of {LAYERS.length}</div>
            </motion.div>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}

/* ---------- 13. AI ---------- */
const rand = (i: number, s: number) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x) }
const POINTS = Array.from({ length: 110 }, (_, i) => {
  const a = rand(i, 1) * Math.PI * 2
  const out = i % 12 === 0
  const r = out ? 28 + rand(i, 2) * 18 : Math.sqrt(-2 * Math.log(rand(i, 3) + 0.001)) * 7.5
  return { x: 80 + Math.cos(a) * r * 1.35, y: 50 + Math.sin(a) * r * 0.95, d: Math.round(r) }
})
function S13() {
  const [limit, setLimit] = useState(24)
  const [mode, setMode] = useState<'sup' | 'unsup'>('unsup')
  const flagged = POINTS.filter((p) => p.d > limit).length
  return (
    <Slide kicker="AI & Anomaly Detection" title="Teaching Machines to Recognize Failure Signatures" tag={<Tag kind="illustrative" label="Synthetic data points" />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-2 text-[0.98rem] leading-snug">
          <Panel className="!py-2.5">AI models learn what "normal" looks like by training on historical sensor data.</Panel>
          <div className="grid grid-cols-2 gap-2">
            <Panel hot={mode === 'sup'} onClick={() => setMode('sup')} className="!py-2.5"><span className="font-semibold text-amber">Supervised learning</span> uses labeled fault examples;</Panel>
            <Panel hot={mode === 'unsup'} onClick={() => setMode('unsup')} className="!py-2.5"><span className="font-semibold text-amber">unsupervised learning</span> flags statistical deviations without prior fault data — ideal for rare failures.</Panel>
          </div>
          <Panel className="!py-2.5">Key features (vibration RMS, temperature delta, spectral peaks) feed into models such as autoencoders, isolation forests, or neural networks.</Panel>
          <Panel className="!py-2.5">When sensor readings drift beyond learned baselines, an alert is triggered.</Panel>
          <Panel orange className="!py-2.5">Explainability tools (e.g., SHAP values) highlight which features drove the anomaly, helping engineers trust and act on AI-generated warnings.</Panel>
        </div>
        <Panel className="flex flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex min-w-[13rem] flex-1 items-center gap-2 text-[0.85rem] text-mute">Learned baseline limit<input type="range" min={10} max={45} value={limit} onChange={(e) => setLimit(Number(e.target.value))} aria-label="Learned baseline limit" /></label>
            <span className="rounded-full border border-orange/60 bg-orange/10 px-3 py-1 text-[0.84rem]"><span className="num font-semibold text-amber">{flagged}</span> of {POINTS.length} points flagged</span>
          </div>
          <svg viewBox="0 0 160 100" className="mt-1 h-[16.5rem] w-full" role="img" aria-label={`Synthetic sensor readings: ${flagged} of ${POINTS.length} fall outside the learned baseline`}>
            <ellipse cx="80" cy="50" rx={limit * 1.35} ry={limit * 0.95} fill="rgba(92,201,220,.07)" stroke="var(--color-cool)" strokeWidth=".5" strokeDasharray="2 2" />
            <text x="80" y={Math.max(5, 50 - limit * 0.95 - 1.6)} textAnchor="middle" fontSize="3.2" fill="var(--color-cool)">Learned normal</text>
            {POINTS.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.d > limit ? 1.45 : 1} fill={p.d > limit ? 'var(--color-orange)' : 'var(--color-cool)'} opacity={p.d > limit ? 1 : 0.8} />)}
          </svg>
          <div className="mt-1 grid grid-cols-3 gap-2 text-[0.8rem]">
            {[['vibration RMS', 86], ['temperature delta', 54], ['spectral peaks', 31]].map(([l, v]) => (
              <div key={l as string}><div className="text-mute">{l}</div><div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-orange" initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.6, delay: 0.3 }} /></div></div>
            ))}
          </div>
          <div className="mt-1 text-[0.74rem] text-dim">Bars sketch how an explainability view ranks features. They are not results.</div>
        </Panel>
      </div>
    </Slide>
  )
}

/* ---------- 14. RUL ---------- */
function S14() {
  const [now, setNow] = useState(40)
  const [win, setWin] = useState(25)
  const data = useMemo(() => Array.from({ length: 51 }, (_, i) => {
    const t = i * 2
    const trend = 100 - 0.0078 * t * t
    const past = t <= now
    const spread = past ? 0 : Math.pow((t - now) / 60, 1.4) * 32
    return { t, actual: past ? Math.round(trend) : null, proj: t >= now ? Math.round(trend) : null, band: t >= now ? [Math.max(0, Math.round(trend - spread)), Math.min(100, Math.round(trend + spread))] : null }
  }), [now])
  // First projected time where the pessimistic edge crosses the failure line
  const failThreshold = 20
  const lower = data.find((d) => d.band && (d.band as number[])[0] <= failThreshold)?.t ?? 100
  const remaining = lower - now
  const act = remaining <= win
  return (
    <Slide kicker="Remaining Useful Life" title="Forecasting Time to Failure" tag={<Tag kind="illustrative" label="Curve and units are illustrative" />}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.45fr]">
        <div className="flex flex-col gap-2 text-[1rem] leading-snug">
          <Panel className="!py-2.5">Remaining Useful Life (RUL) estimates how long a component can continue operating before failure.</Panel>
          <Panel className="!py-2.5">By tracking degradation trends — rising vibration, increasing temperature, growing wear — models project a failure horizon with a confidence interval.</Panel>
          <Panel className="!py-2.5">Shorter prediction horizons yield higher accuracy; longer horizons enable earlier maintenance planning.</Panel>
          <Panel orange className="!py-2.5">Uncertainty bands widen over time, so engineers act when the lower bound of RUL falls within the maintenance planning window, balancing risk against operational continuity.</Panel>
        </div>
        <Panel className="flex flex-col">
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
            <label className="text-[0.84rem] text-mute">Move “now” along the asset's life<input type="range" min={10} max={70} value={now} onChange={(e) => setNow(Number(e.target.value))} aria-label="Current time" /></label>
            <label className="text-[0.84rem] text-mute">Maintenance planning window<input type="range" min={5} max={40} value={win} onChange={(e) => setWin(Number(e.target.value))} aria-label="Planning window" /></label>
            <span className={cx('rounded-xl border px-3 py-1.5 text-center text-[0.88rem] font-semibold', act ? 'border-orange bg-orange/20 text-amber' : 'border-good/50 bg-good/10 text-good')}>{act ? 'Act now: plan the work' : 'Keep monitoring'}</span>
          </div>
          <div className="mt-2 h-[21rem]">
            <ResponsiveContainer>
              <ComposedChart data={data} margin={{ top: 12, right: 14, left: 0, bottom: 16 }}>
                <Grid />
                <XAxis dataKey="t" type="number" domain={[0, 100]} {...axis} tick={false} label={{ value: 'Time →', fill: '#A6ADB7', fontSize: '0.8rem', position: 'insideBottom', offset: -8 }} />
                <YAxis domain={[0, 100]} {...axis} tick={false} width={26} label={{ value: 'Condition', angle: -90, fill: '#A6ADB7', fontSize: '0.8rem' }} />
                <ReferenceArea x1={now} x2={Math.min(100, now + win)} fill="var(--color-orange)" fillOpacity={0.09} label={{ value: 'Planning window', fill: 'var(--color-amber)', fontSize: '0.78rem', position: 'insideTop' }} />
                <ReferenceLine y={failThreshold} stroke="#ff5a47" strokeDasharray="5 4" label={{ value: 'Failure', fill: '#ff8b7c', fontSize: '0.78rem', position: 'insideBottomLeft' }} />
                <ReferenceLine x={now} stroke="#F5F5F5" strokeOpacity={0.55} label={{ value: 'Now', fill: '#F5F5F5', fontSize: '0.78rem', position: 'insideTopRight' }} />
                <ReferenceLine x={lower} stroke="var(--color-amber)" strokeDasharray="3 3" label={{ value: 'RUL lower bound', fill: 'var(--color-amber)', fontSize: '0.74rem', position: 'insideBottomRight' }} />
                <Area dataKey="band" stroke="none" fill="var(--color-cool)" fillOpacity={0.18} isAnimationActive={false} name="Confidence interval" connectNulls={false} />
                <Line dataKey="actual" stroke="var(--color-orange)" strokeWidth={2.4} dot={false} isAnimationActive={false} name="Tracked condition" connectNulls={false} />
                <Line dataKey="proj" stroke="var(--color-cool)" strokeWidth={2} strokeDasharray="6 5" dot={false} isAnimationActive={false} name="Projection" connectNulls={false} />
                <Legend wrapperStyle={legendStyle} verticalAlign="top" height={24} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </Slide>
  )
}

/* ---------- 15. Alert to safe action ---------- */
const ACTION = [
  { k: 'Validate the signal', t: 'rule out sensor noise or false positives.', i: ScanSearch },
  { k: 'Assess criticality', t: 'determine urgency and failure risk.', i: ShieldAlert },
  { k: 'Inspect', t: 'perform targeted physical or remote checks.', i: Search },
  { k: 'Plan resources', t: 'schedule technicians, parts, and downtime.', i: ClipboardCheck },
  { k: 'Isolate equipment', t: 'safely lock out before intervention.', i: Lock },
  { k: 'Repair or replace', t: 'execute the corrective action.', i: Wrench },
  { k: 'Verify and restore', t: 'confirm resolution and resume monitoring.', i: Check },
]
function S15() {
  const r = useRunner(7, 900)
  return (
    <Slide kicker="From Alert to Safe Action" title="A Structured Response Workflow" tag={<RunButton running={r.running} onClick={r.run} label="Run the response" />}>
      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="relative flex flex-col gap-1.5">
          {ACTION.map(({ k, t, i: I }, x) => (
            <Panel key={k} hot={x === r.index} onClick={() => r.select(x)} className={cx('flex items-center gap-3 !py-2', x <= r.index && 'border-line')}>
              <span className={cx('num grid h-8 w-8 shrink-0 place-items-center rounded-full border font-display text-[0.92rem] font-bold', x <= r.index ? 'border-orange bg-orange text-black' : 'border-line text-amber')}>{x + 1}</span>
              <I className="h-5 w-5 shrink-0 text-amber" strokeWidth={1.6} />
              <p className="text-[1.06rem] leading-tight"><span className="font-semibold">{k}</span> <span className="text-mute">— {t}</span></p>
            </Panel>
          ))}
        </div>
        <Photo src="/img/s1-15.webp" alt="Technician in safety gear reviewing a tablet beside open equipment" className="min-h-[16rem] lg:h-[27rem]" pos="60% 50%" />
      </div>
    </Slide>
  )
}

/* ---------- 16. Sectors ---------- */
const SECTORS = [
  { k: 'Manufacturing', i: Factory, img: 's1-16-manufacturing', t: 'Monitors CNC machines, conveyor belts, and robotic arms to prevent unplanned stoppages on the production floor.' },
  { k: 'Energy', i: Wind, img: 's1-16-energy', t: 'Detects bearing wear in wind turbines and pump degradation in oil & gas pipelines before failure occurs.' },
  { k: 'Transport', i: TrainFront, img: 's1-16-transport', t: 'Tracks engine health, brake wear, and axle vibration in rail fleets and commercial vehicle fleets.' },
  { k: 'Facilities', i: Building2, img: 's4-20', t: 'Optimises HVAC compressors, elevators, and chillers in smart buildings to cut energy waste.' },
  { k: 'Agriculture', i: Tractor, img: 's1-16-agriculture', t: 'Monitors tractor drivetrains and irrigation pumps during critical harvest windows to avoid costly downtime.' },
]
function S16() {
  const { active, select } = useAutoSelect(5, 3000)
  return (
    <Slide kicker="Industry Applications" title="Predictive Maintenance Across Sectors">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {SECTORS.map(({ k, i: I, img, t }, x) => (
          <motion.button key={k} type="button" aria-pressed={x === active} onClick={() => select(x)} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className={cx('glass lift flex flex-col overflow-hidden rounded-2xl text-left lg:h-[27.5rem]', x === active && 'hot')}>
            <div className={cx('photo w-full shrink-0 transition-all duration-300', x === active ? 'h-[13.5rem]' : 'h-[9rem]')}><img src={`${import.meta.env.BASE_URL}img/${img}.webp`} alt={`${k} equipment`} loading="lazy" /></div>
            <div className="p-3">
              <div className="flex items-center gap-2"><I className="h-5 w-5 text-amber" strokeWidth={1.6} /><span className="font-display text-[1.14rem] font-semibold">{k}</span></div>
              <p className="mt-1.5 text-[0.98rem] leading-snug text-ink/85">{t}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </Slide>
  )
}

/* ---------- 17. Benefits and trade-offs ---------- */
const BEN = ['Improved equipment reliability and asset lifespan', 'reduced unplanned downtime', 'optimized maintenance scheduling', 'lower spare-parts inventory', 'enhanced worker safety']
const TRD = ['Upfront sensor and infrastructure costs can be significant', 'model development requires clean, labeled data and domain expertise', 'false positives waste resources while false negatives risk failures', 'integration with legacy systems adds complexity', 'ongoing model maintenance demands skilled personnel']
function BalanceRow({ s, kind, on, toggle }: { s: string; kind: 'b' | 't'; on: boolean; toggle: () => void }) {
  return (
    <button type="button" aria-pressed={on} onClick={toggle} className={cx('glass lift flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[0.98rem] leading-snug', on && (kind === 'b' ? 'border-good/60 bg-good/10' : 'hot'))}>
      <span className={cx('grid h-5 w-5 shrink-0 place-items-center rounded-md border', on ? (kind === 'b' ? 'border-good bg-good text-black' : 'border-orange bg-orange text-black') : 'border-hair')}>{on && <Check className="h-3.5 w-3.5" />}</span><span className="first-letter:uppercase">{s}</span>
    </button>
  )
}
function S17() {
  const [on, setOn] = useState<Record<string, boolean>>({})
  const b = BEN.filter((x) => on[x]).length; const t = TRD.filter((x) => on[x]).length
  const tilt = Math.max(-9, Math.min(9, (t - b) * 3))
  return (
    <Slide kicker="Benefits & Trade-offs" title="Balance Expected Gains Against Practical Constraints">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr_1fr]">
        <Rise className="flex flex-col gap-1.5"><div className="font-display text-[1.2rem] font-bold text-good">Benefits</div>{BEN.map((s) => <BalanceRow key={s} s={s} kind="b" on={!!on[s]} toggle={() => setOn((o) => ({ ...o, [s]: !o[s] }))} />)}</Rise>
        <Rise className="flex flex-col items-center justify-center text-center">
          <svg viewBox="0 0 200 120" className="w-full max-w-[17rem]" role="img" aria-label="Balance beam tilting with selected items">
            <path d="M100 42 84 112h32z" fill="#2a3038" stroke="color-mix(in srgb, var(--color-orange) 50%, transparent)" />
            <motion.g animate={{ rotate: tilt }} transition={{ type: 'spring', stiffness: 80, damping: 11 }} style={{ originX: '100px', originY: '42px' }}>
              <rect x="14" y="39" width="172" height="6" rx="3" fill="var(--color-orange)" />
              <circle cx="24" cy="42" r="11" fill="rgba(78,209,138,.25)" stroke="#4ed18a" /><text x="24" y="46.5" fontSize="12" textAnchor="middle" fill="#F5F5F5" fontWeight="700">{b}</text>
              <circle cx="176" cy="42" r="11" fill="color-mix(in srgb, var(--color-orange) 25%, transparent)" stroke="var(--color-orange)" /><text x="176" y="46.5" fontSize="12" textAnchor="middle" fill="#F5F5F5" fontWeight="700">{t}</text>
            </motion.g>
            <circle cx="100" cy="42" r="5" fill="var(--color-amber)" />
          </svg>
          <p className="mt-1 text-[0.84rem] text-mute">Tap items that apply to your site to see the beam move.</p>
          <p className="mt-3 rounded-xl border border-line bg-orange/10 p-3 text-[1rem] leading-snug font-medium">Weigh ROI carefully against organizational readiness before scaling deployment.</p>
        </Rise>
        <Rise className="flex flex-col gap-1.5"><div className="font-display text-[1.2rem] font-bold text-amber">Trade-offs</div>{TRD.map((s) => <BalanceRow key={s} s={s} kind="t" on={!!on[s]} toggle={() => setOn((o) => ({ ...o, [s]: !o[s] }))} />)}</Rise>
      </div>
      <Photo src="/img/s1-17.webp" alt="Machine tool with monitoring screen" className="mt-3 h-[5.8rem]" pos="50% 42%" />
    </Slide>
  )
}

/* ---------- 18. Risks ---------- */
const RISKS = [
  { k: 'Data quality', i: Database, t: 'validate and clean sensor streams.' },
  { k: 'False alarms', i: AlertTriangle, t: 'tune thresholds and use multi-signal confirmation.' },
  { k: 'Connectivity', i: Radio, t: 'deploy edge buffering for resilience.' },
  { k: 'Cybersecurity', i: Shield, t: 'encrypt OT/IT traffic and enforce access controls.' },
  { k: 'Integration', i: Network, t: 'use open APIs and middleware adapters.' },
  { k: 'Workforce skills', i: Users, t: 'invest in training and change management.' },
  { k: 'Validation', i: ClipboardCheck, t: 'maintain labelled failure datasets for model audits.' },
  { k: 'Governance', i: Scale, t: 'define ownership, escalation paths, and review cycles.' },
]
function S18() {
  return (
    <Slide kicker="Risks & Mitigation" title="Identifying Barriers and Controls">
      <div className="grid gap-3 lg:grid-cols-[2.4fr_1fr]">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {RISKS.map(({ k, i: I, t }) => (
            <Panel key={k} className="lift group !p-3">
              <div className="flex items-center gap-2.5"><IconBadge icon={I} className="transition-colors group-hover:bg-orange group-hover:text-black" /><div className="font-display text-[1.1rem] font-semibold">{k}</div></div>
              <div className="mt-2 flex items-start gap-1.5 text-[1rem] leading-snug text-ink/85"><ArrowRight className="mt-[0.2rem] h-4 w-4 shrink-0 text-orange" />{t}</div>
            </Panel>
          ))}
        </div>
        <Photo src="/img/s1-18.webp" alt="Analyst at a multi-monitor monitoring station" className="min-h-[14rem]" />
      </div>
    </Slide>
  )
}

/* ---------- 19. Roadmap ---------- */
const ROAD = [
  { k: 'Select critical assets', t: 'prioritise by failure impact and data availability.' },
  { k: 'Define failure modes', t: 'map fault signatures for each asset class.' },
  { k: 'Instrument equipment', t: 'install sensors and establish data pipelines.' },
  { k: 'Establish baselines', t: 'capture healthy-state signatures.' },
  { k: 'Pilot', t: 'validate models on a small asset group.' },
  { k: 'Integrate workflows', t: 'connect alerts to CMMS and maintenance teams.' },
  { k: 'Scale', t: 'roll out across plant or fleet.' },
  { k: 'Continuously improve', t: 'retrain models, refine thresholds, and track KPIs.' },
]
function S19() {
  const r = useRunner(8, 650)
  return (
    <Slide kicker="Implementation Roadmap" title="From Pilot to Full-Scale Deployment" tag={<RunButton running={r.running} onClick={r.run} label="Play roadmap" />}>
      <label className="sr-hidden" htmlFor="road">Roadmap position</label>
      <input id="road" type="range" min={0} max={7} value={r.index} onChange={(e) => r.select(Number(e.target.value))} />
      <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {ROAD.map(({ k, t }, x) => (
          <Panel key={k} hot={x === r.index} onClick={() => r.select(x)} className={cx('min-h-[8.4rem]', x <= r.index && 'glass-o')}>
            <div className="num font-display text-[1.7rem] leading-none font-bold text-amber">{String(x + 1).padStart(2, '0')}</div>
            <div className="mt-1.5 font-display text-[1.06rem] font-semibold">{k}</div>
            <p className="mt-1 text-[0.96rem] leading-snug text-mute">{t}</p>
          </Panel>
        ))}
      </div>
      <Photo src="/img/s1-19.webp" alt="Two people studying a process diagram on a large screen" className="mt-3 h-[7.2rem]" pos="50% 62%" />
    </Slide>
  )
}

/* ---------- 20. Case study ---------- */
function S20() {
  const [wk, setWk] = useState(3)
  const stats = [
    { v: '8 mm/s', l: 'RMS rising vibration', i: Activity },
    { v: '+22°C', l: 'bearing temperature above baseline', i: Thermometer },
    { v: '3 weeks', l: 'trend period', i: Timer },
    { v: '14×', l: 'estimated unplanned-failure cost vs repair cost', i: DollarSign },
  ]
  return (
    <Slide kicker="Motor & Pump Case Study" title="Lessons from the Field" tag={<Tag kind="deck" label="Figures quoted from source deck" />}>
      <div className="grid gap-4 lg:grid-cols-[1.75fr_1fr]">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {stats.map(({ v, l, i: I }) => <Panel key={l} className="!p-3"><I className="h-5 w-5 text-amber" strokeWidth={1.6} /><div className="num mt-1 font-display text-[1.7rem] leading-none font-bold">{v}</div><div className="mt-1 text-[0.82rem] leading-tight text-mute">{l}</div></Panel>)}
          </div>
          <Panel className="!py-2.5 text-[1rem] leading-snug">A centrifugal pump motor showed rising vibration (8 mm/s RMS) and bearing temperature (+22°C above baseline) over 3 weeks. Anomaly detection flagged the trend; inspection confirmed early-stage bearing wear. A planned replacement was scheduled during a routine shutdown — avoiding an unplanned failure estimated at 14× the repair cost.</Panel>
          <Panel className="!py-2.5">
            <div className="font-display font-semibold">Sequence of events</div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-4">
              {['Trend rises over 3 weeks', 'Anomaly detection flags it', 'Inspection confirms wear', 'Replacement during shutdown'].map((s, i) => (
                <button key={s} type="button" aria-pressed={wk === i} onClick={() => setWk(i)} className={cx('rounded-lg border px-2.5 py-1.5 text-left text-[0.88rem] leading-tight', i <= wk ? 'border-orange/70 bg-orange/10' : 'border-hair')}><span className="num mr-1 font-bold text-amber">{i + 1}</span>{s}</button>
              ))}
            </div>
          </Panel>
          <Panel orange className="!py-2.5 text-[1rem] leading-snug"><span className="font-semibold text-amber">Key lessons:</span> early trending beats reactive response, sensor fusion improves confidence, and documented baselines are essential for accurate anomaly detection.</Panel>
        </div>
        <Photo src="/img/s1-20.webp" alt="Centrifugal pump and motor assembly" className="min-h-[16rem] lg:h-[26rem]" />
      </div>
    </Slide>
  )
}

/* ---------- 21. Close ---------- */
function S21() {
  const kpis = [['Uptime', Timer], ['MTBF', Gauge], ['Cost', DollarSign], ['Precision', ScanSearch]] as const
  return (
    <div className="relative grid min-h-full place-items-center text-center">
      <div aria-hidden className="absolute inset-x-0 top-1/3 opacity-30"><Wave seed={1.4} className="h-28 w-full" /></div>
      <Stagger className="relative">
        <Rise><h1 className="font-display text-[5rem] leading-none font-bold tracking-tight lg:text-[6.8rem]">THANK<span className="text-orange">YOU</span></h1></Rise>
        <Rise className="kicker mt-6">KPIs: Uptime · MTBF · Cost · Precision</Rise>
        <div className="mt-3 flex flex-wrap justify-center gap-2.5">
          {kpis.map(([l, I]) => <Panel key={l} className="lift flex w-[9rem] flex-col items-center !py-3"><I className="h-6 w-6 text-amber" strokeWidth={1.5} /><span className="mt-1 font-display font-semibold">{l}</span></Panel>)}
        </div>
        <Rise><p className="mx-auto mt-6 max-w-[42rem] text-[1.4rem] leading-snug">Start with a critical asset, trustworthy data & a safe action workflow.</p></Rise>
      </Stagger>
    </div>
  )
}

export default [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21]
