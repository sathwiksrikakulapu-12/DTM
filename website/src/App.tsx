import { MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { PresentationProvider, usePresentation, useRoute, sessionStorageSet } from './engine/store'
import Home from './pages/Home'
import Deck from './engine/Deck'
import { detectTier } from './three/Stage'

const Factory = lazy(() => import('./pages/Factory'))
const Insights = lazy(() => import('./pages/Insights'))
const Resources = lazy(() => import('./pages/Resources'))
const Explore = lazy(() => import('./pages/Explore'))
const Glossary = lazy(() => import('./pages/Glossary'))

/**
 * One rem = a fraction of the viewport, so desktop pages and slides scale as a
 * single composition (like a real presentation canvas) without transforms that
 * would break 3D pointer picking. Below 1024px we fall back to normal flow.
 */
function useFitRem() {
  const route = useRoute()
  const { present } = usePresentation()
  useLayoutEffect(() => {
    const apply = () => {
      const w = window.innerWidth; const h = window.innerHeight
      let rem = 16
      if (w >= 1024) {
        if (route.page === 'home') rem = Math.min(w / 80, h / 45)
        else if (route.page === 'slide') {
          if (present) rem = Math.min(w / 76, h / 44.5)
          else rem = w >= 1280 ? Math.min(w / 86, h / 48.6) : Math.min(w / 74, h / 51)
        } else rem = Math.min(w / 84, h / 47)
        rem = Math.max(11.5, Math.min(rem, 44))
      } else if (w < 480) rem = 15
      document.documentElement.style.fontSize = rem + 'px'
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [route.page, present])
}

function Routes() {
  const route = useRoute()
  const { reduced } = usePresentation()
  useFitRem()
  useEffect(() => { if (route.page === 'slide') sessionStorageSet('pdm-last-slide', String(route.n)) }, [route])
  // A mouse click should not leave focus on a button, or Space would re-trigger it instead of advancing.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.detail > 0 && document.activeElement instanceof HTMLButtonElement) document.activeElement.blur()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const blank = <div className="h-full bg-bg" />
  let page
  switch (route.page) {
    case 'slide': page = <Deck n={route.n} />; break
    case 'factory': page = <Suspense fallback={blank}><Factory /></Suspense>; break
    case 'insights': page = <Suspense fallback={blank}><Insights /></Suspense>; break
    case 'resources': page = <Suspense fallback={blank}><Resources /></Suspense>; break
    case 'explore': page = <Suspense fallback={blank}><Explore /></Suspense>; break
    case 'glossary': page = <Suspense fallback={blank}><Glossary /></Suspense>; break
    default: page = <Home />
  }
  return <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>{page}</MotionConfig>
}

document.documentElement.dataset.fx = detectTier()

export default function App() {
  return <PresentationProvider><Routes /></PresentationProvider>
}
