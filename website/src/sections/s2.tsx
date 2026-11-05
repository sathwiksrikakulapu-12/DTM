import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  ArrowRight, BellRing, Brain, CheckCircle2, ClipboardList, Clock, Ear, Eye, Footprints, Gauge, Hand, Heart, HelpCircle, Lightbulb, ListChecks, MessageCircle, MessagesSquare, Phone, RefreshCcw,
  Search, Share2, ShieldQuestion, Sparkles, Target, TrendingUp, Users, Workflow, Wrench, Zap,
} from 'lucide-react'
import { Bar, BarChart, Line, LineChart } from 'recharts'
import { Flow, IconBadge, Panel, Photo, Rise, RunButton, Slide, Stagger, Tag, useAutoSelect, useRunner, cx, Sr } from '../ui/kit'
import { axis, ChartTip, Grid, Legend, legendStyle, ResponsiveContainer, SERIES, Tooltip, XAxis, YAxis } from '../ui/charts'
import { at, goSlide } from '../engine/store'

/* Studio look: warm paper-like notes on the dark canvas */
const Note = ({ children, className, tone = 0, onClick, hot }: { children: React.ReactNode; className?: string; tone?: number; onClick?: () => void; hot?: boolean }) => {
  const tones = ['from-[#3a2460]/70 to-[#171233]/90', 'from-[#2a2350]/70 to-[#12122a]/90', 'from-[#552350]/70 to-[#1d1230]/90']
  const Cmp: any = onClick ? motion.button : motion.div
  return (
    <Cmp type={onClick ? 'button' : undefined} onClick={onClick} variants={{ hidden: { opacity: 0, y: 12, rotate: -0.6 }, show: { opacity: 1, y: 0, rotate: 0 } }}
      className={cx('lift rounded-[1.25rem] border border-line bg-gradient-to-br p-4 text-left', tones[tone % 3], hot && 'hot', className)}>{children}</Cmp>
  )
}

const QUAD = [
  { k: 'SAY', i: MessageCircle, d: 'What is voiced', s: 7 },
  { k: 'THINK', i: Brain, d: 'What stays internal', s: 8 },
  { k: 'DO', i: Hand, d: 'What is observable', s: 9 },
  { k: 'FEEL', i: Heart, d: 'What work evokes', s: 10 },
]
function Locator({ active }: { active: string }) {
  return (
    <div aria-label={`Empathy map position: ${active}`} className="grid w-[8.2rem] shrink-0 grid-cols-2 gap-1 lg:absolute lg:top-0 lg:right-0">
      {QUAD.map((q) => (
        <button key={q.k} type="button" onClick={() => goSlide(at(2, q.s))} title={`Go to ${q.k}`} className={cx('rounded-md border py-1 font-display text-[0.68rem] font-semibold tracking-wider', q.k === active ? 'border-orange bg-orange text-black' : 'border-hair text-mute hover:border-orange/70')}>{q.k}</button>
      ))}
    </div>
  )
}

/* 1 */
function S1() {
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1.25fr_1fr]">
      <Stagger>
        <Rise className="kicker">Human-Centered Industrial Systems</Rise>
        <Rise><h1 className="mt-3 font-display text-[3.2rem] leading-[1.02] font-bold tracking-tight lg:text-[4.1rem]">Predictive Maintenance<br /><span className="text-orange">Through Empathy Mapping</span></h1></Rise>
        <Rise><p className="mt-5 max-w-[34rem] text-[1.25rem] leading-snug text-ink/85">Designing alerts, evidence, and actions around the real decisions of factory maintenance teams.</p></Rise>
      </Stagger>
      <Photo src="/img/s2-01.webp" alt="Technician kneeling with a tablet beside an industrial motor" className="h-[22rem] !rounded-[2rem] lg:h-[32rem]" pos="50% 30%" />
    </div>
  )
}

