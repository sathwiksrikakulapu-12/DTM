import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial, OrbitControls, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Assembly, Plinth, SensorPoint } from './Assembly'
import { detectTier } from './Stage'
import { StudioLights } from './Lights'
import { ScreenAnchor } from './ScreenAnchor'
import { SENSORS } from '../data/sensors'

const M = {
  column: new THREE.MeshStandardMaterial({ color: '#2b3038', roughness: 0.6, metalness: 0.65 }),
  wall: new THREE.MeshStandardMaterial({ color: '#0d1014', roughness: 0.95, metalness: 0.1 }),
  beam: new THREE.MeshStandardMaterial({ color: '#272c33', roughness: 0.6, metalness: 0.7 }),
  pipe: new THREE.MeshStandardMaterial({ color: '#59636f', roughness: 0.3, metalness: 0.95 }),
  pipeHot: new THREE.MeshStandardMaterial({ color: '#b86a22', roughness: 0.35, metalness: 0.9 }),
  tank: new THREE.MeshStandardMaterial({ color: '#39424d', roughness: 0.35, metalness: 0.9 }),
  cabinet: new THREE.MeshStandardMaterial({ color: '#20262e', roughness: 0.55, metalness: 0.7 }),
  robot: new THREE.MeshStandardMaterial({ color: '#e77b08', roughness: 0.4, metalness: 0.55 }),
  robotDark: new THREE.MeshStandardMaterial({ color: '#23272e', roughness: 0.5, metalness: 0.8 }),
  lamp: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 2.1, 1.7), toneMapped: false }),
  lampO: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 0.62, 0.03), toneMapped: false }),
  pulse: new THREE.MeshBasicMaterial({ color: new THREE.Color(3.4, 0.9, 0.08), toneMapped: false }),
  belt: new THREE.MeshStandardMaterial({ color: '#15181d', roughness: 0.85, metalness: 0.3 }),
}

function Columns() {
  const xs = [-20, -10, 0, 10, 20]
  return (
    <group>
      {xs.flatMap((x) => [-13].map((z) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <mesh position={[0, 6, 0]} material={M.column}><boxGeometry args={[0.7, 15, 0.7]} /></mesh>
          <mesh position={[0, 1.5, 0]} material={M.lampO}><boxGeometry args={[0.72, 0.05, 0.72]} /></mesh>
        </group>
      )))}
      {/* roof trusses and light strips */}
      {xs.map((x) => (
        <group key={x} position={[x, 12, 0]}>
          <mesh material={M.beam}><boxGeometry args={[0.5, 0.6, 30]} /></mesh>
        </group>
      ))}
      {[-8, 0, 8].map((z) => (
        <mesh key={z} position={[0, 11.4, z]} material={M.lamp}><boxGeometry args={[42, 0.06, 0.28]} /></mesh>
      ))}
      <mesh position={[0, 6, -14]} material={M.wall}><boxGeometry args={[60, 20, 0.4]} /></mesh>
      {[2.6, 6.8].map((y) => <mesh key={y} position={[0, y, -13.7]} material={M.lampO}><boxGeometry args={[54, 0.035, 0.03]} /></mesh>)}
      <mesh position={[-27, 6, 0]} material={M.wall}><boxGeometry args={[0.4, 20, 40]} /></mesh>
      <mesh position={[27, 6, 0]} material={M.wall}><boxGeometry args={[0.4, 20, 40]} /></mesh>
    </group>
  )
}

/** Pipe rack with travelling data pulses along each run. */
function PipeRun({ points, radius = 0.17, hot, pulses = 3, speed = 0.09 }: { points: [number, number, number][]; radius?: number; hot?: boolean; pulses?: number; speed?: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.08), [points])
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 90, radius, 12, false), [curve, radius])
  const refs = useRef<(THREE.Mesh | null)[]>([])
  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => { if (m) m.position.copy(curve.getPointAt((clock.elapsedTime * speed + i / pulses) % 1)) })
  })
  return (
    <group>
      <mesh geometry={geo} material={hot ? M.pipeHot : M.pipe} />
      {Array.from({ length: pulses }, (_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el }} material={M.pulse}><sphereGeometry args={[radius * 1.25, 10, 10]} /></mesh>
      ))}
    </group>
  )
}

