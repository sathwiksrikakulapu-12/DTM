import { motion } from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { BookA, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Expand, FileText, GraduationCap, Grid3x3, Lightbulb, Minimize, Sparkles, X } from 'lucide-react'
import { cx } from '../ui/kit'
import { ConceptDetail } from '../ui/lab'
import { firstOf, goSlide, lastOf, sections, slides, takePendingPart, TOTAL, usePresentation, type SlideRef } from './store'
import { MeshBackground, SectionSidebar, TopNav } from './Chrome'
import { GlossaryPanel } from '../pages/Glossary'

type Mod = { default: any }
const modules: Record<string, () => Promise<Mod>> = {
  s1: () => import('../sections/s1'), s2: () => import('../sections/s2'), s3: () => import('../sections/s3'),
  s4: () => import('../sections/s4'), s5: () => import('../sections/s5'), s6: () => import('../sections/s6'),
  x1: () => import('../sections/x1'), x2: () => import('../sections/x2'), x3: () => import('../sections/x3'),
  x4: () => import('../sections/x4'), x5: () => import('../sections/x5'), x6: () => import('../sections/x6'),
  b: () => import('../sections/brainstorming'), c: () => import('../sections/divergence'),
}
const cache = new Map<string, ComponentType>()
const partComponent = (ref: string) => {
  if (!cache.has(ref)) {
    const [mod, key] = ref.split(':')
    cache.set(ref, lazy(async () => {
      const m = (await modules[mod]()).default
      return { default: Array.isArray(m) ? m[Number(key) - 1] : m[key] }
    }))
  }
  return cache.get(ref)!
}
const warm = (s: SlideRef) => s.parts.forEach((p) => void modules[p.ref.split(':')[0]]())

/* Section-specific transitions: consistent timing, different character. */
const transitions: Record<number, any> = {
  1: { // fade and scale
    enter: () => ({ opacity: 0, y: 12, scale: 0.99 }),
    center: { opacity: 1, y: 0, scale: 1 },
    exit: () => ({ opacity: 0, y: -8 }),
  },
  2: { // 3D zoom
    enter: (d: number) => ({ opacity: 0, scale: d > 0 ? 1.05 : 0.95, rotateX: 3 }),
    center: { opacity: 1, scale: 1, rotateX: 0 },
    exit: (d: number) => ({ opacity: 0, scale: d > 0 ? 0.96 : 1.04 }),
  },
  3: { // perspective rotation
    enter: (d: number) => ({ opacity: 0, rotateY: d * 9, x: `${d * 3}%` }),
    center: { opacity: 1, rotateY: 0, x: 0 },
    exit: (d: number) => ({ opacity: 0, rotateY: d * -9, x: `${d * -3}%` }),
  },
  4: { // horizontal travel, like walking a journey
    enter: (d: number) => ({ opacity: 0, x: `${d * 7}%` }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: `${d * -7}%` }),
  },
  5: { // parallax rise
    enter: (d: number) => ({ opacity: 0, y: `${d * 5}%`, scale: 0.985 }),
    center: { opacity: 1, y: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, y: `${d * -5}%`, scale: 1.01 }),
  },
  6: { // depth
    enter: () => ({ opacity: 0, scale: 0.965 }),
    center: { opacity: 1, scale: 1 },
    exit: () => ({ opacity: 0, scale: 1.025 }),
  },
}

