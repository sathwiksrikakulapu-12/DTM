import { LayoutGroup, motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { ArrowRight, BrainCircuit, CheckCircle2, Eraser, Lightbulb, MessagesSquare, Pause, Play, Radio, RotateCcw, Share2, Sparkles, Timer, User, Users, Wrench, Zap } from 'lucide-react'
import { Panel, Photo, Rise, Slide, Stagger, Tag, cx } from '../ui/kit'
import { Quiz, SectionSummary } from '../ui/lab'

const Added = () => <Tag kind="web" label="Added: established ideation method applied to the topic" />
const Ideas = () => <Tag kind="illustrative" label="Example ideas, drawn from the decks where marked" />

/* ---------- title ---------- */
function Title() {
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1.25fr_1fr]">
      <Stagger>
        <Rise className="kicker">Section 02</Rise>
        <Rise><h1 className="mt-3 font-display text-[3.6rem] leading-none font-bold tracking-tight lg:text-[4.8rem]"><span className="grad-text">Brainstorming</span></h1></Rise>
        <Rise><p className="mt-4 max-w-[34rem] text-[1.3rem] leading-snug text-ink/90">Turning what we learned from people into many possible ways to detect failure early and act on it.</p></Rise>
        <Rise className="mt-5 flex flex-wrap items-center gap-2">
          {['Reframe', 'Ask', 'Generate', 'Connect', 'Cluster', 'Develop'].map((s, i) => <span key={s} className="flex items-center gap-2"><span className="glass rounded-full px-3.5 py-1 font-display font-semibold">{s}</span>{i < 5 && <ArrowRight className="h-4 w-4 text-orange" />}</span>)}
        </Rise>
        <Rise className="mt-4"><Tag kind="web" label="No separate brainstorming deck: built from ideation methods and the Engineering Students deck" /></Rise>
      </Stagger>
      <Photo src="/img/s3-18.webp" alt="Team brainstorming around a table with sensors and sticky notes" className="h-[20rem] lg:h-[31rem]" />
    </div>
  )
}

/* ---------- reframing ---------- */
const FRAMES = [
  { from: 'We need better sensors on our machines.', to: 'How can technicians know which asset needs attention first?', why: 'Moves from a solution already assumed to the decision people need to make.' },
  { from: 'Machines fail unexpectedly.', to: 'How can a developing fault create enough warning time for a safer, cheaper intervention?', why: 'Moves from a complaint to the outcome that matters: warning time.' },
  { from: 'Technicians ignore alerts.', to: 'What would make an alert trustworthy enough to justify stopping a line?', why: 'Moves from blaming users to asking what evidence they lack.' },
  { from: 'Maintenance costs too much.', to: 'Where does failure cost the most, and how could work be planned around production?', why: 'Moves from a broad cost goal to where a change would matter.' },
]
function Reframe() {
  const [i, setI] = useState(0); const [on, setOn] = useState(true); const f = FRAMES[i]
  return (
    <Slide kicker="Problem reframing" title="Reframe the Problem Before Generating Ideas" sub="A problem statement quietly limits the ideas that follow. Reframing opens up the space." tag={<Added />}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.5fr]">
        <div className="flex flex-col gap-2">{FRAMES.map((x, k) => <Panel key={x.from} hot={i === k} onClick={() => setI(k)} className="!py-3 text-[1.04rem] leading-snug">“{x.from}”</Panel>)}</div>
        <Rise className="glass-o flex flex-col justify-center rounded-2xl p-5">
          <button type="button" aria-pressed={on} onClick={() => setOn(!on)} className="btn-ghost w-fit rounded-full px-3.5 py-1 text-[0.86rem]">{on ? 'Show original statement' : 'Show reframed question'}</button>
          <motion.p key={`${i}${on}`} data-testid="reframe" initial={{ opacity: 0, rotateX: -20, y: 8 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: 0.22 }} className="mt-4 font-display text-[1.95rem] leading-tight font-semibold">{on ? f.to : `“${f.from}”`}</motion.p>
          <p className="mt-4 text-[1.08rem] leading-snug text-ink/85"><span className="font-semibold text-amber">Why it helps: </span>{f.why}</p>
        </Rise>
      </div>
    </Slide>
  )
}

