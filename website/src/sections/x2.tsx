import { motion } from 'framer-motion'
import { useState, type ComponentType } from 'react'
import { BriefcaseBusiness, Gauge, HardHat } from 'lucide-react'
import { Panel, Photo, Rise, Slide, Tag, cx } from '../ui/kit'
import { Quiz, SectionSummary } from '../ui/lab'

const PEOPLE = [
  { id: 'tech', name: 'Maya Chen', role: 'Senior Maintenance Technician', icon: HardHat, tag: 'From the Empathy deck', img: '/img/s2-05.webp',
    goal: 'Prevent downtime without wasting attention.', pains: ['Fragmented data', 'Weak evidence', 'Skeptical after repeated false alarms'],
    need: 'Evidence that supports verification, and a clear next action and owner.', quote: '“Show me why the risk changed.”' },
  { id: 'mgr', name: 'Maintenance Manager', role: 'Added perspective, for discussion', icon: BriefcaseBusiness, tag: 'Illustrative persona, not from research', img: '/img/s4-20.webp',
    goal: 'Keep availability high while using people, parts and budget well.', pains: ['Unclear urgency across many assets', 'Competing requests from production', 'Savings that are hard to prove'],
    need: 'Priority tied to operational risk, and a record of outcomes that shows value.', quote: 'Illustrative question: “Which three jobs protect the most production this week?”' },
  { id: 'op', name: 'Industrial Operator', role: 'Added perspective, for discussion', icon: Gauge, tag: 'Role from the Journey and Sizing decks; details are illustrative', img: '/img/s2-06.webp',
    goal: 'Keep the line running, and notice unusual behaviour early.', pains: ['Feels disruption first', 'Monitors machines daily, with little feedback', 'Often unaware a repair is being planned'],
    need: 'To know how an upcoming intervention affects the line, and to have their observations count.', quote: 'Illustrative remark: “It sounded different this morning. Did anyone log that?”' },
]
function Personas() {
  const [a, setA] = useState(0); const p = PEOPLE[a]; const I = p.icon
  return (
    <Slide kicker="Stakeholder perspectives" title="Three Perspectives: Technician, Manager and Operator" sub="The same alert means something different to the person fixing the machine, the person allocating resources and the person running the line." tag={<Tag kind="web" label="Added explainer" />}>
      <div className="flex gap-2">{PEOPLE.map((x, i) => { const XI = x.icon; return <button key={x.id} type="button" aria-pressed={a === i} onClick={() => setA(i)} className={cx('flex items-center gap-2 rounded-full border px-4 py-1.5 font-medium', a === i ? 'border-orange bg-orange text-black' : 'border-line bg-black/25')}><XI className="h-4 w-4" />{x.id === 'tech' ? 'Technician' : x.id === 'mgr' ? 'Manager' : 'Operator'}</button> })}</div>
      <motion.div key={a} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="mt-3 grid gap-3 lg:grid-cols-[0.8fr_1.6fr]">
        <div className="photo h-[15rem] rounded-[1.5rem] border border-hair lg:h-[21rem]"><img src={import.meta.env.BASE_URL + p.img.slice(1)} alt={`${p.role} portrait or workplace`} style={{ objectPosition: '50% 15%' }} /></div>
        <div className="flex flex-col gap-2.5">
          <div><div className="flex items-center gap-2"><I className="h-6 w-6 text-amber" /><div className="font-display text-[1.9rem] leading-none font-bold">{p.name}</div></div><div className="mt-1 text-amber">{p.role}</div></div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="glass-o rounded-2xl p-3"><div className="kicker">Goal</div><p className="mt-1 text-[1.1rem] leading-snug font-medium">{p.goal}</p></div>
            <div className="glass rounded-2xl p-3"><div className="kicker">Needs</div><p className="mt-1 text-[1.06rem] leading-snug">{p.need}</p></div>
            <div className="glass rounded-2xl p-3"><div className="kicker">Challenges</div><ul className="mt-1 space-y-0.5 text-[1.02rem]">{p.pains.map((x) => <li key={x}>• {x}</li>)}</ul></div>
            <div className="glass rounded-2xl p-3"><div className="kicker">In their words</div><p className="mt-1 font-display text-[1.14rem] leading-snug font-semibold">{p.quote}</p></div>
          </div>
          <div><Tag kind="deck" label={p.tag} /></div>
        </div>
      </motion.div>
    </Slide>
  )
}

