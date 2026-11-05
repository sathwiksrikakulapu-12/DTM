import { animate, motion } from 'framer-motion'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, ChevronDown, FlaskConical, Info, Play, RotateCcw, Sparkles } from 'lucide-react'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/* ---------- reveal ---------- */
const stag = { hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } } }
const rise = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.2, 0.7, 0.2, 1] as const } } }

export const Stagger = ({ className, children }: { className?: string; children: ReactNode }) => (
  <motion.div className={className} variants={stag} initial="hidden" animate="show">{children}</motion.div>
)
export const Rise = ({ className, children, onClick, style }: { className?: string; children: ReactNode; onClick?: () => void; style?: React.CSSProperties }) => (
  <motion.div className={className} variants={rise} onClick={onClick} style={style}>{children}</motion.div>
)

/* ---------- slide scaffold ---------- */
export function Slide({ kicker, title, sub, tag, children, className }: {
  kicker?: string; title: ReactNode; sub?: ReactNode; tag?: ReactNode; children: ReactNode; className?: string
}) {
  return (
    <Stagger className={cx('flex min-h-full flex-col', className)}>
      <Rise className="relative mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          {kicker && <div className="kicker">{kicker}</div>}
          {tag}
        </div>
        <h1 className="mt-1.5 font-display text-[2rem] font-bold leading-[1.08] tracking-tight text-balance lg:text-[2.35rem]">{title}</h1>
        {sub && <p className="mt-2 max-w-[56rem] text-[1.08rem] leading-snug text-mute">{sub}</p>}
      </Rise>
      <div className="flex min-h-0 flex-1 flex-col justify-center pb-1">{children}</div>
    </Stagger>
  )
}

export const Panel = ({ className, children, hot, onClick, orange }: { className?: string; children: ReactNode; hot?: boolean; onClick?: () => void; orange?: boolean }) => {
  const cls = cx(orange ? 'glass-o' : 'glass', 'rounded-2xl p-4 text-left', hot && 'hot', onClick && 'lift cursor-pointer', className)
  if (onClick) return <motion.button type="button" aria-pressed={hot} variants={rise} onClick={onClick} className={cls}>{children}</motion.button>
  return <motion.div variants={rise} className={cls}>{children}</motion.div>
}

export const Photo = ({ src, alt, className, sketch, pos }: { src: string; alt: string; className?: string; sketch?: boolean; pos?: string }) => (
  <motion.div variants={rise} className={cx('photo rounded-2xl border border-hair', sketch && 'photo-sketch', className)}>
    <img src={import.meta.env.BASE_URL + src.replace(/^\//, '')} alt={alt} loading="lazy" decoding="async" style={pos ? { objectPosition: pos } : undefined} />
  </motion.div>
)

export const IconBadge = ({ icon: I, className, size = '1.25rem' }: { icon: any; className?: string; size?: string }) => (
  <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-orange/10 text-amber', className)}>
    <I style={{ width: size, height: size }} strokeWidth={1.7} />
  </span>
)

/* ---------- honesty labels ---------- */
const TAGS = {
  illustrative: { label: 'Illustrative', icon: Info, cls: 'border-amber/40 text-amber bg-amber/10' },
  hypothetical: { label: 'Hypothetical example', icon: FlaskConical, cls: 'border-cool/40 text-cool bg-cool/10' },
  web: { label: 'Added web explainer, not in source slide', icon: Sparkles, cls: 'border-hair text-mute bg-white/5' },
  deck: { label: 'Example from source deck', icon: Info, cls: 'border-hair text-mute bg-white/5' },
  placeholder: { label: 'Placeholder inputs: replace with evidence', icon: AlertTriangle, cls: 'border-cool/40 text-cool bg-cool/10' },
}
export const Tag = ({ kind, label }: { kind: keyof typeof TAGS; label?: string }) => {
  const t = TAGS[kind]; const I = t.icon
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.74rem] font-medium', t.cls)}><I className="h-[0.85rem] w-[0.85rem]" />{label ?? t.label}</span>
}

/* ---------- auto cycling selection that stops on first user interaction ---------- */
export function useAutoSelect(count: number, ms = 2600, start = 0) {
  const [active, setActive] = useState(start)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto) return
    const t = setInterval(() => setActive((a) => (a + 1) % count), ms)
    return () => clearInterval(t)
  }, [auto, count, ms])
  return { active, select: (i: number) => { setAuto(false); setActive(i) }, auto }
}

