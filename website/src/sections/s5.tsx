import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import {
  Activity, AlertCircle, ArrowDown, ArrowRight, BadgeDollarSign, BarChart3, Bell, BrainCircuit, CalendarCheck, CheckCircle2, ClipboardList, Cloud, CloudCog, Cog, Compass, Cpu, CreditCard, Database, Factory, Fan, Gauge, Handshake, HeartPulse,
  LayoutDashboard, Lock, MonitorDot, Package, Plug, RefreshCcw, Repeat, Rocket, Scale, Search, Shield, ShieldCheck, Siren, Sparkles, Target, TrendingUp, UserCheck, Users, Wifi, Wrench, Zap, Bot, Waypoints,
} from 'lucide-react'
import { Bar, BarChart, Line, LineChart, ReferenceArea, ReferenceLine } from 'recharts'
import { AnimatedNumber, Flow, IconBadge, Loop, Panel, Photo, Rise, RunButton, Slide, Stagger, Tag, useAutoSelect, useRunner, Wave, cx, Sr } from '../ui/kit'
import { axis, ChartTip, Grid, Legend, legendStyle, ResponsiveContainer, SERIES, Tooltip, XAxis, YAxis } from '../ui/charts'

/** App-window chrome: the signature motif of this section. */
const Window = ({ title, children, className, right }: { title: string; children: React.ReactNode; className?: string; right?: React.ReactNode }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className={cx('glass flex flex-col overflow-hidden rounded-2xl', className)}>
    <div className="flex h-9 shrink-0 items-center gap-2 border-b border-hair bg-black/30 px-3">
      <span className="flex gap-1" aria-hidden><i className="h-2 w-2 rounded-full bg-orange" /><i className="h-2 w-2 rounded-full bg-amber/60" /><i className="h-2 w-2 rounded-full bg-white/25" /></span>
      <span className="ml-1 truncate text-[0.78rem] font-medium tracking-wide text-mute">{title}</span>
      <span className="ml-auto">{right}</span>
    </div>
    <div className="min-h-0 flex-1 p-4">{children}</div>
  </motion.div>
)

/* 1 */
function S1() {
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1.25fr_1fr]">
      <Stagger>
        <Rise><h1 className="font-display text-[3.6rem] leading-[0.98] font-bold tracking-tight lg:text-[4.6rem]">PREDICTIVE<br />MAINTENANCE<br /><span className="text-orange">AS A SERVICE</span></h1></Rise>
        <Rise><p className="mt-5 max-w-[32rem] text-[1.28rem] leading-snug text-ink/90">Visualizing how connected assets become predictions, service actions, and recurring value.</p></Rise>
        <Rise className="kicker mt-5">BUSINESS MODEL • DATA FLOW • CUSTOMER VALUE</Rise>
      </Stagger>
      <Photo sketch src="/img/s5-01.webp" alt="Sketch of machines connected to a cloud with a dashboard" className="h-[22rem] lg:h-[33rem]" />
    </div>
  )
}

