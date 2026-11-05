import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, Check, CheckCircle2, ClipboardCheck, Lightbulb, Minus, Plus, RotateCcw, Sigma, Sparkles, Target, Wrench, X, XCircle } from 'lucide-react'
import { Panel, Rise, Slide, Tag, cx, Sr } from './kit'
import { CONCEPTS } from '../data/concepts'

/* ---------- Concept explorer: what, why, how, where, example, advantages, limitations, takeaway ---------- */
export function ConceptDetail({ id }: { id: string }) {
  const c = CONCEPTS[id]
  const rows: [string, ReactNode][] = [['What it is', c.what], ['Why it matters', c.why], ['How it works', c.how], ['Where it is used', c.where], ['Industrial example', c.example],
    ['Advantages', <ul key="p">{c.pros.map((p) => <li key={p}>+ {p}</li>)}</ul>], ['Limitations', <ul key="l">{c.limits.map((p) => <li key={p}>− {p}</li>)}</ul>]]
  return (
    <div data-testid="concept-detail" className="mt-4">
      <div className="kicker">{c.kicker}</div>
      <div className="mt-1 font-display text-[1.45rem] leading-tight font-bold">{c.title}</div>
      {rows.map(([h, b]) => <div key={h} className="mt-2.5"><div className="text-[0.72rem] font-semibold tracking-wider text-amber uppercase">{h}</div><div className="mt-0.5 text-[0.96rem] leading-snug">{b}</div></div>)}
      {c.eq && <div className="mt-2.5"><div className="text-[0.72rem] font-semibold tracking-wider text-amber uppercase">Key relationships</div>{c.eq.map((e) => <div key={e.label} className="mt-1"><div className="eq">{e.expr}</div><div className="text-[0.78rem] leading-tight text-mute">{e.note}</div></div>)}</div>}
      <p className="mt-3 rounded-xl border border-line bg-orange/10 p-2.5 font-display font-semibold"><span className="sr-hidden">Key takeaway: </span>{c.takeaway}</p>
      <p className="mt-3 border-t border-hair pt-2 text-[0.76rem] text-dim">Added explainer: standard engineering knowledge, with no statistics or research findings. Examples are illustrative.</p>
    </div>
  )
}

