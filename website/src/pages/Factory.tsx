import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, Hand, Pause, Play, ScanLine, X } from 'lucide-react'
import { MeshBackground, TopNav } from '../engine/Chrome'
import { at, goSlide } from '../engine/store'
import { Deferred, LazyFactory, Scene3D } from '../three/Stage'
import { SENSORS } from '../data/sensors'
import { cx } from '../ui/kit'

const VIEWS = [
  { id: 'overview', label: 'Factory overview' },
  { id: 'motor', label: 'Motor' },
  { id: 'pump', label: 'Pump' },
  { id: 'pipes', label: 'Pipelines' },
  { id: 'panel', label: 'Control panels' },
  { id: 'robot', label: 'Robot and conveyor' },
]

export default function Factory() {
  const [view, setView] = useState({ id: 'overview', key: 0 })
  const [sensor, setSensor] = useState<string | null>(null)
  const [xray, setXray] = useState(false)
  const [spin, setSpin] = useState(2.4)
  const [tour, setTour] = useState(false)

  const go = (id: string) => { setSensor(null); setView((v) => ({ id, key: v.key + 1 })) }

  useEffect(() => {
    if (!tour) return
    const t = setInterval(() => setView((v) => ({ id: VIEWS[(VIEWS.findIndex((x) => x.id === v.id) + 1) % VIEWS.length].id, key: v.key + 1 })), 5200)
    return () => clearInterval(t)
  }, [tour])

  const info = SENSORS.find((s) => s.id === sensor)

  return (
    <div className="theme-home relative flex h-dvh flex-col overflow-hidden bg-bg">
      <MeshBackground />
      <TopNav />
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">
          <Scene3D fallback={<div className="h-full w-full p-4 lg:pr-[23rem] lg:pl-[17rem]"><div className="photo h-full rounded-2xl"><img src={import.meta.env.BASE_URL + 'img/s3-06.webp'} alt="Factory floor with motors, pumps and pipelines" /></div></div>}>
            <Deferred ms={60} placeholder={<div className="grid h-full place-items-center text-dim">Loading factory…</div>}>
              <LazyFactory view={view} sensor={sensor} onSensor={(id) => { setTour(false); setSensor(id) }} xray={xray} spin={spin} />
            </Deferred>
          </Scene3D>
        </div>

        {/* left control column */}
        <div className="pointer-events-none absolute inset-y-3 left-3 flex w-[min(15rem,46vw)] flex-col gap-2.5 overflow-y-auto">
          <div className="glass pointer-events-auto rounded-2xl p-3">
            <div className="kicker text-[0.7rem]">Camera</div>
            <div className="mt-1.5 flex flex-col gap-1">
              {VIEWS.map((v) => (
                <button key={v.id} type="button" onClick={() => { setTour(false); go(v.id) }} aria-pressed={!sensor && view.id === v.id}
                  className={cx('rounded-lg border px-2.5 py-1 text-left text-[0.84rem]', !sensor && view.id === v.id ? 'border-orange/80 bg-orange/15 text-amber' : 'border-transparent text-ink/85 hover:bg-white/5')}>{v.label}</button>
              ))}
            </div>
            <button type="button" onClick={() => { setSensor(null); setTour(!tour) }} className="btn-ghost mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-1 text-[0.82rem]">
              {tour ? <Pause className="h-3.5 w-3.5 text-amber" /> : <Play className="h-3.5 w-3.5 text-amber" />}{tour ? 'Stop tour' : 'Auto tour'}
            </button>
          </div>
          <div className="glass pointer-events-auto rounded-2xl p-3">
            <div className="kicker text-[0.7rem]">Machine</div>
            <button type="button" aria-pressed={xray} onClick={() => setXray(!xray)} className={cx('mt-1.5 flex w-full items-center gap-2 rounded-lg border px-2.5 py-1 text-[0.84rem]', xray ? 'border-orange/80 bg-orange/15 text-amber' : 'border-hair')}>
              <ScanLine className="h-4 w-4" />X-ray housing {xray ? 'on' : 'off'}
            </button>
            <label className="mt-2 block text-[0.8rem] text-mute">Rotor speed (visual only)
              <input type="range" min={0} max={8} step={0.1} value={spin} onChange={(e) => setSpin(Number(e.target.value))} aria-label="Rotor speed" />
            </label>
          </div>
          <div className="pointer-events-auto mt-auto hidden items-center gap-2 rounded-xl border border-hair bg-black/50 px-3 py-1.5 text-[0.76rem] text-mute lg:flex">
            <Hand className="h-4 w-4 shrink-0 text-amber" />Drag to orbit · scroll to zoom · click a glowing sensor
          </div>
        </div>

        {/* right sensor column */}
        <div className="pointer-events-none absolute top-3 right-3 bottom-3 flex w-[min(21rem,50vw)] flex-col gap-2.5 overflow-y-auto">
          <div className="glass pointer-events-auto rounded-2xl p-3">
            <div className="kicker text-[0.7rem]">Sensors</div>
            <div className="mt-1.5 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {SENSORS.map((s) => (
                <button key={s.id} type="button" onClick={() => { setTour(false); setSensor(s.id) }} aria-pressed={sensor === s.id}
                  className={cx('flex items-center gap-1.5 rounded-lg border px-2 py-1 text-left text-[0.82rem]', sensor === s.id ? 'border-orange/80 bg-orange/15 text-amber' : 'border-hair hover:border-line')}>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-orange shadow-[0_0_.4rem_var(--color-orange)]" />{s.name}
                </button>
              ))}
            </div>
          </div>
                      {info ? (
              <motion.div key={info.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="glass-o pointer-events-auto rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-display text-[1.3rem] font-bold">{info.name}</div>
                    <div className="text-[0.85rem] text-amber">{info.device}</div>
                  </div>
                  <button type="button" aria-label="Close sensor details" onClick={() => go(view.id)} className="btn-ghost grid h-7 w-7 shrink-0 place-items-center rounded-full"><X className="h-3.5 w-3.5" /></button>
                </div>
                {[['What it measures', info.measures], ['Why it is important', info.why], ['Failures it can identify', info.failures]].map(([h, t]) => (
                  <div key={h} className="mt-3"><div className="text-[0.75rem] font-semibold tracking-wide text-amber uppercase">{h}</div><p className="mt-0.5 text-[0.92rem] leading-snug text-ink/90">{t}</p></div>
                ))}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-hair pt-2 text-[0.74rem] text-dim">
                  <span>{info.ref}</span>
                  <button type="button" onClick={() => goSlide(at(1, 8))} className="flex items-center gap-1 text-amber hover:underline">Open slide <ArrowRight className="h-3 w-3" /></button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass pointer-events-auto rounded-2xl p-3 text-[0.88rem] leading-snug text-mute">
                <Eye className="mb-1 h-4 w-4 text-amber" />Select a sensor to fly the camera to it and read what it measures, why it matters and what failures it can identify.
                <p className="mt-1.5 text-[0.74rem] text-dim">Scene is a generated illustration; no live plant data is shown.</p>
              </motion.div>
            )}
        </div>
      </div>
    </div>
  )
}