/* 2 */
function S2() {
  return (
    <Slide title="Why Predictive Maintenance Needs Empathy" sub="A technically correct alert can still fail in practice.">
      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_1.15fr_1fr]">
        <Note tone={1} className="flex flex-col items-center justify-center text-center lg:h-[21rem]">
          <Gauge className="h-12 w-12 text-cool" strokeWidth={1.3} /><div className="mt-3 font-display text-[1.5rem] font-bold tracking-wide">MACHINE SIGNALS</div>
          <svg viewBox="0 0 200 40" className="mt-3 w-full max-w-[13rem]" aria-hidden><path d="M0 20 20 20 28 6 38 34 48 14 56 20 90 20 98 8 108 32 118 20 150 20 158 10 166 30 174 20 200 20" stroke="var(--color-cool)" fill="none" strokeWidth="1.6" className="flow-dash" /></svg>
        </Note>
        <Rise className="relative flex flex-col justify-center rounded-[1.25rem] border border-orange/50 bg-orange/10 p-5 text-center">
          <div className="flex items-center justify-center gap-2"><ArrowRight className="h-5 w-5 text-orange" /><Sparkles className="h-6 w-6 text-amber" /><ArrowRight className="h-5 w-5 rotate-180 text-orange" /></div>
          <p className="mt-3 text-[1.24rem] leading-snug">Technology succeeds when it fits real work: shifting priorities, incomplete evidence, production pressure, safety constraints, and the technician’s need to act with confidence.</p>
        </Rise>
        <Note tone={2} className="flex flex-col items-center justify-center text-center lg:h-[21rem]">
          <Users className="h-12 w-12 text-amber" strokeWidth={1.3} /><div className="mt-3 font-display text-[1.5rem] font-bold tracking-wide">HUMAN JUDGMENT</div>
          <div className="mt-3 flex gap-1.5 text-[0.8rem] text-mute"><Eye className="h-5 w-5" /><Ear className="h-5 w-5" /><Hand className="h-5 w-5" /></div>
        </Note>
      </div>
    </Slide>
  )
}

/* 3 */
function S3() {
  const items = [...QUAD, { k: 'NEEDS', i: ListChecks, d: 'What must be enabled', s: 12 }, { k: 'INSIGHTS', i: Lightbulb, d: 'What opportunity emerges', s: 13 }]
  return (
    <Slide title="What Is Empathy Mapping?" sub="A shared view of what a user expresses, considers, does, and experiences—then synthesized into needs and design insights.">
      <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <div className="grid grid-cols-2 gap-3">
          {items.slice(0, 4).map(({ k, i: I, d, s }, x) => (
            <Note key={k} tone={x} onClick={() => goSlide(at(2, s))} className="group flex min-h-[10.5rem] flex-col justify-between">
              <div className="flex items-center justify-between"><I className="h-8 w-8 text-amber" strokeWidth={1.4} /><ArrowRight className="h-5 w-5 text-mute transition-transform group-hover:translate-x-1 group-hover:text-orange" /></div>
              <div><div className="font-display text-[1.65rem] font-bold tracking-wide">{k}</div><div className="text-[1.04rem] text-mute">{d}</div></div>
            </Note>
          ))}
        </div>
        <div className="grid grid-rows-2 gap-3">
          {items.slice(4).map(({ k, i: I, d, s }) => (
            <Note key={k} tone={2} onClick={() => goSlide(at(2, s))} className="group flex flex-col justify-between border-orange/50">
              <div className="flex items-center justify-between"><I className="h-8 w-8 text-orange" strokeWidth={1.4} /><ArrowRight className="h-5 w-5 text-mute transition-transform group-hover:translate-x-1 group-hover:text-orange" /></div>
              <div><div className="font-display text-[1.65rem] font-bold tracking-wide">{k}</div><div className="text-[1.04rem] text-mute">{d}</div></div>
            </Note>
          ))}
        </div>
      </div>
    </Slide>
  )
}

