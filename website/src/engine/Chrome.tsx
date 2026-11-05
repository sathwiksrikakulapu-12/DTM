import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Activity, BarChart3, BookA, BookOpen, Box, ChevronDown, Expand, FlaskConical, GitMerge, Home as HomeIcon, Layers, Lightbulb, ListFilter, Menu, Minimize, PersonStanding, Play, Route as RouteIcon, Search, Siren, Target, UserRound, Wrench, X } from 'lucide-react'
import { cx } from '../ui/kit'
import { atKey, countOf, firstOf, goSlide, lastOf, navigate, sections, sessionStorageGet, TOTAL, usePresentation, useRoute } from './store'

export const SECTION_ICONS: Record<string, any> = { Lightbulb, UserRound, Route: RouteIcon, Target, Layers, GitMerge }

/** Slowly drifting mesh gradient, coloured by the active theme. */
export const MeshBackground = () => <div aria-hidden className="mesh"><i /><i /><i /></div>

export const Logo = () => (
  <a href="#/" aria-label="PdM DT home" className="flex shrink-0 items-center gap-2.5">
    <svg viewBox="0 0 32 20" className="h-[1.35rem] w-[2.1rem]" aria-hidden>
      <defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="#3fd9ff" /><stop offset=".55" stopColor="#c58bff" /><stop offset="1" stopColor="#ff8a00" /></linearGradient></defs>
      <path fill="none" stroke="url(#lg)" strokeWidth="3.4" d="M16 10C13 5 10 2.5 7 2.5a7.5 7.5 0 0 0 0 15c3 0 6-2.5 9-7.5s6-7.5 9-7.5a7.5 7.5 0 0 1 0 15c-3 0-6-2.5-9-7.5z" />
    </svg>
    <span className="font-display text-[1.28rem] font-bold tracking-tight whitespace-nowrap">PdM DT</span>
    <span className="hidden border-l border-hair pl-2.5 text-[0.72rem] leading-[1.15] text-mute 2xl:block">Design Thinking for<br />Predictive Maintenance</span>
  </a>
)

function NavLink({ href, icon: I, children, active }: { href: string; icon: any; children: ReactNode; active?: boolean }) {
  return (
    <a href={href} aria-current={active ? 'page' : undefined}
      className={cx('flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.84rem] font-medium whitespace-nowrap transition-colors',
        active ? 'border-orange/80 bg-orange/15 text-amber shadow-[0_0_.9rem_color-mix(in_srgb,var(--color-orange)_30%,transparent)]' : 'border-transparent text-ink/85 hover:text-amber')}>
      <I className="h-[0.95rem] w-[0.95rem]" strokeWidth={1.8} />{children}
    </a>
  )
}

function useMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  return { open, setOpen, ref }
}

function ExploreMenu({ active }: { active: boolean }) {
  const { open, setOpen, ref } = useMenu()
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}
        className={cx('flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.84rem] font-medium transition-colors', active ? 'border-orange/80 bg-orange/15 text-amber' : 'border-transparent text-ink/85 hover:text-amber')}>
        <ListFilter className="h-[0.95rem] w-[0.95rem]" strokeWidth={1.8} />Explore<ChevronDown className={cx('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div role="menu" className="absolute top-full left-0 z-50 mt-2 w-[20rem] rounded-xl border border-line bg-[#0d1224]/98 p-1.5 shadow-2xl">
          {sections.map((s) => {
            const I = SECTION_ICONS[s.icon]
            return (
              <a key={s.id} role="menuitem" href={`#/slide/${firstOf(s.id)}`} onClick={() => setOpen(false)} className={cx(`theme-${s.id}`, 'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.88rem] hover:bg-orange/15')}>
                <I className="h-4 w-4 text-orange" strokeWidth={1.8} /><span className="flex-1">{s.title}</span><span className="num text-[0.75rem] text-dim">{countOf(s.id)}</span>
              </a>
            )
          })}
          <a role="menuitem" href="#/explore" onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2.5 rounded-lg border-t border-hair px-2.5 py-2 text-[0.88rem] font-medium text-amber hover:bg-orange/10">
            <Search className="h-4 w-4" strokeWidth={1.8} />Browse and search all {TOTAL} slides
          </a>
        </div>
      )}
    </div>
  )
}

function LabsMenu() {
  const { open, setOpen, ref } = useMenu()
  const labs = [
    { l: 'Interactive motor anatomy', i: Wrench, go: () => goSlide(atKey(1, 'machine')) },
    { l: 'Sensor dashboard', i: Activity, go: () => goSlide(atKey(1, 'dashboard')) },
    { l: 'Failure simulator', i: Siren, go: () => goSlide(atKey(1, 'simulator')) },
    { l: 'Immersive 3D factory', i: Box, go: () => navigate('/factory') },
  ]
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)} className="flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-[0.84rem] font-medium text-ink/85 transition-colors hover:text-amber">
        <FlaskConical className="h-[0.95rem] w-[0.95rem]" strokeWidth={1.8} />Labs<ChevronDown className={cx('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div role="menu" className="absolute top-full left-0 z-50 mt-2 w-[16rem] rounded-xl border border-line bg-[#0d1224]/98 p-1.5 shadow-2xl">
          {labs.map(({ l, i: I, go }) => <button key={l} type="button" role="menuitem" onClick={() => { setOpen(false); go() }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.88rem] hover:bg-orange/15"><I className="h-4 w-4 text-amber" strokeWidth={1.8} />{l}</button>)}
        </div>
      )}
    </div>
  )
}

