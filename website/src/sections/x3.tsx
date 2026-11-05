import { motion } from 'framer-motion'
import { useState, type ComponentType } from 'react'
import { ArrowDown, BellRing, CheckCircle2, Cog, Eye, MonitorDot, Search, Send, Wrench } from 'lucide-react'
import { Rise, Slide, Tag, cx } from '../ui/kit'
import { Quiz, SectionSummary } from '../ui/lab'

const STAGES = [
  { k: 'Machine operation', i: Cog, action: 'Operator runs the line and notices how the machine behaves.', touch: 'Machine controls and the line itself', feel: 'Confident', pain: 'Unexpected downtime', gap: 'Operator observations are rarely recorded', opp: 'Capture operator notes alongside data', imp: 'A one-tap “something sounds wrong” note', sys: 'Logs operating context such as load and speed' },
  { k: 'Condition monitoring', i: MonitorDot, action: 'Sensors capture condition continuously.', touch: 'Sensors and the condition dashboard', feel: 'Reassured', pain: 'Data silos across systems', gap: 'Data sits in separate systems', opp: 'Denser sensor networks', imp: 'One view of asset health', sys: 'Compares live data with the healthy baseline' },
  { k: 'Fault identification', i: Search, action: 'Data analyst reviews what has changed.', touch: 'Trend charts and anomaly scores', feel: 'Uncertain', pain: 'Delayed failure detection', gap: 'The analyst lacks recent context from the floor', opp: 'Smarter analytics dashboards', imp: 'Attach context to each anomaly', sys: 'Flags the deviation and ranks likely causes' },
  { k: 'Alert generation', i: BellRing, action: 'Analyst or model confirms that the signal is real.', touch: 'Alert with evidence and priority', feel: 'Skeptical', pain: 'False alarms and alert fatigue', gap: 'An alert may not say why it fired', opp: 'Explainable, risk-ranked alerts', imp: 'Show signal, trend and context', sys: 'Creates an alert with asset, risk and evidence' },
  { k: 'Technician notification', i: Send, action: 'Technician receives the alert and its next step.', touch: 'Real-time mobile alert', feel: 'Pressured', pain: 'Weak handoffs and competing tasks', gap: 'Nobody clearly owns the alert', opp: 'Real-time mobile alerts', imp: 'Named owner and escalation', sys: 'Routes to the owner and escalates if unanswered' },
  { k: 'Inspection', i: Eye, action: 'Technician verifies the condition on the asset.', touch: 'Tablet checklist and handheld instruments', feel: 'Focused', pain: 'Evidence spread across tools', gap: 'Findings may stay in personal notes', opp: 'Evidence-led verification in one view', imp: 'Record findings against the alert', sys: 'Shows trend, history and past repairs' },
  { k: 'Maintenance intervention', i: Wrench, action: 'Manager agrees a window, and the technician isolates and repairs.', touch: 'Work order and maintenance window', feel: 'Responsible', pain: 'Inefficient scheduling', gap: 'Maintenance and production plan separately', opp: 'Cross-team collaboration', imp: 'A shared stop-window plan', sys: 'Raises the work order and checks parts' },
  { k: 'Performance verification', i: CheckCircle2, action: 'Team confirms the fault is gone and records the outcome.', touch: 'Post-repair readings', feel: 'Relieved', pain: 'Poor feedback loop', gap: 'Outcomes do not reach the analyst or model', opp: 'Closed-loop learning', imp: 'One-tap confirmed outcome', sys: 'Sets a new baseline and retrains the model' },
]
function Journey8() {
  const [a, setA] = useState(0); const s = STAGES[a]
  const rows = [['Stakeholder action', s.action], ['Touchpoint', s.touch], ['Emotion', s.feel], ['Pain point', s.pain], ['Communication gap', s.gap], ['Opportunity', s.opp], ['Improvement', s.imp], ['System response', s.sys]]
  return (
    <Slide kicker="Interactive journey" title="The Eight-Stage Service Journey" sub="A synthesis of this deck’s stages, stakeholders, break points and innovation ideas, with feelings from the Empathy deck." tag={<Tag kind="web" label="Added synthesis" />}>
      <Rise className="glass relative rounded-2xl p-3">
        <div aria-hidden className="absolute top-[2.25rem] right-[7%] left-[7%] h-[3px] bg-white/10"><motion.div className="h-full bg-gradient-to-r from-orange to-amber" animate={{ width: `${(a / 7) * 100}%` }} /></div>
        <div className="relative grid grid-cols-8 gap-1">
          {STAGES.map((x, i) => { const I = x.i; return (
            <button key={x.k} type="button" aria-pressed={i === a} onClick={() => setA(i)} className="flex min-w-0 flex-col items-center text-center">
              <span className={cx('grid h-[2.7rem] w-[2.7rem] place-items-center rounded-full border-2 transition-all', i === a ? 'scale-110 border-orange bg-orange text-black' : i < a ? 'border-orange bg-[#0d1224] text-amber' : 'border-line bg-[#0d1224] text-amber')}><I className="h-5 w-5" /></span>
              <span className={cx('mt-1 font-display text-[0.84rem] leading-tight font-semibold', i === a && 'text-amber')}>{x.k}</span>
            </button>
          ) })}
        </div>
      </Rise>
      <motion.div key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([h, t]) => <div key={h} className="glass-o rounded-xl p-3"><div className="text-[0.74rem] font-semibold tracking-wider text-amber uppercase">{h}</div><p className="mt-0.5 text-[1.02rem] leading-snug font-medium">{t}</p></div>)}
      </motion.div>
    </Slide>
  )
}

