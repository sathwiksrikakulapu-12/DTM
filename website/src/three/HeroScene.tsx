import { Canvas, useFrame } from '@react-three/fiber'
import { Line, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Activity, Thermometer, Zap } from 'lucide-react'
import { Assembly, Plinth, SensorPoint } from './Assembly'
import { detectTier } from './Stage'
import { StudioLights } from './Lights'
import { ScreenAnchor } from './ScreenAnchor'
import { navigate } from '../engine/store'

type V3 = [number, number, number]

function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ pointer, clock }) => {
    if (!g.current) return
    const targetY = -0.42 + pointer.x * 0.12 + Math.sin(clock.elapsedTime * 0.25) * 0.05
    const targetX = 0.03 - pointer.y * 0.04
    g.current.rotation.y += (targetY - g.current.rotation.y) * 0.04
    g.current.rotation.x += (targetX - g.current.rotation.x) * 0.04
  })
  return <group ref={g}>{children}</group>
}

const READOUTS: { id: string; icon: any; label: string; unit: string; base: number; jitter: number; anchor: V3; position: V3 }[] = [
  { id: 'v', icon: Activity, label: 'Vibration', unit: 'mm/s', base: 2.8, jitter: 0.25, anchor: [1.5, 1.14, 0.35], position: [-1.4, 3.35, 0.3] },
  { id: 't', icon: Thermometer, label: 'Temperature', unit: '°C', base: 78, jitter: 0.8, anchor: [-0.2, 1.17, 0.5], position: [2.4, 4.05, 0.2] },
  { id: 'c', icon: Zap, label: 'Current', unit: 'A', base: 24.6, jitter: 0.5, anchor: [-1.05, 1.74, 0], position: [0.6, -2.35, 3] },
]

function Readout({ icon: I, label, unit, base, jitter, innerRef }: { icon: any; label: string; unit: string; base: number; jitter: number; innerRef: React.RefObject<HTMLDivElement | null> }) {
  const [v, setV] = useState<number>(base)
  useEffect(() => {
    const t = setInterval(() => setV(base + (Math.random() - 0.5) * jitter), 1400)
    return () => clearInterval(t)
  }, [base, jitter])
  return (
    <div ref={innerRef} className="glass-o pointer-events-none absolute top-0 left-0 w-[8.4rem] rounded-xl px-2.5 py-1.5 shadow-[0_0_1.2rem_rgba(255,138,0,.2)] will-change-transform" style={{ opacity: 0 }}>
      <div className="flex items-center gap-2">
        <I className="h-[1.2rem] w-[1.2rem] shrink-0 text-orange" strokeWidth={1.8} />
        <div className="min-w-0">
          <div className="text-[0.72rem] leading-tight text-mute">{label}</div>
          <div className="num font-display text-[1rem] leading-tight font-semibold whitespace-nowrap">{v.toFixed(1)} {unit}</div>
        </div>
      </div>
      <div className="mt-0.5 text-[0.62rem] leading-none text-dim">Illustrative</div>
    </div>
  )
}

export default function HeroScene() {
  const high = detectTier() === 'high'
  const r0 = useRef<HTMLDivElement>(null); const r1 = useRef<HTMLDivElement>(null); const r2 = useRef<HTMLDivElement>(null)
  const refs = [r0, r1, r2]
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas dpr={high ? [1, 1.7] : 1} gl={{ antialias: true, powerPreference: 'high-performance' }} camera={{ position: [1.2, 3.1, 13.8], fov: 34 }} style={{ background: 'transparent' }}
        onCreated={({ camera }) => camera.lookAt(0.75, 0.5, 0)}>
        <StudioLights low={!high} />
        <Rig>
          <group position={[-1.7, 0, 0]}>
            <Assembly detail={high} />
            <Plinth radius={6.6} />
            {([[1.5, 1.14, 0.35], [-0.2, 1.17, 0.5], [-1.05, 1.74, 0], [4.12, 0.42, 0.78]] as V3[]).map((p) => (
              <SensorPoint key={p.join()} position={p} onSelect={() => navigate('/factory')} />
            ))}
            {READOUTS.map((r, i) => (
              <group key={r.id}>
                <Line points={[r.anchor, r.position]} color="#ffb13b" lineWidth={1} transparent opacity={0.75} />
                <ScreenAnchor position={r.position} target={refs[i]} />
              </group>
            ))}
          </group>
          {high && <Sparkles count={45} scale={[15, 7, 5]} size={2.2} speed={0.22} color="#ffb13b" opacity={0.5} position={[0, 2, 0]} />}
        </Rig>
        {high && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.75} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
            <Vignette eskil={false} offset={0.28} darkness={0.55} />
          </EffectComposer>
        )}
      </Canvas>
      {READOUTS.map((r, i) => <Readout key={r.id} icon={r.icon} label={r.label} unit={r.unit} base={r.base} jitter={r.jitter} innerRef={refs[i]} />)}
    </div>
  )
}