/* 4 */
function S4() {
  const [v, setV] = useState(50)
  const zone = v < 33 ? 0 : v > 67 ? 2 : 1
  return (
    <Slide title="The Challenge We Are Exploring">
      <Rise><p className="max-w-[50rem] font-display text-[1.8rem] leading-tight font-semibold">How might we detect failure early—without overwhelming the people responsible for responding?</p></Rise>
      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <Note tone={1} hot={zone === 0} onClick={() => setV(12)}><div className="font-display text-[1.25rem] font-bold">TOO LITTLE SIGNAL</div><p className="mt-1.5 text-[1.06rem] leading-snug text-mute">Late intervention, avoidable damage, unplanned downtime</p></Note>
        <Note tone={2} hot={zone === 1} onClick={() => setV(50)} className="text-center"><div className="font-display text-[1.7rem] leading-tight font-bold text-orange">TRUSTED<br />PRIORITY</div></Note>
        <Note tone={1} hot={zone === 2} onClick={() => setV(88)} className="text-right"><div className="font-display text-[1.25rem] font-bold">TOO MUCH NOISE</div><p className="mt-1.5 text-[1.06rem] leading-snug text-mute">False positives, alert fatigue, delayed or ignored response</p></Note>
      </div>
      <Rise className="glass mt-4 rounded-2xl p-4">
        <label className="block text-[0.9rem] text-mute" htmlFor="sens">Alert sensitivity: drag to feel the trade-off</label>
        <input id="sens" type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} />
        <div className="relative mt-2 flex h-12 items-end gap-[3px]" aria-hidden>
          {Array.from({ length: 56 }, (_, i) => {
            const active = (i * 37) % 100 < v
            const signal = i % 9 === 4
            return <motion.span key={i} className={cx('flex-1 rounded-sm', signal ? 'bg-orange' : 'bg-white/30')} animate={{ height: active ? (signal ? '100%' : `${25 + (i * 13) % 45}%`) : '6%', opacity: active ? 1 : 0.25 }} transition={{ duration: 0.25 }} />
          })}
        </div>
        <div className="mt-2 flex justify-between text-[0.8rem] text-dim"><span>Fewer alerts</span><span>Illustration only: bars are not data</span><span>More alerts</span></div>
      </Rise>
    </Slide>
  )
}

/* 5 */
function S5() {
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1fr_1.35fr]">
      <Photo src="/img/s2-05.webp" alt="Persona portrait: maintenance technician with a tablet" className="h-[22rem] !rounded-[2rem] lg:h-[32rem]" pos="50% 15%" />
      <Stagger>
        <Rise className="kicker">Meet the Primary Persona</Rise>
        <Rise><h1 className="mt-2 font-display text-[3.4rem] leading-none font-bold">Maya Chen</h1></Rise>
        <Rise className="mt-1.5 text-[1.3rem] font-medium text-amber">Senior Maintenance Technician</Rise>
        <Rise><p className="mt-4 text-[1.2rem] leading-snug text-ink/90">Maya keeps a high-throughput plant running across rotating shifts. She balances planned work, urgent calls, safety checks, spare-part limits, and constant coordination with operations.</p></Rise>
        <div className="mt-4 flex flex-wrap gap-2">
          {[['planned work', ClipboardList], ['urgent calls', Phone], ['safety checks', ShieldQuestion], ['spare-part limits', Wrench], ['coordination with operations', MessagesSquare]].map(([l, I]: any) => <Rise key={l} className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.88rem]"><I className="h-4 w-4 text-amber" />{l}</Rise>)}
        </div>
        <Note tone={2} className="mt-5 border-orange/60"><div className="flex items-center gap-2"><Target className="h-5 w-5 text-orange" /><span className="kicker">Core Goal</span></div><p className="mt-1.5 font-display text-[1.65rem] leading-tight font-semibold">Prevent downtime without wasting attention.</p></Note>
      </Stagger>
    </div>
  )
}

/* 6 */
const DAY = [
  { t: '06:30', k: 'Shift handover', i: Share2 },
  { t: '08:10', k: 'Routine rounds', i: Footprints },
  { t: '10:25', k: 'Urgent line call', i: Phone },
  { t: '13:40', k: 'Verify sensor alert', i: BellRing },
  { t: '15:20', k: 'Close work order', i: CheckCircle2 },
]
function S6() {
  const r = useRunner(5, 1100)
  return (
    <Slide title="Context: A Day on the Plant Floor" sub="Maya’s attention is continuously reprioritized. Planned inspections compete with line stoppages, radio calls, permits, parts searches, handovers, and documentation." tag={<RunButton running={r.running} onClick={r.run} label="Play the day" />}>
      <div className="grid gap-4 lg:grid-cols-[1.75fr_1fr]">
        <div className="relative flex flex-col justify-between gap-2">
          <div aria-hidden className="absolute top-4 bottom-4 left-[3.72rem] w-[2px] bg-white/10"><motion.div className="w-full bg-orange shadow-[0_0_.6rem_var(--color-orange)]" animate={{ height: `${(r.index / 4) * 100}%` }} transition={{ duration: 0.4 }} /></div>
          {DAY.map(({ t, k, i: I }, x) => (
            <button key={t} type="button" aria-pressed={x === r.index} onClick={() => r.select(x)} className="group relative flex items-center gap-3 text-left">
              <span className="num w-[2.8rem] shrink-0 text-right font-display text-[0.95rem] font-semibold text-amber">{t}</span>
              <span className={cx('relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border', x <= r.index ? 'border-orange bg-orange text-black' : 'border-line bg-[#0d1224] text-amber')}><I className="h-4 w-4" /></span>
              <span className={cx('glass lift flex-1 rounded-xl px-4 py-3 font-display text-[1.25rem] font-semibold', x === r.index && 'hot glass-o')}>{k}</span>
            </button>
          ))}
        </div>
        <Photo src="/img/s2-06.webp" alt="Technicians walking a busy production line" className="h-[18rem] !rounded-[2rem] lg:h-[24rem]" />
      </div>
    </Slide>
  )
}