/* ---------- connected step flow ---------- */
export type Step = { label: string; desc?: ReactNode; icon?: any }
export function Flow({ steps, active, onSelect, className, compact }: { steps: Step[]; active: number; onSelect?: (i: number) => void; className?: string; compact?: boolean }) {
  return (
    <div className={cx('flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0', className)}>
      {steps.map((s, i) => {
        const on = i === active; const done = i < active; const I = s.icon
        return (
          <Fragment key={s.label}>
            <Rise className="min-w-0 flex-1">
              <button type="button" aria-pressed={on} onClick={() => onSelect?.(i)}
                className={cx('glass lift h-full w-full rounded-xl p-3 text-left', on && 'hot glass-o', done && 'border-line')}>
                <div className="flex items-center gap-2">
                  {I ? <I className={cx('h-[1.2rem] w-[1.2rem] shrink-0', on || done ? 'text-amber' : 'text-mute')} strokeWidth={1.7} />
                    : <span className={cx('num grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.75rem] font-semibold', on ? 'border-orange bg-orange text-black' : 'border-line text-amber')}>{i + 1}</span>}
                  <span className={cx('font-display font-semibold leading-tight', compact ? 'text-[0.92rem]' : 'text-[1rem]')}>{s.label}</span>
                </div>
                {s.desc && <div className="mt-1.5 text-[0.9rem] leading-snug text-mute">{s.desc}</div>}
              </button>
            </Rise>
            {i < steps.length - 1 && (
              <div aria-hidden className="hidden w-5 shrink-0 items-center lg:flex">
                <svg viewBox="0 0 20 8" className="w-full overflow-visible"><path d="M0 4H20" stroke={done ? 'var(--color-orange)' : 'color-mix(in srgb, var(--color-orange) 45%, transparent)'} strokeWidth="1.6" className="flow-dash" fill="none" /></svg>
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

/* ---------- circular loop with a travelling pulse ---------- */
export function Loop({ nodes, center, active, onSelect, size = '25rem', radius = 38 }: {
  nodes: { label: string; desc?: string; icon?: any }[]; center: ReactNode; active: number; onSelect: (i: number) => void; size?: string; radius?: number
}) {
  const n = nodes.length
  const pos = (i: number) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return { x: 50 + radius * Math.cos(a), y: 50 + radius * Math.sin(a) } }
  return (
    <div className="relative mx-auto aspect-square w-full" style={{ maxWidth: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="color-mix(in srgb, var(--color-orange) 30%, transparent)" strokeWidth=".5" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-orange)" strokeWidth=".55" strokeDasharray="1.4 2.2" className="flow-dash" />
        <circle r="1.3" fill="var(--color-amber)">
          <animateMotion dur="6s" repeatCount="indefinite" path={`M50 ${50 - radius}a${radius} ${radius} 0 1 1 -0.01 0`} />
        </circle>
      </svg>
      <div className="absolute inset-0 grid place-items-center p-[27%] text-center">{center}</div>
      {nodes.map((d, i) => {
        const p = pos(i); const I = d.icon
        return (
          <button key={d.label} type="button" aria-pressed={i === active} onClick={() => onSelect(i)}
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)' }}
            className={cx('glass lift absolute flex min-w-[7rem] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-center', i === active && 'hot glass-o')}>
            {I && <I className="h-[1.05rem] w-[1.05rem] text-amber" strokeWidth={1.7} />}
            <span className="font-display text-[0.94rem] font-semibold leading-tight whitespace-pre-line">{d.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ---------- expandable ---------- */
export function Expand({ title, children, defaultOpen, icon: I }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean; icon?: any }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className={cx('glass rounded-xl', open && 'border-line')}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left">
        {I && <I className="h-[1.1rem] w-[1.1rem] shrink-0 text-amber" strokeWidth={1.7} />}
        <span className="flex-1 font-display text-[1rem] font-semibold">{title}</span>
        <ChevronDown className={cx('h-4 w-4 text-amber transition-transform', open && 'rotate-180')} />
      </button>
      <div className={cx(open ? 'px-3.5 pb-3 text-[0.95rem] leading-snug text-mute' : 'sr-hidden')}>{children}</div>
    </div>
  )
}

/* ---------- animated number ---------- */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const shown = useRef(value)
  useEffect(() => {
    // Short tween that always lands on the exact value: calculators must never show a stale figure.
    const controls = animate(shown.current, value, {
      duration: 0.35, ease: 'easeOut',
      onUpdate: (v) => { shown.current = v; if (ref.current) ref.current.textContent = format(v) },
      onComplete: () => { shown.current = value; if (ref.current) ref.current.textContent = format(value) },
    })
    return () => controls.stop()
  }, [value, format])
  return <span ref={ref} className="num">{format(shown.current)}</span>
}

/* ---------- run button for animated process diagrams ---------- */
export function RunButton({ running, onClick, label = 'Run the flow' }: { running: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.82rem] font-medium">
      {running ? <RotateCcw className="h-3.5 w-3.5 text-amber" /> : <Play className="h-3.5 w-3.5 text-amber" />}{running ? 'Restart' : label}
    </button>
  )
}

/** Steps through indices when started; `index` stays on last when finished. */
export function useRunner(count: number, ms = 800, autoStart = true) {
  const [index, setIndex] = useState(0)
  const [running, setRunning] = useState(autoStart)
  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setIndex((i) => {
      if (i >= count - 1) { setRunning(false); return i }
      return i + 1
    }), ms)
    return () => clearInterval(t)
  }, [running, count, ms])
  return { index, running, run: () => { setIndex(0); setRunning(true) }, select: (i: number) => { setRunning(false); setIndex(i) } }
}

/* ---------- number field used across calculators ---------- */
export function NumField({ label, value, onChange, prefix, suffix, step = 1, min = 0, hint }: {
  label: string; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; step?: number; min?: number; hint?: string
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-[0.84rem] font-medium leading-tight text-mute">{label}</span>
      <span className="flex items-center gap-1.5">
        {prefix && <span className="text-[0.95rem] text-amber">{prefix}</span>}
        <input type="number" className="num text-[1.02rem]" value={Number.isFinite(value) ? value : ''} min={min} step={step}
          onChange={(e) => { const v = parseFloat(e.target.value); onChange(Number.isFinite(v) ? Math.max(min, v) : 0) }} />
        {suffix && <span className="text-[0.84rem] whitespace-nowrap text-mute">{suffix}</span>}
      </span>
      {hint && <span className="mt-0.5 block text-[0.75rem] text-dim">{hint}</span>}
    </label>
  )
}

export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

/* ---------- stylised waveform ---------- */
export function Wave({ seed = 1, amp = 1, className, color = 'var(--color-orange)', speed = 3, points = 120 }: { seed?: number; amp?: number; className?: string; color?: string; speed?: number; points?: number }) {
  const d = Array.from({ length: points }, (_, i) => {
    const t = i / points
    const y = Math.sin(t * 30 * seed) * 0.45 + Math.sin(t * 73 * seed + seed) * 0.22 + Math.sin(t * 11 + seed * 3) * 0.33
    return `${i === 0 ? 'M' : 'L'}${((i / (points - 1)) * 200).toFixed(1)} ${(20 - y * 14 * amp).toFixed(1)}`
  }).join('')
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className={className} aria-hidden>
      <motion.g animate={{ x: [0, -200] }} transition={{ repeat: Infinity, ease: 'linear', duration: speed * 4 }}>
        <path d={d} fill="none" stroke={color} strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
        <path d={d} transform="translate(200 0)" fill="none" stroke={color} strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
      </motion.g>
    </svg>
  )
}

/* Link to another slide in the deck */
export const Sr = ({ children }: { children: ReactNode }) => <span className="sr-hidden">{children}</span>
