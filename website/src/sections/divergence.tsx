import { motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { AlertTriangle, ArrowRight, Check, CircleDollarSign, Cog, Expand, Gauge, HeartHandshake, Play, RotateCcw, Shrink, Target, Trophy, Users } from 'lucide-react'
import { Panel, Rise, Slide, Tag, cx } from '../ui/kit'

const Added = () => <Tag kind="web" label="Added: design-thinking method applied to the topic" />

/* ---------- ideas used across this section ---------- */
type Crit = 'user' | 'tech' | 'cost' | 'impact'
const IDEAS: { k: string; d: string; s: Record<Crit, number>; why: string }[] = [
  { k: 'Threshold alerts', d: 'Fixed limits on vibration and temperature.', s: { user: 3, tech: 5, cost: 5, impact: 2 }, why: 'Transparent and fast, but it can miss patterns and may raise false alarms.' },
  { k: 'Anomaly alert copilot', d: 'Learned baselines, with evidence and a next action.', s: { user: 5, tech: 4, cost: 4, impact: 4 }, why: 'Works with few fault labels and answers the needs found in Empathy Mapping.' },
  { k: 'Full RUL forecasting', d: 'A time-to-failure estimate for each asset.', s: { user: 4, tech: 2, cost: 2, impact: 5 }, why: 'Very useful for planning, but it needs clear degradation history.' },
  { k: 'Digital twin', d: 'A virtual replica for testing scenarios.', s: { user: 3, tech: 2, cost: 1, impact: 4 }, why: 'Powerful context, but costly, and not every asset justifies it.' },
  { k: 'Better manual rounds', d: 'Digital checklists and handheld tools.', s: { user: 4, tech: 5, cost: 4, impact: 2 }, why: 'Simple and human, but infrequent and variable.' },
  { k: 'Fleet monitoring service', d: 'A subscription that compares machines across sites.', s: { user: 3, tech: 3, cost: 3, impact: 4 }, why: 'Scales learning across sites, but depends on connectivity and proof of value.' },
]
const CRIT: { k: Crit; l: string; i: any; q: string; ex: string }[] = [
  { k: 'user', l: 'User needs', i: Users, q: 'Does it solve a need that real users voiced?', ex: 'From Empathy Mapping: “Tell me which asset needs attention first.”' },
  { k: 'tech', l: 'Technical viability', i: Cog, q: 'Can it work with the data and systems available?', ex: 'From Problem Sizing: missing or inaccessible data is an evaluation setback.' },
  { k: 'cost', l: 'Cost', i: CircleDollarSign, q: 'Is the investment reasonable for the likely return?', ex: 'From Problem Sizing: price must leave a visible, credible surplus for the customer.' },
  { k: 'impact', l: 'Impact', i: Gauge, q: 'How much downtime, cost or risk could it remove?', ex: 'From the Engineering Students deck: value spans uptime, quality, safety, cost and resources.' },
]

/* ---------- double diamond ---------- */
const STAGES = [
  { k: 'Discover', mode: 'Diverge', x: 25, y: 20, d: 'Explore the problem broadly: interview people, observe work and map the journey.', ex: 'Empathy Mapping and Journey Mapping widen our view of maintenance work.' },
  { k: 'Define', mode: 'Converge', x: 25, y: 75, d: 'Narrow to the problem worth solving.', ex: 'Problem Sizing: which machines, users and contexts are costly enough?' },
  { k: 'Develop', mode: 'Diverge', x: 75, y: 20, d: 'Generate many possible solutions.', ex: 'Brainstorming: sensors, analytics, workflow and service ideas.' },
  { k: 'Deliver', mode: 'Converge', x: 75, y: 75, d: 'Test, evaluate and select what to build.', ex: 'Decision matrix, pilot and validation plan.' },
]
function Diamond() {
  const [a, setA] = useState(0); const s = STAGES[a]
  return (
    <Slide kicker="Design-thinking stages" title="The Two Stages of Design Thinking" sub="Design thinking alternates between opening up possibilities and narrowing them down. The double diamond is a common way to picture this." tag={<Added />}>
      <div className="grid items-center gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Rise className="glass relative rounded-2xl p-3">
          <svg viewBox="0 0 400 190" className="h-[19rem] w-full" role="img" aria-label="Double diamond: discover and define, then develop and deliver">
            <defs><linearGradient id="dd1" x1="0" x2="1"><stop offset="0" stopColor="var(--color-amber)" /><stop offset=".5" stopColor="var(--color-orange)" /><stop offset="1" stopColor="var(--color-cool)" /></linearGradient></defs>
            {[[10, 195], [205, 390]].map(([x0, x1], i) => <motion.path key={i} d={`M${x0} 95L${(x0 + x1) / 2} 12L${x1} 95L${(x0 + x1) / 2} 178Z`} fill="color-mix(in srgb, var(--color-orange) 12%, transparent)" stroke="url(#dd1)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: i * 0.3 }} />)}
            {STAGES.map((t, i) => { const cx0 = i < 2 ? 102 : 298; const cy = i % 2 === 0 ? 65 : 128; return (
              <g key={t.k} onClick={() => setA(i)} role="button" aria-label={t.k} className="cursor-pointer">
                <rect x={cx0 - 40} y={cy - 16} width="80" height="32" rx="10" fill={a === i ? 'var(--color-orange)' : '#0d1224'} stroke="var(--color-orange)" />
                <text x={cx0} y={cy - 1} textAnchor="middle" fontSize="12" fontWeight="700" fill={a === i ? '#070a16' : '#F6F7FB'} fontFamily="Space Grotesk Variable">{t.k}</text>
                <text x={cx0} y={cy + 11} textAnchor="middle" fontSize="8" fill={a === i ? '#070a16' : '#aab3c5'}>{t.mode}</text>
              </g>
            ) })}
          </svg>
          <div className="mt-1 flex flex-wrap gap-1">{STAGES.map((t, i) => <button key={t.k} type="button" aria-pressed={a === i} onClick={() => setA(i)} className={cx('rounded-full border px-3 py-0.5 text-[0.86rem]', a === i ? 'border-orange bg-orange text-black' : 'border-line')}>{t.k}</button>)}</div>
        </Rise>
        <Panel orange>
          <motion.div key={a} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} data-testid="diamond">
            <div className="flex items-center gap-2 kicker">{s.mode === 'Diverge' ? <Expand className="h-4 w-4" /> : <Shrink className="h-4 w-4" />}{s.mode === 'Diverge' ? 'Divergent thinking' : 'Convergent thinking'}</div>
            <div className="mt-1 font-display text-[2rem] font-bold">{s.k}</div>
            <p className="mt-2 text-[1.2rem] leading-snug">{s.d}</p>
            <p className="mt-2 text-[1.08rem] leading-snug text-amber">{s.ex}</p>
          </motion.div>
          <p className="mt-3 border-t border-hair pt-2 text-[0.84rem] leading-snug text-mute">This is the design-thinking meaning. The source PDF later uses the same words for systems engineering: technologies converging on one platform, and designs diverging to fit each asset.</p>
        </Panel>
      </div>
    </Slide>
  )
}

/* ---------- divergent ---------- */
const SPREAD = IDEAS.map((x) => x.k).concat(['Mobile technician alerts', 'Shared stop-window planner'])
function Diverge() {
  const [k, setK] = useState(0); const [run, setRun] = useState(true)
  useEffect(() => { if (!run) return; const t = setInterval(() => setK((v) => { if (v >= SPREAD.length) { setRun(false); return v } return v + 1 }), 420); return () => clearInterval(t) }, [run])
  const points = useMemo(() => SPREAD.map((_, i) => ({ x: 42 + (i % 2) * 27 + (i % 4 === 0 ? 4 : 0), y: 7 + (Math.floor(i / 2) / 3.2) * 84 })), [])
  return (
    <Slide kicker="Divergent thinking" title="Divergent Thinking: One Problem, Many Possibilities" sub="Explore possibilities, generate alternatives, expand ideas and postpone judgment." tag={<Added />}>
      <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
        <Rise className="glass relative h-[23rem] overflow-hidden rounded-2xl">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            {points.slice(0, k).map((p, i) => <motion.path key={i} d={`M18 50C30 50 ${p.x - 12} ${p.y} ${p.x} ${p.y}`} fill="none" stroke="var(--color-amber)" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />)}
          </svg>
          <div className="absolute top-1/2 left-3 w-[22%] -translate-y-1/2 rounded-2xl border-2 border-orange bg-[color-mix(in_srgb,var(--color-orange)_22%,#0d1224)] p-2.5 text-center font-display text-[1rem] leading-tight font-bold">Unexpected machine failure</div>
          {SPREAD.slice(0, k).map((t, i) => <motion.span key={t} initial={{ opacity: 0, scale: 0.4, x: '-60%' }} animate={{ opacity: 1, scale: 1, x: '0%' }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} style={{ left: `${points[i].x}%`, top: `${points[i].y}%` }} className="glass absolute -translate-y-1/2 rounded-full border-amber/60 px-2.5 py-1 text-[0.88rem] font-semibold whitespace-nowrap">{t}</motion.span>)}
        </Rise>
        <div className="flex flex-col gap-2">
          {[['Exploring possibilities', 'Ask “what else?” before asking “which one?”'], ['Generating alternatives', 'Different assets, sensors, analytics and services.'], ['Creative thinking', 'Borrow from other fields, and allow wild ideas.'], ['Idea expansion', 'Build on each idea rather than judging it.']].map(([h, t]) => <Panel key={h} className="!py-2.5"><div className="font-display text-[1.06rem] font-bold text-amber">{h}</div><p className="text-[1rem] leading-snug">{t}</p></Panel>)}
          <button type="button" onClick={() => { setK(0); setRun(true) }} className="btn-primary flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.9rem]">{run ? <Play className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}Replay expansion</button>
        </div>
      </div>
    </Slide>
  )
}

/* ---------- approaches ---------- */
const LENSES = [
  { k: 'Technician', need: 'Show me why the risk changed.', ideas: ['Evidence-led alert card', 'Mobile checklist', 'One-tap repair feedback'] },
  { k: 'Operator', need: 'Tell me what affects my line, and when.', ideas: ['Line-side status', 'Shared stop-window planner', 'Shift handover summary'] },
  { k: 'Data analyst', need: 'Give me clean, labelled data.', ideas: ['Learned baselines', 'Labelled failure datasets', 'Model drift monitoring'] },
  { k: 'Manager', need: 'Which jobs protect the most production?', ideas: ['Risk-ranked weekly plan', 'Fleet health view', 'Payback tracking'] },
  { k: 'Finance / owner', need: 'Can we verify the savings?', ideas: ['Pilot with measured outcomes', 'Per-asset subscription', 'Shared value option'] },
]
function Approaches() {
  const [a, setA] = useState(0); const l = LENSES[a]
  return (
    <Slide kicker="Divergent thinking" title="Different Approaches, From Different Stakeholder Needs" sub="Changing whose problem you consider is a reliable way to widen the solution space. Select a stakeholder to expand their ideas." tag={<Tag kind="illustrative" label="Example needs and ideas, based on the decks" />}>
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">{LENSES.map((x, i) => <Panel key={x.k} hot={a === i} onClick={() => setA(i)} className={cx('!py-3 text-center', a === i && 'glass-o')}><Users className="mx-auto h-6 w-6 text-amber" strokeWidth={1.5} /><div className="mt-1 font-display text-[1.04rem] font-bold">{x.k}</div></Panel>)}</div>
      <motion.div key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} data-testid="lens" className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.6fr]">
        <div className="glass-o flex items-center rounded-2xl p-5"><p className="font-display text-[1.65rem] leading-tight font-semibold">“{l.need}”</p></div>
        <div className="grid gap-2 sm:grid-cols-3">{l.ideas.map((d, i) => <motion.div key={d} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="glass flex min-h-[9rem] items-center rounded-2xl p-4 text-center font-display text-[1.2rem] leading-tight font-semibold">{d}</motion.div>)}</div>
      </motion.div>
    </Slide>
  )
}