function Tank({ position, r = 1.5, h = 6 }: { position: [number, number, number]; r?: number; h?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} material={M.tank}><cylinderGeometry args={[r, r, h, 32]} /></mesh>
      <mesh position={[0, h, 0]} material={M.tank}><sphereGeometry args={[r, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      {[0.2, 0.55, 0.85].map((f) => <mesh key={f} position={[0, h * f, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.beam}><torusGeometry args={[r + 0.02, 0.05, 8, 40]} /></mesh>)}
    </group>
  )
}

/** Control panel whose screens are drawn on canvas textures: real geometry, not images. */
function usePanelTexture(variant: number) {
  return useMemo(() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 288
    const g = c.getContext('2d')!
    g.fillStyle = '#081016'; g.fillRect(0, 0, 512, 288)
    g.strokeStyle = 'rgba(255,255,255,.08)'
    for (let x = 0; x < 512; x += 42) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 288); g.stroke() }
    for (let y = 0; y < 288; y += 36) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke() }
    const line = (col: string, a: number, f: number, base: number, grow = 0) => {
      g.strokeStyle = col; g.lineWidth = 3; g.beginPath()
      for (let x = 0; x <= 512; x += 4) {
        const y = base + Math.sin(x * f + variant) * a + Math.sin(x * f * 3.1) * a * 0.3 - grow * Math.pow(x / 512, 3)
        if (x === 0) g.moveTo(x, y); else g.lineTo(x, y)
      }
      g.stroke()
    }
    line('#35e0f0', 12, 0.05, 90)
    line('#ff9a2e', 7, 0.11, 200, variant % 2 ? 90 : 30)
    g.fillStyle = '#ff9a2e'; g.fillRect(16, 14, 120, 14); g.fillStyle = '#35e0f0'; g.fillRect(150, 14, 60, 14)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [variant])
}
function ControlPanel({ position, rotation, variant = 0 }: { position: [number, number, number]; rotation?: [number, number, number]; variant?: number }) {
  const tex = usePanelTexture(variant)
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.4, 0]} material={M.cabinet}><boxGeometry args={[3.2, 2.8, 0.7]} /></mesh>
      <mesh position={[0, 1.8, 0.36]}><planeGeometry args={[2.7, 1.5]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      {[-1, -0.6, -0.2].map((x, i) => <mesh key={x} position={[x, 0.65, 0.37]} material={i === 2 ? M.lampO : M.lamp}><circleGeometry args={[0.08, 12]} /></mesh>)}
    </group>
  )
}

function RobotArm({ position }: { position: [number, number, number] }) {
  const a = useRef<THREE.Group>(null); const b = useRef<THREE.Group>(null); const c = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (a.current) a.current.rotation.y = Math.sin(t * 0.4) * 0.8 + 0.3
    if (b.current) b.current.rotation.z = -0.55 + Math.sin(t * 0.6) * 0.25
    if (c.current) c.current.rotation.z = 1.2 + Math.sin(t * 0.8 + 1) * 0.3
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} material={M.robotDark}><cylinderGeometry args={[0.75, 0.9, 0.5, 24]} /></mesh>
      <group ref={a} position={[0, 0.5, 0]}>
        <mesh position={[0, 0.3, 0]} material={M.robot}><cylinderGeometry args={[0.5, 0.6, 0.6, 20]} /></mesh>
        <group ref={b} position={[0, 0.6, 0]}>
          <mesh position={[0, 1.2, 0]} material={M.robot}><boxGeometry args={[0.42, 2.4, 0.42]} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={M.robotDark}><cylinderGeometry args={[0.32, 0.32, 0.65, 20]} /></mesh>
          <group ref={c} position={[0, 2.4, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={M.robotDark}><cylinderGeometry args={[0.28, 0.28, 0.55, 20]} /></mesh>
            <mesh position={[0, 0.95, 0]} material={M.robot}><boxGeometry args={[0.32, 1.9, 0.32]} /></mesh>
            <mesh position={[0, 2.0, 0]} material={M.robotDark}><boxGeometry args={[0.5, 0.2, 0.2]} /></mesh>
            <mesh position={[0, 2.15, 0]} material={M.lampO}><sphereGeometry args={[0.07, 10, 10]} /></mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

function Conveyor({ position, length = 15 }: { position: [number, number, number]; length?: number }) {
  const boxes = useRef<THREE.Group>(null)
  useFrame((_, d) => {
    boxes.current?.children.forEach((c) => { c.position.x += d * 0.9; if (c.position.x > length / 2) c.position.x -= length })
  })
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} material={M.belt}><boxGeometry args={[length, 0.14, 1.5]} /></mesh>
      {[-1, 1].map((z) => <mesh key={z} position={[0, 1.04, z * 0.82]} material={M.beam}><boxGeometry args={[length, 0.24, 0.1]} /></mesh>)}
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-length / 2 + (i + 0.5) * (length / 7), 0.45, 0]} material={M.column}><boxGeometry args={[0.2, 1, 1.5]} /></mesh>)}
      <group ref={boxes}>
        {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-length / 2 + i * (length / 5), 1.36, 0]} material={M.cabinet}><boxGeometry args={[0.8, 0.6, 0.8]} /></mesh>)}
      </group>
    </group>
  )
}

