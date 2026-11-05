import { motion } from 'framer-motion'
import { useState } from 'react'
import { Activity, ArrowRight, Binary, BrainCircuit, Check, CircleGauge, Cloud, Cpu, Database, Factory, FlaskConical, Gauge, GitMerge, LayoutDashboard, Minus, Plus, Radio, Search, ShieldCheck, Target, Thermometer, TrendingUp, Volume2, Wrench, Zap } from 'lucide-react'
import { Line, LineChart } from 'recharts'
import { Flow, Panel, Photo, Rise, Slide, Stagger, Tag, useAutoSelect, useRunner, RunButton, Wave, cx, Sr } from '../ui/kit'
import { axis, ChartTip, Grid, Legend, legendStyle, ResponsiveContainer, SERIES, Tooltip, XAxis, YAxis } from '../ui/charts'

/* 1 */
function S1() {
  const [name, setName] = useState(() => { try { return localStorage.getItem('pdm-presenter') ?? '' } catch { return '' } })
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Stagger>
        <Rise className="kicker">An engineering systems perspective</Rise>
        <Rise><h1 className="mt-3 font-display text-[3.2rem] leading-[1.02] font-bold tracking-tight lg:text-[3.9rem]">Convergence and<br />Divergence in<br /><span className="grad-text">Predictive Maintenance</span></h1></Rise>
        <Rise className="mt-5 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-[0.84rem] font-semibold tracking-widest text-mute">PRESENTER
            <input type="text" aria-label="Presenter name" value={name} placeholder="____________________" className="!w-[15rem]" onChange={(e) => { setName(e.target.value); try { localStorage.setItem('pdm-presenter', e.target.value) } catch { /* blocked */ } }} />
          </label>
          <span className="kicker">NOV 5, 2026</span>
        </Rise>
      </Stagger>
      <Photo src="/img/s6-01.webp" alt="Dimly lit plant with pumps and pipework" className="h-[22rem] lg:h-[32rem]" />
    </div>
  )
}

/* 2 */
function S2() {
  const obj = ['Understand maintenance fundamentals and predictive workflows', 'Explore technology convergence across the stack', 'Examine divergence by asset, failure mode and strategy', 'Apply concepts to a motor/pump and ESP32 prototype']
  const road = ['Maintenance Fundamentals', 'Convergence Concepts', 'Divergence Concepts', 'Use Case & Architecture', 'Prototype & Roadmap']
  return (
    <Slide title="Learning objectives & roadmap">
      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col gap-2.5">{obj.map((o, i) => <Panel key={o} className="flex items-center gap-3"><span className="num font-display text-[1.7rem] font-bold text-orange">0{i + 1}</span><span className="text-[1.15rem] leading-snug">{o}</span></Panel>)}</div>
        <div className="relative flex flex-col gap-2">{road.map((r, i) => <Rise key={r}><div className={cx('lift flex items-center gap-3 rounded-xl border px-4 py-3 font-display text-[1.14rem] font-semibold', i === 4 ? 'border-cool bg-cool/15' : 'border-line bg-orange/10')}><span className="num text-amber">{i + 1}</span>{r}</div></Rise>)}</div>
      </div>
    </Slide>
  )
}

/* 3 */
function S3() {
  const v = [['Operational reliability', Gauge], ['Production efficiency', Factory], ['Safety & lifecycle value', ShieldCheck]] as const
  return (
    <Slide title="Maintenance keeps assets useful—and people safe">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-3">
          <Panel orange><div className="font-display text-[1.9rem] font-bold text-orange">Maintenance</div><p className="mt-1 text-[1.3rem] leading-snug">Activities performed to preserve or restore an asset’s required functionality.</p></Panel>
          {v.map(([k, I]) => <Panel key={k} className="lift flex items-center gap-3"><I className="h-7 w-7 text-amber" strokeWidth={1.4} /><span className="font-display text-[1.25rem] font-semibold">{k}</span></Panel>)}
        </div>
        <Photo src="/img/s6-03.webp" alt="Technician checking a blue motor with a handheld instrument" className="h-[20rem] lg:h-[26rem]" pos="50% 25%" />
      </div>
    </Slide>
  )
}