/* ---------- convergent ---------- */
function Converge() {
  const [a, setA] = useState(0); const c = CRIT[a]; const I = c.i
  return (
    <Slide kicker="Convergent thinking" title="Convergent Thinking: Evaluate and Narrow Down" sub="Now judgment returns. Ideas are compared against explicit criteria, so that decisions can be explained." tag={<Added />}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-2">{CRIT.map((x, i) => { const XI = x.i; return <Panel key={x.k} hot={a === i} onClick={() => setA(i)} className={cx('flex items-center gap-3 !py-3', a === i && 'glass-o')}><XI className="h-6 w-6 shrink-0 text-amber" strokeWidth={1.5} /><span className="font-display text-[1.2rem] font-semibold">{x.l}</span></Panel> })}</div>
        <div className="flex flex-col gap-3">
          <motion.div key={a} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} data-testid="criterion" className="glass-o flex-1 rounded-2xl p-5"><I className="h-8 w-8 text-amber" strokeWidth={1.4} /><div className="mt-2 font-display text-[1.75rem] font-bold">{c.l}</div><p className="mt-1 text-[1.26rem] leading-snug">{c.q}</p><p className="mt-2 text-[1.06rem] leading-snug text-amber">{c.ex}</p></motion.div>
          <Panel className="flex flex-wrap items-center gap-2 !py-3">
            {['Idea evaluation', 'Feasibility', 'Impact assessment', 'Prioritisation', 'Selection'].map((s, i) => <span key={s} className="flex items-center gap-2"><span className="font-medium">{s}</span>{i < 4 && <ArrowRight className="h-4 w-4 text-orange" />}</span>)}
          </Panel>
        </div>
      </div>
    </Slide>
  )
}