/** Moves camera and orbit target together; stops as soon as the view is reached so the user can orbit. */
function CameraRig({ view, controls }: { view: { pos: THREE.Vector3; target: THREE.Vector3; key: number } | null; controls: React.RefObject<any> }) {
  const { camera } = useThree()
  const done = useRef(-1)
  useFrame(() => {
    if (!view || done.current === view.key || !controls.current) return
    camera.position.lerp(view.pos, 0.055)
    controls.current.target.lerp(view.target, 0.055)
    if (camera.position.distanceTo(view.pos) < 0.05) done.current = view.key
  })
  return null
}

export type FactoryView = { id: string; label: string; pos: [number, number, number]; target: [number, number, number] }
export const FACTORY_VIEWS: FactoryView[] = [
  { id: 'overview', label: 'Factory overview', pos: [9, 7, 19], target: [2, 2.6, -1] },
  { id: 'motor', label: 'Motor', pos: [-1.5, 3.2, 8.2], target: [-0.6, 1.8, 0] },
  { id: 'pump', label: 'Pump', pos: [8.5, 3.2, 7], target: [4.8, 2, 0] },
  { id: 'pipes', label: 'Pipelines', pos: [17, 7, 3], target: [12, 5, -8] },
  { id: 'panel', label: 'Control panels', pos: [-9, 3.6, 7], target: [-13, 2, -6] },
  { id: 'robot', label: 'Robot and conveyor', pos: [-4, 5, 18], target: [-13, 2.2, 8] },
]

