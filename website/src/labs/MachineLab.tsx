import { motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { AlertTriangle, Boxes, Radar, RotateCw, ScanLine } from 'lucide-react'
import { Rise, Slide, Tag, cx, Sr } from '../ui/kit'
import { Deferred, LazyMachine, Scene3D } from '../three/Stage'
import { PARTS, type PartId } from '../data/components'
import { SENSORS } from '../data/sensors'

const FAILURE_POINTS: PartId[] = ['bearings', 'coupling', 'stator', 'rotor', 'fan', 'pump']

export default function MachineLab() {
  const [sel, setSel] = useState<PartId>('bearings')
  const [sensor, setSensor] = useState<string | null>(null)
  const [explode, setExplode] = useState(false)
  const [xray, setXray] = useState(false)
  const [showSensors, setShowSensors] = useState(true)
  const [showFail, setShowFail] = useState(false)
  const [rotate, setRotate] = useState(false)
  const onPart = useCallback((id: PartId) => { setSel(id); setSensor(null) }, [])
  const onSensor = useCallback((id: string) => setSensor(id), [])
  const assembly = useMemo(() => ({ interactive: true, selected: sel, onPart, explode: explode ? 1 : 0, xray }), [sel, onPart, explode, xray])
  const part = PARTS.find((p) => p.id === sel)!
  const s = SENSORS.find((x) => x.id === sensor)
  const Toggle = ({ on, set, icon: I, children }: { on: boolean; set: (v: boolean) => void; icon: any; children: string }) => (
    <button type="button" aria-pressed={on} onClick={() => set(!on)} className={cx('flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.8rem] font-medium whitespace-nowrap', on ? 'border-orange bg-orange text-black' : 'border-line bg-black/30 hover:border-orange')}><I className="h-3.5 w-3.5" />{children}</button>
  )
  return (
    <Slide kicker="3D lab" title="Interactive Motor Anatomy" tag={<Tag kind="web" label="Added lab" />}>
      <div className="grid gap-3 lg:grid-cols-[10.5rem_1fr_19rem]">
        <Rise className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible" >
          {PARTS.map((p) => (
            <button key={p.id} type="button" aria-pressed={sel === p.id && !sensor} onClick={() => onPart(p.id)} className={cx('shrink-0 rounded-lg border px-2.5 py-[0.42rem] text-left text-[0.88rem] font-medium', sel === p.id && !sensor ? 'border-orange bg-orange/25 text-amber' : 'border-hair bg-white/[.03] hover:border-line')}>{p.name}</button>
          ))}
        </Rise>
        <Rise className="glass relative h-[24rem] overflow-hidden rounded-2xl lg:h-[29rem]">
          <Scene3D>
            <Deferred ms={300}>
              <LazyMachine assembly={assembly} labels showSensors={showSensors && !explode} onSensor={onSensor} activeSensor={sensor} alerts={showFail ? FAILURE_POINTS : undefined} autoRotate={rotate} cameraZ={12.5} />
            </Deferred>
          </Scene3D>
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            <Toggle on={explode} set={setExplode} icon={Boxes}>Exploded view</Toggle>
            <Toggle on={xray} set={setXray} icon={ScanLine}>X-ray</Toggle>
            <Toggle on={showSensors} set={setShowSensors} icon={Radar}>Sensors</Toggle>
            <Toggle on={showFail} set={setShowFail} icon={AlertTriangle}>Failure points</Toggle>
            <Toggle on={rotate} set={setRotate} icon={RotateCw}>Auto-rotate</Toggle>
          </div>
          <span className="pointer-events-none absolute bottom-2 left-3 text-[0.74rem] text-mute">Drag to rotate · scroll to zoom · click a part or a glowing sensor</span>
        </Rise>
        <Rise className="glass-o overflow-y-auto rounded-2xl p-3.5 lg:h-[29rem]">
          <motion.div key={s?.id ?? part.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} data-testid="part-panel">
            {s ? (
              <>
                <div className="font-display text-[1.35rem] leading-tight font-bold">{s.name} sensor</div>
                <div className="text-[0.86rem] text-amber">{s.device}</div>
                {[['What it measures', s.measures], ['Why it is important', s.why], ['Failures it can identify', s.failures]].map(([h, t]) => <div key={h} className="mt-2.5"><div className="text-[0.72rem] font-semibold tracking-wider text-amber uppercase">{h}</div><p className="mt-0.5 text-[0.95rem] leading-snug">{t}</p></div>)}
                <p className="mt-2 text-[0.72rem] text-dim">{s.ref}</p>
              </>
            ) : (
              <>
                <div className="font-display text-[1.35rem] leading-tight font-bold">{part.name}</div>
                <div className="mt-2.5"><div className="text-[0.72rem] font-semibold tracking-wider text-amber uppercase">Function</div><p className="mt-0.5 text-[0.95rem] leading-snug">{part.fn}</p></div>
                <div className="mt-2.5"><div className="text-[0.72rem] font-semibold tracking-wider text-amber uppercase">Common failure modes</div><ul className="mt-0.5 space-y-0.5 text-[0.95rem] leading-snug">{part.failures.map((f) => <li key={f}>• {f}</li>)}</ul></div>
                <div className="mt-2.5"><div className="text-[0.72rem] font-semibold tracking-wider text-amber uppercase">Relevant monitoring</div><div className="mt-1 flex flex-wrap gap-1">{part.monitoring.map((f) => <span key={f} className="rounded-full border border-line bg-black/25 px-2 py-0.5 text-[0.8rem]">{f}</span>)}</div></div>
                <div className="mt-2.5"><div className="text-[0.72rem] font-semibold tracking-wider text-amber uppercase">Why predictive maintenance helps</div><p className="mt-0.5 text-[0.95rem] leading-snug">{part.why}</p></div>
              </>
            )}
          </motion.div>
        </Rise>
      </div>
      <Sr>{PARTS.map((p) => p.name).join(', ')}</Sr>
    </Slide>
  )
}