/* ---------- HMW ---------- */
const WHO = ['a senior technician', 'a plant manager', 'a machine operator', 'a data analyst']
const NEED = ['see which asset needs attention first', 'trust an alert enough to act on it', 'agree a maintenance window with production', 'record what happened after a repair']
const LIMIT = ['during a busy shift', 'with incomplete evidence', 'without extra screens', 'on older machines with no sensors']
const SEEDS = ['How might we detect failure early—without overwhelming the people responsible for responding?', 'How might we turn every resolved alert into a learning opportunity?', 'How might we make risk explainable in under 10 seconds?', 'How might we connect asset risk to production impact?']
function Hmw() {
  const [a, setA] = useState(0); const [b, setB] = useState(1); const [c, setC] = useState(0)
  const Col = ({ l, opts, v, set }: { l: string; opts: string[]; v: number; set: (n: number) => void }) => (
    <div><div className="kicker mb-1 text-[0.7rem]">{l}</div><div className="flex flex-col gap-1">{opts.map((o, i) => <button key={o} type="button" aria-pressed={v === i} onClick={() => set(i)} className={cx('rounded-lg border px-2.5 py-1.5 text-left text-[0.92rem] leading-tight', v === i ? 'border-orange bg-orange/25' : 'border-hair bg-white/[.03] hover:border-line')}>{o}</button>)}</div></div>
  )
  return (
    <Slide kicker="How Might We" title="How Might We Questions" sub="“How might we” invites many answers, without prescribing a solution. Build your own, or start from one based on the decks." tag={<Added />}>
      <Rise className="glass-o rounded-2xl p-4">
        <motion.p key={`${a}${b}${c}`} data-testid="hmw" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-[1.55rem] leading-tight font-semibold">How might we help <span className="text-amber">{WHO[a]}</span> <span className="text-cool">{NEED[b]}</span> <span className="text-orange">{LIMIT[c]}</span>?</motion.p>
      </Rise>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.2fr_1fr_1.2fr]">
        <Col l="Who" opts={WHO} v={a} set={setA} /><Col l="Needs to" opts={NEED} v={b} set={setB} /><Col l="When" opts={LIMIT} v={c} set={setC} />
        <div><div className="kicker mb-1 text-[0.7rem]">Questions based on the decks</div><ul className="space-y-1 text-[0.92rem] leading-tight">{SEEDS.map((s) => <li key={s} className="glass rounded-lg px-2.5 py-1.5">{s}</li>)}</ul></div>
      </div>
    </Slide>
  )
}