/* 7-10 quadrant slides */
function S7() {
  const say = ['“Tell me which asset needs attention first.”', '“Show me why the risk changed.”', '“I need enough evidence to justify stopping the line.”']
  return (
    <Slide kicker="Empathy map" title="SAY: What Users Say" tag={<Locator active="SAY" />}>
      <div className="flex flex-col gap-4 lg:pt-3">
        {say.map((s, i) => (
          <Rise key={s} className={cx('relative max-w-[46rem]', i === 1 && 'lg:ml-[9rem]', i === 2 && 'lg:ml-[18rem]')}>
            <div className="lift rounded-[1.6rem] rounded-bl-md border border-line bg-gradient-to-br from-[#3a2460]/70 to-[#171233]/90 p-6 font-display text-[1.65rem] leading-tight font-semibold">{s}</div>
          </Rise>
        ))}
      </div>
    </Slide>
  )
}
function S8() {
  const think = ['Is this a real failure pattern—or another spike?', 'What changed since the last inspection?', 'Will operations support the intervention now?']
  return (
    <Slide kicker="Empathy map" title="THINK: What Users Think" tag={<Locator active="THINK" />}>
      <div className="grid gap-4 lg:grid-cols-3 lg:pt-3">
        {think.map((s, i) => (
          <Note key={s} tone={1} className={cx('flex min-h-[17rem] flex-col justify-between', i === 1 && 'lg:mt-8', i === 2 && 'lg:mt-16')}>
            <HelpCircle className="h-9 w-9 text-cool" strokeWidth={1.3} /><p className="font-display text-[1.55rem] leading-tight font-semibold">{s}</p>
          </Note>
        ))}
      </div>
    </Slide>
  )
}
function S9() {
  const list = [['Cross-checks vibration, temperature, and sound', Gauge], ['Calls the operator for recent context', Phone], ['Uses spreadsheets, notes, and memory to verify', ClipboardList]] as const
  return (
    <Slide kicker="Empathy map" title="DO: What Users Do" tag={<Locator active="DO" />}>
      <div className="grid gap-3 lg:pt-3">
        {list.map(([s, I], i) => (
          <Rise key={s} className="glass lift flex items-center gap-5 rounded-[1.25rem] p-5">
            <span className="num font-display text-[2.6rem] leading-none font-bold text-orange/60">{i + 1}</span>
            <IconBadge icon={I} className="!h-14 !w-14 !rounded-2xl" size="1.8rem" />
            <p className="font-display text-[1.55rem] leading-tight font-semibold">{s}</p>
          </Rise>
        ))}
      </div>
    </Slide>
  )
}
function S10() {
  const feel = [['Responsible for consequences beyond direct control', 'bg-orange'], ['Skeptical after repeated false alarms', 'bg-cool'], ['Relieved when evidence and next steps are clear', 'bg-good']] as const
  return (
    <Slide kicker="Empathy map" title="FEEL: What Users Feel" tag={<Locator active="FEEL" />}>
      <div className="grid gap-4 lg:grid-cols-3 lg:pt-3">
        {feel.map(([s, c]) => (
          <Note key={s} tone={2} className="flex min-h-[19rem] flex-col justify-between">
            <span className="relative block h-10 w-10"><span className={cx('pulse-ring absolute inset-0 rounded-full', c)} /><span className={cx('absolute inset-2 rounded-full', c)} /></span>
            <p className="font-display text-[1.55rem] leading-tight font-semibold">{s}</p>
          </Note>
        ))}
      </div>
    </Slide>
  )
}