/* 4 */
function S4() {
  const st = [
    { k: 'REACTIVE', a: 'Fix after failure', p: 'Low planning effort', m: 'High downtime & risk' },
    { k: 'PREVENTIVE', a: 'Service on schedule', p: 'Predictable work', m: 'May replace healthy parts' },
    { k: 'PREDICTIVE', a: 'Act on condition', p: 'Fewer surprises', m: 'Needs data & skills' },
  ]
  const [v, setV] = useState(58)
  const zone = v < 40 ? 'Too early: remaining life is wasted' : v > 78 ? 'Too late: failure risk is high' : 'Inside the intervention window'
  return (
    <Slide title="Three maintenance logics, three risk profiles">
      <div className="grid gap-3 lg:grid-cols-3">
        {st.map((s, i) => <Panel key={s.k} className={cx('lift', i === 2 && 'hot glass-o')}><div className="font-display text-[1.32rem] font-bold">{s.k}</div><div className="mt-0.5 text-[1.12rem] text-amber">{s.a}</div><div className="mt-2.5 flex items-center gap-2"><Plus className="h-4 w-4 text-good" />{s.p}</div><div className="mt-1 flex items-center gap-2"><Minus className="h-4 w-4 text-[#ff8a8e]" />{s.m}</div></Panel>)}
      </div>
      <Rise className="glass mt-3 rounded-2xl p-4">
        <p className="font-display text-[1.32rem] leading-tight font-semibold">Predictive maintenance targets the intervention window: not too early, not too late.</p>
        <div className="relative mt-3 h-6 overflow-hidden rounded-full" style={{ background: 'linear-gradient(90deg,#5aa7ff 0%,#5aa7ff 38%,#2fe39a 42%,#2fe39a 76%,#ff5a5f 82%)' }}><span className="absolute top-0 h-full w-1 bg-white" style={{ left: `${v}%` }} /></div>
        <input type="range" aria-label="Intervention timing" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} className="mt-1" />
        <div className="text-[0.98rem] font-medium">{zone} <span className="text-[0.76rem] text-dim">(illustrative scale)</span></div>
      </Rise>
    </Slide>
  )
}

/* 5 */
function S5() {
  const st = [{ label: 'Acquire', desc: 'Sensors', icon: Activity }, { label: 'Transmit', desc: 'IIoT', icon: Radio }, { label: 'Process', desc: 'Edge / cloud', icon: Cpu }, { label: 'Analyze', desc: 'AI / ML', icon: BrainCircuit }, { label: 'Act', desc: 'Work order', icon: Wrench }]
  const r = useRunner(5, 850)
  return (
    <Slide title="Predictive maintenance is a closed decision loop" tag={<RunButton running={r.running} onClick={r.run} />}>
      <div className="min-h-[12rem]"><Flow steps={st} active={r.index} onSelect={r.select} /></div>
      <Rise className="mt-6 text-center font-display text-[1.8rem] font-semibold"><span>Condition data</span><span className="mx-2 text-orange">→</span><span>evidence</span><span className="mx-2 text-orange">→</span><span>timely intervention</span></Rise>
    </Slide>
  )
}