/* ---------- modes ---------- */
const MODES = {
  individual: { i: User, t: 'Individual ideation', d: 'Each person generates ideas alone, in silence, before any discussion.', good: ['Avoids everyone following the first idea', 'Quieter voices contribute equally', 'Produces a wider spread of ideas'], use: 'Use it first, when you need quantity and variety.', ex: 'A technician and an analyst each write ideas for “which asset first?” for five minutes.' },
  group: { i: Users, t: 'Group ideation', d: 'The team builds on each other’s ideas, combining and extending them.', good: ['Mixes expertise across roles', 'Ideas improve by being combined', 'Builds shared ownership'], use: 'Use it after individual work, to combine and extend.', ex: 'Operators add production context to an analyst’s alert idea, and it becomes a coordinated-window concept.' },
}
const RULES = ['Defer judgment', 'Encourage wild ideas', 'Build on the ideas of others', 'Stay focused on the topic', 'One conversation at a time', 'Be visual', 'Go for quantity']
function Modes() {
  const [m, setM] = useState<'individual' | 'group'>('individual'); const c = MODES[m]; const I = c.i
  const [rule, setRule] = useState(0)
  return (
    <Slide kicker="Brainstorming methods" title="Individual and Group Ideation" tag={<Added />}>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2">{(Object.keys(MODES) as ('individual' | 'group')[]).map((k) => <button key={k} type="button" aria-pressed={m === k} onClick={() => setM(k)} className={cx('rounded-full border px-4 py-1.5 font-semibold capitalize', m === k ? 'border-orange bg-orange text-black' : 'border-line bg-black/25')}>{k}</button>)}</div>
          <motion.div key={m} initial={{ opacity: 0, x: m === 'group' ? 14 : -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }} className="glass-o flex-1 rounded-2xl p-4">
            <div className="flex items-center gap-2"><I className="h-6 w-6 text-amber" /><div className="font-display text-[1.45rem] font-bold">{c.t}</div></div>
            <p className="mt-1.5 text-[1.12rem] leading-snug">{c.d}</p>
            <ul className="mt-2 space-y-1 text-[1.04rem]">{c.good.map((g) => <li key={g} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-good" />{g}</li>)}</ul>
            <p className="mt-2 text-[1.04rem] font-medium text-amber">{c.use}</p>
            <p className="mt-1 text-[0.98rem] text-ink/80">Example: {c.ex}</p>
          </motion.div>
        </div>
        <Panel>
          <div className="kicker">Ground rules</div>
          <ol className="mt-2 space-y-1.5">{RULES.map((r, i) => <li key={r}><button type="button" aria-pressed={rule === i} onClick={() => setRule(i)} className={cx('flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[1.02rem]', rule === i ? 'border-orange bg-orange/20' : 'border-hair')}><span className="num font-display font-bold text-amber">{i + 1}</span>{r}</button></li>)}</ol>
          <p className="mt-2 text-[0.74rem] text-dim">Widely used brainstorming rules, popularised by design-thinking practice.</p>
        </Panel>
      </div>
    </Slide>
  )
}

/* ---------- Crazy 8s ---------- */
const STARTERS = ['Risk-ranked alert list', 'One-screen evidence view', 'Mobile alert with owner', 'Agree a stop window in chat', 'Photo proof after repair', 'Plain-language “why” card', 'QR code on each machine', 'Fleet-wide comparison map']
function Crazy8() {
  const [running, setRunning] = useState(false); const [left, setLeft] = useState(40); const [txt, setTxt] = useState<string[]>(Array(8).fill(''))
  const frame = Math.min(7, Math.floor((40 - left) / 5))
  useEffect(() => { if (!running) return; const t = setInterval(() => setLeft((s) => { if (s <= 1) { setRunning(false); return 0 } return s - 1 }), 1000); return () => clearInterval(t) }, [running])
  const reset = () => { setRunning(false); setLeft(40); setTxt(Array(8).fill('')) }
  return (
    <Slide kicker="Ideation technique" title="Crazy 8s" sub="Fold a sheet into eight panels and sketch eight ideas in eight minutes. Speed pushes you past the obvious first idea. This demo runs at 5 seconds per panel." tag={<Added />}>
      <Rise className="mb-2.5 flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={() => setRunning(!running)} className="btn-primary flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.92rem]">{running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{running ? 'Pause' : left === 40 ? 'Start the timer' : 'Resume'}</button>
        <button type="button" onClick={reset} className="btn-ghost flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.88rem]"><Eraser className="h-4 w-4" />Clear</button>
        <span data-testid="crazy-timer" className="num flex items-center gap-1.5 font-display text-[1.3rem] font-bold"><Timer className="h-5 w-5 text-amber" />{left}s</span>
        <span className="text-[0.94rem] text-mute">{left === 0 ? 'Time! Pick your favourite to share.' : `Panel ${frame + 1} of 8`}</span>
      </Rise>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {STARTERS.map((s, i) => (
          <motion.div key={s} variants={{ hidden: { opacity: 0, scale: 0.93 }, show: { opacity: 1, scale: 1 } }} className={cx('glass rounded-xl p-2.5 transition-all', running && i === frame && 'hot')}>
            <div className="num font-display text-[0.95rem] font-bold text-amber">{i + 1}</div>
            <input type="text" aria-label={`Your idea for panel ${i + 1}`} value={txt[i]} onChange={(e) => setTxt((x) => x.map((v, k) => (k === i ? e.target.value : v)))} placeholder="Type your idea" className="mt-1 text-[0.92rem]" />
            <div className="mt-1.5 text-[0.86rem] leading-tight text-mute">Example: {s}</div>
          </motion.div>
        ))}
      </div>
    </Slide>
  )
}

/* ---------- mind map ---------- */
const MAP = [
  { k: 'Sensing', c: '#3fd9ff', a: -90, kids: ['Vibration accelerometers', 'Thermal imaging', 'Current signature analysis', 'Acoustic emission', 'Oil analysis'] },
  { k: 'Connectivity', c: '#7c8cff', a: -18, kids: ['Edge gateways', 'MQTT and OPC-UA', 'Edge buffering', 'Cloud historian'] },
  { k: 'Analytics', c: '#ff4fd1', a: 54, kids: ['Learned baselines', 'Anomaly detection', 'Failure classification', 'RUL forecast', 'SHAP explanations'] },
  { k: 'People', c: '#ff8a00', a: 126, kids: ['Risk-ranked alerts', 'Named next action', 'Mobile notification', 'Coordination with operations'] },
  { k: 'Service', c: '#2fe39a', a: 198, kids: ['Per-asset subscription', 'Shared value option', 'Fleet dashboards', 'Model improvement loop'] },
]
function MindMap() {
  const [a, setA] = useState(0); const cur = MAP[a]
  return (
    <Slide kicker="Ideation technique" title="Mind Mapping" sub="Start from a central question and branch outward, to see how ideas relate. Select a branch to expand it." tag={<Ideas />}>
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <Rise className="glass relative rounded-2xl p-2">
          <svg viewBox="0 0 400 260" className="h-[23rem] w-full" role="img" aria-label="Mind map with five branches around a central question">
            {MAP.map((m, i) => {
              const r = Math.PI / 180 * m.a; const x = 200 + Math.cos(r) * 135; const y = 130 + Math.sin(r) * 92
              return (
                <g key={m.k} className="cursor-pointer" onClick={() => setA(i)} role="button" aria-label={m.k}>
                  <motion.path d={`M200 130Q${(200 + x) / 2 + 12} ${(130 + y) / 2 - 12} ${x} ${y}`} fill="none" stroke={m.c} strokeWidth={a === i ? 2.4 : 1.2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: i * 0.1 }} />
                  {a === i && m.kids.map((k, j) => { const q = r + (j - (m.kids.length - 1) / 2) * 0.33; const kx = x + Math.cos(q) * 42; const ky = y + Math.sin(q) * 26; return <motion.g key={k} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: j * 0.06 }}><line x1={x} y1={y} x2={kx} y2={ky} stroke={m.c} strokeOpacity=".7" /><circle cx={kx} cy={ky} r="4" fill={m.c} /></motion.g> })}
                  <rect x={x - 37} y={y - 12} width="74" height="24" rx="12" fill="#0d1224" stroke={m.c} strokeWidth={a === i ? 2 : 1} />
                  <text x={x} y={y + 3.6} textAnchor="middle" fontSize="10" fill="#F6F7FB" fontWeight="600" fontFamily="Space Grotesk Variable">{m.k}</text>
                </g>
              )
            })}
            <circle cx="200" cy="130" r="39" fill="color-mix(in srgb, var(--color-orange) 22%, #0d1224)" stroke="var(--color-orange)" strokeWidth="1.6" />
            <text textAnchor="middle" fontSize="8.2" fill="#F6F7FB" fontWeight="700" fontFamily="Space Grotesk Variable"><tspan x="200" y="123">Detect failure</tspan><tspan x="200" y="134">early, without</tspan><tspan x="200" y="145">overwhelming</tspan></text>
          </svg>
        </Rise>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap gap-1">{MAP.map((m, i) => <button key={m.k} type="button" aria-pressed={a === i} onClick={() => setA(i)} className={cx('rounded-full border px-2.5 py-0.5 text-[0.84rem]', a === i ? 'bg-white/15 font-semibold' : 'border-hair')} style={{ borderColor: m.c }}>{m.k}</button>)}</div>
          <Panel orange className="flex-1"><motion.div key={a} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}><div className="font-display text-[1.55rem] font-bold" style={{ color: cur.c }}>{cur.k}</div><ul data-testid="mind-branch" className="mt-2 space-y-1.5 text-[1.12rem]">{cur.kids.map((k) => <li key={k}>• {k}</li>)}</ul></motion.div></Panel>
        </div>
      </div>
    </Slide>
  )
}