/* 2 */
function S2() {
  const st = [{ label: 'ASSETS', desc: 'Machines reveal condition', icon: Factory }, { label: 'DATA', desc: 'Signals become context', icon: Database }, { label: 'PREDICTION', desc: 'Models surface risk', icon: BrainCircuit }, { label: 'SERVICE', desc: 'Teams act in time', icon: Wrench }, { label: 'VALUE', desc: 'Uptime compounds', icon: TrendingUp }]
  const r = useRunner(5, 950)
  return (
    <Slide title="THE JOURNEY: SIGNAL TO VALUE" sub="One continuous service loop turns machine condition into measurable business outcomes." tag={<RunButton running={r.running} onClick={r.run} />}>
      <div className="mt-6"><Flow steps={st} active={r.index} onSelect={r.select} /></div>
      <Window title="service-loop / signal" className="mt-5 h-[13.5rem]">
        <div className="relative h-full">
          <Wave seed={1.2} amp={0.9} className="absolute inset-0 h-full w-full" speed={3} />
          <motion.div aria-hidden className="absolute top-0 bottom-0 w-[2px] bg-amber shadow-[0_0_.8rem_var(--color-amber)]" animate={{ left: `${((r.index + 0.5) / 5) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </Window>
    </Slide>
  )
}

/* 3 */
function S3() {
  const st = [{ label: 'EQUIPMENT', icon: Factory }, { label: 'CONDITION DATA', icon: Activity }, { label: 'ANALYTICS', icon: BarChart3 }, { label: 'EARLY ACTION', icon: Zap }]
  const { active, select } = useAutoSelect(4, 1500)
  const sig = [['Vibration', 1], ['temperature', 0.5], ['pressure', 0.7], ['current', 1.2], ['operating context', 0.35]] as const
  return (
    <Slide title="SEE THE FAILURE BEFORE IT HAPPENS" sub="Predictive maintenance reads condition—not calendars—to identify emerging risk.">
      <div className="mt-2"><Flow steps={st} active={active} onSelect={select} /></div>
      <Window title="condition-data / live feed (illustrative)" className="mt-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {sig.map(([s, a], i) => <div key={s} className="min-w-0"><div className="text-[0.95rem] capitalize">{s}</div><Wave seed={i + 1.4} amp={a} className="mt-1 h-[9.5rem] w-full" speed={2 + i} color={i % 2 ? 'var(--color-cool)' : 'var(--color-orange)'} /></div>)}
        </div>
        <Sr>Vibration • temperature • pressure • current • operating context</Sr>
      </Window>
    </Slide>
  )
}

/* 4 */
function S4() {
  const nodes = [{ label: 'CONNECT', icon: Plug }, { label: 'MONITOR', icon: MonitorDot }, { label: 'PREDICT', icon: BrainCircuit }, { label: 'ACT', icon: Wrench }, { label: 'LEARN', icon: RefreshCcw }]
  const { active, select } = useAutoSelect(5, 1800)
  return (
    <Slide title="FROM PRODUCT SALE TO ONGOING OUTCOME" sub="The provider continuously monitors, predicts, supports action, and improves the model.">
      <Rise className="mx-auto w-full max-w-[28rem]">
        <Loop nodes={nodes} active={active} onSelect={select} size="28rem" center={<div><Repeat className="mx-auto h-8 w-8 text-orange" strokeWidth={1.4} /><div className="mt-1 font-display text-[1.45rem] leading-tight font-bold">RECURRING<br />SERVICE</div></div>} />
      </Rise>
    </Slide>
  )
}

/* 5 */
function S5() {
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Stagger>
        <Rise><h1 className="font-display text-[3.8rem] leading-[0.98] font-bold tracking-tight lg:text-[4.6rem]"><span className="text-orange">UNEXPECTED<br />DOWNTIME</span><br />BREAKS THE FLOW</h1></Rise>
        <Rise><p className="mt-5 text-[1.3rem] leading-snug text-ink/90">One hidden fault can halt throughput, scramble labor, delay orders, and trigger costly secondary damage.</p></Rise>
        <Rise className="mt-5 flex flex-wrap items-center gap-2">
          {['UNCERTAINTY', 'URGENCY', 'COST'].map((s, i) => <span key={s} className="flex items-center gap-2"><span className="rounded-lg border border-bad/50 bg-bad/10 px-3 py-1 font-display font-bold tracking-wide">{s}</span>{i < 2 && <ArrowRight className="h-4 w-4 text-orange" />}</span>)}
          <Sr>UNCERTAINTY → URGENCY → COST</Sr>
        </Rise>
      </Stagger>
      <Photo sketch src="/img/s5-05.webp" alt="Sketch of technicians around a failed motor on a line" className="h-[22rem] lg:h-[31rem]" />
    </div>
  )
}

/* 6 */
function ReactLane({ title, items, tone, index, select }: { title: string; items: string[]; tone: 'bad' | 'good'; index: number; select: (i: number) => void }) {
  return (
    <Window title={title} className={cx('h-full', tone === 'good' && 'border-orange/60')}>
      <div className="flex h-full flex-col items-stretch justify-center gap-1">
        {items.map((s, i) => (
          <div key={s}>
            <button type="button" aria-pressed={i === index} onClick={() => select(i)} className={cx('w-full rounded-xl border p-3.5 text-center font-display text-[1.32rem] font-semibold transition-all', i <= index ? (tone === 'good' ? 'border-orange bg-orange/20' : 'border-bad/60 bg-bad/15') : 'border-hair text-mute')}>{s}</button>
            {i < 2 && <ArrowDown className={cx('mx-auto my-1 h-5 w-5', i < index ? (tone === 'good' ? 'text-orange' : 'text-[#ff8b7c]') : 'text-dim')} />}
          </div>
        ))}
      </div>
    </Window>
  )
}
function S6() {
  const r = useRunner(3, 1100)
  return (
    <Slide title="REACTIVE VS. PREDICTIVE" sub="The difference is not only timing—it is control." tag={<RunButton running={r.running} onClick={r.run} label="Compare" />}>
      <div className="grid gap-4 lg:h-[24rem] lg:grid-cols-2">
        <ReactLane title="REACTIVE" tone="bad" index={r.index} select={r.select} items={['Failure happens', 'Production stops', 'Emergency repair']} />
        <ReactLane title="PREDICTIVE SERVICE" tone="good" index={r.index} select={r.select} items={['Risk emerges', 'Maintenance is planned', 'Availability protected']} />
      </div>
    </Slide>
  )
}

/* 7 */
const VIEWS = [
  { k: 'OPERATIONS', d: 'Uptime', i: Factory }, { k: 'SERVICE PARTNER', d: 'Delivery', i: Handshake }, { k: 'MAINTENANCE', d: 'Priorities', i: Wrench },
  { k: 'FINANCE', d: 'Risk & return', i: BadgeDollarSign }, { k: 'RELIABILITY', d: 'Root causes', i: Search },
]
function S7() {
  const { active, select } = useAutoSelect(5, 2000)
  const R = 41
  return (
    <Slide title="ONE MODEL, MANY DECISION MAKERS" sub="Each stakeholder sees a different slice of the same asset truth.">
      <Rise className="relative mx-auto aspect-square w-full max-w-[26rem]">
        <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden>
          {VIEWS.map((_, i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return <line key={i} x1="50" y1="50" x2={50 + R * Math.cos(a)} y2={50 + R * Math.sin(a)} stroke={i === active ? 'var(--color-orange)' : 'rgba(255,255,255,.14)'} strokeWidth={i === active ? 0.8 : 0.4} className={i === active ? 'flow-dash' : ''} /> })}
        </svg>
        <div className="absolute inset-0 grid place-items-center"><div className="grid h-[7.4rem] w-[7.4rem] place-items-center rounded-full border-2 border-orange bg-orange/15 text-center font-display text-[1.2rem] leading-tight font-bold shadow-[0_0_2rem_color-mix(in_srgb,var(--color-orange)_30%,transparent)]">ASSET<br />HEALTH</div></div>
        {VIEWS.map(({ k, d, i: I }, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2
          return (
            <button key={k} type="button" aria-pressed={i === active} onClick={() => select(i)} style={{ left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%`, transform: 'translate(-50%,-50%)' }}
              className={cx('glass lift absolute flex w-[8.1rem] flex-col items-center rounded-xl p-2 text-center', i === active && 'hot glass-o')}>
              <I className="h-5 w-5 text-amber" strokeWidth={1.5} /><span className="font-display text-[0.8rem] leading-tight font-bold">{k}</span><span className="text-[0.9rem] text-amber">{d}</span>
            </button>
          )
        })}
      </Rise>
    </Slide>
  )
}

