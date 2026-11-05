import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react'

/* ---------- capability detection ---------- */
export type Tier = 'none' | 'low' | 'high'
let cached: Tier | null = null
export function detectTier(): Tier {
  if (cached) return cached
  const params = new URLSearchParams(window.location.search)
  if (params.get('no3d') === '1') return (cached = 'none')
  if (params.get('tier') === 'high' || params.get('tier') === 'low') return (cached = params.get('tier') as Tier)
  let forced: string | null = null
  try { forced = localStorage.getItem('pdm-3d') } catch { /* blocked storage */ }
  if (forced === 'off') return (cached = 'none')
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    if (!gl) return (cached = 'none')
    const dbg = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
    const renderer = dbg ? String((gl as WebGLRenderingContext).getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    if (/swiftshader|llvmpipe|software/i.test(renderer)) return (cached = 'low')
  } catch { return (cached = 'none') }
  const mobile = window.innerWidth < 900
  const weak = (navigator.hardwareConcurrency || 8) <= 2
  return (cached = mobile || weak ? 'low' : 'high')
}
export const is3DEnabled = () => { try { return localStorage.getItem('pdm-3d') !== 'off' } catch { return true } }
export const set3D = (on: boolean) => { try { localStorage.setItem('pdm-3d', on ? 'on' : 'off') } catch { /* blocked storage */ } window.location.reload() }

/* ---------- error boundary so a GPU failure can never blank a slide ---------- */
export class Guard extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

/* Mount after a tiny delay so slide transitions stay smooth. */
export function Deferred({ ms = 120, children, placeholder = null }: { ms?: number; children: ReactNode; placeholder?: ReactNode }) {
  const [on, set] = useState(false)
  useEffect(() => { const t = setTimeout(() => set(true), ms); return () => clearTimeout(t) }, [ms])
  return <>{on ? children : placeholder}</>
}

export function Motor2DFallback({ className }: { className?: string }) {
  return (
    <div className={'photo h-full w-full rounded-2xl ' + (className ?? '')}>
      <img src={import.meta.env.BASE_URL + 'img/s4-16.webp'} alt="Motor and pump assembly from the Problem Sizing deck (3D is off on this device)" />
      <span className="absolute right-3 bottom-3 z-10 rounded-full border border-hair bg-black/60 px-2.5 py-0.5 text-[0.72rem] text-mute">3D off: showing image</span>
    </div>
  )
}

export const Loading3D = () => (
  <div className="grid h-full w-full place-items-center text-[0.85rem] text-mute">
    <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-orange border-t-transparent" />Loading 3D scene…</span>
  </div>
)

export const LazyHero = lazy(() => import('./HeroScene'))
export const LazyFactory = lazy(() => import('./FactoryScene'))
export const LazyExplorer = lazy(() => import('./SensorExplorer'))
export const LazyMachine = lazy(() => import('./MachineScene'))

/** Tier-aware wrapper: lazy loads the 3D chunk and falls back to an image. */
export function Scene3D({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const fb = fallback ?? <Motor2DFallback />
  if (detectTier() === 'none') return <>{fb}</>
  return <Guard fallback={fb}><Suspense fallback={<Loading3D />}>{children}</Suspense></Guard>
}