/* ---------- SCAMPER ---------- */
const SC = [
  ['S', 'Substitute', 'What could replace part of the current approach?', 'Replace fixed-schedule inspections with condition-triggered ones.'],
  ['C', 'Combine', 'What could be merged?', 'Combine vibration and temperature so that alerts need two signals to agree.'],
  ['A', 'Adapt', 'What idea from elsewhere could be adapted?', 'Adapt hospital patient-triage boards to rank assets by risk.'],
  ['M', 'Modify', 'What could be enlarged, reduced or changed?', 'Shrink an alert to one screen: asset, why, next action, timing.'],
  ['P', 'Put to another use', 'How else could this be used?', 'Use alert history as evidence for spare-parts planning.'],
  ['E', 'Eliminate', 'What could be removed?', 'Eliminate the spreadsheets technicians use to cross-check signals.'],
  ['R', 'Reverse', 'What if the order were reversed?', 'Let the technician rate the alert first, so feedback trains the model.'],
]
function Scamper() {
  const [a, setA] = useState(0)
  return (
    <Slide kicker="Ideation technique" title="SCAMPER" sub="Seven prompts that force a fresh look at an existing process." tag={<Ideas />}>
      <div className="grid grid-cols-7 gap-1.5">{SC.map(([l, w], i) => <motion.button key={w} type="button" whileHover={{ y: -4, rotateX: 8 }} aria-pressed={a === i} aria-label={w} onClick={() => setA(i)} className={cx('glass rounded-xl py-3 text-center', a === i && 'hot glass-o')}><div className={cx('font-display text-[2.3rem] leading-none font-bold', a === i ? 'text-amber' : 'text-orange')}>{l}</div><div className="mt-1 hidden text-[0.76rem] leading-tight sm:block">{w}</div></motion.button>)}</div>
      <motion.div key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} data-testid="scamper" className="glass-o mt-3 rounded-2xl p-5">
        <div className="font-display text-[1.8rem] font-bold">{SC[a][1]}</div>
        <p className="mt-1 text-[1.2rem] text-amber">{SC[a][2]}</p>
        <p className="mt-3 flex items-start gap-2 text-[1.3rem] leading-snug"><Lightbulb className="mt-1 h-5 w-5 shrink-0 text-cool" />{SC[a][3]}</p>
      </motion.div>
    </Slide>
  )
}