/* 11 */
function S11() {
  const stages = [['Detect', 'Fragmented data', Search], ['Interpret', 'Weak evidence', Brain], ['Prioritize', 'Unclear urgency', ListChecks], ['Coordinate', 'Response delays', MessagesSquare], ['Act', 'Poor feedback loop', RefreshCcw]] as const
  const { active, select } = useAutoSelect(5, 2200)
  return (
    <Slide title="Pain Points Across the Workflow">
      <div className="relative mt-6 grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div aria-hidden className="shimmer-line absolute top-7 right-[8%] left-[8%] hidden h-[2px] lg:block" />
        {stages.map(([k, p, I], i) => (
          <motion.button key={k} type="button" aria-pressed={i === active} onClick={() => select(i)} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="relative z-10 flex flex-col items-center text-center">
            <span className={cx('num grid h-14 w-14 place-items-center rounded-full border-2 font-display text-[1.4rem] font-bold transition-all', i === active ? 'border-orange bg-orange text-black shadow-[0_0_1.4rem_color-mix(in_srgb,var(--color-orange)_60%,transparent)]' : 'border-line bg-[#0d1224] text-amber')}>{i + 1}</span>
            <span className="mt-2 font-display text-[1.32rem] font-semibold">{k}</span>
            <I className="mt-3 h-6 w-6 text-mute" strokeWidth={1.4} />
            <span className={cx('lift mt-3 w-full rounded-[1.1rem] border p-4 font-display text-[1.2rem] leading-tight font-semibold transition-all lg:min-h-[8.5rem]', i === active ? 'border-orange/80 bg-orange/15' : 'border-hair bg-white/[.03] text-ink/85')}>{p}</span>
          </motion.button>
        ))}
      </div>
    </Slide>
  )
}

/* 12 */
function S12() {
  const needs = ['One trusted view of asset health', 'Priority tied to operational risk', 'Evidence that supports verification', 'A clear next action and owner', 'Feedback that improves future alerts']
  return (
    <Slide title="What Users Need">
      <div className="flex flex-col gap-2.5">
        {needs.map((s, i) => (
          <Rise key={s} style={{ marginLeft: `${i * 3.4}rem` }} className="max-lg:!ml-0">
            <div className="glass lift flex items-center gap-4 rounded-[1.1rem] p-3.5">
              <span className="num grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange font-display text-[1.15rem] font-bold text-black">{i + 1}</span>
              <p className="font-display text-[1.42rem] leading-tight font-semibold">{s}</p>
            </div>
          </Rise>
        ))}
      </div>
    </Slide>
  )
}

/* 13 */
function S13() {
  const list = ['Trust grows from explainable evidence—not prediction scores alone.', 'Technicians already verify; good design shortens and strengthens that loop.', 'Urgency is contextual: asset risk must be connected to production impact.', 'Every resolved alert is a learning opportunity for both people and models.']
  const { active, select } = useAutoSelect(4, 3000)
  return (
    <Slide title="INSIGHTS: What We Learned">
      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((s, i) => (
          <Note key={s} tone={i === active ? 2 : 1} hot={i === active} onClick={() => select(i)} className="min-h-[12.8rem]">
            <Lightbulb className={cx('h-8 w-8 transition-colors', i === active ? 'fill-amber/30 text-amber' : 'text-mute')} strokeWidth={1.3} />
            <p className="mt-3 font-display text-[1.5rem] leading-tight font-semibold">{s}</p>
          </Note>
        ))}
      </div>
    </Slide>
  )
}

/* 14 */
function S14() {
  const rows = [
    ['Relevant', 'Rank by operational consequence', 'Top risk understood in < 10 sec', Target],
    ['Explainable', 'Expose signal, trend, and context', 'Evidence available in one view', Eye],
    ['Actionable', 'Name next step, owner, and timing', 'No dead-end alerts', Zap],
    ['Adaptive', 'Capture resolution feedback', 'Alert quality improves over time', TrendingUp],
  ] as const
  return (
    <Slide title="From Empathy to Design Criteria">
      <div className="grid gap-3 lg:grid-cols-4">
        {rows.map(([k, how, test, I]) => (
          <Note key={k} tone={0} className="flex min-h-[23rem] flex-col">
            <IconBadge icon={I} className="!h-12 !w-12" size="1.5rem" />
            <div className="mt-3 font-display text-[1.65rem] font-bold">{k}</div>
            <p className="mt-3 text-[1.14rem] leading-snug text-ink/90">{how}</p>
            <div className="mt-auto flex items-start gap-2 rounded-xl border border-orange/40 bg-orange/10 p-3 text-[1.02rem] leading-snug font-medium"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange" />{test}</div>
          </Note>
        ))}
      </div>
    </Slide>
  )
}

