import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import manifest from '../data/manifest.json'
import source from '../data/sourceText.json'
import { DEPTH, ADDED_DEPTH, PART_CONCEPT } from '../data/depth'

export type SectionMeta = (typeof manifest.sections)[number]
export const sections = manifest.sections
export const decks = manifest.decks as Record<string, string>

export const SLIDES_PER_SECTION = 20

export type SlidePart = {
  /** Component reference, for example "s2:5" (source deck 2, slide 5) or "b:crazy8" (added content) */ ref: string
  label?: string
  deck?: string; deckFile?: string; srcSlide?: number
  text: string[]
  takeaway?: string
  depth?: string
  concept?: string
}
export type SlideRef = {
  /** 1-based position in the whole presentation (1..120) */ n: number
  section: SectionMeta
  /** 1-based position inside its section (1..20) */ index: number
  title: string
  visual: string
  parts: SlidePart[]
}

const sourceText = source as Record<string, string[][]>

const makePart = ([ref, label]: string[]): SlidePart => {
  const m = /^s(\d):(\d+)$/.exec(ref)
  if (m) {
    const deck = `s${m[1]}`; const k = Number(m[2]); const d = DEPTH[`${m[1]}-${k}`]
    return { ref, label, deck, deckFile: decks[deck], srcSlide: k, text: sourceText[deck][k - 1] ?? [], takeaway: d?.t, depth: d?.d, concept: PART_CONCEPT[ref] }
  }
  const d = ADDED_DEPTH[ref]
  return { ref, label, text: [], takeaway: d?.t, depth: d?.d, concept: PART_CONCEPT[ref] }
}

export const slides: SlideRef[] = sections.flatMap((section) => section.slides.map((s, i) => ({ section, index: i + 1, title: s.title, visual: s.visual, parts: s.parts.map(makePart) })))
  .map((s, i) => ({ ...s, n: i + 1 }))
export const TOTAL = slides.length

/** Throws in development if the mandatory structure is ever broken. */
export function validateStructure() {
  const names = ['Empathy Mapping', 'Brainstorming', 'Problem Sizing', 'Journey Mapping', 'Convergence and Divergence', 'Visualization']
  const problems: string[] = []
  if (sections.map((s) => s.title).join('|') !== names.join('|')) problems.push('Section names or order are wrong')
  sections.forEach((s) => { if (s.slides.length !== SLIDES_PER_SECTION) problems.push(`${s.title} has ${s.slides.length} slides`) })
  if (TOTAL !== 120) problems.push(`Total is ${TOTAL}`)
  return problems
}
const structureProblems = validateStructure()
if (structureProblems.length) console.error('Slide structure invalid:', structureProblems)

const inSection = (id: number) => slides.filter((s) => s.section.id === id)
export const firstOf = (id: number) => inSection(id)[0].n
export const lastOf = (id: number) => { const l = inSection(id); return l[l.length - 1].n }
export const countOf = (id: number) => inSection(id).length
const refIndex = new Map<string, { n: number; part: number }>()
slides.forEach((s) => s.parts.forEach((p, i) => refIndex.set(p.ref, { n: s.n, part: i })))
export const partOfRef = (ref: string) => refIndex.get(ref)
/** Website slide holding slide k of source deck `deck`. */
export const at = (deck: number, k: number) => refIndex.get(`s${deck}:${k}`)!.n

/* Concept library: other pages can ask it to open on a chosen concept. */
export let conceptFocus: string | null = null
export const clearConceptFocus = () => { conceptFocus = null }
/** Website slide holding an added item. A "dd-" concept key opens the concept library on that concept. */
export const atKey = (group: number | string, key: string) => {
  if (key.startsWith('dd-') && !refIndex.get(`x${group}:${key}`)) { conceptFocus = key.slice(3); return refIndex.get('x1:library')!.n }
  return refIndex.get(`${typeof group === 'number' ? `x${group}` : group}:${key}`)!.n
}

/* Handy for automated tests and for debugging from the console. */
;(window as any).__pdmSlides = slides.map((s) => ({ n: s.n, sec: s.section.id, section: s.section.title, index: s.index, title: s.title, refs: s.parts.map((p) => p.ref) }))

