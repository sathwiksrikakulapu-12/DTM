import { useMemo, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { MeshBackground, TopNav } from '../engine/Chrome'
import { atKey, goSlide } from '../engine/store'
import { GLOSSARY } from '../data/concepts'
import { cx } from '../ui/kit'

export function GlossaryPanel({ onJump }: { onJump?: () => void }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return GLOSSARY.filter((g) => !t || g.term.toLowerCase().includes(t) || g.def.toLowerCase().includes(t))
  }, [q])
  const cur = GLOSSARY.find((g) => g.term === open)
  return (
    <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <label className="relative block">
          <span className="sr-hidden">Search glossary</span>
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-amber" />
          <input type="search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms, for example FFT, RUL or edge" style={{ paddingLeft: '2.2rem' }} />
        </label>
        <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {list.map((g) => (
            <button key={g.term} type="button" aria-pressed={open === g.term} onClick={() => setOpen(g.term)} className={cx('glass lift rounded-lg px-3 py-2 text-left font-display text-[0.94rem] font-semibold', open === g.term && 'hot')}>{g.term}</button>
          ))}
          {list.length === 0 && <p className="text-mute">No terms match “{q}”.</p>}
        </div>
      </div>
      <div className="glass-o h-fit rounded-2xl p-4 lg:sticky lg:top-0" data-testid="glossary-panel">
        {cur ? (
          <>
            <div className="font-display text-[1.45rem] font-bold text-amber">{cur.term}</div>
            <p className="mt-2 text-[1.05rem] leading-snug">{cur.def}</p>
            {cur.slide && <button type="button" onClick={() => { goSlide(atKey(cur.slide![0], cur.slide![1])); onJump?.() }} className="mt-3 flex items-center gap-1 text-[0.86rem] font-medium text-amber hover:underline">Open the related slide <ArrowRight className="h-3.5 w-3.5" /></button>}
          </>
        ) : <p className="text-[1rem] text-mute">Select a term to read its explanation.</p>}
      </div>
    </div>
  )
}

export default function Glossary() {
  return (
    <div className="theme-home relative flex h-dvh flex-col bg-bg">
      <MeshBackground />
      <TopNav />
      <main className="bg-grid relative min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-8">
        <div className="kicker">Glossary</div>
        <h1 className="mt-1 mb-3 font-display text-[2.3rem] font-bold">Technical glossary</h1>
        <GlossaryPanel />
      </main>
    </div>
  )
}
