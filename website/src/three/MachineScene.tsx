import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useRef, useState } from 'react'
import { Assembly, Plinth, SensorPoint, DataStreams, type AssemblyProps } from './Assembly'
import { detectTier } from './Stage'
import { StudioLights } from './Lights'
import { ScreenAnchor } from './ScreenAnchor'
import { PARTS, type PartId } from '../data/components'
import { SENSORS } from '../data/sensors'

/** Orbitable machine used by the anatomy lab, sensor dashboard, simulator and finale. */
export default function MachineScene({ assembly, showSensors, onSensor, activeSensor, cameraZ = 13, autoRotate, labels, particles, alerts }: {
  assembly: AssemblyProps; showSensors?: boolean; onSensor?: (id: string) => void; activeSensor?: string | null
  cameraZ?: number; autoRotate?: boolean; labels?: boolean; particles?: boolean; alerts?: PartId[]
}) {
  const high = detectTier() === 'high'
  const [hover, setHover] = useState<PartId | null>(null)
  const label = useRef<HTMLDivElement>(null)
  const shownId = hover ?? assembly.selected ?? null
  const info = labels ? PARTS.find((p) => p.id === shownId) : undefined
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas dpr={high ? [1, 1.6] : 1} camera={{ position: [2.6, 3.4, cameraZ], fov: 34 }} style={{ background: 'transparent' }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <StudioLights low={!high} />
        <group position={[-1.9, -0.05, 0]}>
          <Assembly detail={high} {...assembly} hovered={hover} onHover={setHover} />
          <Plinth radius={7.2} />
          {high && <ContactShadows position={[2.2, -1.44, 0]} scale={15} opacity={0.65} blur={2.2} far={3} resolution={512} frames={1} />}
          {showSensors && SENSORS.map((s) => <SensorPoint key={s.id} position={s.position} active={activeSensor === s.id} onSelect={onSensor ? () => onSensor(s.id) : undefined} />)}
          {alerts?.map((id) => <SensorPoint key={id} position={PARTS.find((p) => p.id === id)!.anchor} active color="red" />)}
          {info && <ScreenAnchor position={[info.anchor[0], info.anchor[1] + 0.4, info.anchor[2]]} target={label} />}
          {particles && <DataStreams paths={[
            { from: [1.5, 1.14, 0.35], to: [-3, 4.2, -2], color: '#35e4ff' },
            { from: [-0.2, 1.17, 0.5], to: [2, 4.6, -2.5], color: '#ff8a00' },
            { from: [4.55, 1.5, 0.28], to: [7, 4.2, -2], color: '#c58bff' },
          ]} />}
        </group>
        {high && <Sparkles count={40} scale={[16, 7, 6]} size={2} speed={0.2} color="#7fd4ff" opacity={0.45} position={[0, 2, 0]} />}
        <OrbitControls enablePan={false} minDistance={5} maxDistance={20} minPolarAngle={0.35} maxPolarAngle={1.62} target={[0.4, 0.3, 0]} autoRotate={autoRotate} autoRotateSpeed={0.55} enableDamping />
        {high && <EffectComposer multisampling={0}><Bloom intensity={0.7} luminanceThreshold={0.85} mipmapBlur /></EffectComposer>}
      </Canvas>
      {info && <div ref={label} className="pointer-events-none absolute top-0 left-0 rounded-md border border-line bg-black/85 px-2 py-0.5 text-[0.78rem] whitespace-nowrap text-ink">{info.name}</div>}
    </div>
  )
}