/* ---------- workspace ---------- */
const WS = [
  { cat: 'Sensing', i: Radio, ideas: [
    { t: 'Retrofit vibration sensors', d: 'Clamp-on accelerometers on critical rotating assets, including older machines.', rel: ['Vibration analysis', 'IIoT'], fit: 'Motors, pumps, fans' },
    { t: 'Handheld thermal rounds', d: 'Technicians capture infrared images on a route and upload them for trending.', rel: ['Thermal monitoring'], fit: 'Electrical panels' },
    { t: 'Motor current analysis', d: 'Read rotor and load problems through the supply, with no contact on the machine.', rel: ['MCSA', 'Sensor fusion'], fit: 'Hard-to-reach motors' },
  ] },
  { cat: 'Analytics', i: BrainCircuit, ideas: [
    { t: 'Learned normal baselines', d: 'Flag departures from normal without needing fault labels.', rel: ['Anomaly detection', 'Condition monitoring'], fit: 'New assets' },
    { t: 'Fault classifier', d: 'Name known failure patterns from confirmed past repairs.', rel: ['Machine learning'], fit: 'Fleets with history' },
    { t: 'RUL planning estimate', d: 'Show a window with uncertainty, so that work can be planned.', rel: ['RUL', 'Failure prediction'], fit: 'Gradual wear' },
  ] },
  { cat: 'Workflow', i: Wrench, ideas: [
    { t: 'Risk-ranked alert list', d: 'One list ordered by operational consequence.', rel: ['Design criteria', 'CMMS'], fit: 'Busy shifts' },
    { t: 'Auto-drafted work order', d: 'An alert drafts a work order with its evidence attached.', rel: ['CMMS', 'Maintenance optimisation'], fit: 'Planned maintenance teams' },
    { t: 'Repair feedback loop', d: 'One tap records what was found, which labels data for models.', rel: ['Machine learning'], fit: 'All sites' },
  ] },
  { cat: 'Collaboration', i: MessagesSquare, ideas: [
    { t: 'Shared stop-window planner', d: 'Operations and maintenance agree a window on one screen.', rel: ['Journey mapping'], fit: 'High-throughput lines' },
    { t: 'Mobile alert with owner', d: 'Each alert names an owner and escalates if unanswered.', rel: ['Real-time mobile alerts'], fit: 'Rotating shifts' },
    { t: 'Handover summary', d: 'The system summarises open risk at each shift change.', rel: ['Empathy mapping'], fit: 'Shift work' },
  ] },
  { cat: 'Service', i: Share2, ideas: [
    { t: 'Per-asset monitoring plan', d: 'A low-risk way to begin, with visibility only.', rel: ['PdM as a Service'], fit: 'Early adopters' },
    { t: 'Fleet benchmarking', d: 'Compare similar machines across sites to spot outliers.', rel: ['Cloud analytics'], fit: 'Multi-site owners' },
    { t: 'Digital twin what-if', d: 'Test a repair timing against a virtual replica before dispatching work.', rel: ['Digital twins'], fit: 'High-value assets' },
  ] },
]
function Workspace() {
  const [c, setC] = useState(0); const [open, setOpen] = useState<string | null>(WS[0].ideas[0].t); const [cmp, setCmp] = useState<string[]>([])
  const all = WS.flatMap((w) => w.ideas)
  const toggle = (t: string) => setCmp((x) => (x.includes(t) ? x.filter((v) => v !== t) : [...x.slice(-1), t]))
  return (
    <Slide kicker="Interactive workspace" title="Interactive Brainstorming Workspace" sub="Pick a category, expand an idea, see related concepts, and add two ideas to compare." tag={<Ideas />}>
      <div className="flex flex-wrap gap-1.5">{WS.map((w, i) => { const I = w.i; return <button key={w.cat} type="button" aria-pressed={c === i} onClick={() => { setC(i); setOpen(w.ideas[0].t) }} className={cx('flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[0.94rem] font-medium', c === i ? 'border-orange bg-orange text-black' : 'border-line bg-black/25 hover:border-orange')}><I className="h-4 w-4" />{w.cat}</button> })}</div>
      <div className="mt-2.5 grid gap-3 lg:grid-cols-[1.45fr_1fr]">
        <div className="flex flex-col gap-2">
          {WS[c].ideas.map((d) => (
            <motion.div key={d.t} layout transition={{ duration: 0.2 }} className={cx('glass rounded-xl', open === d.t && 'hot')}>
              <div className="flex items-center gap-2 px-3 py-2">
                <button type="button" aria-expanded={open === d.t} onClick={() => setOpen(open === d.t ? null : d.t)} className="flex-1 text-left font-display text-[1.16rem] font-semibold">{d.t}</button>
                <button type="button" aria-pressed={cmp.includes(d.t)} onClick={() => toggle(d.t)} className={cx('rounded-full border px-2.5 py-0.5 text-[0.78rem]', cmp.includes(d.t) ? 'border-orange bg-orange text-black' : 'border-line')}>{cmp.includes(d.t) ? 'Comparing' : 'Compare'}</button>
              </div>
              {open === d.t && <div className="px-3 pb-2.5"><p className="text-[1.04rem] leading-snug">{d.d}</p><div className="mt-1.5 flex flex-wrap items-center gap-1 text-[0.82rem]"><span className="text-mute">Related:</span>{d.rel.map((r) => <span key={r} className="rounded-full border border-line bg-black/25 px-2 py-0.5">{r}</span>)}</div></div>}
            </motion.div>
          ))}
        </div>
        <Panel orange>
          <div className="kicker">Compare ideas</div>
          {cmp.length === 0 && <p className="mt-2 text-[1rem] text-mute">Select “Compare” on up to two ideas, from any category.</p>}
          <div data-testid="ws-compare" className={cx('mt-2 grid gap-2', cmp.length === 2 && 'grid-cols-2')}>
            {cmp.map((t) => { const d = all.find((x) => x.t === t)!; return <div key={t} className="rounded-xl border border-hair bg-black/25 p-2.5"><div className="font-display text-[1.02rem] leading-tight font-bold">{t}</div><p className="mt-1 text-[0.9rem] leading-snug">{d.d}</p><p className="mt-1 text-[0.84rem] text-amber">Best fit: {d.fit}</p></div> })}
          </div>
        </Panel>
      </div>
    </Slide>
  )
}