/* 6 */
const HUB = [
  { k: 'Sensors', i: Activity, d: 'Capture vibration, temperature, current, pressure and acoustics.' },
  { k: 'IIoT', i: Radio, d: 'Carries signals through gateways using protocols such as MQTT.' },
  { k: 'AI / ML', i: BrainCircuit, d: 'Detects, diagnoses and forecasts from condition data.' },
  { k: 'Digital Twin', i: GitMerge, d: 'Keeps engineering context attached so teams can test scenarios.' },
  { k: 'Edge / Cloud', i: Cloud, d: 'Places computation where it creates the most value.' },
]
function S6() {
  const { active, select } = useAutoSelect(5, 2000)
  const R = 40
  return (
    <Slide title="Convergence turns components into a maintenance system">
      <div className="grid items-center gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Rise className="relative mx-auto aspect-[1.35] w-full max-w-[36rem]">
          <svg viewBox="0 0 135 100" className="absolute inset-0 h-full w-full" aria-hidden>
            {HUB.map((h, i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; const x = 67.5 + R * 1.35 * Math.cos(a); const y = 50 + R * Math.sin(a); return <g key={h.k}><path d={`M${x} ${y}L67.5 50`} stroke={i === active ? 'var(--color-orange)' : 'rgba(255,255,255,.2)'} strokeWidth=".5" className={i === active ? 'flow-dash' : ''} /><circle r=".9" fill="var(--color-amber)"><animateMotion dur="1.9s" begin={`-${i * 0.3}s`} repeatCount="indefinite" path={`M${x} ${y}L67.5 50`} /></circle></g> })}
          </svg>
          <div className="absolute inset-0 grid place-items-center"><div className="grid h-[7.4rem] w-[9.5rem] place-items-center rounded-2xl border-2 border-orange bg-[color-mix(in_srgb,var(--color-orange)_18%,#0b1020)] text-center font-display text-[1.08rem] leading-tight font-bold shadow-[0_0_2rem_color-mix(in_srgb,var(--color-orange)_40%,transparent)]">PREDICTIVE<br />MAINTENANCE</div></div>
          {HUB.map(({ k, i: I }, i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return <button key={k} type="button" aria-pressed={i === active} onClick={() => select(i)} style={{ left: `${(67.5 + R * 1.35 * Math.cos(a)) / 1.35}%`, top: `${50 + R * Math.sin(a)}%`, transform: 'translate(-50%,-50%)' }} className={cx('glass lift absolute flex w-[7.8rem] items-center justify-center gap-1.5 rounded-xl py-2 font-display text-[0.94rem] font-semibold', i === active && 'hot glass-o')}><I className="h-4 w-4 text-amber" />{k}</button> })}
        </Rise>
        <Panel orange><motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><div className="font-display text-[1.6rem] font-bold">{HUB[active].k}</div><p className="mt-2 text-[1.14rem] leading-snug">{HUB[active].d}</p></motion.div><div className="mt-3 border-t border-hair pt-1 text-[0.74rem] text-dim">Short descriptions added from the deck’s following slides.</div></Panel>
      </div>
    </Slide>
  )
}

/* 7 */
function S7() {
  const s = [['Vibration', Activity], ['Temperature', Thermometer], ['Current', Zap], ['Pressure', Gauge], ['Acoustic', Volume2]] as const
  return (
    <Slide title="Sensors create the industrial nervous system">
      <div className="grid items-center gap-3 lg:grid-cols-[1fr_1fr_0.2fr_0.8fr]">
        <Photo src="/img/s6-07.webp" alt="Motor fitted with a sensor box" className="h-[18rem] lg:h-[24rem]" />
        <div className="flex flex-col gap-2">{s.map(([k, I], i) => <Panel key={k} className="flex items-center gap-2 !py-2"><I className="h-5 w-5 shrink-0 text-amber" /><span className="w-[6.5rem] shrink-0 font-display font-semibold">{k}</span><Wave seed={i + 1.2} amp={0.8} className="h-8 min-w-0 flex-1" speed={2 + i * 0.5} /></Panel>)}</div>
        <div className="hidden justify-center lg:flex"><ArrowRight className="h-8 w-8 text-orange" /></div>
        <Panel orange className="text-center"><Radio className="mx-auto h-9 w-9 text-amber" strokeWidth={1.4} /><div className="mt-2 font-display text-[1.32rem] font-bold">IIoT GATEWAY</div><div className="mt-1 text-[1.04rem] text-mute">MQTT • wireless</div></Panel>
      </div>
    </Slide>
  )
}

/* 8 */
function S8() {
  const [a, setA] = useState(1)
  const t = [{ k: 'SENSORS', d: 'Raw, high-frequency signals', i: Activity }, { k: 'EDGE', d: 'Filter • features • fast alarms', i: Cpu }, { k: 'CLOUD', d: 'Fleet analytics • storage • model training', i: Cloud }]
  return (
    <Slide title="Place computation where it creates the most value">
      <div className="grid gap-2 lg:grid-cols-3">{t.map(({ k, d, i: I }, i) => <Panel key={k} hot={a === i} onClick={() => setA(i)} className={cx('min-h-[10rem]', a === i && 'glass-o')}><I className="h-8 w-8 text-amber" strokeWidth={1.4} /><div className="mt-2 font-display text-[1.42rem] font-bold">{k}</div><div className="mt-1 text-[1.1rem] leading-snug">{d}</div></Panel>)}</div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Panel className={cx(a === 1 && 'hot')}><div className="font-display text-[1.14rem] font-bold text-amber">EDGE PRIORITY</div><p className="mt-1 text-[1.1rem] leading-snug">Latency, bandwidth, resilience and local safety context.</p></Panel>
        <Panel className={cx(a === 2 && 'hot')}><div className="font-display text-[1.14rem] font-bold text-amber">CLOUD PRIORITY</div><p className="mt-1 text-[1.1rem] leading-snug">Long horizons, cross-asset learning and scalable compute.</p></Panel>
      </div>
    </Slide>
  )
}