/* ---------- decision matrix ---------- */
function Select() {
  const [w, setW] = useState<Record<Crit, number>>({ user: 3, tech: 2, cost: 2, impact: 3 })
  const [drop, setDrop] = useState<Set<string>>(new Set())
  const total = w.user + w.tech + w.cost + w.impact || 1
  const ranked = IDEAS.filter((i) => !drop.has(i.k)).map((i) => ({ ...i, score: (CRIT.reduce((a, c) => a + i.s[c.k] * w[c.k], 0) / total) })).sort((a, b) => b.score - a.score)
  const top = ranked[0]
  return (
    <Slide kicker="Interactive idea selection" title="Compare and Select an Idea" sub="Change how much each criterion matters, or remove ideas. The ranking updates as a weighted score out of 5." tag={<Tag kind="illustrative" label="Example scores to discuss, not measured data" />}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.55fr]">
        <div className="flex flex-col gap-2">
          <Panel className="space-y-1 !py-2.5">
            <div className="kicker">Criteria weights</div>
            {CRIT.map((c) => <label key={c.k} className="block text-[0.88rem] text-mute"><span className="flex justify-between"><span>{c.l}</span><b className="num text-ink">{w[c.k]}</b></span><input type="range" min={0} max={5} value={w[c.k]} aria-label={`${c.l} weight`} onChange={(e) => setW((x) => ({ ...x, [c.k]: Number(e.target.value) }))} /></label>)}
          </Panel>
          {top && <Panel orange className="flex-1 !py-3"><div className="flex items-center gap-2 kicker"><Trophy className="h-4 w-4" />Current selection</div><div data-testid="top-idea" className="mt-1 font-display text-[1.45rem] leading-tight font-bold">{top.k}</div><p className="mt-1 text-[1rem] leading-snug">{top.why}</p></Panel>}
        </div>
        <Rise className="glass rounded-2xl p-3">
          <ul data-testid="ranking" className="space-y-1.5">
            {ranked.map((i, r) => (
              <motion.li layout key={i.k} transition={{ duration: 0.3 }} className="flex items-center gap-2">
                <span className="num w-5 text-right font-display font-bold text-amber">{r + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2"><span className="truncate font-medium">{i.k}</span><span className="num font-display font-bold">{i.score.toFixed(2)}</span></div>
                  <div className="mt-0.5 h-2.5 overflow-hidden rounded-full bg-white/10"><motion.div className={cx('h-full rounded-full', r === 0 ? 'bg-gradient-to-r from-orange to-amber' : 'bg-cool/70')} animate={{ width: `${(i.score / 5) * 100}%` }} transition={{ duration: 0.3 }} /></div>
                </div>
                <button type="button" onClick={() => setDrop((s) => new Set(s).add(i.k))} aria-label={`Remove ${i.k}`} className="btn-ghost rounded-full px-2 py-0.5 text-[0.72rem]">Remove</button>
              </motion.li>
            ))}
          </ul>
          {drop.size > 0 && <button type="button" onClick={() => setDrop(new Set())} className="btn-ghost mt-2 rounded-full px-3 py-0.5 text-[0.82rem]">Restore all ideas</button>}
        </Rise>
      </div>
    </Slide>
  )
}