/* ---------- idea generation ---------- */
const NODES = [
  { t: 'Sensors', x: 12, y: 22 }, { t: 'Baselines', x: 34, y: 12 }, { t: 'Anomaly score', x: 58, y: 18 }, { t: 'RUL estimate', x: 84, y: 14 },
  { t: 'Thermal rounds', x: 10, y: 58 }, { t: 'Evidence view', x: 38, y: 44 }, { t: 'Risk ranking', x: 64, y: 48 }, { t: 'Work order', x: 88, y: 46 },
  { t: 'Mobile alert', x: 22, y: 84 }, { t: 'Stop window', x: 50, y: 78 }, { t: 'Feedback loop', x: 76, y: 84 }, { t: 'Service plan', x: 94, y: 76 },
]
const LINKS = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [2, 6], [5, 6], [6, 7], [3, 7], [4, 5], [5, 8], [6, 9], [8, 9], [7, 10], [9, 10], [10, 2], [10, 11], [7, 11]]
function Generate() {
  const [k, setK] = useState(0); const [play, setPlay] = useState(true)
  const total = NODES.length + LINKS.length
  useEffect(() => { if (!play) return; const t = setInterval(() => setK((v) => { if (v >= total) { setPlay(false); return v } return v + 1 }), 280); return () => clearInterval(t) }, [play, total])
  const nodes = Math.min(k, NODES.length); const links = Math.max(0, k - NODES.length)
  return (
    <Slide kicker="Idea generation" title="Idea Generation: Concepts Emerge and Connect" sub="The first ideas appear separately. New value appears when they connect into a system." tag={<Ideas />}>
      <Rise className="glass relative h-[22rem] overflow-hidden rounded-2xl">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {LINKS.slice(0, links).map(([a, b], i) => <motion.line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="var(--color-amber)" strokeOpacity=".55" strokeWidth="1.2" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />)}
        </svg>
        {NODES.slice(0, nodes).map((n, i) => <motion.span key={n.t} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} style={{ left: `${n.x}%`, top: `${n.y}%`, x: '-50%', y: '-50%' }} className={cx('absolute rounded-full border px-3 py-1 text-[0.92rem] font-semibold whitespace-nowrap', i % 3 === 0 ? 'border-orange bg-orange/25' : i % 3 === 1 ? 'border-amber bg-amber/20' : 'border-cool bg-cool/20')}>{n.t}</motion.span>)}
      </Rise>
      <Rise className="mt-2.5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => { setK(0); setPlay(true) }} className="btn-primary flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.9rem]"><RotateCcw className="h-4 w-4" />Replay</button>
        <span data-testid="gen-count" className="num text-[1rem]"><b className="text-amber">{nodes}</b> ideas · <b className="text-amber">{links}</b> connections</span>
        <span className="flex items-center gap-1.5 text-[0.95rem] text-mute"><Zap className="h-4 w-4 text-cool" />Quantity first: evaluation comes later, in Convergence and Divergence.</span>
      </Rise>
    </Slide>
  )
}

