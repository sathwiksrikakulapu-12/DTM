import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useRef, useState } from 'react'
import { Assembly, Plinth, SensorPoint } from './Assembly'
import { detectTier } from './Stage'
import { StudioLights } from './Lights'
import { ScreenAnchor } from './ScreenAnchor'
import { SENSORS } from '../data/sensors'

/** Used on slides: orbitable motor with selectable sensors, or a plain title backdrop. */
export default function SensorExplorer({ active, onSelect, interactive = true, autoRotate = false, showSensors = true }: {
  active?: string; onSelect?: (id: string) => void; interactive?: boolean; autoRotate?: boolean; showSensors?: boolean
}) {
  const high = detectTier() === 'high'
  const [hover, setHover] = useState<string | null>(null)
  const label = useRef<HTMLDivElement>(null)
  const shown = SENSORS.find((s) => s.id === (hover ?? active))
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas dpr={high ? [1, 1.6] : 1} camera={{ position: [3, 3.8, 15], fov: 34 }} style={{ background: 'transparent' }}>
        <StudioLights low={!high} />
        <group position={[-2, -0.1, 0]}>
          <Assembly detail={high} />
          <Plinth radius={7.2} />
          {showSensors && SENSORS.map((s) => (
            <SensorPoint key={s.id} position={s.position} active={active === s.id} onSelect={() => onSelect?.(s.id)} onHover={(on) => setHover(on ? s.id : null)} />
          ))}
          {shown && <ScreenAnchor position={[shown.position[0], shown.position[1] + 0.42, shown.position[2]]} target={label} />}
        </group>
        <OrbitControls enabled={interactive} enablePan={false} minDistance={7} maxDistance={18} minPolarAngle={0.5} maxPolarAngle={1.6}
          target={[0.6, 0.3, 0]} autoRotate={autoRotate} autoRotateSpeed={0.5} enableDamping />
        {high && <EffectComposer multisampling={0}><Bloom intensity={0.7} luminanceThreshold={0.85} mipmapBlur /></EffectComposer>}
      </Canvas>
      {shown && <div ref={label} className="pointer-events-none absolute top-0 left-0 rounded-md border border-line bg-black/80 px-2 py-0.5 text-[0.76rem] whitespace-nowrap text-ink">{shown.name}</div>}
    </div>
  )
}