/* ---------- process ---------- */
const PROC = [
  { k: 'Problem', n: 1, d: 'One clear question: how might we detect failure early without overwhelming people?' },
  { k: 'Multiple Ideas', n: 8, d: 'Divergence: sensors, analytics, workflow and service ideas are all on the table.' },
  { k: 'Exploration', n: 6, d: 'Each idea is developed just enough to understand what it needs and whom it serves.' },
  { k: 'Evaluation', n: 4, d: 'Convergence: user needs, viability, cost and impact remove weak options.' },
  { k: 'Prioritisation', n: 2, d: 'The remaining ideas are ranked and sequenced: what should be tested first?' },
  { k: 'Selected Solution', n: 1, d: 'Anomaly alert copilot for critical rotating assets, to be validated through a pilot. Example outcome.' },
]
function Process() {
  const [a, setA] = useState(0); const [run, setRun] = useState(false)
  useEffect(() => { if (!run) return; const t = setInterval(() => setA((v) => { if (v >= 5) { setRun(false); return v } return v + 1 }), 1300); return () => clearInterval(t) }, [run])
  const p = PROC[a]
  const dots = Array.from({ length: p.n }, (_, i) => i)
  return (
    <Slide kicker="Interactive demonstration" title="From Problem to Selected Solution" tag={<Tag kind="illustrative" label="Example walk-through" />}>
      <Rise className="flex flex-wrap items-center gap-1">
        {PROC.map((x, i) => <span key={x.k} className="flex items-center gap-1"><button type="button" aria-pressed={a === i} onClick={() => { setRun(false); setA(i) }} className={cx('rounded-full border px-3 py-1 font-display text-[0.94rem] font-semibold', a === i ? 'border-orange bg-orange text-black' : i < a ? 'border-orange bg-orange/20' : 'border-line')}>{x.k}</button>{i < 5 && <ArrowRight className="h-4 w-4 text-orange" />}</span>)}
        <button type="button" onClick={() => { setA(0); setRun(true) }} className="btn-primary ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-[0.86rem]"><Play className="h-3.5 w-3.5" />Play</button>
      </Rise>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <Rise className="glass flex h-[20rem] flex-wrap content-center items-center justify-center gap-3 rounded-2xl p-5">
          {dots.map((i) => <motion.div layout key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} className={cx('grid place-items-center rounded-2xl border-2 border-orange bg-[color-mix(in_srgb,var(--color-orange)_22%,#0d1224)] text-center font-display font-bold', p.n === 1 ? 'h-[11rem] w-[17rem] px-3 text-[1.5rem] leading-tight' : p.n <= 2 ? 'h-[9rem] w-[12rem] px-2 text-[1.08rem] leading-tight' : 'h-[5.2rem] w-[8.4rem] px-1.5 text-[0.84rem] leading-tight')}>{a === 0 ? 'The problem' : a === 5 ? 'Anomaly alert copilot' : p.n === 8 ? SPREAD[i] : IDEAS[[1, 0, 2, 5, 4, 3][i]].k}</motion.div>)}
        </Rise>
        <Panel orange className="flex flex-col justify-center"><div className="kicker">{a < 3 ? 'Diverging' : 'Converging'}</div><div className="mt-1 font-display text-[1.75rem] font-bold">{p.k}</div><p data-testid="process" className="mt-2 text-[1.2rem] leading-snug">{p.d}</p><div className="num mt-3 text-[0.94rem] text-amber">{p.n} option{p.n > 1 ? 's' : ''} in play</div></Panel>
      </div>
    </Slide>
  )
}