/* 9 */
const TREND = [[2.1, 0.1], [2.2, 0.1], [2.3, 0.2], [2.5, 0.2], [2.8, 0.3], [3.2, 0.5], [4.1, 0.8], [5.4, 0.95]].map(([a, b], i) => ({ t: i + 1, 'Vibration RMS': a, 'Anomaly score': b }))
function S9() {
  const a = [{ k: 'DETECT', d: 'Anomaly detection', i: Search }, { k: 'DIAGNOSE', d: 'Failure classification', i: Binary }, { k: 'FORECAST', d: 'Remaining Useful Life', i: TrendingUp }]
  const { active, select } = useAutoSelect(3, 2200)
  return (
    <Slide title="AI/ML converts condition signals into foresight" tag={<Tag kind="illustrative" label="Illustrative condition trend" />}>
      <div className="grid gap-3 lg:grid-cols-[1.75fr_1fr]">
        <Panel>
          <div className="font-display font-semibold">Illustrative condition trend</div>
          <div className="mt-1 h-[21rem]">
            <ResponsiveContainer>
              <LineChart data={TREND} margin={{ top: 8, right: 14, left: 0, bottom: 0 }}><Grid /><XAxis dataKey="t" {...axis} /><YAxis domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5, 6]} tickFormatter={(v) => `${v} mm/s`} {...axis} width={56} /><Tooltip content={<ChartTip />} cursor={{ stroke: 'rgba(255,255,255,.2)' }} /><Legend wrapperStyle={legendStyle} verticalAlign="top" height={24} />
                <Line dataKey="Vibration RMS" stroke={SERIES.a} strokeWidth={2.6} dot={{ r: 4, fill: SERIES.a }} animationDuration={700} />
                <Line dataKey="Anomaly score" stroke={SERIES.b} strokeWidth={2.6} dot={{ r: 4, fill: SERIES.b }} animationDuration={700} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[0.74rem] text-dim">Values read from the chart in the source deck, which plots both series on one axis.</div>
        </Panel>
        <div className="flex flex-col gap-2.5">{a.map(({ k, d, i: I }, i) => <Panel key={k} hot={active === i} onClick={() => select(i)} className={cx('flex-1', active === i && 'glass-o')}><I className="h-6 w-6 text-amber" strokeWidth={1.5} /><div className="mt-1 font-display text-[1.3rem] font-bold">{k}</div><div className="text-[1.06rem] text-mute">{d}</div></Panel>)}</div>
      </div>
    </Slide>
  )
}

/* 10 */
function S10() {
  const st = [{ label: 'PHYSICAL ASSET', desc: 'Live condition', icon: Factory }, { label: 'DIGITAL TWIN', desc: 'Simulate • compare', icon: GitMerge }, { label: 'DECISION', desc: 'Alert • prioritize • schedule', icon: Target }]
  const { active, select } = useAutoSelect(3, 1900)
  return (
    <Slide title="Insights matter only when they change a decision">
      <Flow steps={st} active={active} onSelect={select} className="min-h-[11rem]" />
      <Panel orange className="mt-5"><p className="text-[1.3rem] leading-snug">A virtual replica keeps engineering context attached to sensor data—so teams can test scenarios before dispatching work.</p></Panel>
    </Slide>
  )
}

/* 11 */
function S11() {
  const [a, setA] = useState(0)
  const b = [{ k: 'ASSET', y: 16 }, { k: 'FAILURE MODE', y: 50 }, { k: 'CRITICALITY', y: 84 }]
  return (
    <Slide title="Divergence is not fragmentation—it is fit-for-purpose design">
      <Rise className="relative h-[24rem]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>{b.map((x, i) => <path key={x.k} d={`M36 50C50 50 52 ${x.y} 66 ${x.y}`} fill="none" stroke={a === i ? 'var(--color-orange)' : 'rgba(255,255,255,.25)'} strokeWidth="2" vectorEffect="non-scaling-stroke" className={a === i ? 'flow-dash' : ''} />)}</svg>
        <div className="absolute top-1/2 left-0 w-[35%] -translate-y-1/2 rounded-2xl border-2 border-cool bg-cool/15 p-5"><div className="font-display text-[1.5rem] font-bold">COMMON PLATFORM</div><div className="mt-1 text-[1.15rem] text-ink/85">Shared data backbone</div></div>
        {b.map((x, i) => <button key={x.k} type="button" aria-pressed={a === i} onClick={() => setA(i)} style={{ top: `${x.y}%` }} className={cx('glass lift absolute right-0 w-[34%] -translate-y-1/2 rounded-xl p-4 text-left font-display text-[1.3rem] font-bold', a === i && 'hot glass-o')}>{x.k}</button>)}
      </Rise>
    </Slide>
  )
}