/* 8: animated business model */
const BM = [
  { k: 'CUSTOMER\nASSETS', i: Factory }, { k: 'SENSORS +\nCONNECTIVITY', i: Wifi }, { k: 'SERVICE\nPLATFORM', i: CloudCog }, { k: 'INSIGHTS +\nACTION', i: Sparkles }, { k: 'RECURRING\nPAYMENT', i: CreditCard },
]
function S8() {
  const [a, setA] = useState(2)
  const X = (i: number) => 60 + i * 170
  return (
    <Slide title="BUSINESS MODEL AT A GLANCE" tag={<span className="text-[0.84rem] text-mute">Select a block to highlight it</span>}>
      <Window title="business-model / value and learning flows" className="mt-1">
        <div className="relative w-full" style={{ aspectRatio: '800 / 300' }}>
          <svg viewBox="0 0 800 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Value flows right from customer assets to recurring payment; learning and retention flow back">
            <defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--color-orange)" /></marker></defs>
            {BM.slice(0, -1).map((_, i) => <path key={i} d={`M${X(i) + 56} 100H${X(i + 1) - 58}`} stroke="var(--color-orange)" strokeWidth="2.4" fill="none" className="flow-dash" markerEnd="url(#ar)" />)}
            {BM.slice(0, -1).map((_, i) => <circle key={i} r="5" fill="var(--color-amber)"><animateMotion dur="1.3s" begin={`-${i * 0.45}s`} repeatCount="indefinite" path={`M${X(i) + 56} 100H${X(i + 1) - 58}`} /></circle>)}
            <path d={`M${X(4)} 152V232Q${X(4)} 252 ${X(4) - 20} 252H${X(0) + 20}Q${X(0)} 252 ${X(0)} 232V152`} stroke="var(--color-cool)" strokeWidth="2" fill="none" strokeDasharray="6 7" className="flow-dash" markerEnd="url(#ar)" />
            <circle r="6" fill="var(--color-cool)"><animateMotion dur="4.4s" repeatCount="indefinite" path={`M${X(4)} 152V232Q${X(4)} 252 ${X(4) - 20} 252H${X(0) + 20}Q${X(0)} 252 ${X(0)} 232V152`} /></circle>
          </svg>
          {BM.map(({ k, i: I }, i) => (
            <button key={k} type="button" aria-pressed={a === i} onClick={() => setA(i)} style={{ left: `${(X(i) / 800) * 100}%`, top: `${(100 / 300) * 100}%`, width: `${(112 / 800) * 100}%`, transform: 'translate(-50%,-50%)' }}
              className={cx('glass lift absolute flex aspect-square flex-col items-center justify-center rounded-2xl p-1 text-center', a === i && 'hot glass-o')}>
              <I className="h-7 w-7 text-orange" strokeWidth={1.4} /><span className="mt-1 font-display text-[0.78rem] leading-[1.1] font-bold whitespace-pre-line">{k}</span>
            </button>
          ))}
          <div className="absolute inset-x-0 bottom-[1.5%] text-center text-[0.98rem] text-ink/90"><span className="text-amber">Value flows right</span>  •  <span className="text-cool">learning and retention flow back</span></div>
        </div>
      </Window>
    </Slide>
  )
}