/* ---------- why both ---------- */
function Why() {
  const [m, setM] = useState<'only-d' | 'only-c' | 'both'>('both')
  const v = {
    'only-d': { t: 'Diverging only', i: AlertTriangle, tone: 'border-[#ffc83d]/60 bg-[#ffc83d]/10', d: 'Plenty of ideas, but nothing gets decided. The team runs out of time, and no solution is tested.' },
    'only-c': { t: 'Converging only', i: AlertTriangle, tone: 'border-bad/60 bg-bad/10', d: 'A fast decision, but only from the first obvious options. The team may end up perfecting the wrong solution.' },
    both: { t: 'Diverging, then converging', i: Check, tone: 'border-good/60 bg-good/10', d: 'A wide range of ideas is explored, then judged against explicit evidence. The final choice can be explained, and it is more likely to fit real needs.' },
  }[m]; const I = v.i
  return (
    <Slide kicker="Relationship" title="Why Both Are Necessary" sub="They are separate modes of thinking. Mixing them, by criticising ideas as they appear, tends to weaken both." tag={<Added />}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-2">
          {([['only-d', 'What if we only diverge?'], ['only-c', 'What if we only converge?'], ['both', 'What if we do both, in turn?']] as const).map(([k, l]) => <Panel key={k} hot={m === k} onClick={() => setM(k)} className="font-display text-[1.14rem] font-semibold">{l}</Panel>)}
          <Panel className="flex-1 !py-3"><div className="flex items-center gap-2 kicker"><Target className="h-4 w-4" />In systems engineering too</div><p className="mt-1 text-[1.02rem] leading-snug">The PDF applies the same words to systems: <b>convergence creates scale</b> through a shared platform, and <b>divergence creates fit</b> through asset-specific choices.</p></Panel>
        </div>
        <motion.div key={m} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} data-testid="why" className={cx('flex flex-col justify-center rounded-2xl border p-6', v.tone)}><I className="h-9 w-9" strokeWidth={1.5} /><div className="mt-2 font-display text-[1.9rem] font-bold">{v.t}</div><p className="mt-2 text-[1.28rem] leading-snug">{v.d}</p></motion.div>
      </div>
      <Rise className="mt-3 flex items-center gap-2 text-[0.98rem] text-mute"><HeartHandshake className="h-4 w-4 text-amber" />Next, this section turns to the engineering view, from the source PDF.</Rise>
    </Slide>
  )
}

const extras: Record<string, ComponentType> = { diamond: Diamond, diverge: Diverge, approaches: Approaches, converge: Converge, select: Select, process: Process, why: Why }
export default extras
