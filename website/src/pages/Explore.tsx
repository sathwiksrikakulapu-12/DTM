import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { MeshBackground, TopNav } from '../engine/Chrome'
import { goSlide, sections, slides, TOTAL } from '../engine/store'
import { cx } from '../ui/kit'

export default function Explore() {
  const [q, setQ] = useState('')
  const [sec, setSec] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => input.current?.focus(), [])
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return slides.filter((s) => (!sec || s.section.id === sec) && (!t || s.title.toLowerCase().includes(t) || s.parts.some((p) => p.text.join(' ').toLowerCase().includes(t)) || s.visual.toLowerCase().includes(t)))
  }, [q, sec])
  return (
    <div className="theme-home relative flex h-dvh flex-col bg-bg">
      <MeshBackground />
      <TopNav />
      <main className="bg-grid relative min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-8">
        <div className="kicker">Explore</div>
        <h1 className="mt-1 font-display text-[2.3rem] font-bold">Browse all {TOTAL} slides</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <label className="relative min-w-[16rem] flex-1 lg:max-w-[28rem]">
            <span className="sr-hidden">Search slides</span>
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-amber" />
            <input ref={input} type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles and slide text, e.g. RUL, bearing, TAM" style={{ paddingLeft: '2.2rem' }} />
          </label>
          <button type="button" aria-pressed={sec === 0} onClick={() => setSec(0)} className={cx('rounded-full border px-3 py-1 text-[0.84rem]', sec === 0 ? 'border-orange bg-orange text-black font-semibold' : 'border-line')}>All</button>
          {sections.map((s) => <button key={s.id} type="button" aria-pressed={sec === s.id} onClick={() => setSec(s.id)} className={cx('rounded-full border px-3 py-1 text-[0.84rem] whitespace-nowrap', sec === s.id ? 'border-orange bg-orange text-black font-semibold' : 'border-line')}>{String(s.id).padStart(2, '0')} {s.title}</button>)}
          <span className="num text-[0.84rem] text-mute">{list.length} result{list.length === 1 ? '' : 's'}</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((s) => (
            <button key={s.n} type="button" onClick={() => goSlide(s.n)} className="glass lift flex min-h-[7.6rem] flex-col rounded-xl p-3 text-left">
              <div className="flex items-center justify-between text-[0.74rem] text-mute"><span className="num font-display text-[0.92rem] font-bold text-amber">{String(s.n).padStart(3, '0')}</span><span>{s.section.title} · {s.index}/20</span></div>
              <div className="mt-1.5 font-display text-[1.02rem] leading-tight font-semibold">{s.title}</div>
              <div className="mt-1 text-[0.8rem] leading-snug text-mute">{s.visual}</div>
            </button>
          ))}
          {list.length === 0 && <p className="text-mute">No slides match “{q}”.</p>}
        </div>
      </main>
    </div>
  )
}