const POINTS = [
  { k: 'Detect', y: 62, f: 'Uncertain', d: 'Fragmented data leaves the first signal hard to trust.' },
  { k: 'Interpret', y: 74, f: 'Skeptical', d: 'After repeated false alarms, a new alert is met with doubt.' },
  { k: 'Prioritize', y: 82, f: 'Pressured', d: 'Unclear urgency competes with line stoppages and permits.' },
  { k: 'Coordinate', y: 70, f: 'Responsible', d: 'Consequences reach beyond what the technician directly controls.' },
  { k: 'Act', y: 26, f: 'Relieved', d: 'Relief comes when evidence and next steps are clear.' },
]
function Emotion() {
  const [a, setA] = useState(4); const p = POINTS[a]
  const d = POINTS.map((x, i) => `${i ? 'L' : 'M'}${60 + i * 170} ${x.y}`).join('')
  return (
    <Slide kicker="Emotional journey" title="The Emotional Journey" sub="Workflow stages come from the deck’s slide 11, and the feelings draw on its slide 10. The curve itself is an interpretation." tag={<Tag kind="illustrative" label="Interpretive curve" />}>
      <Rise className="glass rounded-2xl p-4">
        <svg viewBox="0 0 800 110" className="h-[11rem] w-full" role="img" aria-label="Emotion curve across five workflow stages, ending higher at Act">
          <defs><linearGradient id="emo" x1="0" x2="1"><stop offset="0" stopColor="var(--color-amber)" /><stop offset="1" stopColor="var(--color-orange)" /></linearGradient></defs>
          <line x1="20" x2="780" y1="50" y2="50" stroke="rgba(255,255,255,.14)" strokeDasharray="4 5" />
          <motion.path d={d} fill="none" stroke="url(#emo)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
          {POINTS.map((x, i) => <circle key={x.k} cx={60 + i * 170} cy={x.y} r={i === a ? 9 : 6} fill={i === a ? 'var(--color-amber)' : 'var(--color-orange)'} />)}
        </svg>
        <div className="grid grid-cols-5 gap-1.5">
          {POINTS.map((x, i) => <button key={x.k} type="button" aria-pressed={i === a} onClick={() => setA(i)} className={cx('lift rounded-xl border p-2 text-center', i === a ? 'hot glass-o' : 'border-hair')}><div className="font-display font-semibold">{x.k}</div><div className="text-[0.84rem] text-amber">{x.f}</div></button>)}
        </div>
      </Rise>
      <Panel orange className="mt-3"><motion.p key={a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-[1.32rem] leading-tight font-semibold"><span className="text-amber">{p.f}: </span>{p.d}</motion.p></Panel>
    </Slide>
  )
}

const Q = () => <Quiz title="Check your understanding: Empathy" questions={[
  { q: 'A technician says “show me why the risk changed.” Which part of the map does this belong to?', options: ['SAY', 'THINK', 'DO', 'FEEL'], correct: 0, why: 'It is a voiced statement. THINK covers what stays internal, DO what can be observed, and FEEL what the work evokes.' },
  { q: 'Technicians keep their own spreadsheets to verify alerts. What does this most suggest?', options: ['They dislike technology', 'There is an unmet need for one trusted view', 'Alerts are perfect', 'Training is unnecessary'], correct: 1, why: 'Workarounds are strong evidence of an unmet need, which is why the deck lists “one trusted view of asset health”.' },
  { q: 'Which design criterion is testable?', options: ['“The alert should feel good”', '“Make the UI modern”', '“Top risk understood in under 10 seconds”', '“Use more AI”'], correct: 2, why: 'A testable criterion can be measured in a prototype session, and this one comes directly from the deck.' },
  { q: 'What builds trust in alerts, according to the deck’s insights?', options: ['Higher prediction scores alone', 'More frequent alerts', 'Explainable evidence', 'Louder alarms'], correct: 2, why: '“Trust grows from explainable evidence—not prediction scores alone.”' },
]} />

const S = () => <SectionSummary title="Empathy Mapping in review"
  concepts={['Say, think, do, feel', 'Needs and insights', 'Persona: Maya Chen', 'Design criteria']}
  findings={['A correct alert can still fail in practice', 'Pain points appear at each workflow stage', 'Repeated false alarms create scepticism']}
  insights={['Trust grows from explainable evidence', 'Technicians already verify, so strengthen that loop', 'Urgency depends on production context', 'Every resolved alert teaches people and models']}
  applications={['Risk-based alert triage', 'Evidence-led verification', 'Workflow-aware coordination', 'Closed-loop learning']}
  takeaway="Design for people, not just machines." />

const extras: Record<string, ComponentType> = { personas: Personas, emotion: Emotion, quiz: Q, summary: S }
export default extras
