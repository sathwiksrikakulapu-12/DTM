import { motion } from 'framer-motion'
import { useMemo, useState, type ComponentType } from 'react'
import { ArrowRight, GitMerge, Layers, Lightbulb, Route, Target, UserRound } from 'lucide-react'
import { Rise, Slide, cx } from '../ui/kit'
import { Quiz, SectionSummary } from '../ui/lab'
import { Deferred, LazyMachine, Scene3D } from '../three/Stage'
import { firstOf, goSlide } from '../engine/store'

const Q = () => <Quiz title="Check your understanding: Convergence" questions={[
  { q: 'In design thinking, what comes after generating many ideas?', options: ['Starting to build the first idea', 'Evaluating them against explicit criteria', 'Generating more forever', 'Choosing the most complex one'], correct: 1, why: 'Convergent thinking evaluates, prioritises and selects, so that the final choice can be explained.' },
  { q: 'In the source PDF, what does divergence mean?', options: ['A fragmented, uncoordinated system', 'Fit-for-purpose design on a common platform', 'Using only one sensor type', 'Abandoning shared data'], correct: 1, why: '“Divergence is not fragmentation—it is fit-for-purpose design.”' },
  { q: 'Which analysis should you choose first?', options: ['The most complex available', 'The simplest that answers the decision', 'Always RUL', 'Always deep learning'], correct: 1, why: 'A threshold is transparent and fast. More complexity is only justified when the decision needs it.' },
  { q: 'Which signature does the deck link to pumps?', options: ['Bearing wear', 'Cavitation', 'Leakage / stiction', 'Rotor bars'], correct: 1, why: 'The deck pairs motor with bearing wear, pump with cavitation, and valve with leakage or stiction.' },
  { q: 'Should the ESP32 prototype protect a real industrial machine?', options: ['Yes, it is low-cost', 'Yes, after one test', 'No, it is a learning prototype and not safety-rated', 'Only at night'], correct: 2, why: 'The deck says plainly: “Not industrial safety-rated”. Field testing and hardening must come first.' },
]} />

const S = () => <SectionSummary title="Convergence and Divergence in review"
  concepts={['Divergent, then convergent thinking', 'Decision matrix and selection', 'Closed decision loop', 'Sensors, IIoT, edge/cloud, AI/ML, digital twin', 'Asset, failure mode and criticality', 'Shared spine, adaptive edges']}
  findings={['Different assets fail in different signatures', 'Sampling and placement are part of the model', 'Criticality sets the maintenance posture']}
  insights={['Insights matter only when they change a decision', 'Choose the simplest analysis that answers it', 'Prototype value grows through validation']}
  applications={['One drivetrain with tailored motor and pump views', 'ESP32 learning prototype', 'Plan for industrial interfaces']}
  takeaway="Convergence creates scale. Divergence creates fit." />

const STAGES = [
  { k: 'Empathy Mapping', d: 'Understand people: what technicians say, think, do and feel.', i: UserRound, c: '#b983ff', sec: 1 },
  { k: 'Brainstorming', d: 'Generate ideas: many possible ways to detect and act.', i: Lightbulb, c: '#2ea8ff', sec: 2 },
  { k: 'Problem Sizing', d: 'Size the problem: frequent and costly enough to solve?', i: Target, c: '#ff9a1f', sec: 3 },
  { k: 'Journey Mapping', d: 'Map the experience: handoffs and friction across the workflow.', i: Route, c: '#1fdcc6', sec: 4 },
  { k: 'Convergence and Divergence', d: 'Evaluate solutions: expand, then choose with evidence.', i: GitMerge, c: '#9d8bff', sec: 5 },
  { k: 'Visualization', d: 'Visualise the outcome: a predictive maintenance solution.', i: Layers, c: '#35c8ff', sec: 6 },
]
function Finale() {
  const [a, setA] = useState(5)
  const assembly = useMemo(() => ({ spin: 2.4 }), [])
  return (
    <div className="flex min-h-full flex-col justify-center gap-3">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center font-display text-[2.6rem] leading-none font-bold tracking-tight">The Complete <span className="grad-text">Design-Thinking Journey</span></motion.h1>
      <div className="relative flex flex-col gap-1.5 lg:flex-row lg:items-stretch">
        {STAGES.map(({ k, d, i: I, c, sec }, i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 18, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15 + i * 0.16, duration: 0.4 }} className="flex min-w-0 flex-1 items-center gap-1">
            <button type="button" onMouseEnter={() => setA(i)} onFocus={() => setA(i)} onClick={() => goSlide(firstOf(sec))} className={cx('lift h-full min-w-0 flex-1 rounded-2xl border bg-black/30 p-2.5 text-left', a === i && 'scale-[1.02]')} style={{ borderColor: c, boxShadow: a === i ? `0 0 1.6rem ${c}66` : undefined }}>
              <span className="grid h-9 w-9 place-items-center rounded-full text-black" style={{ background: c }}><I className="h-5 w-5" /></span>
              <span className="mt-1.5 block font-display text-[1rem] leading-tight font-bold">{k}</span>
              <span className="mt-0.5 block text-[0.82rem] leading-tight text-ink/80">{d}</span>
            </button>
            {i < 5 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-mute lg:block" />}
          </motion.div>
        ))}
      </div>
      <Rise className="glass relative h-[17rem] overflow-hidden rounded-2xl lg:h-[19rem]">
        <Scene3D><Deferred ms={500}><LazyMachine assembly={assembly} autoRotate particles showSensors cameraZ={13} /></Deferred></Scene3D>
        <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-display text-[1.24rem] font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,.9)]">Understanding people leads to timely, trusted and actionable maintenance.</p>
      </Rise>
    </div>
  )
}

const extras: Record<string, ComponentType> = { quiz: Q, summary: S, finale: Finale }
export default extras