const COMPARE = {
  reactive: { t: 'Reactive journey', tone: 'bad', steps: ['Failure happens', 'Production stops', 'Emergency diagnosis', 'Rush for parts and labour', 'Emergency repair'], notes: ['Disruption is high', 'The failure sets the schedule', 'Secondary damage is possible'] },
  predictive: { t: 'Predictive journey', tone: 'good', steps: ['Risk emerges in the data', 'Alert with evidence', 'Inspection and verification', 'Parts and window agreed', 'Planned repair, then verify'], notes: ['Work is planned and safer', 'People set the schedule', 'Each outcome improves the models'] },
}
function BeforeAfter() {
  const [m, setM] = useState<'reactive' | 'predictive'>('predictive'); const c = COMPARE[m]
  return (
    <Slide kicker="Before and after" title="Before and After: Reactive vs Predictive" tag={<Tag kind="web" label="Added comparison" />}>
      <div className="flex gap-2">{(['reactive', 'predictive'] as const).map((k) => <button key={k} type="button" aria-pressed={m === k} onClick={() => setM(k)} className={cx('rounded-full border px-4 py-1.5 font-semibold capitalize', m === k ? (k === 'reactive' ? 'border-bad bg-bad text-black' : 'border-good bg-good text-black') : 'border-line bg-black/25')}>{k}</button>)}</div>
      <motion.div key={m} initial={{ opacity: 0, x: m === 'predictive' ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass rounded-2xl p-4">
          <div className="font-display text-[1.3rem] font-bold">{c.t}</div>
          <div className="mt-2 flex flex-col gap-1">
            {c.steps.map((s, i) => <div key={s}><div className={cx('rounded-xl border px-4 py-2 font-display text-[1.1rem] font-semibold', c.tone === 'bad' ? 'border-bad/50 bg-bad/10' : 'border-good/50 bg-good/10')}>{s}</div>{i < 4 && <ArrowDown className="mx-auto my-0.5 h-3.5 w-3.5 text-mute" />}</div>)}
          </div>
        </div>
        <div className="glass-o flex flex-col justify-center gap-3 rounded-2xl p-5">{c.notes.map((n) => <p key={n} className="font-display text-[1.3rem] leading-tight font-semibold">{n}</p>)}</div>
      </motion.div>
    </Slide>
  )
}

const Q = () => <Quiz title="Check your understanding: Journey Mapping" questions={[
  { q: 'What does a journey map make most visible?', options: ['Sensor wiring', 'Handoffs, interactions and ownership', 'Bearing geometry', 'Market size'], correct: 1, why: 'The deck says journey mapping “makes handoffs, interactions and ownership visible”.' },
  { q: 'Which is an example of a journey break point from the deck?', options: ['Data silos + weak handoffs', 'Too many stakeholders', 'High sensor accuracy', 'Short payback'], correct: 0, why: 'The four break points are unexpected downtime, delayed detection, data silos + weak handoffs, and inefficient scheduling.' },
  { q: 'Why is “an alert is the start—not the outcome” important?', options: ['Alerts are always false', 'Value only appears once an owner acts on it', 'Alerts replace technicians', 'Alerts need no context'], correct: 1, why: 'A prediction creates value only after context, accountability and a decision turn it into executed work.' },
  { q: 'Who keeps control in the future-state journey?', options: ['Only the AI', 'Only the sensor vendor', 'People, supported by automation', 'Nobody: it is fully automatic'], correct: 2, why: 'The deck says integrated AI and orchestration reduce delay “while keeping people in control”.' },
]} />

const S = () => <SectionSummary title="Journey Mapping in review"
  concepts={['Four stakeholder lenses', 'Current and future state', 'Signal to decision pipeline', 'Closed learning loop']}
  findings={['Manual handoffs create delay', 'An alert is only the start', 'RUL changes the question to “when?”']}
  insights={['Delays often sit between roles', 'Focus ideas on the greatest friction', 'Keep people in control of decisions']}
  applications={['Denser sensor networks', 'Real-time mobile alerts', 'Smarter analytics dashboards', 'Cross-team collaboration']}
  takeaway="Map the journey. Move before failure." />

const extras: Record<string, ComponentType> = { journey8: Journey8, beforeafter: BeforeAfter, quiz: Q, summary: S }
export default extras