/* ---------- clustering ---------- */
const NOTES = [
  { t: 'Clamp-on vibration sensor', th: 'Sense', who: 'Technician' }, { t: 'Thermal route', th: 'Sense', who: 'Technician' }, { t: 'Learned baseline', th: 'Understand', who: 'Analyst' },
  { t: 'Plain-language “why” card', th: 'Understand', who: 'Technician' }, { t: 'Fleet comparison map', th: 'Understand', who: 'Manager' }, { t: 'Risk-ranked list', th: 'Decide', who: 'Manager' },
  { t: 'Stop-window planner', th: 'Decide', who: 'Operator' }, { t: 'Auto-drafted work order', th: 'Act', who: 'Manager' }, { t: 'Mobile alert with owner', th: 'Act', who: 'Technician' },
  { t: 'One-tap repair feedback', th: 'Learn', who: 'Technician' }, { t: 'Handover summary', th: 'Learn', who: 'Operator' }, { t: 'Line status light', th: 'Sense', who: 'Operator' },
]
type Mode = 'scattered' | 'th' | 'who'
function Cluster() {
  const [m, setM] = useState<Mode>('scattered')
  const groups = useMemo(() => (m === 'scattered' ? [['All ideas', NOTES]] : [...new Set(NOTES.map((n) => n[m]))].map((g) => [g, NOTES.filter((n) => n[m] === g)])) as [string, typeof NOTES][], [m])
  const tones = ['bg-orange/25 border-orange/60', 'bg-amber/20 border-amber/60', 'bg-cool/20 border-cool/60', 'bg-white/10 border-white/30', 'bg-good/15 border-good/60']
  return (
    <Slide kicker="Idea clustering" title="Idea Clustering" sub="Grouping shows themes and gaps. Clustering the same ideas in another way reveals something different." tag={<Ideas />}>
      <Rise className="mb-2.5 flex flex-wrap gap-1.5">{([['scattered', 'Scattered'], ['th', 'Cluster by stage'], ['who', 'Cluster by stakeholder']] as [Mode, string][]).map(([k, l]) => <button key={k} type="button" aria-pressed={m === k} onClick={() => setM(k)} className={cx('rounded-full border px-3.5 py-1 text-[0.92rem] font-medium', m === k ? 'border-orange bg-orange text-black' : 'border-line bg-black/25')}>{l}</button>)}</Rise>
      <LayoutGroup>
        <div data-testid="clusters" className={cx('grid gap-2', m === 'scattered' ? 'grid-cols-1' : m === 'th' ? 'lg:grid-cols-5' : 'lg:grid-cols-4')}>
          {groups.map(([g, list], gi) => (
            <motion.div layout key={g} transition={{ duration: 0.35 }} className="glass rounded-2xl p-2.5">
              <motion.div layout="position" className="font-display text-[1.08rem] font-bold text-amber">{g}</motion.div>
              <div className={cx('mt-1.5 flex gap-1.5', m === 'scattered' ? 'flex-wrap' : 'flex-col')}>
                {list.map((n) => <motion.div layout layoutId={n.t} key={n.t} transition={{ duration: 0.4 }} className={cx('rounded-lg border px-2.5 py-1.5 text-[0.96rem] leading-tight', tones[m === 'scattered' ? NOTES.indexOf(n) % 5 : gi % 5])}>{n.t}</motion.div>)}
              </div>
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
    </Slide>
  )
}

/* ---------- concept development ---------- */
const CONCEPTS = [
  { k: 'Alert Copilot', d: 'A prioritised alert with evidence, next step, owner and timing, built on simple anomaly detection.', for: 'Technicians and planners', needs: 'Vibration and temperature data, a CMMS link', risk: 'False alarms erode trust', from: 'Empathy Mapping design criteria' },
  { k: 'Coordinated Window', d: 'A shared view where maintenance and operations agree when to stop the line.', for: 'Managers and operators', needs: 'Production schedule integration', risk: 'Depends on cross-team habits', from: 'Journey Mapping break points' },
  { k: 'Fleet Service', d: 'A subscription monitoring service that compares machines across sites and improves its models.', for: 'Multi-site owners', needs: 'Connectivity, shared data model', risk: 'Value must be proved repeatedly', from: 'Visualization deck business model' },
]
function Concepts() {
  const [a, setA] = useState(0); const c = CONCEPTS[a]
  const rows: [string, keyof typeof c][] = [['Description', 'd'], ['Who it serves', 'for'], ['What it needs', 'needs'], ['Main risk', 'risk'], ['Builds on', 'from']]
  return (
    <Slide kicker="Concept development" title="Concept Development" sub="Clusters become concepts: a short description of who it serves, what it needs, and what could go wrong." tag={<Ideas />}>
      <div className="grid gap-2.5 lg:grid-cols-3">{CONCEPTS.map((x, i) => <Panel key={x.k} hot={a === i} onClick={() => setA(i)} className={cx(a === i && 'glass-o')}><div className="kicker text-[0.7rem]">Concept {i + 1}</div><div className="mt-0.5 font-display text-[1.45rem] font-bold">{x.k}</div></Panel>)}</div>
      <motion.div key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} data-testid="concept-card" className="glass mt-2.5 grid gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-5">
        {rows.map(([h, k]) => <div key={h}><div className="text-[0.74rem] font-semibold tracking-wider text-amber uppercase">{h}</div><p className="mt-0.5 text-[1.04rem] leading-snug">{c[k]}</p></div>)}
      </motion.div>
      <Rise className="mt-2.5 flex items-center gap-2 text-[1rem] text-mute"><Sparkles className="h-4 w-4 text-amber" />These concepts are carried forward and evaluated in Convergence and Divergence.</Rise>
    </Slide>
  )
}

const Q = () => <Quiz title="Check your understanding: Brainstorming" questions={[
  { q: 'Why ideate individually before discussing as a group?', options: ['It takes longer', 'It avoids everyone following the first idea', 'It removes the need for a group', 'It guarantees the best idea'], correct: 1, why: 'Silent individual work gives a wider spread of ideas, and quieter voices contribute equally.' },
  { q: 'Which is a “How might we” question that does not assume a solution?', options: ['How might we install more sensors?', 'How might we buy a dashboard?', 'How might we help technicians trust an alert enough to act?', 'How might we replace technicians?'], correct: 2, why: 'It names the need and the user, and it leaves the solution open.' },
  { q: 'In SCAMPER, “combine vibration and temperature so that two signals must agree” is an example of what?', options: ['Combine', 'Eliminate', 'Reverse', 'Substitute'], correct: 0, why: 'It merges two existing elements, which is also the idea behind sensor fusion.' },
  { q: 'Which sensor best suits detecting bearing faults at an early stage?', options: ['Thermocouple on the pump casing', 'Vibration accelerometer on the bearing housing', 'Flow meter', 'Line status light'], correct: 1, why: 'The Engineering Students deck links vibration accelerometers with imbalance, misalignment and bearing faults.' },
]} />

const S = () => <SectionSummary title="Brainstorming in review"
  concepts={['Problem reframing', 'How Might We questions', 'Crazy 8s, mind mapping, SCAMPER', 'Individual then group ideation']}
  findings={['PdM spans sensing, analytics, workflow and service', 'Each technique has blind spots, and they complement each other', 'Barriers are organisational as well as technical']}
  applications={['Idea categories for a real workshop', 'Sector-specific idea starters', 'Roadmap from pilot to scale']}
  insights={['Quantity first, judgment later', 'Connections between ideas create new value', 'Clustering reveals themes and gaps']}
  takeaway="Generate widely and connect ideas, then carry the best concepts forward to be evaluated." />

const extras: Record<string, ComponentType> = {
  title: Title, reframe: Reframe, hmw: Hmw, modes: Modes, crazy8: Crazy8, mindmap: MindMap, scamper: Scamper, workspace: Workspace,
  generate: Generate, cluster: Cluster, concepts: Concepts, quiz: Q, summary: S,
}
export default extras