/* 9 */
const ARCH = [
  { k: 'SENSORS', i: Activity, p: 'PHYSICAL' }, { k: 'EDGE\nGATEWAY', i: Cpu, p: 'PHYSICAL' }, { k: 'CLOUD\nPLATFORM', i: Cloud, p: 'DATA PLANE' },
  { k: 'ANALYTICS\nENGINE', i: BrainCircuit, p: 'DATA PLANE' }, { k: 'DASHBOARD', i: LayoutDashboard, p: 'SERVICE PLANE' }, { k: 'WORK\nORDER', i: ClipboardList, p: 'SERVICE PLANE' },
]
const PLANES = ['PHYSICAL', 'DATA PLANE', 'SERVICE PLANE']
function S9() {
  const [plane, setPlane] = useState<string | null>(null)
  const [node, setNode] = useState(0)
  return (
    <Slide title="SYSTEM ARCHITECTURE: ASSET TO INSIGHT" tag={<span className="text-[0.84rem] text-mute">Select a plane or a component</span>}>
      <div className="grid gap-3 lg:grid-cols-3">
        {PLANES.map((p) => {
          const on = plane === null || plane === p
          return (
            <Rise key={p} className={cx('rounded-2xl border border-dashed p-3 transition-opacity', plane === p ? 'border-orange bg-orange/10' : 'border-line', !on && 'opacity-35')}>
              <button type="button" aria-pressed={plane === p} onClick={() => setPlane(plane === p ? null : p)} className="kicker w-full text-left hover:text-orange">{p}</button>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {ARCH.filter((a) => a.p === p).map((a) => {
                  const I = a.i; const idx = ARCH.indexOf(a)
                  return (
                    <button key={a.k} type="button" aria-pressed={node === idx} onClick={() => setNode(idx)} className={cx('glass lift flex min-h-[10.5rem] flex-col items-center justify-center rounded-xl p-2 text-center', node === idx && 'hot glass-o')}>
                      <I className="h-9 w-9 text-orange" strokeWidth={1.3} /><span className="mt-2 font-display text-[0.98rem] leading-tight font-bold whitespace-pre-line">{a.k}</span>
                    </button>
                  )
                })}
              </div>
            </Rise>
          )
        })}
      </div>
      <Rise className="relative mt-4 flex items-center gap-2 overflow-x-auto rounded-2xl border border-hair bg-black/30 px-4 py-3">
        {ARCH.map((a, i) => (
          <span key={a.k} className="flex shrink-0 items-center gap-2"><span className={cx('rounded-md px-2 py-0.5 text-[0.84rem] whitespace-nowrap', i <= node ? 'bg-orange/20 text-amber' : 'text-mute')}>{a.k.replace('\n', ' ')}</span>{i < 5 && <ArrowRight className={cx('h-4 w-4', i < node ? 'text-orange' : 'text-dim')} />}</span>
        ))}
      </Rise>
    </Slide>
  )
}