/* 15 */
function S15() {
  const items = [['Risk-based', 'alert triage', ListChecks], ['Evidence-led', 'verification', Search], ['Workflow-aware', 'coordination', Workflow], ['Closed-loop', 'learning', RefreshCcw]] as const
  return (
    <Slide title="Opportunity Areas">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map(([a, b, I], i) => (
          <Note key={a} tone={i} className="group relative min-h-[12.6rem] overflow-hidden">
            <span aria-hidden className="absolute -top-5 -right-1 font-display text-[8rem] leading-none font-bold text-white/[.05] transition-colors group-hover:text-orange/15">{i + 1}</span>
            <I className="h-9 w-9 text-amber" strokeWidth={1.3} />
            <p className="mt-5 font-display text-[1.9rem] leading-[1.08] font-bold">{a}<br /><span className="text-amber">{b}</span></p>
          </Note>
        ))}
      </div>
    </Slide>
  )
}

/* 16 */
const SIGNAL = [
  { t: '08:00', Vibration: 42, Temperature: 48 }, { t: '10:00', Vibration: 46, Temperature: 49 }, { t: '12:00', Vibration: 55, Temperature: 49 },
  { t: '14:00', Vibration: 63, Temperature: 50 }, { t: '16:00', Vibration: 71, Temperature: 50 },
]
function S16() {
  const [vis, setVis] = useState({ Vibration: true, Temperature: true })
  const [ack, setAck] = useState(false)
  return (
    <Slide title="A Better Predictive-Maintenance Experience" tag={<Tag kind="deck" label="Concept UI from source deck" />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
        <Rise className="glass-o rounded-[1.5rem] p-5">
          <div className="flex items-center justify-between">
            <div className="font-display text-[1.75rem] font-bold">PUMP P-204</div>
            <span className="relative flex items-center gap-1.5 rounded-full bg-orange px-3 py-0.5 font-display text-[0.9rem] font-bold text-black">NOW</span>
          </div>
          <div className="mt-1 text-[1.2rem]">Health risk: <span className="font-bold text-[#ff8b7c]">HIGH</span></div>
          <div className="mt-4 kicker">Evidence</div>
          <p className="mt-1 text-[1.12rem] leading-snug">Vibration trend +18% · Temperature stable</p>
          <p className="mt-1 text-[1.12rem] leading-snug">Pattern matches bearing wear</p>
          <div className="mt-4 rounded-xl border border-orange/60 bg-black/30 p-3.5">
            <div className="kicker">Next Action</div>
            <p className="mt-1 font-display text-[1.32rem] leading-tight font-semibold">Inspect drive-end bearing within 4 hours</p>
            <button type="button" aria-pressed={ack} onClick={() => setAck(!ack)} className={cx('mt-3 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.9rem]', ack ? 'border border-good/60 bg-good/10 text-good' : 'btn-primary')}>
              {ack ? <><CheckCircle2 className="h-4 w-4" />Acknowledged by owner (demo)</> : 'Acknowledge action (demo)'}
            </button>
          </div>
        </Rise>
        <Panel className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-display text-[1.1rem] font-semibold">Signal evidence</div>
            <div className="flex gap-2">
              {(['Vibration', 'Temperature'] as const).map((k) => (
                <button key={k} type="button" aria-pressed={vis[k]} onClick={() => setVis((v) => ({ ...v, [k]: !v[k] }))} className={cx('flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.8rem]', vis[k] ? 'border-line' : 'border-hair text-dim')}>
                  <span className="h-2 w-2 rounded-full" style={{ background: k === 'Vibration' ? SERIES.a : SERIES.b, opacity: vis[k] ? 1 : 0.3 }} />{k}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 h-[23rem]">
            <ResponsiveContainer>
              <LineChart data={SIGNAL} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
                <Grid /><XAxis dataKey="t" {...axis} /><YAxis domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} {...axis} width={34} />
                <Tooltip content={<ChartTip />} cursor={{ stroke: 'rgba(255,255,255,.2)' }} />
                {vis.Vibration && <Line dataKey="Vibration" stroke={SERIES.a} strokeWidth={2.5} dot={{ r: 4, fill: SERIES.a }} animationDuration={700} />}
                {vis.Temperature && <Line dataKey="Temperature" stroke={SERIES.b} strokeWidth={2.5} dot={{ r: 4, fill: SERIES.b }} animationDuration={700} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[0.74rem] text-dim">Values read from the chart image in the source deck.</div>
        </Panel>
      </div>
    </Slide>
  )
}

/* 17 */
function S17() {
  const steps = [
    { label: 'Detect', desc: 'Anomaly appears', icon: BellRing }, { label: 'Triage', desc: 'Risk is ranked', icon: ListChecks }, { label: 'Verify', desc: 'Evidence checked', icon: Search },
    { label: 'Coordinate', desc: 'Window agreed', icon: MessagesSquare }, { label: 'Resolve', desc: 'Action recorded', icon: CheckCircle2 },
  ]
  const r = useRunner(5, 900)
  return (
    <Slide title="Example User Journey" tag={<RunButton running={r.running} onClick={r.run} label="Play journey" />}>
      <div className="flex min-h-[22rem] flex-col justify-center gap-6">
        <div className="relative h-3 rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-gradient-to-r from-orange to-amber shadow-[0_0_1rem_color-mix(in_srgb,var(--color-orange)_60%,transparent)]" animate={{ width: `${((r.index + 1) / 5) * 100}%` }} transition={{ duration: 0.45 }} /></div>
        <div className="grid gap-3 lg:grid-cols-5">
          {steps.map((s, i) => {
            const I = s.icon
            return (
              <Note key={s.label} tone={i <= r.index ? 2 : 1} hot={i === r.index} onClick={() => r.select(i)} className="min-h-[14rem]">
                <div className="flex items-center justify-between"><span className="num font-display text-[2rem] font-bold text-amber">{i + 1}</span><I className="h-7 w-7 text-amber" strokeWidth={1.4} /></div>
                <div className="mt-5 font-display text-[1.5rem] font-bold">{s.label}</div>
                <p className="mt-1 text-[1.15rem] text-mute">{s.desc}</p>
              </Note>
            )
          })}
        </div>
      </div>
    </Slide>
  )
}

/* 18 */
const TARGETS = [
  { m: 'Alert precision', Baseline: 58, Target: 85 }, { m: 'Time to verify', Baseline: 42, Target: 75 },
  { m: 'Action completion', Baseline: 64, Target: 90 }, { m: 'User confidence', Baseline: 55, Target: 88 },
]
function S18() {
  const [show, setShow] = useState<'both' | 'Baseline' | 'Target'>('both')
  return (
    <Slide title="How We Could Measure Success" sub="Balance operational outcomes with the quality of the human decision experience." tag={<Tag kind="illustrative" label="Illustrative success targets" />}>
      <Panel className="flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="font-display text-[1.1rem] font-semibold">Illustrative success targets</div>
          <div className="flex gap-1.5">
            {(['both', 'Baseline', 'Target'] as const).map((k) => <button key={k} type="button" aria-pressed={show === k} onClick={() => setShow(k)} className={cx('rounded-full border px-3 py-0.5 text-[0.82rem] capitalize', show === k ? 'border-orange bg-orange/20 text-amber' : 'border-hair text-mute')}>{k}</button>)}
          </div>
        </div>
        <div className="mt-2 h-[24rem]">
          <ResponsiveContainer>
            <BarChart data={TARGETS} layout="vertical" margin={{ top: 4, right: 40, left: 12, bottom: 0 }} barGap={3} barCategoryGap="22%">
              <Grid />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} {...axis} />
              <YAxis type="category" dataKey="m" width={130} {...axis} />
              <Tooltip content={<ChartTip unit="%" />} cursor={{ fill: 'rgba(255,255,255,.04)' }} />
              <Legend wrapperStyle={legendStyle} verticalAlign="top" height={28} />
              {show !== 'Target' && <Bar dataKey="Baseline" fill={SERIES.b} radius={[0, 4, 4, 0]} animationDuration={600} label={{ position: 'right', fill: '#A6ADB7', fontSize: '0.8rem', formatter: (v: number) => `${v}%` }} />}
              {show !== 'Baseline' && <Bar dataKey="Target" fill={SERIES.a} radius={[0, 4, 4, 0]} animationDuration={600} label={{ position: 'right', fill: '#F5F5F5', fontSize: '0.8rem', formatter: (v: number) => `${v}%` }} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-[0.74rem] text-dim">Values read from the chart image in the source deck, which labels them illustrative.</div>
      </Panel>
    </Slide>
  )
}

/* 19 */
const MAP = [
  { k: 'SAY', i: MessageCircle, short: 'Priority first · Show why · Support the stop decision', full: ['“Tell me which asset needs attention first.”', '“Show me why the risk changed.”', '“I need enough evidence to justify stopping the line.”'] },
  { k: 'THINK', i: Brain, short: 'Is it real? · What changed? · Will operations act?', full: ['Is this a real failure pattern—or another spike?', 'What changed since the last inspection?', 'Will operations support the intervention now?'] },
  { k: 'DO', i: Hand, short: 'Cross-check signals · Ask operators · Use workarounds', full: ['Cross-checks vibration, temperature, and sound', 'Calls the operator for recent context', 'Uses spreadsheets, notes, and memory to verify'] },
  { k: 'FEEL', i: Heart, short: 'Responsible · Skeptical · Relieved by clarity', full: ['Responsible for consequences beyond direct control', 'Skeptical after repeated false alarms', 'Relieved when evidence and next steps are clear'] },
  { k: 'NEEDS', i: ListChecks, short: 'Trusted view · Contextual priority · Evidence · Clear action', full: ['One trusted view of asset health', 'Priority tied to operational risk', 'Evidence that supports verification', 'A clear next action and owner', 'Feedback that improves future alerts'] },
  { k: 'INSIGHTS', i: Lightbulb, short: 'Explain trust · Connect risk · Shorten verification · Learn', full: ['Trust grows from explainable evidence—not prediction scores alone.', 'Technicians already verify; good design shortens and strengthens that loop.', 'Urgency is contextual: asset risk must be connected to production impact.', 'Every resolved alert is a learning opportunity for both people and models.'] },
]
function S19() {
  const [a, setA] = useState(0)
  const cur = MAP[a]
  return (
    <Slide title="Complete Empathy Map" tag={<span className="text-[0.84rem] text-mute">Select any part of the map to open its detail</span>}>
      <div className="grid gap-3 lg:grid-cols-[1.75fr_1fr]">
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {MAP.slice(0, 4).map(({ k, i: I, short }, x) => (
              <Note key={k} tone={x} hot={a === x} onClick={() => setA(x)} className="min-h-[8.2rem] !p-3.5"><div className="flex items-center gap-2"><I className="h-5 w-5 text-amber" /><span className="font-display text-[1.25rem] font-bold">{k}</span></div><p className="mt-1.5 text-[1.05rem] leading-snug">{short}</p></Note>
            ))}
          </div>
          {MAP.slice(4).map(({ k, i: I, short }, x) => (
            <Note key={k} tone={2} hot={a === x + 4} onClick={() => setA(x + 4)} className="flex flex-wrap items-center gap-x-3 gap-y-1 !p-3.5"><span className="flex items-center gap-2"><I className="h-5 w-5 text-orange" /><span className="font-display text-[1.15rem] font-bold">{k}</span></span><span className="text-[1.05rem] leading-snug">{short}</span></Note>
          ))}
        </div>
        <Rise className="glass-o rounded-[1.25rem] p-4">
          <motion.div key={cur.k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            <div className="font-display text-[1.5rem] font-bold text-amber">{cur.k}</div>
            <ul className="mt-2 space-y-2">{cur.full.map((f) => <li key={f} className="border-b border-hair pb-2 text-[1.04rem] leading-snug last:border-0">{f}</li>)}</ul>
          </motion.div>
        </Rise>
      </div>
    </Slide>
  )
}

/* 20 */
function S20() {
  return (
    <div className="grid min-h-full place-items-center">
      <Stagger className="max-w-[58rem] text-center">
        <Rise className="kicker">The Central Takeaway</Rise>
        <Rise><h1 className="mt-3 font-display text-[3.8rem] leading-[1.02] font-bold tracking-tight lg:text-[5rem]">Design for people,<br /><span className="text-orange">not just machines.</span></h1></Rise>
        <Rise><p className="mx-auto mt-5 max-w-[46rem] text-[1.3rem] leading-snug text-ink/90">Start with real maintenance work. Make risk explainable. Turn evidence into a clear next action. Capture outcomes so the system—and the team—keeps learning.</p></Rise>
        <Rise className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <span className="kicker mr-1">Next:</span>
          {['Observe', 'Co-design', 'Prototype', 'Measure'].map((s, i) => <span key={s} className="flex items-center gap-2"><span className="glass rounded-full px-4 py-1.5 font-display text-[1.08rem] font-semibold">{s}</span>{i < 3 && <ArrowRight className="h-4 w-4 text-orange" />}</span>)}
          <Sr>NEXT: Observe · Co-design · Prototype · Measure</Sr>
        </Rise>
      </Stagger>
    </div>
  )
}

export default [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20]