function ProgressBar({ n, onJump }: { n: number; onJump: (v: number) => void }) {
  return (
    <div className="relative h-5 min-w-0 flex-1 cursor-pointer" role="slider" tabIndex={-1} aria-label="Slide progress" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={n}
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); onJump(Math.max(1, Math.min(TOTAL, Math.ceil(((e.clientX - r.left) / r.width) * TOTAL)))) }}>
      <div className="absolute top-1/2 flex h-[0.36rem] w-full -translate-y-1/2 gap-[2px]">
        {sections.map((s) => {
          const f = firstOf(s.id); const l = lastOf(s.id); const span = l - f + 1
          const fill = Math.max(0, Math.min(1, (n - f + 1) / span))
          return (
            <div key={s.id} title={s.title} className={cx('relative h-full overflow-hidden rounded-full bg-white/12', `theme-${s.id}`)} style={{ flexGrow: span, flexBasis: 0 }}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-orange to-amber" animate={{ width: `${fill * 100}%` }} transition={{ duration: 0.3, ease: 'easeOut' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CtlBtn = ({ label, onClick, disabled, children, primary, on }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode; primary?: boolean; on?: boolean }) => (
  <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} aria-pressed={on}
    className={cx('grid h-[2.3rem] w-[2.3rem] shrink-0 place-items-center rounded-full border transition-all disabled:cursor-not-allowed disabled:opacity-30',
      primary ? 'border-orange bg-orange/20 text-amber shadow-[0_0_.8rem_color-mix(in_srgb,var(--color-orange)_45%,transparent)] hover:bg-orange/35' : 'border-line bg-black/30 hover:border-orange/80 hover:text-amber', on && 'bg-orange/25 text-amber')}>
    {children}
  </button>
)

/** Thumbnail grid of the whole presentation. */
function Overview({ n, onClose }: { n: number; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { ref.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'center' }) }, [])
  return (
    <motion.div role="dialog" aria-label="Presentation overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="absolute inset-0 z-40 flex flex-col bg-[#060a18]/97">
      <div className="flex shrink-0 items-center justify-between px-5 py-3">
        <div className="font-display text-[1.3rem] font-bold">Presentation overview</div>
        <button type="button" aria-label="Close overview" onClick={onClose} className="btn-ghost grid h-9 w-9 place-items-center rounded-full"><X className="h-4 w-4" /></button>
      </div>
      <div ref={ref} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5">
        {sections.map((s) => (
          <section key={s.id} className={`theme-${s.id}`}>
            <h2 className="kicker mb-1.5">{String(s.id).padStart(2, '0')} {s.title} · 20 slides</h2>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-7">
              {slides.filter((x) => x.section.id === s.id).map((x) => (
                <button key={x.n} type="button" aria-current={x.n === n ? 'true' : undefined} onClick={() => { goSlide(x.n); onClose() }}
                  className={cx('glass lift min-h-[4.3rem] rounded-lg p-2 text-left text-[0.74rem] leading-tight', x.n === n && 'hot')}>
                  <span className="num font-display font-bold text-amber">{x.n}</span> {x.title}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  )
}

export default function Deck({ n }: { n: number }) {
  const { present, exitPresent, toggleFullscreen, fullscreen } = usePresentation()
  const slide = slides[n - 1]
  const section = slide.section
  const dirRef = useRef(1); const prev = useRef(n)
  if (prev.current !== n) { dirRef.current = n > prev.current ? 1 : -1; prev.current = n }

  // Tabs inside a slide. The stored slide number makes the tab reset automatically on navigation.
  const [partState, setPartState] = useState(() => ({ n, i: takePendingPart(n) }))
  if (partState.n !== n) setPartState({ n, i: takePendingPart(n) })
  const partIndex = partState.n === n ? partState.i : 0
  const setPart = useCallback((i: number) => setPartState({ n, i }), [n])
  const part = slide.parts[Math.min(partIndex, slide.parts.length - 1)]
  const hasDrawer = !!(part.depth || part.deck || part.concept)

  const [drawer, setDrawer] = useState<null | 'deeper' | 'concept' | 'source'>(null)
  const [overlay, setOverlay] = useState<null | 'overview' | 'glossary'>(null)
  const [idle, setIdle] = useState(false)

  /* Section transition screen. */
  const secRef = useRef(section.id)
  const [banner, setBanner] = useState(false)
  useEffect(() => {
    if (secRef.current === section.id) return
    secRef.current = section.id
    setBanner(true)
    const t = setTimeout(() => setBanner(false), 900)
    return () => clearTimeout(t)
  }, [section.id])

  // Next and Previous step through a slide's tabs first, so merged content is never skipped.
  // Read the address directly, so that keys pressed faster than React renders are not lost.
  const liveN = () => { const m = /slide\/(\d+)/.exec(window.location.hash); return m ? Number(m[1]) : n }
  const next = useCallback(() => { if (liveN() === n && partIndex < slide.parts.length - 1) setPart(partIndex + 1); else goSlide(liveN() + 1) }, [n, partIndex, slide.parts.length, setPart])
  const back = useCallback(() => { if (liveN() === n && partIndex > 0) setPart(partIndex - 1); else goSlide(liveN() - 1) }, [n, partIndex, setPart])
  const nextSec = useCallback(() => { if (section.id < sections.length) goSlide(firstOf(section.id + 1)) }, [section.id])
  const prevSec = useCallback(() => { goSlide(n === firstOf(section.id) && section.id > 1 ? firstOf(section.id - 1) : firstOf(section.id)) }, [n, section.id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const typing = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable
      if (typing && e.key !== 'Escape') return
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (overlay && e.key !== 'Escape') return
      switch (e.key) {
        case 'ArrowRight': case 'PageDown':
          e.preventDefault(); if (e.shiftKey) nextSec(); else next(); break
        case 'ArrowLeft': case 'PageUp':
          e.preventDefault(); if (e.shiftKey) prevSec(); else back(); break
        case ' ':
          if (t.tagName === 'BUTTON' || t.tagName === 'A') return // keyboard users activating a focused control
          e.preventDefault(); if (e.shiftKey) back(); else next(); break
        case 'Home': e.preventDefault(); goSlide(1); break
        case 'End': e.preventDefault(); goSlide(TOTAL); break
        case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break
        case 'n': case 'N': setDrawer((v) => (v ? null : part.depth ? 'deeper' : part.concept ? 'concept' : part.deck ? 'source' : null)); break
        case 'o': case 'O': setOverlay('overview'); break
        case 'g': case 'G': setOverlay('glossary'); break
        case 'Escape':
          if (overlay) setOverlay(null)
          else if (drawer) setDrawer(null)
          else if (present) exitPresent()
          else if (document.fullscreenElement) toggleFullscreen()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, back, nextSec, prevSec, present, exitPresent, toggleFullscreen, drawer, overlay, part])

  // Controls fade out while presenting and the mouse is still.
  useEffect(() => {
    if (!present) { setIdle(false); return }
    let timer = setTimeout(() => setIdle(true), 2200)
    const wake = () => { setIdle(false); clearTimeout(timer); timer = setTimeout(() => setIdle(true), 2200) }
    window.addEventListener('mousemove', wake)
    window.addEventListener('touchstart', wake)
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', wake); window.removeEventListener('touchstart', wake) }
  }, [present])

  const touch = useRef<{ x: number; y: number } | null>(null)

  // Warm neighbouring slides so navigation is instant.
  useEffect(() => { const a = slides[n]; if (a) warm(a) }, [n])
  // A drawer tab that the new part lacks must not stay selected.
  useEffect(() => { setDrawer((d) => { if (!d) return d; if (d === 'deeper' && !part.depth) return part.concept ? 'concept' : part.deck ? 'source' : null; if (d === 'concept' && !part.concept) return part.depth ? 'deeper' : null; if (d === 'source' && !part.deck) return part.depth ? 'deeper' : null; return d }) }, [part])

  const Current = useMemo(() => partComponent(part.ref), [part.ref])
  const t = transitions[section.id]

  return (
    <div data-testid="deck" data-section={section.title} className={cx('flex h-dvh flex-col overflow-hidden bg-bg', `theme-${section.id}`)}>
      {!present && <TopNav />}
      <div className="relative flex min-h-0 flex-1">
        <MeshBackground />
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        {!present && <SectionSidebar current={n} active={section.id} className="relative z-10 my-3 ml-3 hidden w-[12.2rem] shrink-0 xl:flex" />}
        <main className="relative z-10 flex min-w-0 flex-1 flex-col" style={{ perspective: '1600px' }}
          onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }}
          onTouchEnd={(e) => {
            if (!touch.current) return
            const dx = e.changedTouches[0].clientX - touch.current.x; const dy = e.changedTouches[0].clientY - touch.current.y
            touch.current = null
            if ((e.target as HTMLElement).closest('canvas, input')) return
            if (Math.abs(dx) > 70 && Math.abs(dy) < 40) { if (dx < 0) next(); else back() }
          }}>
          {!present && (
            <nav aria-label="Sections" className="flex shrink-0 gap-1.5 overflow-x-auto px-3 pt-2.5 xl:hidden">
              {sections.map((s) => (
                <button key={s.id} type="button" onClick={() => goSlide(firstOf(s.id))} aria-current={s.id === section.id ? 'true' : undefined}
                  className={cx(`theme-${s.id}`, 'shrink-0 rounded-full border px-3 py-1 text-[0.78rem] whitespace-nowrap', s.id === section.id ? 'border-orange bg-orange/20 text-amber' : 'border-hair text-mute')}>
                  {String(s.id).padStart(2, '0')} {s.title}
                </button>
              ))}
            </nav>
          )}
          {slide.parts.length > 1 && (
            <div role="tablist" aria-label="Parts of this slide" className={cx('z-10 flex shrink-0 gap-1 overflow-x-auto px-4 pt-2 lg:px-9', present && 'mx-auto w-full max-w-[74rem]')}>
              {slide.parts.map((p, i) => (
                <button key={p.ref} type="button" role="tab" data-part-tab aria-selected={i === partIndex} onClick={() => setPart(i)}
                  className={cx('rounded-full border px-3 py-0.5 text-[0.8rem] font-medium whitespace-nowrap transition-colors', i === partIndex ? 'border-orange bg-orange text-black' : 'border-line bg-black/25 hover:border-orange')}>
                  <span className="num mr-1 opacity-70">{i + 1}</span>{p.label}
                </button>
              ))}
            </div>
          )}
          <div className="relative min-h-0 flex-1">
            {slide.index === 1 && <div data-testid="section-chip" className="glass-o pointer-events-none absolute top-2 right-4 z-10 rounded-full px-3 py-1 font-display text-[0.86rem] font-semibold lg:right-9"><span className="num text-amber">Section {String(section.id).padStart(2, '0')}</span> · {section.title}</div>}
            {/* Enter-only: navigation never waits on an animation, so a slide can always appear at once. */}
            <motion.div key={`${n}-${part.ref}`} custom={dirRef.current} variants={t} initial="enter" animate="center"
                transition={{ duration: 0.24, ease: [0.3, 0.7, 0.2, 1] }}
                data-testid="slide" data-slide={n} data-part={part.ref}
                className={cx('absolute inset-0 overflow-x-hidden overflow-y-auto px-4 py-3 lg:px-9 lg:py-3.5', present && 'mx-auto max-w-[74rem]')}>
                <Suspense fallback={<div className="grid h-full place-items-center text-mute">Loading slide…</div>}>
                  <Current />
                </Suspense>
            </motion.div>
            {/* Section transition screen */}
              {banner && (
                <motion.div data-testid="section-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-[color-mix(in_srgb,var(--tint)_82%,#060a18)]">
                  <motion.div initial={{ scale: 0.92, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center">
                    <div className="kicker">Section {String(section.id).padStart(2, '0')} of 06</div>
                    <div className="grad-text mt-2 font-display text-[3.4rem] leading-none font-bold">{section.title}</div>
                    <div className="mt-2 text-[1.05rem] text-mute">20 slides</div>
                  </motion.div>
                </motion.div>
              )}
          </div>
          {part.takeaway && (
            <div className={cx('mx-4 mb-1.5 flex shrink-0 items-center gap-2 rounded-xl border border-line bg-black/25 px-3 py-1.5 lg:mx-9', present && idle && 'mb-3')}>
              <Lightbulb className="h-4 w-4 shrink-0 text-amber" strokeWidth={1.8} />
              <p data-testid="takeaway" className="min-w-0 flex-1 text-[0.92rem] leading-tight"><span className="sr-hidden">Key takeaway: </span>{part.takeaway}</p>
              {part.concept && <button type="button" onClick={() => setDrawer('concept')} className="hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.78rem] font-medium text-amber hover:bg-orange/15 sm:flex"><GraduationCap className="h-3.5 w-3.5" />Concept</button>}
              {part.depth && <button type="button" onClick={() => setDrawer('deeper')} className="hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.78rem] font-medium text-amber hover:bg-orange/15 sm:flex"><Sparkles className="h-3.5 w-3.5" />Go deeper</button>}
            </div>
          )}
        </main>

          {drawer && (
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ duration: 0.2 }} aria-label="Slide details"
              className="absolute top-0 right-0 bottom-0 z-30 w-full max-w-[29rem] overflow-y-auto border-l border-line bg-[#0a0f22]/97 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {part.depth && <button type="button" aria-pressed={drawer === 'deeper'} onClick={() => setDrawer('deeper')} className={cx('rounded-full border px-3 py-1 text-[0.82rem]', drawer === 'deeper' ? 'border-orange bg-orange/20 text-amber' : 'border-hair')}>Go deeper</button>}
                  {part.concept && <button type="button" aria-pressed={drawer === 'concept'} onClick={() => setDrawer('concept')} className={cx('rounded-full border px-3 py-1 text-[0.82rem]', drawer === 'concept' ? 'border-orange bg-orange/20 text-amber' : 'border-hair')}>Concept</button>}
                  {part.deck && <button type="button" aria-pressed={drawer === 'source'} onClick={() => setDrawer('source')} className={cx('rounded-full border px-3 py-1 text-[0.82rem]', drawer === 'source' ? 'border-orange bg-orange/20 text-amber' : 'border-hair')}>Original slide text</button>}
                </div>
                <button type="button" aria-label="Close details" onClick={() => setDrawer(null)} className="btn-ghost grid h-8 w-8 shrink-0 place-items-center rounded-full"><X className="h-4 w-4" /></button>
              </div>
              {drawer === 'deeper' && (
                <div className="mt-4">
                  <div className="kicker">{slide.title}</div>
                  {part.takeaway && <p className="mt-2 font-display text-[1.14rem] leading-snug font-semibold">{part.takeaway}</p>}
                  {part.depth && <p className="mt-3 text-[1rem] leading-snug text-ink/90">{part.depth}</p>}
                  <p className="mt-4 border-t border-hair pt-2 text-[0.76rem] text-dim">Added explanation for this website. It summarises general engineering knowledge and the slide’s content.</p>
                </div>
              )}
              {drawer === 'concept' && part.concept && <ConceptDetail id={part.concept} />}
              {drawer === 'source' && part.deck && (
                <div className="mt-4">
                  <div className="text-[0.84rem] text-mute">{part.deckFile}, slide {part.srcSlide}</div>
                  <div className="mt-3 space-y-2 text-[0.92rem] leading-snug text-ink/90">{part.text.map((l, i) => <p key={i}>{l}</p>)}</div>
                </div>
              )}
            </motion.aside>
          )}
      </div>

      <motion.footer animate={{ opacity: idle ? 0 : 1, y: idle ? 8 : 0 }} transition={{ duration: 0.25 }}
        className={cx('z-20 flex shrink-0 items-center gap-2 border-t border-hair bg-[#0a0f20]/85 px-3 py-2 lg:gap-3', present && 'absolute right-0 bottom-0 left-0', idle && 'pointer-events-none')}>
        <button type="button" onClick={() => setDrawer(drawer ? null : part.depth ? 'deeper' : part.concept ? 'concept' : part.deck ? 'source' : null)} disabled={!hasDrawer} title="Slide details and original text (N)" aria-pressed={!!drawer}
          className="btn-ghost hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.76rem] whitespace-nowrap disabled:opacity-70 md:flex">
          <FileText className="h-3.5 w-3.5 text-amber" />{part.deck ? `Source: ${part.deck.toUpperCase()} · ${part.srcSlide}` : 'Added for the web'}
        </button>
        <div data-testid="counter" className="num shrink-0 rounded-full border border-line bg-black/30 px-3 py-1 font-display text-[0.86rem] font-semibold">
          <span className="text-amber">{String(n).padStart(2, '0')}</span> / {TOTAL}
        </div>
        <span data-testid="section-progress" className="num hidden shrink-0 text-[0.76rem] whitespace-nowrap text-ink/85 lg:inline">{section.title}: {slide.index}/20</span>
        <ProgressBar n={n} onJump={goSlide} />
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <span className="hidden gap-1.5 md:flex">
            <CtlBtn label="Presentation overview (O)" onClick={() => setOverlay('overview')}><Grid3x3 className="h-4 w-4" /></CtlBtn>
            <CtlBtn label="Glossary (G)" onClick={() => setOverlay('glossary')}><BookA className="h-4 w-4" /></CtlBtn>
          </span>
          <CtlBtn label="Previous section (Shift + Left)" onClick={prevSec} disabled={n === 1}><ChevronsLeft className="h-4 w-4" /></CtlBtn>
          <CtlBtn label="Previous (Left)" onClick={back} disabled={n === 1 && partIndex === 0}><ChevronLeft className="h-[1.1rem] w-[1.1rem]" /></CtlBtn>
          <CtlBtn label="Next (Right)" primary onClick={next} disabled={n === TOTAL && partIndex === slide.parts.length - 1}><ChevronRight className="h-[1.1rem] w-[1.1rem]" /></CtlBtn>
          <CtlBtn label="Next section (Shift + Right)" onClick={nextSec} disabled={section.id === sections.length}><ChevronsRight className="h-4 w-4" /></CtlBtn>
          {present ? (
            <CtlBtn label="Exit presentation mode (Esc)" onClick={exitPresent}><X className="h-4 w-4" /></CtlBtn>
          ) : (
            <CtlBtn label="Fullscreen (F)" onClick={toggleFullscreen}>{fullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}</CtlBtn>
          )}
        </div>
      </motion.footer>
      {present && idle && <div aria-hidden className="absolute right-0 bottom-0 left-0 z-20 h-[3px] bg-white/10"><div className="h-full bg-orange" style={{ width: `${(n / TOTAL) * 100}%` }} /></div>}

        {overlay === 'overview' && <Overview key="o" n={n} onClose={() => setOverlay(null)} />}
        {overlay === 'glossary' && (
          <motion.div key="g" role="dialog" aria-label="Glossary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="absolute inset-0 z-40 flex flex-col bg-[#060a18]/97 p-5">
            <div className="mb-2 flex shrink-0 items-center justify-between">
              <div className="font-display text-[1.3rem] font-bold">Technical glossary</div>
              <button type="button" aria-label="Close glossary" onClick={() => setOverlay(null)} className="btn-ghost grid h-9 w-9 place-items-center rounded-full"><X className="h-4 w-4" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto"><GlossaryPanel onJump={() => setOverlay(null)} /></div>
          </motion.div>
        )}
    </div>
  )
}