/* 10 */
const FLEET = [['PUMP', Gauge], ['HVAC', Fan], ['TURBINE', Waypoints], ['MOTOR', Cog], ['ROBOT', Bot], ['COMPRESSOR', Package]] as const
function S10() {
  const [off, setOff] = useState<Set<string>>(new Set())
  const R = 40
  return (
    <Slide title="MANY MACHINES. ONE OPERATING PICTURE." sub="Secure connectivity normalizes diverse signals into a shared asset model." tag={<span className="text-[0.84rem] text-mute"><span className="num font-semibold text-amber">{6 - off.size}</span> of 6 connected. Select to toggle.</span>}>
      <Rise className="relative mx-auto aspect-[1.7] w-full max-w-[46rem]">
        <svg viewBox="0 0 170 100" className="absolute inset-0 h-full w-full" aria-hidden>
          {FLEET.map(([k], i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2; const x = 85 + R * 1.75 * Math.cos(a); const y = 50 + R * Math.sin(a)
            const d = `M${x} ${y}L85 50`
            return off.has(k) ? <path key={k} d={d} stroke="rgba(255,255,255,.1)" strokeWidth=".35" strokeDasharray="1 2" /> : (
              <g key={k}><path d={d} stroke="color-mix(in srgb, var(--color-orange) 50%, transparent)" strokeWidth=".4" /><circle r=".9" fill="var(--color-amber)"><animateMotion dur="2s" begin={`-${i * 0.3}s`} repeatCount="indefinite" path={d} /></circle></g>
            )
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center"><div className="grid h-[8.6rem] w-[8.6rem] place-items-center rounded-full border-2 border-orange bg-[color-mix(in_srgb,var(--color-orange)_16%,#0b1020)] text-center shadow-[0_0_2.4rem_color-mix(in_srgb,var(--color-orange)_35%,transparent)]"><div><Cloud className="mx-auto h-7 w-7 text-orange" strokeWidth={1.4} /><div className="mt-1 font-display text-[1.02rem] leading-tight font-bold">CENTRAL<br />PLATFORM</div></div></div></div>
        {FLEET.map(([k, I], i) => {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2; const on = !off.has(k)
          return (
            <button key={k} type="button" aria-pressed={on} onClick={() => setOff((s) => { const n = new Set(s); on ? n.add(k) : n.delete(k); return n })} style={{ left: `${(85 + R * 1.75 * Math.cos(a)) / 1.7}%`, top: `${50 + R * Math.sin(a)}%`, transform: 'translate(-50%,-50%)' }}
              className={cx('glass lift absolute flex w-[7.6rem] flex-col items-center rounded-xl py-2', on ? 'border-line' : 'opacity-40')}>
              <I className="h-6 w-6 text-amber" strokeWidth={1.4} /><span className="mt-0.5 font-display text-[0.92rem] font-bold">{k}</span>
            </button>
          )
        })}
      </Rise>
    </Slide>
  )
}

/* 11 */
const HEALTH = [96, 94, 92, 88, 81, 72, 60, 45].map((h, i) => ({ t: i + 1, 'Asset health': h, 'Warning threshold': 65 }))
function S11() {
  const [th, setTh] = useState(65)
  const data = HEALTH.map((d) => ({ ...d, 'Warning threshold': th }))
  // first time step at which health falls below the threshold (interpolated)
  let cross = 8
  for (let i = 1; i < 8; i++) {
    const a = HEALTH[i - 1]['Asset health']; const b = HEALTH[i]['Asset health']
    if (a >= th && b < th) { cross = i + (a - th) / (a - b); break }
  }
  return (
    <Slide title="ANALYTICS TURNS DRIFT INTO WARNING" sub="The model detects deterioration early enough to create a useful intervention window.">
      <div className="grid gap-4 lg:grid-cols-[1.75fr_1fr]">
        <Window title="Simplified asset-health trend" right={<span className="text-[0.72rem] text-dim">Values read from the deck's chart image</span>}>
          <div className="h-[21rem]">
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 8, right: 14, left: 0, bottom: 0 }}>
                <Grid />
                <XAxis dataKey="t" type="number" domain={[1, 8]} ticks={[1, 2, 3, 4, 5, 6, 7, 8]} {...axis} />
                <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tickFormatter={(v) => `${v}%`} {...axis} width={44} />
                <Tooltip content={<ChartTip unit="%" />} cursor={{ stroke: 'rgba(255,255,255,.2)' }} /><Legend wrapperStyle={legendStyle} verticalAlign="top" height={26} />
                <ReferenceArea x1={Math.min(cross, 8)} x2={8} fill="var(--color-orange)" fillOpacity={0.16} label={{ value: 'INTERVENTION WINDOW', fill: 'var(--color-amber)', fontSize: '0.78rem', position: 'insideTop' }} />
                <Line dataKey="Asset health" stroke={SERIES.b} strokeWidth={2.6} dot={{ r: 4, fill: SERIES.b }} isAnimationActive animationDuration={800} />
                <Line dataKey="Warning threshold" stroke="#ff5a47" strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <label className="mt-1 flex items-center gap-3 text-[0.84rem] text-mute"><span className="whitespace-nowrap">Warning threshold <span className="num font-semibold text-ink">{th}%</span></span><input type="range" min={45} max={90} value={th} onChange={(e) => setTh(Number(e.target.value))} aria-label="Warning threshold" /></label>
        </Window>
        <Panel orange className="flex flex-col justify-center">
          <div className="kicker">Intervention<br />Window</div>
          <p className="mt-3 text-[1.24rem] leading-snug">Risk crosses the threshold before functional failure—creating time to plan parts, labor, and production.</p>
        </Panel>
      </div>
    </Slide>
  )
}

/* 12 */
const PRIOS = [
  { n: 1, a: 'Compressor C-14', t: 'inspect bearing', sev: 'High' , i: Package }, { n: 2, a: 'Robot R-08', t: 'verify current spike', sev: 'High', i: Bot }, { n: 3, a: 'Pump P-22', t: 'schedule seal replacement', sev: 'Planned', i: Gauge },
]
function S12() {
  const [sel, setSel] = useState(0)
  const [done, setDone] = useState<Set<number>>(new Set())
  const k = [['FLEET HEALTH', '87%', HeartPulse], ['OPEN ALERTS', '12', Bell], ['HIGH RISK', '3', Siren], ['PLANNED THIS WEEK', '8', CalendarCheck]] as const
  const cur = PRIOS[sel]
  return (
    <Slide title="A DASHBOARD DESIGNED FOR ACTION" sub="Prioritize what needs attention now—without burying teams in telemetry." tag={<Tag kind="deck" label="Example values from source deck" />}>
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {k.map(([l, v, I]) => <Panel key={l} className="!p-3.5"><div className="flex items-center justify-between"><span className="text-[0.76rem] font-semibold tracking-wide text-mute">{l}</span><I className="h-5 w-5 text-orange" strokeWidth={1.5} /></div><div className="num mt-1.5 font-display text-[2.5rem] leading-none font-bold">{v}</div></Panel>)}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Window title="MAINTENANCE PRIORITIES">
          <div className="flex flex-col gap-2">
            {PRIOS.map((p, i) => (
              <button key={p.a} type="button" aria-pressed={sel === i} onClick={() => setSel(i)} className={cx('lift flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left', sel === i ? 'border-orange bg-orange/15' : 'border-hair', done.has(i) && 'opacity-50')}>
                <span className="num grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange font-display font-bold text-black">{p.n}</span>
                <span className="text-[1.16rem] leading-tight"><span className="font-semibold">{p.a}</span> — {p.t}</span>
                {done.has(i) && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-good" />}
              </button>
            ))}
          </div>
        </Window>
        <Window title={`work-item / ${cur.a}`}>
          <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col">
            <div className="font-display text-[1.32rem] font-bold">{cur.a}</div>
            <div className="mt-0.5 text-[1.08rem] text-amber first-letter:uppercase">{cur.t}</div>
            <button type="button" aria-pressed={done.has(sel)} onClick={() => setDone((s) => { const n = new Set(s); n.has(sel) ? n.delete(sel) : n.add(sel); return n })} className={cx('mt-auto rounded-full px-3.5 py-1.5 text-[0.92rem]', done.has(sel) ? 'btn-ghost' : 'btn-primary')}>{done.has(sel) ? 'Reopen (demo)' : 'Mark as actioned (demo)'}</button>
          </motion.div>
        </Window>
      </div>
    </Slide>
  )
}

/* 13 */
function S13() {
  const nodes = [{ label: 'ALERT', icon: Bell }, { label: 'TRIAGE', icon: ClipboardList }, { label: 'INSPECTION', icon: Search }, { label: 'WORK ORDER', icon: ClipboardList }, { label: 'REPAIR', icon: Wrench }, { label: 'FEEDBACK', icon: RefreshCcw }]
  const { active, select } = useAutoSelect(6, 1600)
  return (
    <Slide title="ALERT TO ACTION—THEN BACK TO LEARNING">
      <div className="grid items-center gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Rise><Loop nodes={nodes} active={active} onSelect={select} size="27rem" center={<UserCheck className="h-10 w-10 text-orange" strokeWidth={1.3} />} /></Rise>
        <Panel orange><p className="font-display text-[1.7rem] leading-tight font-semibold">Human judgment stays in the loop.</p><p className="mt-3 text-[1.25rem] leading-snug text-ink/90">Every confirmed outcome improves future recommendations.</p></Panel>
      </div>
    </Slide>
  )
}

/* 14 */
const TIERS = [
  { k: 'VISIBILITY', m: 'PER ASSET / MO', f: ['Connectivity', 'Health dashboard', 'Basic alerts'], i: Compass },
  { k: 'PREDICTION', m: 'TIERED SUBSCRIPTION', f: ['Failure-risk models', 'Prioritized actions', 'Service support'], i: BrainCircuit },
  { k: 'OUTCOME', m: 'SHARED VALUE OPTION', f: ['SLA-aligned service', 'Optimization', 'Performance reviews'], i: Target },
]
function S14() {
  const [a, setA] = useState(1)
  return (
    <Slide title="SERVICE PACKAGES THAT SCALE WITH MATURITY" tag={<Tag kind="illustrative" label="Illustrative structure—not a price quote." />}>
      <div className="grid items-end gap-3 lg:grid-cols-3">
        {TIERS.map((t, i) => {
          const I = t.i
          return (
            <Panel key={t.k} hot={a === i} onClick={() => setA(i)} className={cx('flex flex-col', a === i && 'glass-o')} >
              <div style={{ minHeight: `${15 + i * 3.6}rem` }} className="flex flex-col">
                <div className="flex items-center justify-between"><I className="h-8 w-8 text-orange" strokeWidth={1.3} /><span className="num font-display text-[1.2rem] font-bold text-dim">{i + 1}/3</span></div>
                <div className="mt-3 font-display text-[1.5rem] font-bold">{t.k}</div>
                <div className="text-[0.84rem] font-semibold tracking-[0.12em] text-amber">{t.m}</div>
                <ul className="mt-3 space-y-1.5">{t.f.map((f) => <li key={f} className="flex items-center gap-2 text-[1.1rem]"><CheckCircle2 className="h-4 w-4 shrink-0 text-orange" />{f}</li>)}</ul>
              </div>
            </Panel>
          )
        })}
      </div>
    </Slide>
  )
}

/* 15 */
function S15() {
  const st = [{ label: 'ONBOARD', desc: 'Goals + assets', icon: Rocket }, { label: 'CONNECT', desc: 'Secure data', icon: Lock }, { label: 'BASELINE', desc: 'Learn normal', icon: Activity }, { label: 'INSIGHT', desc: 'Surface risk', icon: Sparkles }, { label: 'ACTION', desc: 'Close the loop', icon: Wrench }, { label: 'RENEW', desc: 'Scale value', icon: Repeat }]
  const r = useRunner(6, 850)
  return (
    <Slide title="CUSTOMER JOURNEY: PROVE, EMBED, EXPAND" tag={<RunButton running={r.running} onClick={r.run} label="Play journey" />}>
      <div className="mt-4"><Flow steps={st} active={r.index} onSelect={r.select} compact /></div>
      <Rise className={cx('mt-6 rounded-2xl border p-6 transition-all', r.index >= 3 ? 'hot glass-o' : 'glass')}>
        <div className="kicker">Value moment</div>
        <p className="mt-2 font-display text-[1.75rem] leading-tight font-semibold">the first trusted prediction that changes a maintenance decision</p>
      </Rise>
      <Sr>VALUE MOMENT: the first trusted prediction that changes a maintenance decision</Sr>
    </Slide>
  )
}

/* 16 */
const CHAIN = ['LESS\nDOWNTIME', 'MORE OUTPUT', 'EARLIER, BETTER\nDECISIONS', 'PLANNED\nLABOR', 'LOWER COST', 'FEWER\nSECONDARY FAILURES', 'SAFER OPERATIONS']
function S16() {
  const { active, select } = useAutoSelect(7, 1500, 2)
  const hub = 2
  const others = CHAIN.map((_, i) => i).filter((i) => i !== hub)
  return (
    <Slide title="PREDICTIONS CREATE A CHAIN OF VALUE">
      <Rise className="relative mx-auto aspect-[1.8] w-full max-w-[50rem]">
        <svg viewBox="0 0 180 100" className="absolute inset-0 h-full w-full" aria-hidden>
          {others.map((o, x) => {
            const a = (x / others.length) * Math.PI * 2 - Math.PI / 2; const px = 90 + 72 * Math.cos(a); const py = 50 + 38 * Math.sin(a)
            return <g key={o}><path d={`M90 50L${px} ${py}`} stroke={active === o ? 'var(--color-orange)' : 'color-mix(in srgb, var(--color-orange) 30%, transparent)'} strokeWidth={active === o ? 0.7 : 0.35} /><circle r=".9" fill="var(--color-amber)"><animateMotion dur="2.2s" begin={`-${x * 0.35}s`} repeatCount="indefinite" path={`M90 50L${px} ${py}`} /></circle></g>
          })}
        </svg>
        <button type="button" aria-pressed={active === hub} onClick={() => select(hub)} className={cx('absolute top-1/2 left-1/2 grid w-[11.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border-2 border-orange bg-[color-mix(in_srgb,var(--color-orange)_18%,#0b1020)] p-4 text-center font-display text-[1.14rem] leading-tight font-bold whitespace-pre-line shadow-[0_0_2rem_color-mix(in_srgb,var(--color-orange)_35%,transparent)]', active === hub && 'hot')}>{CHAIN[hub]}</button>
        {others.map((o, x) => {
          const a = (x / others.length) * Math.PI * 2 - Math.PI / 2
          return (
            <button key={o} type="button" aria-pressed={active === o} onClick={() => select(o)} style={{ left: `${((90 + 72 * Math.cos(a)) / 180) * 100}%`, top: `${50 + 38 * Math.sin(a)}%`, transform: 'translate(-50%,-50%)' }}
              className={cx('glass lift absolute w-[9.8rem] rounded-xl p-2.5 text-center font-display text-[0.92rem] leading-tight font-bold whitespace-pre-line', active === o && 'hot glass-o')}>{CHAIN[o]}</button>
          )
        })}
      </Rise>
    </Slide>
  )
}

/* 17 */
const ECON = [{ s: 'Pilot', 'Recurring revenue': 25, 'Service cost': 40 }, { s: 'Launch', 'Recurring revenue': 55, 'Service cost': 48 }, { s: 'Scale', 'Recurring revenue': 110, 'Service cost': 68 }, { s: 'Mature', 'Recurring revenue': 170, 'Service cost': 90 }]
function S17() {
  const [stage, setStage] = useState(3)
  const cur = ECON[stage]; const m = cur['Recurring revenue'] - cur['Service cost']
  return (
    <Slide title="RECURRING REVENUE, IMPROVING ECONOMICS" sub="Illustrative unit-economics profile as connected assets scale." tag={<Tag kind="illustrative" />}>
      <div className="grid gap-3 lg:grid-cols-[1.75fr_1fr]">
        <Window title="unit-economics / illustrative" right={<span className="text-[0.72rem] text-dim">Values read from the deck's chart image</span>}>
          <div className="h-[21.5rem]">
            <ResponsiveContainer>
              <BarChart data={ECON} margin={{ top: 8, right: 8, left: 2, bottom: 0 }} barGap={4} barCategoryGap="24%" onClick={(e: any) => { if (e?.activeTooltipIndex !== undefined) setStage(e.activeTooltipIndex) }}>
                <Grid /><XAxis dataKey="s" {...axis} /><YAxis domain={[0, 200]} ticks={[0, 50, 100, 150, 200]} tickFormatter={(v) => `$${v}k`} {...axis} width={48} />
                <Tooltip content={<ChartTip prefix="$" unit="k" />} cursor={{ fill: 'rgba(255,255,255,.04)' }} /><Legend wrapperStyle={legendStyle} verticalAlign="top" height={26} />
                <Bar dataKey="Recurring revenue" fill={SERIES.a} radius={[4, 4, 0, 0]} animationDuration={700} />
                <Bar dataKey="Service cost" fill={SERIES.b} radius={[4, 4, 0, 0]} animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Window>
        <div className="flex flex-col gap-3">
          <Panel>
            <div className="flex gap-1">{ECON.map((e, i) => <button key={e.s} type="button" aria-pressed={i === stage} onClick={() => setStage(i)} className={cx('flex-1 rounded-lg border py-1 text-[0.82rem]', i === stage ? 'border-orange bg-orange/20 text-amber' : 'border-hair text-mute')}>{e.s}</button>)}</div>
            <div className="mt-2 text-[0.86rem] text-mute">Revenue minus service cost, {cur.s}</div>
            <div className={cx('font-display text-[2.1rem] leading-tight font-bold', m < 0 ? 'text-[#ff8b7c]' : 'text-good')}><AnimatedNumber value={m} format={(n) => `${n < 0 ? '−' : ''}$${Math.abs(Math.round(n))}k`} /></div>
          </Panel>
          <Panel orange className="flex-1">
            <div className="kicker">Profitability drivers</div>
            <ul className="mt-2 space-y-1.5 text-[1.1rem]">{['Assets per customer', 'Model reuse', 'Automation rate', 'Retention', 'Service efficiency'].map((d) => <li key={d} className="flex items-center gap-2"><TrendingUp className="h-4 w-4 shrink-0 text-orange" />{d}</li>)}</ul>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}

/* 18 */
function S18() {
  const ctl = [['DATA SECURITY', 'Encrypt + govern', Lock], ['FALSE ALARMS', 'Tune to consequence', Bell], ['MODEL DRIFT', 'Monitor performance', Activity], ['INTEGRATION', 'Design for legacy', Plug], ['HUMAN OVERSIGHT', 'Confirm critical action', UserCheck]] as const
  const [on, setOn] = useState<Set<number>>(new Set())
  return (
    <Slide title="RESPONSIBLE BY DESIGN" sub="Trust requires technical controls and clear human accountability." tag={<span className="num text-[0.84rem] text-mute"><span className="font-semibold text-amber">{on.size}</span> / 5 controls reviewed</span>}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ctl.map(([k, d, I], i) => {
          const a = on.has(i)
          return (
            <Panel key={k} hot={a} onClick={() => setOn((s) => { const n = new Set(s); a ? n.delete(i) : n.add(i); return n })} className="flex min-h-[20rem] flex-col">
              <div className="flex items-start justify-between"><span className={cx('grid h-14 w-14 place-items-center rounded-2xl border border-line transition-colors', a ? 'bg-orange text-black' : 'bg-orange/10 text-amber')}><I className="h-7 w-7" strokeWidth={1.4} /></span>{a && <ShieldCheck className="h-6 w-6 text-good" />}</div>
              <div className="mt-auto font-display text-[1.25rem] leading-tight font-bold">{k}</div>
              <div className="mt-1.5 text-[1.1rem] leading-snug text-mute">{d}</div>
            </Panel>
          )
        })}
      </div>
    </Slide>
  )
}

/* 19 */
function S19() {
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1.25fr_1fr]">
      <Stagger>
        <Rise><Tag kind="hypothetical" label="FICTIONAL ILLUSTRATIVE CASE" /></Rise>
        <Rise><h1 className="mt-3 font-display text-[3.2rem] leading-[1.02] font-bold tracking-tight lg:text-[4rem]">A CONNECTED<br />FACTORY PLANS<br /><span className="text-orange">THE REPAIR</span></h1></Rise>
        <Rise><p className="mt-5 text-[1.26rem] leading-snug text-ink/90">A vibration pattern on Line 2 indicates bearing wear. The team validates the signal, combines the repair with Saturday’s changeover, and avoids an unplanned stop.</p></Rise>
        <Rise className="mt-5 flex flex-wrap items-center gap-2">
          {['PREDICTION', 'PLANNED WINDOW', 'CONTINUITY'].map((s, i) => <span key={s} className="flex items-center gap-2"><span className="rounded-lg border border-orange/50 bg-orange/10 px-3 py-1 font-display font-bold tracking-wide">{s}</span>{i < 2 && <ArrowRight className="h-4 w-4 text-orange" />}</span>)}
          <Sr>PREDICTION → PLANNED WINDOW → CONTINUITY</Sr>
        </Rise>
      </Stagger>
      <Photo sketch src="/img/s5-19.webp" alt="Sketch of a connected factory with one machine flagged" className="h-[22rem] lg:h-[32rem]" />
    </div>
  )
}

/* 20 */
function S20() {
  const nodes = [{ label: 'ASSETS', icon: Factory }, { label: 'DATA', icon: Database }, { label: 'PREDICTION', icon: BrainCircuit }, { label: 'SERVICE', icon: Wrench }, { label: 'VALUE', icon: TrendingUp }]
  const { active, select } = useAutoSelect(5, 1700)
  return (
    <Slide title="TURN ASSET SIGNALS INTO SERVICE VALUE" sub="Start narrow, prove trust, then scale the operating model.">
      <div className="grid items-center gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Rise><Loop nodes={nodes} active={active} onSelect={select} size="25rem" center={<div><RefreshCcw className="mx-auto h-7 w-7 text-orange" strokeWidth={1.4} /><div className="mt-1 font-display text-[1.02rem] leading-tight font-bold">CONTINUOUS<br />LEARNING</div></div>} /></Rise>
        <Panel orange>
          <div className="kicker">Next</div>
          <ol className="mt-3 space-y-2.5">
            {['select one asset class', 'define the decision', 'instrument the feedback loop'].map((s, i) => <li key={s} className="flex items-center gap-3 font-display text-[1.45rem] leading-tight font-semibold"><span className="num grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange text-[1rem] text-black">{i + 1}</span>{s}</li>)}
          </ol>
          <Sr>NEXT: select one asset class • define the decision • instrument the feedback loop</Sr>
        </Panel>
      </div>
    </Slide>
  )
}

export default [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20]