/* ---------- pending part: opens a specific tab when jumping to a slide ---------- */
let pendingPart: { n: number; part: number } | null = null
export const takePendingPart = (n: number) => { if (pendingPart?.n === n) { const p = pendingPart.part; pendingPart = null; return p } return 0 }
export const goRef = (ref: string) => { const r = refIndex.get(ref); if (r) { pendingPart = r; goSlide(r.n) } }

/* ---------- hash route ---------- */
export type Route =
  | { page: 'home' } | { page: 'slide'; n: number } | { page: 'factory' }
  | { page: 'insights' } | { page: 'resources' } | { page: 'explore' } | { page: 'glossary' }

const parse = (hash: string): Route => {
  const p = hash.replace(/^#\/?/, '').split('/')
  if (p[0] === 'slide') {
    const n = Math.max(1, Math.min(TOTAL, parseInt(p[1] || '1', 10) || 1))
    return { page: 'slide', n }
  }
  if (p[0] === 'factory' || p[0] === 'insights' || p[0] === 'resources' || p[0] === 'explore' || p[0] === 'glossary') return { page: p[0] }
  return { page: 'home' }
}
const subscribe = (cb: () => void) => { window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb) }
export const useHash = () => useSyncExternalStore(subscribe, () => window.location.hash)
export const useRoute = () => { const h = useHash(); return useMemo(() => parse(h), [h]) }
export const navigate = (to: string) => { window.location.hash = to }
export const goSlide = (n: number) => navigate(`/slide/${Math.max(1, Math.min(TOTAL, n))}`)

/* ---------- presentation mode, fullscreen, reduced motion ---------- */
type Ctx = {
  present: boolean
  fullscreen: boolean
  reduced: boolean
  toggleReduced: () => void
  enterPresent: () => void
  exitPresent: () => void
  toggleFullscreen: () => void
}
const PresentationCtx = createContext<Ctx>(null!)
export const usePresentation = () => useContext(PresentationCtx)

const readReduced = () => { try { const v = localStorage.getItem('pdm-reduced'); if (v !== null) return v === '1' } catch { /* blocked */ } return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false }
export const isReducedMotion = () => document.documentElement.dataset.reduced === 'true'

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [present, setPresent] = useState(false)
  const [fullscreen, setFullscreen] = useState(!!document.fullscreenElement)
  const [reduced, setReduced] = useState(readReduced)

  useEffect(() => { document.documentElement.dataset.reduced = String(reduced) }, [reduced])

  useEffect(() => {
    const onChange = () => {
      const on = !!document.fullscreenElement
      setFullscreen(on)
      // Browser Escape leaves fullscreen without a key event: treat it as leaving presentation mode.
      if (!on) setPresent(false)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const enterFs = () => document.documentElement.requestFullscreen?.().catch(() => {})
  const exitFs = () => { if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}) }

  const enterPresent = useCallback(() => {
    setPresent(true)
    if (parse(window.location.hash).page !== 'slide') {
      const last = Number(sessionStorageGet('pdm-last-slide')) || 1
      goSlide(last)
    }
    enterFs()
  }, [])
  const exitPresent = useCallback(() => { setPresent(false); exitFs() }, [])
  const toggleFullscreen = useCallback(() => { if (document.fullscreenElement) exitFs(); else enterFs() }, [])
  const toggleReduced = useCallback(() => setReduced((r) => { try { localStorage.setItem('pdm-reduced', r ? '0' : '1') } catch { /* blocked */ } return !r }), [])

  return (
    <PresentationCtx.Provider value={{ present, fullscreen, reduced, toggleReduced, enterPresent, exitPresent, toggleFullscreen }}>
      {children}
    </PresentationCtx.Provider>
  )
}

export const sessionStorageGet = (k: string) => { try { return sessionStorage.getItem(k) } catch { return null } }
export const sessionStorageSet = (k: string, v: string) => { try { sessionStorage.setItem(k, v) } catch { /* private mode */ } }