export function TopNav({ transparent }: { transparent?: boolean }) {
  const route = useRoute()
  const { enterPresent, toggleFullscreen, fullscreen, reduced, toggleReduced } = usePresentation()
  const [menu, setMenu] = useState(false)
  useEffect(() => setMenu(false), [route])
  return (
    <header className={cx('relative z-40 flex h-[3.5rem] shrink-0 items-center gap-3 border-b border-hair px-4', transparent ? 'bg-black/25 backdrop-blur-md' : 'bg-[#0a0f20]/90 backdrop-blur-md')}>
      <Logo />
      <nav aria-label="Main" className="ml-auto hidden items-center gap-0.5 lg:ml-4 lg:flex">
        <NavLink href="#/" icon={HomeIcon} active={route.page === 'home'}>Home</NavLink>
        <ExploreMenu active={route.page === 'explore'} />
        <LabsMenu />
        <NavLink href="#/factory" icon={Box} active={route.page === 'factory'}>3D Factory</NavLink>
        <NavLink href="#/insights" icon={BarChart3} active={route.page === 'insights'}>Insights</NavLink>
        <NavLink href="#/glossary" icon={BookA} active={route.page === 'glossary'}>Glossary</NavLink>
        <NavLink href="#/resources" icon={BookOpen} active={route.page === 'resources'}>Resources</NavLink>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <button type="button" aria-label="Search slides" title="Search slides" onClick={() => navigate('/explore')} className="btn-ghost hidden h-9 w-9 place-items-center rounded-full sm:grid"><Search className="h-4 w-4" /></button>
        <button type="button" aria-label={reduced ? 'Turn animations back on' : 'Reduce motion'} aria-pressed={reduced} title={reduced ? 'Reduced motion is on' : 'Reduce motion'} onClick={toggleReduced} className={cx('btn-ghost hidden h-9 w-9 place-items-center rounded-full sm:grid', reduced && 'bg-orange/25 text-amber')}><PersonStanding className="h-4 w-4" /></button>
        <button type="button" aria-label="Toggle fullscreen" title="Fullscreen (F)" onClick={toggleFullscreen} className="btn-ghost grid h-9 w-9 place-items-center rounded-full">{fullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}</button>
        <button type="button" onClick={enterPresent} className="btn-primary flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.84rem] whitespace-nowrap">
          <span className="hidden sm:inline">Presentation Mode</span><span className="sm:hidden">Present</span><Play className="h-3.5 w-3.5 fill-current" />
        </button>
        <button type="button" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(!menu)} className="btn-ghost grid h-9 w-9 place-items-center rounded-full lg:hidden">{menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
      </div>
      {menu && (
        <nav aria-label="Mobile" className="absolute top-full right-0 left-0 z-50 flex flex-col gap-1 border-b border-line bg-[#0a0f20]/98 p-3 lg:hidden">
          <NavLink href="#/" icon={HomeIcon} active={route.page === 'home'}>Home</NavLink>
          <NavLink href="#/explore" icon={ListFilter} active={route.page === 'explore'}>Explore</NavLink>
          <NavLink href={`#/slide/${atKey(1, 'dashboard')}`} icon={Activity}>Sensor dashboard</NavLink>
          <NavLink href={`#/slide/${atKey(1, 'simulator')}`} icon={Siren}>Failure simulator</NavLink>
          <NavLink href="#/factory" icon={Box} active={route.page === 'factory'}>3D Factory</NavLink>
          <NavLink href="#/insights" icon={BarChart3} active={route.page === 'insights'}>Insights</NavLink>
          <NavLink href="#/glossary" icon={BookA} active={route.page === 'glossary'}>Glossary</NavLink>
          <NavLink href="#/resources" icon={BookOpen} active={route.page === 'resources'}>Resources</NavLink>
        </nav>
      )}
    </header>
  )
}

/** Left section list, shared by the homepage and the slide deck. */
export function SectionSidebar({ current, className, active }: { current?: number; className?: string; active?: number }) {
  return (
    <aside aria-label="Presentation sections" className={cx('glass flex flex-col gap-1 rounded-2xl p-2', className)}>
      <div className="px-1.5 pt-0.5 pb-0.5">
        <div className="font-display text-[1rem] font-semibold">Presentation</div>
        <div className="num text-[0.7rem] text-mute">{sections.length} Sections · {TOTAL} Slides</div>
      </div>
      {sections.map((s) => {
        const I = SECTION_ICONS[s.icon]
        const on = active === s.id
        const inSec = current && current >= firstOf(s.id) && current <= lastOf(s.id)
        const pct = inSec ? ((current! - firstOf(s.id) + 1) / countOf(s.id)) * 100 : 0
        return (
          <button key={s.id} type="button" aria-current={on ? 'true' : undefined} onClick={() => goSlide(firstOf(s.id))}
            className={cx(`theme-${s.id}`, 'lift relative flex min-h-0 flex-1 items-center gap-1.5 overflow-hidden rounded-xl border px-1.5 py-1 text-left', on ? 'hot glass-o' : 'border-hair bg-white/[.03]')}>
            <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-lg', on ? 'bg-orange/30 text-amber' : 'bg-orange/10 text-orange')}><I className="h-[1rem] w-[1rem]" strokeWidth={1.8} /></span>
            <span className="min-w-0">
              <span className="flex items-baseline gap-1">
                <span className="num font-display text-[0.76rem] font-bold text-amber">{String(s.id).padStart(2, '0')}</span>
                <span className="text-[0.78rem] leading-[1.08] font-semibold">{s.title}</span>
              </span>
              <span className="num block text-[0.64rem] text-mute">{countOf(s.id)} Slides</span>
            </span>
            {inSec && <span aria-hidden className="absolute bottom-0 left-0 h-[2px] bg-orange" style={{ width: `${pct}%` }} />}
          </button>
        )
      })}
    </aside>
  )
}

export const lastViewed = () => Number(sessionStorageGet('pdm-last-slide')) || 1