/* 12 */
function S12() {
  const a = [{ k: 'MOTOR', d: 'Bearing wear', s: 3, amp: 1.2 }, { k: 'PUMP', d: 'Cavitation', s: 5.5, amp: 0.8 }, { k: 'VALVE', d: 'Leakage / stiction', s: 0.8, amp: 0.45 }]
  const { active, select } = useAutoSelect(3, 2300)
  return (
    <Slide title="Different assets fail in different signatures">
      <Photo src="/img/s6-12.webp" alt="Motor, pump and valve side by side" className="h-[11rem]" />
      <div className="mt-3 grid gap-3 lg:grid-cols-3">{a.map((x, i) => <Panel key={x.k} hot={active === i} onClick={() => select(i)} className={cx(active === i && 'glass-o')}><div className="font-display text-[1.3rem] font-bold">{x.k}</div><div className="text-[1.12rem] text-amber">{x.d}</div><Wave seed={x.s} amp={x.amp} className="mt-2 h-14 w-full" speed={3} /><div className="text-[0.72rem] text-dim">Stylised trace, not measured data</div></Panel>)}</div>
    </Slide>
  )
}

/* 13 */
const COLS = ['VIBRATION', 'TEMP.', 'CURRENT', 'PRESSURE', 'ACOUSTIC']
const ROWS = [['Motor', 'High-rate', 'Slow', 'Medium', '—', 'Optional'], ['Pump', 'High-rate', 'Slow', 'Medium', 'Medium', 'Useful'], ['Valve', 'Event', 'Slow', '—', 'High', 'Useful']]
function S13() {
  const [r, setR] = useState(0)
  const tone = (v: string) => (v === 'High-rate' || v === 'High' ? 'bg-orange text-black font-semibold' : v === '—' ? 'text-dim' : v === 'Medium' || v === 'Event' ? 'bg-orange/25' : 'bg-white/[.05]')
  return (
    <Slide title="Sensing strategy follows the failure hypothesis" tag={<span className="text-[0.84rem] text-mute">Select an asset to highlight its row</span>}>
      <Rise className="glass overflow-x-auto rounded-2xl p-3">
        <table className="w-full min-w-[38rem] border-separate border-spacing-1 text-center text-[1.08rem]">
          <thead><tr><th scope="col" className="kicker p-2 text-left">ASSET</th>{COLS.map((c) => <th key={c} scope="col" className="kicker p-2">{c}</th>)}</tr></thead>
          <tbody>{ROWS.map((row, i) => (
            <tr key={row[0]} className={cx(r !== i && 'opacity-55', 'transition-opacity')}>
              <th scope="row" className="p-0"><button type="button" aria-pressed={r === i} onClick={() => setR(i)} className={cx('w-full rounded-lg border px-3 py-3.5 text-left font-display font-bold', r === i ? 'border-orange bg-orange/25' : 'border-hair')}>{row[0]}</button></th>
              {row.slice(1).map((v, k) => <td key={k} className={cx('rounded-lg px-2 py-3.5', tone(v))}>{v}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </Rise>
      <Panel orange className="mt-3"><p className="font-display text-[1.3rem] leading-tight font-semibold">Sampling rate, placement and context are part of the model—not an afterthought.</p></Panel>
    </Slide>
  )
}

/* 14 */
function S14() {
  const l = [['01', 'THRESHOLD', 'Transparent, fast; best with known limits.'], ['02', 'ANOMALY', 'Finds departures when labels are scarce.'], ['03', 'CLASSIFY', 'Names known failure patterns.'], ['04', 'RUL', 'Estimates time-to-intervention.']]
  return (
    <Slide title="Choose the simplest analysis that answers the decision">
      <div className="flex flex-col gap-2.5">{l.map(([n, k, d], i) => <Rise key={k} style={{ marginLeft: `${i * 3.6}rem` }} className="max-lg:!ml-0"><div className="glass lift flex items-center gap-4 rounded-2xl p-4"><span className="num font-display text-[1.7rem] font-bold text-orange">{n}</span><span className="w-[9rem] shrink-0 font-display text-[1.32rem] font-bold">{k}</span><span className="text-[1.14rem] leading-snug text-ink/90">{d}</span></div></Rise>)}</div>
      <Rise className="mt-3 flex items-center gap-2 text-[0.92rem] text-mute"><CircleGauge className="h-4 w-4 text-amber" />Complexity and data needs grow down the list.</Rise>
    </Slide>
  )
}

/* 15 */
function S15() {
  const [c, setC] = useState<'HIGH' | 'LOW'>('HIGH'); const [f, setF] = useState<'HIGH' | 'LOW'>('HIGH')
  const crit = { HIGH: 'Conservative thresholds • redundancy • frequent review', LOW: 'Condition-based or reactive • low-cost sensing' }
  const risk = { HIGH: 'Earlier intervention • larger safety margin', LOW: 'Monitor trend • defer work when evidence is weak' }
  return (
    <Slide title="Criticality sets the maintenance posture" tag={<span className="text-[0.84rem] text-mute">Select one option in each row to set a posture</span>}>
      <div className="grid gap-3 sm:grid-cols-2">
        {(['HIGH', 'LOW'] as const).map((k) => <Panel key={k} hot={c === k} onClick={() => setC(k)} className="min-h-[8rem]"><div className="font-display text-[1.25rem] font-bold">{k} CRITICALITY</div><p className="mt-1 text-[1.1rem] leading-snug text-ink/90">{crit[k]}</p></Panel>)}
        {(['HIGH', 'LOW'] as const).map((k) => <Panel key={k} hot={f === k} onClick={() => setF(k)} className="min-h-[8rem]"><div className="font-display text-[1.25rem] font-bold">{k} FAILURE RISK</div><p className="mt-1 text-[1.1rem] leading-snug text-ink/90">{risk[k]}</p></Panel>)}
      </div>
      <Panel orange className="mt-3"><div className="kicker">Your posture</div><p data-testid="posture" className="mt-1 font-display text-[1.25rem] leading-tight font-semibold">{crit[c]}; {risk[f].toLowerCase()}</p></Panel>
    </Slide>
  )
}

/* 16 */
function S16() {
  const [v, setV] = useState(0)
  const views = [{ k: 'MOTOR VIEW', s: 'Vibration + current', f: 'Focus: bearing wear and imbalance' }, { k: 'PUMP VIEW', s: 'Vibration + pressure + temperature', f: 'Focus: cavitation and flow instability' }]
  return (
    <Slide title="Use case: one drivetrain, two tailored views">
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Photo src="/img/s6-16.webp" alt="Motor and pump drivetrain on a skid" className="h-[18rem] lg:h-[25rem]" />
        <div className="flex flex-col gap-3">{views.map((x, i) => <Panel key={x.k} hot={v === i} onClick={() => setV(i)} className={cx('flex-1', v === i && 'glass-o')}><div className="font-display text-[1.5rem] font-bold">{x.k}</div><div className="mt-2 text-[1.2rem] text-amber">{x.s}</div><div className="mt-1 text-[1.12rem]">{x.f}</div></Panel>)}</div>
      </div>
    </Slide>
  )
}

/* 17 */
function S17() {
  const n = [{ label: 'SENSORS', icon: Activity }, { label: 'ESP32 / EDGE', icon: Cpu }, { label: 'CLOUD', icon: Cloud }, { label: 'AI / ML', icon: BrainCircuit }, { label: 'DASHBOARD', icon: LayoutDashboard }, { label: 'ACTION', icon: Wrench }]
  const { active, select } = useAutoSelect(6, 1500)
  const [mode, setMode] = useState<'c' | 'd'>('c')
  return (
    <Slide title="End-to-end architecture: shared spine, adaptive edges">
      <Flow steps={n} active={active} onSelect={select} compact />
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Panel hot={mode === 'c'} onClick={() => setMode('c')} className={cx(mode === 'c' && 'glass-o')}><div className="font-display text-[1.5rem] font-bold text-orange">CONVERGENCE</div><p className="mt-1 flex items-center gap-2 text-[1.2rem]"><ArrowRight className="h-5 w-5 shrink-0 text-orange" />shared transport, identity, context and workflow</p></Panel>
        <Panel hot={mode === 'd'} onClick={() => setMode('d')} className={cx(mode === 'd' && 'glass-o')}><div className="font-display text-[1.5rem] font-bold text-cool">DIVERGENCE</div><p className="mt-1 flex items-center gap-2 text-[1.2rem]"><ArrowRight className="h-5 w-5 shrink-0 text-cool" />per-asset sensors, features, models and thresholds</p></Panel>
      </div>
      <Sr>CONVERGENCE → shared transport, identity, context and workflow. DIVERGENCE → per-asset sensors, features, models and thresholds.</Sr>
    </Slide>
  )
}

/* 18 */
function S18() {
  const f = ['Vibration, temperature and current sensing', 'Local feature extraction', 'Dashboard anomaly alerts', 'Modular, low-cost experimentation']
  return (
    <Slide title="A learning prototype makes the pipeline tangible">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-2.5">
          {f.map((x) => <Panel key={x} className="flex items-center gap-3"><Check className="h-5 w-5 shrink-0 text-orange" /><span className="text-[1.18rem]">{x}</span></Panel>)}
          <Panel orange><div className="flex items-center gap-2"><FlaskConical className="h-5 w-5 text-amber" /><span className="font-display text-[1.25rem] font-bold">LEARNING PROTOTYPE</span></div><p className="mt-1 text-[1.15rem] font-medium">Not industrial safety-rated</p></Panel>
        </div>
        <Photo src="/img/s6-18.webp" alt="ESP32 board with sensors and a laptop dashboard" className="h-[18rem] lg:h-[24rem]" />
      </div>
    </Slide>
  )
}

/* 19 */
function S19() {
  const st = [{ label: 'REFINE', desc: 'Calibrate & harden' }, { label: 'FIELD TEST', desc: 'Compare with baseline' }, { label: 'INTEGRATE', desc: 'Plan industrial interfaces' }]
  const r = useRunner(3, 1100)
  return (
    <Slide title="Prototype value grows through disciplined validation" tag={<RunButton running={r.running} onClick={r.run} label="Play path" />}>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel><div className="font-display text-[1.25rem] font-bold text-good">BENEFITS</div><p className="mt-1 text-[1.18rem]">Cost-effective • flexible • educational</p></Panel>
        <Panel><div className="font-display text-[1.25rem] font-bold text-[#ff8a8e]">LIMITATIONS</div><p className="mt-1 text-[1.18rem]">Sensor accuracy • robustness • prototype status</p></Panel>
      </div>
      <div className="mt-5"><Flow steps={st} active={r.index} onSelect={r.select} className="min-h-[9rem]" /></div>
    </Slide>
  )
}

/* 20 */
function S20() {
  const refs = ['ISO 13374 — Condition monitoring and diagnostics', 'ISO 17359 — General guidelines for condition monitoring', 'Jardine, Lin & Banjevic (2006) — Machinery diagnostics and prognostics', 'Lee et al. (2014) — Cyber-physical systems for manufacturing']
  return (
    <div className="grid min-h-full items-center">
      <Stagger>
        <Rise><h1 className="font-display text-[2.7rem] leading-[1.05] font-bold tracking-tight lg:text-[3.2rem]">Unify the platform. <span className="grad-text">Tailor the maintenance decision.</span></h1></Rise>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-3">
            <Rise className="rounded-2xl border border-orange bg-orange/15 p-5 font-display text-[2rem] leading-none font-bold"><span className="text-orange">CONVERGENCE</span><br />creates scale.</Rise>
            <Rise className="rounded-2xl border border-cool bg-cool/15 p-5 font-display text-[2rem] leading-none font-bold"><span className="text-cool">DIVERGENCE</span><br />creates fit.</Rise>
          </div>
          <div className="flex flex-col gap-3">
            <Panel className="text-[1.2rem] leading-snug">Effective predictive maintenance combines a unified data-to-action backbone with asset-specific sensing, analytics and risk choices.</Panel>
            <Panel><div className="kicker">Selected references</div><ul className="mt-1.5 space-y-1 text-[0.95rem] leading-snug text-ink/85">{refs.map((r) => <li key={r}>{r}</li>)}</ul></Panel>
          </div>
        </div>
      </Stagger>
    </div>
  )
}

export default [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20]