export default function FactoryScene({ view, sensor, onSensor, xray, spin }: {
  view: { id: string; key: number } ; sensor: string | null; onSensor: (id: string) => void; xray: boolean; spin: number
}) {
  const high = detectTier() === 'high'
  const controls = useRef<any>(null)
  const [hover, setHover] = useState<string | null>(null)
  const label = useRef<HTMLDivElement>(null)
  const shown = SENSORS.find((s) => s.id === (hover ?? sensor))

  const camTarget = useMemo(() => {
    if (sensor) {
      const s = SENSORS.find((x) => x.id === sensor)!
      const world = new THREE.Vector3(s.position[0], s.position[1] + 1.65, s.position[2])
      return { pos: world.clone().add(new THREE.Vector3(1.0, 1.6, 5.8)), target: world, key: view.key + 1000 + SENSORS.indexOf(s) }
    }
    const v = FACTORY_VIEWS.find((x) => x.id === view.id)!
    return { pos: new THREE.Vector3(...v.pos), target: new THREE.Vector3(...v.target), key: view.key }
  }, [sensor, view])

  return (
    <div className="relative h-full w-full overflow-hidden">
    <Canvas dpr={high ? [1, 1.5] : 1} camera={{ position: [24, 14, 42], fov: 42, far: 200 }} style={{ background: '#07090c' }}>
      <fog attach="fog" args={['#07090c', 28, 70]} />
      <StudioLights low={!high} />
      <pointLight position={[0, 9, 0]} intensity={40} color="#ffd9b0" distance={30} />
      <pointLight position={[-14, 7, 8]} intensity={7} color="#ff8a00" distance={18} />
      <Columns />
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 60]} />
        {high
          ? <MeshReflectorMaterial resolution={512} blur={[400, 120]} mixBlur={1} mixStrength={1.6} roughness={0.75} depthScale={0.8} color="#0e1116" metalness={0.5} mirror={0.6} />
          : <meshStandardMaterial color="#0a0c0f" roughness={0.9} metalness={0.05} />}
      </mesh>
      <gridHelper args={[80, 40, '#2a1f10', '#13161a']} position={[0, 0.012, 0]} />

      {/* hero machine with interactive sensors */}
      <group position={[0, 1.65, 0]}>
        <Assembly xray={xray} spin={spin} detail={high} />
        <Plinth radius={6.8} y={-1.45} />
        {SENSORS.map((s) => (
          <SensorPoint key={s.id} position={s.position} active={sensor === s.id} onSelect={() => onSensor(s.id)} onHover={(on) => setHover(on ? s.id : null)} />
        ))}
        {shown && <ScreenAnchor position={[shown.position[0], shown.position[1] + 0.42, shown.position[2]]} target={label} />}
      </group>

      {/* background motors and pumps */}
      {[[-18, -6], [-4, -11], [17, -7.5], [18, 6]].map(([x, z], i) => (
        <group key={i} position={[x, 1.55, z]} rotation={[0, i === 3 ? Math.PI : 0, 0]} scale={0.72}>
          <Assembly detail={false} spin={1.6 + i * 0.3} />
        </group>
      ))}

      {/* pipelines */}
      <PipeRun points={[[4.35, 4.5, 0], [4.35, 7.4, 0], [4.35, 8.2, -3], [8, 8.2, -7], [20, 8.2, -7], [25, 8.2, -7]]} hot pulses={4} />
      <PipeRun points={[[-25, 9, -9.5], [-6, 9, -9.5], [8, 9, -9.5], [25, 9, -9.5]]} radius={0.24} pulses={4} speed={0.05} />
      <PipeRun points={[[-25, 7.8, -10.3], [-3, 7.8, -10.3], [12, 7.8, -10.3], [25, 7.8, -10.3]]} radius={0.17} hot pulses={3} speed={0.07} />
      <PipeRun points={[[9, 1.65, 0], [13, 1.65, 0], [14.5, 1.65, -3], [15, 4, -8], [15, 8, -10]]} radius={0.2} pulses={3} />
      {/* data cables: machine to control panels */}
      <PipeRun points={[[-1.5, 3.4, -0.6], [-2.5, 5.5, -4], [-8, 5.2, -7], [-13, 3.4, -7]]} radius={0.04} pulses={5} speed={0.16} />
      <Tank position={[21, 0, -9]} /><Tank position={[12, 0, -11]} r={1.8} h={7} /><Tank position={[-23, 0, -9]} r={1.3} h={5} />

      {/* control panels */}
      <ControlPanel position={[-13, 0, -7]} rotation={[0, 0.35, 0]} variant={1} />
      <ControlPanel position={[-9.3, 0, -8.2]} rotation={[0, 0.15, 0]} variant={2} />
      <ControlPanel position={[-5.6, 0, -8.8]} variant={3} />

      <RobotArm position={[-13, 0, 6]} />
      <Conveyor position={[-13, 0, 10]} />
      {high && <Sparkles count={120} scale={[44, 12, 30]} position={[0, 5, 0]} size={2} speed={0.18} color="#ffb13b" opacity={0.4} />}

      <OrbitControls ref={controls} makeDefault enablePan={false} minDistance={4} maxDistance={46} maxPolarAngle={1.52} enableDamping dampingFactor={0.08} />
      <CameraRig view={camTarget} controls={controls} />
      {high && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.7} luminanceThreshold={0.85} mipmapBlur />
          <Vignette offset={0.25} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
    {shown && <div ref={label} className="pointer-events-none absolute top-0 left-0 rounded-md border border-line bg-black/80 px-2 py-0.5 text-[0.8rem] whitespace-nowrap text-ink">{shown.name}</div>}
    </div>
  )
}
