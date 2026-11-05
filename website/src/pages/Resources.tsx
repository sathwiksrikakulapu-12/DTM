import { useState } from 'react'
import { Box, FileText, Keyboard } from 'lucide-react'
import { MeshBackground, TopNav } from '../engine/Chrome'
import { goSlide, sections, slides, usePresentation } from '../engine/store'
import { cx, Tag } from '../ui/kit'
import { is3DEnabled, set3D } from '../three/Stage'

const KEYS = [
  ['→ / Space', 'Next slide'], ['←', 'Previous slide'], ['Shift + → / ←', 'Next or previous section'], ['Home / End', 'First or last slide'],
  ['F', 'Toggle fullscreen'], ['O', 'Presentation overview'], ['G', 'Glossary'], ['N', 'Go deeper and original slide text'], ['Esc', 'Close overlays, exit fullscreen or presentation mode'],
]
const GLOSSARY = [
  ['PdM', 'Predictive maintenance: uses real-time condition data combined with analytics to anticipate equipment failures before they occur.', 'Engineering Students deck, slide 3'],
  ['RUL', 'Remaining Useful Life: estimates how long a component can continue operating before failure.', 'Engineering Students deck, slide 14'],
  ['MCSA', 'Motor current signature analysis: uncovers rotor faults and misalignment without physical contact.', 'Engineering Students deck, slide 11'],
  ['SHAP values', 'Explainability tool that highlights which features drove the anomaly.', 'Engineering Students deck, slide 13'],
  ['MQTT, OPC-UA', 'Connectivity protocols that transmit data securely.', 'Engineering Students deck, slide 12'],
  ['TAM', 'All relevant assets and customers.', 'Problem Sizing deck, slide 9'],
  ['SAM', 'Reachable segment with the right data and channels.', 'Problem Sizing deck, slide 9'],
  ['SOM', 'Realistic early share, constrained by sales capacity and proof.', 'Problem Sizing deck, slide 9'],
]

export default function Resources() {
  const [sec, setSec] = useState(1)
  const enabled = is3DEnabled()
  const { reduced, toggleReduced } = usePresentation()
  return (
    <div className="theme-home relative flex h-dvh flex-col bg-bg">
      <MeshBackground />
      <TopNav />
      <main className="bg-grid relative min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-8">
        <div className="kicker">Resources</div>
        <h1 className="mt-1 font-display text-[2.3rem] font-bold">Presenter reference</h1>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <section className="glass rounded-2xl p-4">
            <h2 className="flex items-center gap-2 font-display text-[1.14rem] font-semibold"><Keyboard className="h-5 w-5 text-amber" />Keyboard controls</h2>
            <dl className="mt-2.5 space-y-1.5 text-[0.92rem]">{KEYS.map(([k, d]) => <div key={k} className="flex items-center justify-between gap-3"><dt className="rounded-md border border-line bg-black/40 px-2 py-0.5 font-display text-[0.8rem] whitespace-nowrap">{k}</dt><dd className="text-right text-mute">{d}</dd></div>)}</dl>
          </section>
          <section className="glass rounded-2xl p-4">
            <h2 className="flex items-center gap-2 font-display text-[1.14rem] font-semibold"><Box className="h-5 w-5 text-amber" />3D rendering</h2>
            <p className="mt-2 text-[0.95rem] leading-snug text-mute">Turn 3D off on devices that struggle. Slides then show an image from the decks in place of each scene.</p>
            <button type="button" onClick={() => set3D(!enabled)} className="btn-ghost mt-3 rounded-full px-4 py-1.5 text-[0.9rem]">Turn 3D {enabled ? 'off' : 'on'}</button>
            <button type="button" aria-pressed={reduced} onClick={toggleReduced} className="btn-ghost mt-2 ml-2 rounded-full px-4 py-1.5 text-[0.9rem]">{reduced ? 'Turn animations on' : 'Reduce motion'}</button>
          </section>
          <section className="glass rounded-2xl p-4">
            <h2 className="flex items-center gap-2 font-display text-[1.14rem] font-semibold"><FileText className="h-5 w-5 text-amber" />How to read the labels</h2>
            <div className="mt-2.5 flex flex-col items-start gap-1.5">
              <Tag kind="illustrative" /><Tag kind="hypothetical" /><Tag kind="placeholder" /><Tag kind="deck" /><Tag kind="web" />
            </div>
          </section>
          <section className="glass rounded-2xl p-4 lg:col-span-3">
            <h2 className="font-display text-[1.14rem] font-semibold">Glossary from the decks</h2>
            <dl className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{GLOSSARY.map(([k, d, r]) => <div key={k} className="rounded-xl border border-hair p-3"><dt className="font-display font-bold text-amber">{k}</dt><dd className="mt-0.5 text-[0.9rem] leading-snug">{d}</dd><dd className="mt-1 text-[0.74rem] text-dim">{r}</dd></div>)}</dl>
          </section>
          <section className="glass rounded-2xl p-4 lg:col-span-3">
            <h2 data-testid="structure" className="font-display text-[1.14rem] font-semibold">Slide map: {sections.length} sections, {slides.length} slides, source decks to website</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sections.map((s) => <button key={s.id} type="button" aria-pressed={sec === s.id} onClick={() => setSec(s.id)} className={cx('rounded-full border px-3 py-0.5 text-[0.82rem]', sec === s.id ? 'border-orange bg-orange text-black font-semibold' : 'border-line')}>{String(s.id).padStart(2, '0')} {s.title}</button>)}
            </div>
            <p className="mt-2 text-[0.84rem] text-mute">{sections[sec - 1].style}. Exactly {slides.filter((s) => s.section.id === sec).length} slides.</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-[0.88rem]">
                <thead className="text-[0.74rem] tracking-wider text-amber uppercase"><tr><th className="py-1.5 pr-3 font-semibold">Slide</th><th className="pr-3 font-semibold">Title</th><th className="pr-3 font-semibold">Source</th><th className="font-semibold">Web treatment</th></tr></thead>
                <tbody>
                  {slides.filter((s) => s.section.id === sec).map((s) => (
                    <tr key={s.n} className="border-t border-hair">
                      <td className="py-1.5 pr-3"><button type="button" onClick={() => goSlide(s.n)} className="num text-amber hover:underline">{s.index}</button></td>
                      <td className="pr-3">{s.title}</td>
                      <td className="pr-3 text-mute">{s.parts.map((p) => (p.deck ? `${p.deckFile?.replace('Predictive Maintenance ', '').replace(/\.(pptx|pdf)$/, '')} ${p.srcSlide}` : 'Added')).join(', ')}</td>
                      <td className="text-mute">{s.visual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
