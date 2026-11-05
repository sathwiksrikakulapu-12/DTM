import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Bell, BellRing, BrainCircuit, CheckCircle2, ClipboardList, Cog, Database, DollarSign, Eye, Filter, Flag, Frown, Gauge, Handshake, LineChart as LineIcon, Lightbulb,
  ListChecks, Megaphone, RefreshCcw, Rocket, Route, Search, Shield, Smartphone, Smile, Sparkles, Stethoscope, Thermometer, Timer, TrendingDown, UserCog, Users, Volume2, Wifi, Wrench, Zap,
} from 'lucide-react'
import { Line, LineChart, ReferenceLine } from 'recharts'
import { Flow, IconBadge, Loop, Panel, Photo, Rise, RunButton, Slide, Stagger, Tag, useAutoSelect, useRunner, Wave, cx, Sr } from '../ui/kit'
import { axis, ChartTip, Grid, Legend, legendStyle, ResponsiveContainer, SERIES, Tooltip, XAxis, YAxis } from '../ui/charts'

/** Horizontal journey track: the signature motif of this section. */
function Track({ stages, active, onSelect, gaps }: { stages: { label: string; icon?: any }[]; active: number; onSelect: (i: number) => void; gaps?: boolean }) {
  const pct = stages.length > 1 ? (active / (stages.length - 1)) * 100 : 0
  return (
    <div className="relative">
      <div aria-hidden className="absolute top-[1.45rem] right-[calc(100%/var(--n)/2)] left-[calc(100%/var(--n)/2)] h-[3px] rounded bg-white/10" style={{ ['--n' as any]: stages.length }}>
        <motion.div className="h-full rounded bg-gradient-to-r from-orange to-amber shadow-[0_0_.8rem_color-mix(in_srgb,var(--color-orange)_70%,transparent)]" animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
      </div>
      <div className="relative grid gap-1" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))` }}>
        {stages.map((s, i) => {
          const I = s.icon
          return (
            <button key={s.label} type="button" aria-pressed={i === active} onClick={() => onSelect(i)} className="group flex min-w-0 flex-col items-center text-center">
              <span className={cx('grid h-[2.9rem] w-[2.9rem] place-items-center rounded-full border-2 transition-all', i === active ? 'scale-110 border-orange bg-orange text-black shadow-[0_0_1.2rem_color-mix(in_srgb,var(--color-orange)_65%,transparent)]' : i < active ? 'border-orange bg-[color-mix(in_srgb,var(--color-orange)_22%,#0b1020)] text-amber' : 'border-line bg-[#0d1224] text-amber group-hover:border-orange')}>
                {I ? <I className="h-5 w-5" strokeWidth={1.8} /> : <span className="num font-display font-bold">{i + 1}</span>}
              </span>
              <span className={cx('mt-1.5 font-display text-[0.98rem] leading-tight font-semibold whitespace-pre-line', i === active ? 'text-amber' : 'text-ink/90')}>{s.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* 1 */
function S1() {
  return (
    <div className="relative h-full min-h-[28rem] overflow-hidden rounded-3xl border border-hair">
      <div className="photo absolute inset-0"><img src={import.meta.env.BASE_URL + 'img/s3-01.webp'} alt="Long factory hall with large machines" /></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#080A0D] via-[#080A0D]/75 to-transparent" />
      <Stagger className="relative flex h-full flex-col justify-center p-8 lg:p-14">
        <Rise><h1 className="font-display text-[3.2rem] leading-[1.02] font-bold tracking-tight lg:text-[4.4rem]">Predictive Maintenance:<br /><span className="text-orange">Journey Mapping</span></h1></Rise>
        <Rise className="mt-5 text-[1.3rem] text-ink/90">University Brainstorming Project</Rise>
        <Rise className="kicker mt-2">October 23, 2026</Rise>
      </Stagger>
    </div>
  )
}

/* 2 */
function S2() {
  const items = [{ label: 'MACHINE', icon: Cog }, { label: 'DATA', icon: Database }, { label: 'ACTION', icon: Wrench }]
  const { active, select } = useAutoSelect(3, 1800)
  return (
    <Slide title="What is predictive maintenance?" sub="Condition-based maintenance uses live equipment data and analytics to predict failure before it occurs—so intervention happens at the right moment.">
      <div className="grid items-center gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Rise className="glass rounded-2xl p-7"><Track stages={items} active={active} onSelect={select} />
          <div className="mt-7 grid grid-cols-3 gap-3">
            <Wave seed={1} className="h-14 w-full" color={active >= 0 ? 'var(--color-orange)' : '#555'} />
            <Wave seed={2.3} className="h-14 w-full" color={active >= 1 ? 'var(--color-orange)' : '#555'} />
            <Wave seed={0.6} amp={0.4} className="h-14 w-full" color={active >= 2 ? 'var(--color-orange)' : '#555'} />
          </div>
        </Rise>
        <Photo src="/img/s3-02.webp" alt="Sensor mounted on an electric motor" className="h-[18rem] lg:h-[23rem]" />
      </div>
    </Slide>
  )
}

/* 3 */
function S3() {
  const v = [['↓ DOWNTIME', 'Fewer unplanned stops', TrendingDown], ['$ COST', 'Avoid secondary damage', DollarSign], ['↗ CAPACITY', 'Use people and parts well', Users], ['SAFETY', 'Act before risk escalates', Shield]] as const
  return (
    <Slide title="Value shows up on the floor" sub="Earlier signals turn uncertainty into planned, safer work.">
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="grid grid-cols-2 gap-3">
          {v.map(([k, d, I]) => (
            <Panel key={k} className="lift flex min-h-[11.5rem] flex-col justify-between"><I className="h-8 w-8 text-orange" strokeWidth={1.4} /><div><div className="font-display text-[1.45rem] font-bold">{k}</div><div className="mt-0.5 text-[1.1rem] leading-snug text-mute">{d}</div></div></Panel>
          ))}
        </div>
        <Photo src="/img/s3-03.webp" alt="Two technicians reviewing a tablet beside a pump" className="h-[18rem] lg:h-[24.5rem]" />
      </div>
    </Slide>
  )
}

/* 4 */
function S4() {
  const stages = [
    { n: '01', k: 'REACTIVE', a: 'Fix after failure', b: 'High disruption', i: Wrench },
    { n: '02', k: 'PREVENTIVE', a: 'Service by schedule', b: 'Some unnecessary work', i: ClipboardList },
    { n: '03', k: 'PREDICTIVE', a: 'Act on condition', b: 'Right work, right time', i: Activity },
  ]
  const { active, select } = useAutoSelect(3, 2400, 0)
  return (
    <Slide title="From reaction to anticipation">
      <div className="relative">
        <svg aria-hidden viewBox="0 0 900 120" className="absolute top-0 left-0 hidden h-[9rem] w-full lg:block" preserveAspectRatio="none">
          <path d="M0 110C200 110 260 80 430 70S720 40 900 8" fill="none" stroke="color-mix(in srgb, var(--color-orange) 50%, transparent)" strokeWidth="3" className="flow-dash" />
        </svg>
        <div className="relative grid gap-3 lg:grid-cols-3 lg:pt-3">
          {stages.map((s, i) => {
            const I = s.i
            return (
              <Panel key={s.k} hot={active === i} onClick={() => select(i)} className={cx('flex min-h-[20rem] flex-col', i === 0 && 'lg:mt-[6.5rem] lg:min-h-[15.5rem]', i === 1 && 'lg:mt-[3.5rem] lg:min-h-[18.5rem]', active === i && 'glass-o')}>
                <div className="flex items-center justify-between"><span className="num font-display text-[2.1rem] font-bold text-orange">{s.n}</span><I className="h-8 w-8 text-amber" strokeWidth={1.4} /></div>
                <div className="mt-3 font-display text-[1.55rem] font-bold tracking-wide">{s.k}</div>
                <p className="mt-2 text-[1.2rem]">{s.a}</p>
                <p className="mt-auto pt-3 text-[1.05rem] font-medium text-amber">{s.b}</p>
              </Panel>
            )
          })}
        </div>
      </div>
    </Slide>
  )
}

/* 5 */
const LENS = [
  { a: 'MG', k: 'Manager', c: 'lg:col-start-1 lg:row-start-1' },
  { a: 'OP', k: 'Operator', c: 'lg:col-start-3 lg:row-start-1' },
  { a: 'DA', k: 'Data Analyst', c: 'lg:col-start-1 lg:row-start-2' },
  { a: 'MT', k: 'Technician', c: 'lg:col-start-3 lg:row-start-2' },
]
function S5() {
  const { active, select } = useAutoSelect(4, 2000)
  return (
    <Slide title="Map the work through four lenses" sub="Journey mapping makes handoffs, interactions and ownership visible across the end-to-end maintenance process.">
      <div className="relative grid gap-3 lg:grid-cols-[1fr_1.2fr_1fr] lg:grid-rows-2">
        {LENS.map((l, i) => (
          <Panel key={l.a} hot={i === active} onClick={() => select(i)} className={cx('flex items-center gap-4 lg:min-h-[11rem]', l.c, i === active && 'glass-o')}>
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-orange bg-orange/15 font-display text-[1.5rem] font-bold text-amber">{l.a}</span>
            <span className="font-display text-[1.5rem] font-bold">{l.k}</span>
          </Panel>
        ))}
        <Rise className="row-start-1 grid place-items-center lg:col-start-2 lg:row-span-2">
          <div className="relative grid h-[17rem] w-[17rem] place-items-center rounded-full border border-orange/40 bg-gradient-to-br from-orange/20 to-transparent text-center">
            <motion.span aria-hidden className="absolute inset-[-0.7rem] rounded-full border-2 border-dashed border-orange/40" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: 'linear' }} />
            <div><Route className="mx-auto h-9 w-9 text-orange" strokeWidth={1.4} /><div className="mt-2 font-display text-[2rem] font-bold tracking-wide">JOURNEY</div><div className="mt-1 text-[1.02rem] text-mute">Observe • Map • Reframe</div></div>
          </div>
        </Rise>
      </div>
    </Slide>
  )
}

/* 6 */
const CURRENT = [
  { label: 'Operate', icon: Cog, who: 'OPERATOR: Monitors machines daily', pain: null, feel: null, opp: null },
  { label: 'Notice issue', icon: Eye, who: 'OPERATOR: Monitors machines daily', pain: 'Delayed failure detection', feel: null, opp: 'Denser sensor networks' },
  { label: 'Report', icon: Megaphone, who: 'OPERATOR to TECHNICIAN handoff', pain: 'Data silos + weak handoffs', feel: null, opp: 'Real-time mobile alerts' },
  { label: 'Diagnose', icon: Stethoscope, who: 'DATA ANALYST: Interprets sensor data', pain: 'Data silos + weak handoffs', feel: 'Skeptical after repeated false alarms', opp: 'Smarter analytics dashboards' },
  { label: 'Schedule', icon: ClipboardList, who: 'MANAGER: Guides maintenance strategy', pain: 'Inefficient scheduling', feel: null, opp: 'Cross-team collaboration' },
  { label: 'Repair', icon: Wrench, who: 'TECHNICIAN: Performs repairs', pain: 'Unexpected downtime', feel: 'Responsible for consequences beyond direct control', opp: null },
]
const Lane = ({ h, v, icon: I }: { h: string; v: string | null; icon?: any }) => (
  <div className="min-w-0 rounded-xl border border-hair bg-black/20 p-2.5">
    <div className="text-[0.74rem] font-semibold tracking-wider text-amber uppercase">{h}</div>
    <p className="mt-1 flex items-start gap-1.5 text-[1rem] leading-snug font-medium">{v ? <>{I && <I className="mt-[0.2rem] h-4 w-4 shrink-0 text-orange" />}{v}</> : <span className="font-normal text-dim">None listed for this stage</span>}</p>
  </div>
)
function S6() {
  const [a, setA] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => { if (!auto) return; const t = setInterval(() => setA((x) => (x + 1) % 6), 1900); return () => clearInterval(t) }, [auto])
  const s = CURRENT[a]
  return (
    <Slide title="Current maintenance journey" sub="Manual handoffs create delay between the first weak signal and completed repair.">
      <Rise className="glass rounded-2xl p-5"><Track stages={CURRENT} active={a} onSelect={(i) => { setAuto(false); setA(i) }} /></Rise>
      <div className="mt-3 grid gap-3 lg:grid-cols-[2.6fr_1fr]">
        <motion.div key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-o rounded-2xl p-3.5">
          <div className="kicker">Stage {a + 1}: {s.label}</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Lane h="Stakeholder touchpoint" v={s.who} icon={Users} />
            <Lane h="Pain point" v={s.pain} icon={AlertTriangle} />
            <Lane h="Emotion" v={s.feel} icon={Frown} />
            <Lane h="Opportunity" v={s.opp} icon={Lightbulb} />
          </div>
          <p className="mt-2 text-[0.74rem] leading-tight text-dim">Stage details are an interpretive cross-reference of this deck's slides 7, 8 and 18 and the Empathy Mapping deck's slide 10. The source slide lists only the six stage names.</p>
        </motion.div>
        <Photo src="/img/s3-06.webp" alt="Factory aisle with motors and pumps" className="h-[13.5rem] lg:h-auto" />
      </div>
    </Slide>
  )
}

/* 7 */
function S7() {
  const p = [['OP', 'OPERATOR', 'Monitors machines daily', Eye], ['MT', 'TECHNICIAN', 'Performs repairs', Wrench], ['DA', 'DATA ANALYST', 'Interprets sensor data', LineIcon], ['MG', 'MANAGER', 'Guides maintenance strategy', UserCog]] as const
  return (
    <Slide title="Four people. One shared outcome.">
      <div className="grid gap-3 lg:grid-cols-4">
        {p.map(([a, k, d, I]) => (
          <Panel key={a} className="lift group flex min-h-[20rem] flex-col items-center text-center">
            <span className="mt-3 grid h-24 w-24 place-items-center rounded-full border-2 border-orange/70 bg-orange/10 font-display text-[2rem] font-bold text-amber transition-colors group-hover:bg-orange group-hover:text-black">{a}</span>
            <I className="mt-4 h-6 w-6 text-mute" strokeWidth={1.4} />
            <div className="mt-2 font-display text-[1.32rem] font-bold tracking-wide">{k}</div>
            <p className="mt-2 text-[1.12rem] leading-snug text-mute">{d}</p>
          </Panel>
        ))}
      </div>
      <Rise className="relative mt-5 h-1"><div className="shimmer-line absolute inset-0 rounded-full" /></Rise>
    </Slide>
  )
}

/* 8 */
function S8() {
  const b = [['01', 'Unexpected downtime', Timer], ['02', 'Delayed failure detection', Bell], ['03', 'Data silos + weak handoffs', Database], ['04', 'Inefficient scheduling', ClipboardList]] as const
  return (
    <Slide title="Where the current journey breaks">
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="relative flex flex-col justify-between gap-2.5">
          {b.map(([n, k, I], i) => (
            <Rise key={n} className="flex items-center gap-3" style={{ marginLeft: `${i % 2 ? 2.2 : 0}rem` }}>
              <span className="relative grid h-11 w-11 shrink-0 place-items-center"><span className="pulse-ring absolute inset-1 rounded-full bg-bad/40" /><AlertTriangle className="relative h-6 w-6 text-[#ff8b7c]" strokeWidth={1.6} /></span>
              <div className="glass lift flex flex-1 items-center gap-3 rounded-2xl p-4"><span className="num font-display text-[1.5rem] font-bold text-orange">{n}</span><span className="flex-1 font-display text-[1.32rem] leading-tight font-semibold">{k}</span><I className="h-6 w-6 text-mute" strokeWidth={1.4} /></div>
            </Rise>
          ))}
        </div>
        <Photo src="/img/s3-08.webp" alt="Technician thinking over a tablet beside a motor" className="h-[18rem] lg:h-[25rem]" />
      </div>
    </Slide>
  )
}

/* 9 */
function S9() {
  const list = [['Vibration', Activity, 1], ['Temperature', Thermometer, 0.5], ['Pressure', Gauge, 0.7], ['Acoustic', Volume2, 1.3], ['Thermal imaging', Eye, 0.4]] as const
  const { active, select } = useAutoSelect(5, 1700)
  return (
    <Slide title="Every asset leaves a data trail" sub="Touchpoints along the journey convert physical behavior into observable signals.">
      <div className="grid gap-4 lg:grid-cols-[1.75fr_1fr]">
        <div className="flex flex-col gap-2">
          {list.map(([k, I, a], i) => (
            <Panel key={k} hot={i === active} onClick={() => select(i)} className="flex items-center gap-3 !py-2.5">
              <I className="h-5 w-5 shrink-0 text-amber" strokeWidth={1.6} /><span className="w-[10rem] shrink-0 font-display text-[1.14rem] font-semibold">{k}</span>
              <Wave seed={i + 1.3} amp={i === active ? a : a * 0.45} color={i === active ? 'var(--color-orange)' : '#6c7580'} className="h-[2.6rem] min-w-0 flex-1" speed={2 + i * 0.6} />
            </Panel>
          ))}
        </div>
        <Photo src="/img/s3-09.webp" alt="Thermal camera aimed at a motor coupling" className="h-[18rem] lg:h-[23.5rem]" />
      </div>
    </Slide>
  )
}

/* 10 */
function S10() {
  const st = [{ label: 'DATA\nACQUISITION', icon: Database, v: 'Collect' }, { label: 'PREPROCESSING', icon: Filter, v: 'clean' }, { label: 'ANALYTICS / AI', icon: BrainCircuit, v: 'learn' }, { label: 'DECISION\nSUPPORT', icon: CheckCircle2, v: 'act' }]
  const { active, select } = useAutoSelect(4, 1500)
  return (
    <Slide title="Raw signals become decisions" sub="A governed pipeline turns machine behavior into a recommendation people can trust.">
      <Rise className="glass relative overflow-hidden rounded-2xl p-7">
        <Track stages={st} active={active} onSelect={select} />
        <div aria-hidden className="relative mt-7 h-14 overflow-hidden rounded-lg border border-hair bg-black/30">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.span key={i} className="absolute top-1/2 block -translate-y-1/2 rounded-sm bg-amber" style={{ width: i % 2 ? '1.6rem' : '0.7rem', height: i % 2 ? '0.45rem' : '0.7rem' }}
              animate={{ left: ['-5%', '105%'] }} transition={{ repeat: Infinity, duration: 4.2, delay: i * 0.5, ease: 'linear' }} />
          ))}
        </div>
      </Rise>
      <Rise className="mt-4 text-center font-display text-[2rem] font-semibold">
        <Sr>Collect → clean → learn → act</Sr>
        <span aria-hidden>{st.map((s, i) => <span key={s.v}><span className={cx('transition-colors', i === active ? 'text-orange' : 'text-ink/70')}>{s.v}</span>{i < 3 && <span className="mx-2.5 text-mute">→</span>}</span>)}</span>
      </Rise>
    </Slide>
  )
}

/* 11 */
function S11() {
  const [th, setTh] = useState(72)
  const sig = (k: number) => 45 + Math.sin(k * 0.4) * 8 + Math.sin(k * 0.06) * 20 + 12 + Math.sin(k * 1.7) * 3
  const [d, setD] = useState(() => Array.from({ length: 70 }, (_, i) => ({ i, v: sig(i) })))
  useEffect(() => {
    let k = 70
    const t = setInterval(() => { k++; setD((x) => [...x.slice(1), { i: k, v: sig(k) }]) }, 160)
    return () => clearInterval(t)
  }, [])
  const over = d[d.length - 1].v > th
  return (
    <Slide title="See condition—not just status" sub="Continuous capture, threshold logic and trend analysis reveal change while there is still time to act." tag={<Tag kind="illustrative" label="Simulated signal" />}>
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <Panel>
          <div className="flex items-center gap-3">
            <label className="flex flex-1 items-center gap-2 text-[0.88rem] text-mute">Threshold<input type="range" min={45} max={90} value={th} onChange={(e) => setTh(Number(e.target.value))} aria-label="Threshold" /></label>
            <span className={cx('rounded-full border px-3 py-1 text-[0.86rem] font-semibold', over ? 'border-orange bg-orange/20 text-amber' : 'border-good/50 text-good')}>{over ? 'Escalated' : 'Normal'}</span>
          </div>
          <div className="mt-2 h-[19rem]">
            <ResponsiveContainer>
              <LineChart data={d} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}><Grid /><XAxis dataKey="i" hide /><YAxis domain={[20, 100]} {...axis} tick={false} width={8} />
                <ReferenceLine y={th} stroke="var(--color-orange)" strokeDasharray="5 5" label={{ value: 'Threshold', fill: 'var(--color-amber)', fontSize: '0.8rem', position: 'insideTopRight' }} />
                <Line dataKey="v" stroke="var(--color-cool)" strokeWidth={2} dot={false} isAnimationActive={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Panel><div className="font-display text-[1.05rem] font-bold text-amber">CONTINUOUS</div><p className="mt-1 text-[0.98rem] leading-snug">Capture every meaningful shift</p></Panel>
            <Panel><div className="font-display text-[1.05rem] font-bold text-amber">THRESHOLDS</div><p className="mt-1 text-[0.98rem] leading-snug">Escalate the right signal</p></Panel>
          </div>
          <Photo src="/img/s3-11.webp" alt="Thermal view of a motor and pump" className="h-[14rem] flex-1" />
        </div>
      </div>
    </Slide>
  )
}

/* 12 */
const NORMAL = [42, 44, 43, 45, 44, 46, 45, 47]; const OBS = [41, 45, 44, 46, 52, 67, 82, 91]
function S12() {
  const [upto, setUpto] = useState(8)
  const data = NORMAL.map((n, i) => ({ t: i + 1, Normal: n, Observed: i < upto ? OBS[i] : null }))
  return (
    <Slide title="AI finds the pattern break" sub="Anomaly detection learns normal multivariate behavior, then flags deviations that fixed thresholds can miss.">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Panel>
          <div className="flex items-center gap-3"><div className="font-display font-semibold">Normal vs observed signal</div>
            <label className="ml-auto flex w-[15rem] items-center gap-2 text-[0.84rem] text-mute">Time step <input type="range" min={1} max={8} value={upto} onChange={(e) => setUpto(Number(e.target.value))} aria-label="Reveal observed signal by time step" /></label>
          </div>
          <div className="mt-2 h-[21rem]">
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                <Grid /><XAxis dataKey="t" {...axis} /><YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} {...axis} width={34} />
                <Tooltip content={<ChartTip />} cursor={{ stroke: 'rgba(255,255,255,.2)' }} /><Legend wrapperStyle={legendStyle} verticalAlign="top" height={26} />
                <Line dataKey="Normal" stroke={SERIES.b} strokeWidth={2.4} dot={{ r: 4, fill: SERIES.b }} isAnimationActive={false} />
                <Line dataKey="Observed" stroke={SERIES.a} strokeWidth={2.4} dot={{ r: 4, fill: SERIES.a }} isAnimationActive={false} connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[0.74rem] text-dim">Values read from the chart image in the source deck.</div>
        </Panel>
        <Photo src="/img/s3-12.webp" alt="Bearing with connected sensor nodes, one glowing orange" className="h-[18rem] lg:h-[26.5rem]" />
      </div>
    </Slide>
  )
}

/* 13 */
const ZONES = [{ k: 'NOW', c: '#4ed18a' }, { k: 'WATCH', c: 'var(--color-amber)' }, { k: 'PLAN', c: 'var(--color-orange)' }, { k: 'INTERVENE', c: '#ff5a47' }]
function S13() {
  const [v, setV] = useState(20)
  const z = Math.min(3, Math.floor(v / 25))
  return (
    <Slide title="How much useful life remains?" sub="RUL estimates the operating window before likely failure—shifting the question from “what is wrong?” to “when should we intervene?”">
      <Rise className="glass rounded-2xl p-6">
        <div className="grid grid-cols-4 gap-1.5">
          {ZONES.map((x, i) => (
            <button key={x.k} type="button" aria-pressed={z === i} onClick={() => setV(i * 25 + 12)} className={cx('rounded-xl border py-4 font-display text-[1.32rem] font-bold tracking-wide transition-all', z === i ? 'scale-[1.03] text-black' : 'border-hair text-ink/75')} style={z === i ? { background: x.c, borderColor: x.c, boxShadow: `0 0 1.4rem ${x.c}66` } : undefined}>{x.k}</button>
          ))}
        </div>
        <label className="mt-5 block text-[0.9rem] text-mute" htmlFor="rul">Drag along the asset's remaining operating window</label>
        <input id="rul" type="range" min={0} max={99} value={v} onChange={(e) => setV(Number(e.target.value))} />
        <div className="relative mt-3 h-[7rem]">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M0 3C30 4 55 7 72 13S93 25 100 29" fill="none" stroke="var(--color-orange)" strokeWidth=".7" vectorEffect="non-scaling-stroke" />
            <line x1={v} x2={v} y1="0" y2="30" stroke="#F5F5F5" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="absolute bottom-0 left-0 text-[0.8rem] text-dim">Illustrative degradation path, no units</span>
        </div>
      </Rise>
    </Slide>
  )
}

/* 14 */
function S14() {
  const st = [{ label: 'ANOMALY\nDETECTED', icon: Search }, { label: 'ALERT\nGENERATED', icon: BellRing }, { label: 'OWNER\nNOTIFIED', icon: Users }, { label: 'RISK\nREVIEWED', icon: Shield }, { label: 'ACTION\nAPPROVED', icon: CheckCircle2 }]
  const r = useRunner(5, 950)
  const tags = ['Signal', 'context', 'accountability', 'decision']
  return (
    <Slide title="An alert is the start—not the outcome" sub="The decision journey must preserve context, ownership and urgency." tag={<RunButton running={r.running} onClick={r.run} label="Run chain" />}>
      <Rise className="glass rounded-2xl p-7"><Track stages={st} active={r.index} onSelect={r.select} /></Rise>
      <Rise className="mt-6 flex flex-wrap items-center justify-center gap-2.5 font-display text-[1.5rem] font-semibold">
        {tags.map((t, i) => <span key={t} className="flex items-center gap-2.5"><span className={cx('rounded-full border px-4 py-1.5', Math.round((r.index / 4) * 3) >= i ? 'border-orange bg-orange/15 text-amber' : 'border-hair text-mute')}>{t}</span>{i < 3 && <ArrowRight className="h-5 w-5 text-orange" />}</span>)}
        <Sr>Signal → context → accountability → decision</Sr>
      </Rise>
    </Slide>
  )
}

/* 15 */
function S15() {
  const st = ['Create work order', 'Dispatch technician', 'Repair asset', 'Verify condition']
  const r = useRunner(4, 1100)
  return (
    <Slide title="Execution closes the loop" sub="Timely response converts prediction into operational value." tag={<RunButton running={r.running} onClick={r.run} label="Run steps" />}>
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-2.5">
          {st.map((s, i) => (
            <Panel key={s} hot={i === r.index} onClick={() => r.select(i)} className={cx('flex items-center gap-4 !py-4', i <= r.index && 'glass-o')}>
              <span className="num font-display text-[1.9rem] font-bold text-orange">0{i + 1}</span><span className="font-display text-[1.4rem] font-semibold">{s}</span>
              {i < r.index && <CheckCircle2 className="ml-auto h-6 w-6 text-good" />}
            </Panel>
          ))}
        </div>
        <Photo src="/img/s3-15.webp" alt="Technician repairing a motor while a colleague records on a tablet" className="h-[18rem] lg:h-[24.5rem]" />
      </div>
    </Slide>
  )
}

/* 16 */
function S16() {
  const nodes = [{ label: 'MAINTENANCE\nOUTCOME', icon: Wrench }, { label: 'DATA\nVALIDATION', icon: Database }, { label: 'MODEL\nTUNING', icon: BrainCircuit }, { label: 'PROCESS\nREFINEMENT', icon: Cog }]
  const { active, select } = useAutoSelect(4, 2000)
  return (
    <Slide title="Every repair makes the system smarter" sub="Outcomes validate data, tune models and refine the maintenance process.">
      <Rise className="mx-auto w-full max-w-[29rem]">
        <Loop nodes={nodes} active={active} onSelect={select} size="29rem" center={<div><RefreshCcw className="mx-auto h-8 w-8 text-orange" strokeWidth={1.4} /><div className="mt-1 font-display text-[1.32rem] leading-tight font-bold">LEARN<br />& IMPROVE</div></div>} />
      </Rise>
    </Slide>
  )
}

/* 17 */
const FUTURE = [{ label: 'SENSE', icon: Activity }, { label: 'PRIORITIZE', icon: ListChecks }, { label: 'VERIFY', icon: Search }, { label: 'PREDICT', icon: BrainCircuit }, { label: 'ORCHESTRATE', icon: Handshake }, { label: 'LEARN', icon: RefreshCcw }]
function S17() {
  const [mode, setMode] = useState<'future' | 'current'>('future')
  const stages = mode === 'future' ? FUTURE : CURRENT
  const { active, select } = useAutoSelect(6, 1600)
  return (
    <Slide title="Future-state: signal to action, seamlessly" sub="Integrated AI and automated orchestration reduce delay while keeping people in control."
      tag={<div className="flex gap-1">{(['current', 'future'] as const).map((m) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cx('rounded-full border px-3 py-0.5 text-[0.84rem] capitalize', mode === m ? 'border-orange bg-orange text-black font-semibold' : 'border-line')}>{m} state</button>)}</div>}>
      <Rise className="glass rounded-2xl p-6"><Track stages={stages} active={active} onSelect={select} /></Rise>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_1fr]">
        <Panel orange className="flex flex-col justify-center">
          {mode === 'future'
            ? <p className="font-display text-[1.5rem] leading-tight font-semibold">Fewer handoffs • Faster decisions • Better experience</p>
            : <p className="font-display text-[1.5rem] leading-tight font-semibold">Manual handoffs create delay between the first weak signal and completed repair.</p>}
        </Panel>
        <Panel>
          <div className="kicker">Emotion lane</div>
          <div className="mt-2 flex items-center gap-3">
            {mode === 'future' ? <Smile className="h-9 w-9 shrink-0 text-good" strokeWidth={1.4} /> : <Frown className="h-9 w-9 shrink-0 text-[#ff8b7c]" strokeWidth={1.4} />}
            <p className="text-[1.12rem] leading-snug">{mode === 'future' ? 'Relieved when evidence and next steps are clear' : 'Skeptical after repeated false alarms'}</p>
          </div>
          <div className="mt-2 text-[0.74rem] text-dim">Cross-referenced from the Empathy Mapping deck, slide 10.</div>
        </Panel>
      </div>
      <Sr>Fewer handoffs • Faster decisions • Better experience</Sr>
    </Slide>
  )
}

/* 18 */
function S18() {
  const ideas = [['Denser sensor networks', Wifi], ['Real-time mobile alerts', Smartphone], ['Smarter analytics dashboards', BarChart3], ['Cross-team collaboration', Handshake]] as const
  const [picked, setPicked] = useState<number | null>(null)
  return (
    <Slide title="Where might we innovate?" sub="Use the journey to focus brainstorming on the moments with the greatest friction and value.">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ideas.map(([k, I], i) => (
            <Panel key={k} hot={picked === i} onClick={() => setPicked(picked === i ? null : i)} className={cx('flex min-h-[11.4rem] flex-col justify-between', picked === i && 'glass-o')}>
              <div className="flex items-center justify-between"><span className="num font-display text-[1.6rem] font-bold text-orange">0{i + 1}</span><I className="h-7 w-7 text-amber" strokeWidth={1.4} /></div>
              <div className="font-display text-[1.4rem] leading-tight font-semibold">{k}</div>
              {picked === i && <div className="flex items-center gap-1 text-[0.84rem] text-amber"><Lightbulb className="h-4 w-4" />Selected for discussion</div>}
            </Panel>
          ))}
        </div>
        <Photo src="/img/s3-18.webp" alt="Team brainstorming around a table with sticky notes and sensors" className="h-[18rem] lg:h-[23.6rem]" />
      </div>
    </Slide>
  )
}

/* 19 */
function S19() {
  const k = [['DOWNTIME', 'Reduction %', TrendingDown], ['COST', 'Savings', DollarSign], ['ALERTS', 'Accuracy', Bell], ['TECHNICIANS', 'Utilization', Users]] as const
  const ph = [['PILOT', '0–3 months', Flag], ['SCALE', '3–12 months', Rocket], ['OPTIMIZE', '12+ months', Sparkles]] as const
  const [p, setP] = useState(0)
  return (
    <Slide title="Measure value. Scale with intent.">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {k.map(([a, b, I]) => <Panel key={a} className="lift"><I className="h-7 w-7 text-orange" strokeWidth={1.4} /><div className="mt-3 font-display text-[1.25rem] font-bold">{a}</div><div className="text-[1.05rem] text-mute">{b}</div></Panel>)}
      </div>
      <Rise className="glass mt-4 rounded-2xl p-6">
        <div className="relative grid grid-cols-3 gap-2">
          {ph.map(([a, b, I], i) => (
            <button key={a} type="button" aria-pressed={p === i} onClick={() => setP(i)} className={cx('lift relative flex items-center gap-3 rounded-xl border p-4 text-left [clip-path:polygon(0_0,calc(100%-1rem)_0,100%_50%,calc(100%-1rem)_100%,0_100%)]', i <= p ? 'border-orange bg-orange/25' : 'border-hair bg-white/5')}>
              <I className="hidden h-7 w-7 shrink-0 text-amber sm:block" strokeWidth={1.4} /><span><span className="block font-display text-[1.3rem] font-bold">{a}</span><span className="num block text-[1.02rem] text-ink/80">{b}</span></span>
            </button>
          ))}
        </div>
      </Rise>
    </Slide>
  )
}

/* 20 */
function S20() {
  const pts = ['Predictive maintenance creates measurable value.', 'Journey mapping exposes stakeholders and friction.', 'Data turns signals into proactive action.', 'Feedback sustains continuous improvement.']
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1.45fr_1fr]">
      <Stagger>
        <Rise><h1 className="font-display text-[3.4rem] leading-[1.02] font-bold tracking-tight lg:text-[4.2rem]">Map the journey.<br /><span className="text-orange">Move before failure.</span></h1></Rise>
        <div className="mt-6 flex flex-col gap-2">
          {pts.map((p, i) => <Rise key={p} className="glass lift flex items-center gap-3 rounded-xl px-4 py-2.5"><span className="num font-display text-[1.25rem] font-bold text-orange">0{i + 1}</span><span className="text-[1.16rem] leading-snug">{p}</span></Rise>)}
        </div>
        <Rise className="mt-5 inline-block rounded-2xl border border-orange/60 bg-orange/15 px-5 py-3 font-display text-[1.45rem] font-semibold">What should we prototype first?</Rise>
      </Stagger>
      <Photo src="/img/s3-20.webp" alt="Turbine with sensors in a modern plant" className="h-[22rem] lg:h-[33rem]" />
    </div>
  )
}

export default [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20]