export function DeepDive({ id, demo, demoLabel = 'Try it', extra }: { id: string; demo?: ReactNode; demoLabel?: string; extra?: ReactNode }) {
  const c = CONCEPTS[id]
  const tabs: { k: string; body: ReactNode }[] = [
    ...(demo ? [{ k: demoLabel, body: demo }] : []),
    { k: 'Why it matters', body: <p>{c.why}</p> },
    { k: 'How it works', body: <p>{c.how}</p> },
    { k: 'Where it is used', body: <p>{c.where}</p> },
    { k: 'Example', body: <p>{c.example}</p> },
    { k: 'Advantages', body: <ul className="space-y-1.5">{c.pros.map((p) => <li key={p} className="flex gap-2"><Plus className="mt-1 h-4 w-4 shrink-0 text-good" />{p}</li>)}</ul> },
    { k: 'Limitations', body: <ul className="space-y-1.5">{c.limits.map((p) => <li key={p} className="flex gap-2"><Minus className="mt-1 h-4 w-4 shrink-0 text-[#ff8a8e]" />{p}</li>)}</ul> },
  ]
  const [t, setT] = useState(0)
  return (
    <Slide kicker={`Deep dive · ${c.kicker}`} title={c.title} tag={<>{<Tag kind="web" label="Added explainer" />}{extra}</>}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-2.5">
          <Panel orange><div className="kicker">What it is</div><p className={cx('mt-1.5 leading-snug', (c.eq?.length ?? 0) > 2 ? 'text-[1.08rem]' : 'text-[1.3rem]')}>{c.what}</p></Panel>
          {c.eq && (
            <Panel className="flex-1 !py-3">
              <div className="flex items-center gap-1.5 kicker"><Sigma className="h-4 w-4" />Key relationships</div>
              <div className="mt-1 space-y-1">
                {c.eq.map((e) => (
                  <div key={e.label}>
                    <div className="text-[0.76rem] text-mute">{e.label}</div>
                    <div className={cx('eq text-ink', (c.eq?.length ?? 0) > 2 && '!text-[1.06rem]')}>{e.expr}</div>
                    <div className="text-[0.78rem] leading-tight text-dim">{e.note}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
        <div className="flex flex-col gap-2.5">
          <Rise className="flex flex-wrap gap-1.5">
            {tabs.map((x, i) => <button key={x.k} type="button" aria-pressed={t === i} onClick={() => setT(i)} className={cx('rounded-full border px-3 py-1 text-[0.86rem] font-medium transition-colors', t === i ? 'border-orange bg-orange text-black' : 'border-line bg-black/25 hover:border-orange')}>{x.k}</button>)}
          </Rise>
          <Panel className="min-h-[11rem] flex-1 text-[1.24rem] leading-snug">
            <motion.div key={t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>{tabs[t].body}</motion.div>
            <Sr>{tabs.filter((_, i) => i !== t && !(demo && i === 0)).map((x) => <span key={x.k}>{x.body}</span>)}</Sr>
          </Panel>
          <Panel className="flex items-start gap-2 !border-orange/50 !py-2.5"><Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber" /><p className="font-display text-[1.22rem] leading-snug font-semibold"><span className="sr-hidden">Key takeaway: </span>{c.takeaway}</p></Panel>
        </div>
      </div>
    </Slide>
  )
}

/* ---------- Clickable architecture with moving data ---------- */
export type ArchNode = { k: string; icon: any; purpose: string; how: string; inputs: string; outputs: string; next: string }
export function ArchDiagram({ nodes }: { nodes: ArchNode[] }) {
  const [a, setA] = useState(0)
  const [pulse, setPulse] = useState(0)
  useEffect(() => { const t = setInterval(() => setPulse((p) => p + 1), 1500); return () => clearInterval(t) }, [])
  const n = nodes[a]; const I = n.icon
  return (
    <div className="flex flex-col gap-3">
      <div className="glass relative rounded-2xl p-3">
        <div aria-hidden className="absolute top-[2.35rem] right-[6%] left-[6%] h-[2px] bg-white/12">
          <motion.div className="h-full bg-gradient-to-r from-orange to-amber" animate={{ width: `${(a / (nodes.length - 1)) * 100}%` }} transition={{ duration: 0.35 }} />
          <motion.span key={pulse} className="absolute -top-[3px] h-2 w-2 rounded-full bg-cool shadow-[0_0_.6rem_var(--color-cool)]" initial={{ left: '0%' }} animate={{ left: `${(a / (nodes.length - 1)) * 100}%` }} transition={{ duration: Math.max(0.3, 1.3 * (a / (nodes.length - 1))), ease: 'linear' }} />
        </div>
        <div className="relative grid gap-1" style={{ gridTemplateColumns: `repeat(${nodes.length}, minmax(0,1fr))` }}>
          {nodes.map((x, i) => {
            const NI = x.icon
            return (
              <button key={x.k} type="button" aria-pressed={i === a} onClick={() => setA(i)} className="group flex min-w-0 flex-col items-center text-center">
                <span className={cx('grid h-[2.9rem] w-[2.9rem] place-items-center rounded-full border-2 transition-all', i === a ? 'scale-110 border-orange bg-orange text-black shadow-[0_0_1.2rem_var(--color-orange)]' : i < a ? 'border-orange bg-[color-mix(in_srgb,var(--color-orange)_22%,#0b1020)] text-amber' : 'border-line bg-[#0d1224] text-amber group-hover:border-orange')}><NI className="h-5 w-5" strokeWidth={1.7} /></span>
                <span className={cx('mt-1 font-display text-[0.86rem] leading-tight font-semibold', i === a && 'text-amber')}>{x.k}</span>
              </button>
            )
          })}
        </div>
      </div>
        <motion.div key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="glass-o rounded-2xl p-4">
          <div className="flex items-center gap-2.5"><I className="h-6 w-6 text-amber" strokeWidth={1.6} /><div className="font-display text-[1.4rem] font-bold">{n.k}</div></div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[['Purpose', n.purpose], ['How it works', n.how], ['Inputs', n.inputs], ['Outputs', n.outputs], ['Link to next stage', n.next]].map(([h, t]) => (
              <div key={h}><div className="text-[0.74rem] font-semibold tracking-wider text-amber uppercase">{h}</div><p className="mt-0.5 text-[0.98rem] leading-snug">{t}</p></div>
            ))}
          </div>
        </motion.div>
      <Sr>{nodes.map((x) => `${x.k}: ${x.purpose}`).join(' ')}</Sr>
    </div>
  )
}

/* ---------- Knowledge checkpoint ---------- */
export type Question = { q: string; options: string[]; correct: number; why: string; visual?: ReactNode }
export function Quiz({ title, questions }: { title: string; questions: Question[] }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<(number | null)[]>(questions.map(() => null))
  const cur = questions[i]; const p = picked[i]; const answered = p !== null
  const score = picked.filter((v, k) => v === questions[k].correct).length
  const done = picked.every((v) => v !== null)
  return (
    <Slide kicker="Knowledge checkpoint" title={title} tag={<span className="num rounded-full border border-line bg-black/25 px-3 py-0.5 text-[0.84rem]">Score <b className="text-amber">{score}</b> / {questions.length}</span>}>
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Rise className="flex flex-col gap-2.5">
          <div className="flex gap-1.5" aria-label="Question progress">
            {questions.map((_, k) => <button key={k} type="button" aria-label={`Question ${k + 1}`} aria-current={k === i ? 'true' : undefined} onClick={() => setI(k)} className={cx('num grid h-8 w-8 place-items-center rounded-full border text-[0.86rem] font-semibold', k === i ? 'border-orange bg-orange text-black' : picked[k] === null ? 'border-hair' : picked[k] === questions[k].correct ? 'border-good/70 bg-good/15 text-good' : 'border-bad/60 bg-bad/15 text-[#ff8a8e]')}>{k + 1}</button>)}
          </div>
          <div className="font-display text-[1.7rem] leading-tight font-semibold">{cur.q}</div>
          {cur.visual}
          <div className="grid gap-2 sm:grid-cols-2">
            {cur.options.map((o, k) => {
              const right = answered && k === cur.correct; const wrong = answered && k === p && k !== cur.correct
              return (
                <button key={o} type="button" disabled={answered} onClick={() => setPicked((x) => x.map((v, m) => (m === i ? k : v)))}
                  className={cx('glass flex items-center gap-2 rounded-xl border p-3.5 text-left text-[1.18rem] leading-snug transition-all', !answered && 'lift', right && '!border-good bg-good/15', wrong && '!border-bad bg-bad/15', answered && !right && !wrong && 'opacity-55')}>
                  {right ? <CheckCircle2 className="h-5 w-5 shrink-0 text-good" /> : wrong ? <XCircle className="h-5 w-5 shrink-0 text-[#ff8a8e]" /> : <span className="num grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line text-[0.74rem]">{String.fromCharCode(65 + k)}</span>}{o}
                </button>
              )
            })}
          </div>
        </Rise>
        <Panel orange className="flex flex-col">
          <div className="kicker">Feedback</div>
          {answered
            ? <div data-testid="quiz-feedback" className="mt-2 flex-1"><div className={cx('font-display text-[1.3rem] font-bold', p === cur.correct ? 'text-good' : 'text-[#ff8a8e]')}>{p === cur.correct ? 'Correct' : 'Not quite'}</div><p className="mt-1 text-[1.14rem] leading-snug">{cur.why}</p></div>
            : <p className="mt-2 flex-1 text-[1.02rem] text-mute">Choose an answer to see the explanation.</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {i < questions.length - 1 && <button type="button" onClick={() => setI(i + 1)} className="btn-primary flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[0.9rem]">Next question<ArrowRight className="h-4 w-4" /></button>}
            {done && <button type="button" onClick={() => { setPicked(questions.map(() => null)); setI(0) }} className="btn-ghost flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.86rem]"><RotateCcw className="h-3.5 w-3.5" />Try again</button>}
          </div>
        </Panel>
      </div>
    </Slide>
  )
}

/* ---------- Section summary ---------- */
export function SectionSummary({ title, concepts, findings, insights, applications, takeaway }: { title: string; concepts: string[]; findings: string[]; insights: string[]; applications: string[]; takeaway: string }) {
  const cols = [
    { h: 'Main concepts', i: Sparkles, l: concepts }, { h: 'Important findings', i: ClipboardCheck, l: findings },
    { h: 'Design-thinking insights', i: Lightbulb, l: insights }, { h: 'Practical applications', i: Wrench, l: applications },
  ]
  return (
    <Slide kicker="Section summary" title={title}>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map(({ h, i: I, l }) => (
          <Panel key={h} className="!p-3.5">
            <div className="flex items-center gap-2"><I className="h-5 w-5 text-amber" strokeWidth={1.6} /><div className="font-display text-[1.14rem] font-bold">{h}</div></div>
            <ul className="mt-2 space-y-2 text-[1.1rem] leading-snug">{l.map((x) => <li key={x} className="flex gap-1.5"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-orange" />{x}</li>)}</ul>
          </Panel>
        ))}
      </div>
      <Panel orange className="mt-3 flex items-center gap-3"><Target className="h-7 w-7 shrink-0 text-amber" strokeWidth={1.5} /><p className="font-display text-[1.6rem] leading-tight font-semibold"><span className="kicker mr-2 align-middle">Key takeaway</span>{takeaway}</p></Panel>
    </Slide>
  )
}

/* ---------- Canvas plots: light on React, redrawn only when data changes ---------- */
function useCanvas(draw: (g: CanvasRenderingContext2D, w: number, h: number, css: (v: string) => string) => void, deps: unknown[]) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw); drawRef.current = draw
  const paint = () => {
    const c = ref.current; if (!c) return
    const r = c.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = Math.max(1, Math.round(r.width * dpr)); const h = Math.max(1, Math.round(r.height * dpr))
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h }
    const g = c.getContext('2d'); if (!g) return
    g.clearRect(0, 0, w, h)
    const st = getComputedStyle(c)
    drawRef.current(g, w, h, (v) => st.getPropertyValue(v).trim())
  }
  useEffect(() => { const ro = new ResizeObserver(paint); if (ref.current) ro.observe(ref.current); return () => ro.disconnect() }, [])
  useEffect(paint, deps) // eslint-disable-line
  return ref
}

export function WaveCanvas({ data, className, scale = 3, label }: { data: Float32Array; className?: string; scale?: number; label: string }) {
  const ref = useCanvas((g, w, h, css) => {
    g.strokeStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke()
    g.strokeStyle = css('--color-orange'); g.lineWidth = Math.max(1, w / 500); g.beginPath()
    for (let i = 0; i < data.length; i++) { const x = (i / (data.length - 1)) * w; const y = h / 2 - (data[i] / scale) * (h / 2); if (i) g.lineTo(x, y); else g.moveTo(x, y) }
    g.stroke()
  }, [data, scale])
  return <canvas ref={ref} role="img" aria-label={label} className={cx('h-full w-full', className)} />
}

export function SpectrumCanvas({ data, maxHz, binHz, runHz, className, label }: { data: Float32Array; maxHz: number; binHz: number; runHz: number; className?: string; label: string }) {
  const ref = useCanvas((g, w, h, css) => {
    const bins = Math.min(data.length, Math.floor(maxHz / binHz))
    const bh = h - h * 0.14
    g.fillStyle = 'rgba(255,255,255,.5)'; g.font = `${Math.round(h * 0.085)}px Inter Variable, sans-serif`; g.textAlign = 'center'
    for (let m = 1; m * runHz < maxHz; m += m < 4 ? 1 : 2) { const x = ((m * runHz) / maxHz) * w; g.fillText(`${m}×`, x, h - 2); g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(x, 0, 1, bh); g.fillStyle = 'rgba(255,255,255,.5)' }
    const grad = g.createLinearGradient(0, bh, 0, 0); grad.addColorStop(0, css('--color-orange')); grad.addColorStop(1, css('--color-amber'))
    g.fillStyle = grad
    const bw = Math.max(1, w / bins - 1)
    for (let i = 1; i < bins; i++) { const v = Math.min(1, data[i] / 1.7); g.fillRect((i * binHz / maxHz) * w - bw / 2, bh - v * bh, bw, v * bh) }
  }, [data, maxHz, binHz, runHz])
  return <canvas ref={ref} role="img" aria-label={label} className={cx('h-full w-full', className)} />
}

export function TrendCanvas({ values, limit, min, max, className, label, color = '--color-cool' }: { values: number[]; limit?: number; min: number; max: number; className?: string; label: string; color?: string }) {
  const ref = useCanvas((g, w, h, css) => {
    const y = (v: number) => h - ((v - min) / (max - min)) * h
    if (limit !== undefined) { g.strokeStyle = '#ff5a5f'; g.setLineDash([6, 5]); g.beginPath(); g.moveTo(0, y(limit)); g.lineTo(w, y(limit)); g.stroke(); g.setLineDash([]) }
    g.strokeStyle = css(color); g.lineWidth = Math.max(1.5, w / 400); g.beginPath()
    values.forEach((v, i) => { const x = (i / Math.max(1, values.length - 1)) * w; if (i) g.lineTo(x, y(v)); else g.moveTo(x, y(v)) })
    g.stroke()
  }, [values, limit, min, max, color])
  return <canvas ref={ref} role="img" aria-label={label} className={cx('h-full w-full', className)} />
}

export const SimulatedTag = () => <Tag kind="hypothetical" label="Simulated values, not a validated model" />
export const CloseIcon = X
