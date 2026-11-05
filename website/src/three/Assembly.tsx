import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { PartId } from '../data/components'
import { isReducedMotion } from '../engine/store'

/* Everything here is procedural geometry: no model downloads, so it works offline. */

const steel = (c = '#203a5a', r = 0.38, m = 0.88) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m })
const MAT = {
  body: steel('#2a5a93', 0.34, 0.8),
  fin: steel('#234c7c', 0.4, 0.8),
  dark: steel('#14181f', 0.55, 0.8),
  shaft: steel('#c6ced8', 0.2, 1),
  copperGlow: new THREE.MeshStandardMaterial({ color: '#ff7a00', emissive: '#ff6a00', emissiveIntensity: 2.6, roughness: 0.4, metalness: 0.4, toneMapped: false }),
  copper: steel('#c47331', 0.32, 1),
  flange: steel('#3f4b5a', 0.32, 0.95),
  pump: steel('#2c5c94', 0.32, 0.8),
  pipe: steel('#7a8797', 0.28, 0.95),
  base: steel('#2a2f38', 0.62, 0.55),
  race: steel('#d7dde5', 0.16, 1),
  concrete: new THREE.MeshStandardMaterial({ color: '#171b26', roughness: 0.58, metalness: 0.4 }),
  holo: new THREE.LineBasicMaterial({ color: '#35e0f0', transparent: true, opacity: 0.55, toneMapped: false }),
  holoOrange: new THREE.LineBasicMaterial({ color: '#ff9a2e', transparent: true, opacity: 0.5, toneMapped: false }),
  ring: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 0.62, 0.03), toneMapped: false }),
  ringCool: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.1, 1.5, 2.6), toneMapped: false }),
  ringSoft: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.2, 1.4), toneMapped: false, transparent: true, opacity: 0.55 }),
}

const cyl = (rt: number, rb: number, h: number, seg = 48, open = false, ts = 0, tl = Math.PI * 2) => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open, ts, tl)
const X = [0, 0, Math.PI / 2] as [number, number, number]

const CUT_START = -0.35; const CUT_LEN = 1.9 // opened window in the housing (radians; 0 faces +z, PI/2 faces up)
const WIN_X0 = -0.15; const WIN_X1 = 1.38 // the window spans this part of the housing length

/* ---------- interactive parts ---------- */
type PartCtxT = {
  interactive: boolean; selected?: PartId | null; hovered?: PartId | null; onPart?: (id: PartId) => void; onHover?: (id: PartId | null) => void
  explode: number; faultPart?: PartId | null; severity: number
}
const PartCtx = createContext<PartCtxT>({ interactive: false, explode: 0, severity: 0 })

const OFFSETS: Record<PartId, [number, number, number]> = {
  casing: [0, 2.15, 0], stator: [0, 0, 2.3], rotor: [0, 0, 0], shaft: [0, 0, 0], bearings: [0, -0.02, -1.6],
  coupling: [0.25, 1.1, 0.8], fan: [-1.9, 0, 0], base: [0, -0.7, 0], pump: [2, 0.25, 0],
}
const selectedColor = new THREE.Color('#35e4ff'); const hoverColor = new THREE.Color('#ffb13b'); const faultColor = new THREE.Color('#ff2a2a')

function Part({ id, children }: { id: PartId; children: ReactNode }) {
  const ctx = useContext(PartCtx)
  const g = useRef<THREE.Group>(null)
  const mats = useRef<THREE.MeshStandardMaterial[]>([])
  const ctxRef = useRef(ctx); ctxRef.current = ctx
  const wantsOwnMaterials = ctx.interactive || ctx.faultPart !== undefined

  // Parts that can be highlighted get their own material copies, so glow never bleeds into other parts.
  useLayoutEffect(() => {
    if (!wantsOwnMaterials || !g.current) return
    const seen = new Map<THREE.Material, THREE.Material>()
    const list: THREE.MeshStandardMaterial[] = []
    g.current.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh || !(m.material instanceof THREE.MeshStandardMaterial)) return
      if (!seen.has(m.material)) { const c = m.material.clone(); seen.set(m.material, c); list.push(c) }
      m.material = seen.get(m.material)!
    })
    mats.current = list
  }, [wantsOwnMaterials])

  const base = useMemo(() => new THREE.Color(), [])
  useFrame(({ clock }, d) => {
    const c = ctxRef.current
    if (g.current) {
      const o = OFFSETS[id]; const k = 1 - Math.pow(0.002, d)
      g.current.position.x += (o[0] * c.explode - g.current.position.x) * k
      g.current.position.y += (o[1] * c.explode - g.current.position.y) * k
      g.current.position.z += (o[2] * c.explode - g.current.position.z) * k
    }
    if (!mats.current.length) return
    const isFault = c.faultPart === id && c.severity > 0.02
    const pulse = 0.65 + Math.sin(clock.elapsedTime * (2 + c.severity * 6)) * 0.35
    let intensity = 0
    if (isFault) { base.copy(faultColor); intensity = c.severity * 1.6 * pulse }
    if (c.selected === id) { base.copy(selectedColor); intensity = Math.max(intensity, 0.55) } else if (c.hovered === id) { base.copy(hoverColor); intensity = Math.max(intensity, 0.4) }
    for (const m of mats.current) {
      if (m.toneMapped === false) continue // copper windings already glow
      m.emissive.copy(base); m.emissiveIntensity = intensity
    }
  })

  const handlers = ctx.interactive ? {
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); ctx.onPart?.(id) },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); ctx.onHover?.(id); document.body.style.cursor = 'pointer' },
    onPointerOut: () => { ctx.onHover?.(null); document.body.style.cursor = '' },
  } : {}
  return <group ref={g} {...handlers}>{children}</group>
}

/** Rotating group. Kept separate per part so that parts can still explode independently. */
function Spin({ speed, children }: { speed: number; children: ReactNode }) {
  const g = useRef<THREE.Group>(null)
  useFrame((_, d) => { if (g.current && !isReducedMotion()) g.current.rotation.x += d * speed })
  return <group ref={g}>{children}</group>
}

/* ---------- geometry helpers ---------- */
function Fins({ length, radius, x, skipWindow, count = 44 }: { length: number; radius: number; x: number; skipWindow?: boolean; count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const angles = useMemo(() => {
    const out: number[] = []
    for (let i = 0; i < count; i++) {
      const th = (i / count) * Math.PI * 2
      const wrapped = th > Math.PI ? th - Math.PI * 2 : th
      if (skipWindow && wrapped > CUT_START && wrapped < CUT_START + CUT_LEN) continue
      out.push(th)
    }
    return out
  }, [count, skipWindow])
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(); const q = new THREE.Quaternion(); const s = new THREE.Vector3(1, 1, 1); const p = new THREE.Vector3(); const axis = new THREE.Vector3(1, 0, 0)
    angles.forEach((th, i) => {
      p.set(x, Math.sin(th) * radius, Math.cos(th) * radius)
      q.setFromAxisAngle(axis, Math.PI / 2 - th)
      ref.current!.setMatrixAt(i, m.compose(p, q, s))
    })
    ref.current!.instanceMatrix.needsUpdate = true
    ref.current!.computeBoundingSphere()
  }, [angles, radius, x])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, angles.length]} material={MAT.fin}>
      <boxGeometry args={[length, 0.13, 0.042]} />
    </instancedMesh>
  )
}

function Bolts({ r, n, x, size = 0.035 }: { r: number; n: number; x: number; size?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)); const s = new THREE.Vector3(1, 1, 1); const p = new THREE.Vector3()
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; p.set(x, Math.cos(a) * r, Math.sin(a) * r); ref.current!.setMatrixAt(i, m.compose(p, q, s)) }
    ref.current!.instanceMatrix.needsUpdate = true
    ref.current!.computeBoundingSphere()
  }, [r, n, x])
  return <instancedMesh ref={ref} args={[undefined, undefined, n]} material={MAT.shaft}><cylinderGeometry args={[size, size, 0.05, 6]} /></instancedMesh>
}

function Bearing({ x }: { x: number }) {
  const balls = useMemo(() => Array.from({ length: 11 }, (_, i) => (i / 11) * Math.PI * 2), [])
  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[0, Math.PI / 2, 0]} material={MAT.race}><torusGeometry args={[0.33, 0.045, 10, 44]} /></mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} material={MAT.race}><torusGeometry args={[0.19, 0.03, 10, 36]} /></mesh>
      {balls.map((a) => <mesh key={a} position={[0, Math.cos(a) * 0.26, Math.sin(a) * 0.26]} material={MAT.shaft}><sphereGeometry args={[0.05, 12, 12]} /></mesh>)}
    </group>
  )
}

function FanCowl() {
  return (
    <group position={[-2.3, 0, 0]}>
      <mesh rotation={X} geometry={cyl(1.08, 1.08, 0.72, 48, true)}><meshStandardMaterial color="#25497a" roughness={0.42} metalness={0.78} side={THREE.DoubleSide} /></mesh>
      {[0.25, 0.42, 0.6, 0.78, 0.95].map((r) => (
        <mesh key={r} position={[-0.36, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={MAT.dark}><torusGeometry args={[r, 0.016, 6, 40]} /></mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[-0.36, 0, 0]} rotation={[(i / 12) * Math.PI * 2, 0, 0]} material={MAT.dark}><boxGeometry args={[0.022, 2.04, 0.022]} /></mesh>
      ))}
      <mesh rotation={X} position={[-0.37, 0, 0]} geometry={cyl(0.14, 0.14, 0.05, 24)} material={MAT.flange} />
    </group>
  )
}

function Holo() {
  const geo = useMemo(() => {
    const len = WIN_X1 - WIN_X0
    const a = new THREE.WireframeGeometry(new THREE.CylinderGeometry(0.99, 0.99, len, 24, 5, true, CUT_START, CUT_LEN))
    const b = new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.72, 0.72, len, 26, 1, true), 1)
    return { a, b }
  }, [])
  useEffect(() => () => { geo.a.dispose(); geo.b.dispose() }, [geo])
  useFrame(({ clock }) => { MAT.holo.opacity = 0.34 + Math.sin(clock.elapsedTime * 1.6) * 0.12 })
  return (
    <group rotation={X} position={[(WIN_X0 + WIN_X1) / 2, 0, 0]}>
      <lineSegments geometry={geo.a} material={MAT.holo} />
      <lineSegments geometry={geo.b} material={MAT.holoOrange} />
    </group>
  )
}

function Flange({ position, rotation, r = 0.36 }: { position: [number, number, number]; rotation?: [number, number, number]; r?: number }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={cyl(r, r, 0.09, 32)} material={MAT.flange} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return <mesh key={i} position={[Math.cos(a) * r * 0.84, 0.055, Math.sin(a) * r * 0.84]} material={MAT.shaft}><cylinderGeometry args={[0.025, 0.025, 0.03, 6]} /></mesh>
      })}
    </group>
  )
}

function Pump() {
  return (
    <group position={[4.2, 0, 0]}>
      <mesh rotation={[0, Math.PI / 2, 0]} scale={[1, 1, 0.82]} material={MAT.pump}><torusGeometry args={[0.72, 0.36, 18, 48]} /></mesh>
      <mesh rotation={X} geometry={cyl(0.72, 0.72, 0.56, 40)} material={MAT.pump} />
      <mesh rotation={X} position={[-0.48, 0, 0]} geometry={cyl(0.5, 0.82, 0.28, 40)} material={MAT.flange} />
      <Bolts r={0.95} n={14} x={0.34} size={0.03} />
      <mesh position={[0.15, 0.95, 0]} geometry={cyl(0.26, 0.3, 0.9, 32)} material={MAT.pump} />
      <Flange position={[0.15, 1.42, 0]} />
      <mesh position={[0.15, 2.1, 0]} geometry={cyl(0.24, 0.24, 1.3, 32)} material={MAT.pipe} />
      <Flange position={[0.15, 2.78, 0]} />
      <mesh rotation={X} position={[0.68, 0, 0]} geometry={cyl(0.3, 0.26, 0.5, 32)} material={MAT.pump} />
      <Flange position={[0.96, 0, 0]} rotation={X} />
      <mesh rotation={X} position={[2.1, 0, 0]} geometry={cyl(0.26, 0.26, 2.2, 32)} material={MAT.pipe} />
      <Flange position={[3.22, 0, 0]} rotation={X} />
      <mesh position={[0, -0.92, 0]} material={MAT.dark}><boxGeometry args={[0.9, 0.5, 1.0]} /></mesh>
      <mesh position={[2.2, -0.68, 0]} material={MAT.dark}><boxGeometry args={[0.28, 0.9, 0.5]} /></mesh>
    </group>
  )
}

export type AssemblyProps = {
  spin?: number; detail?: boolean; xray?: boolean; onlyMotor?: boolean
  interactive?: boolean; selected?: PartId | null; hovered?: PartId | null; onPart?: (id: PartId) => void; onHover?: (id: PartId | null) => void
  explode?: number; faultPart?: PartId | null; severity?: number; shake?: number
}

/** Motor + coupling + pump on a skid. Origin is the shaft line. */
export function Assembly({ spin = 2.4, detail = true, xray = false, onlyMotor = false, interactive = false, selected, hovered, onPart, onHover, explode = 0, faultPart, severity = 0, shake = 0 }: AssemblyProps) {
  const shell = useMemo(() => { const m = MAT.body.clone(); m.side = THREE.DoubleSide; return m }, [])
  useEffect(() => { shell.transparent = xray; shell.opacity = xray ? 0.16 : 1; shell.depthWrite = !xray; shell.needsUpdate = true }, [xray, shell])
  const root = useRef<THREE.Group>(null)
  // Vibration you can see: amplitude grows with the simulated fault severity.
  useFrame(({ clock }) => {
    if (!root.current || !shake) return
    const t = clock.elapsedTime * 60
    root.current.position.y = Math.sin(t) * 0.018 * shake
    root.current.position.z = Math.sin(t * 1.37) * 0.014 * shake
  })
  const ctx = useMemo(() => ({ interactive, selected, hovered, onPart, onHover, explode, faultPart, severity }), [interactive, selected, hovered, onPart, onHover, explode, faultPart, severity])
  const fins = detail ? 56 : 30
  return (
    <PartCtx.Provider value={ctx}>
      <group ref={root}>
        <Part id="casing">
          <mesh rotation={X} position={[(-1.55 + WIN_X0) / 2, 0, 0]} geometry={cyl(1.02, 1.02, WIN_X0 + 1.55, 64, true)} material={shell} />
          <mesh rotation={X} position={[(WIN_X0 + WIN_X1) / 2, 0, 0]} geometry={cyl(1.02, 1.02, WIN_X1 - WIN_X0, 64, true, CUT_START + CUT_LEN, Math.PI * 2 - CUT_LEN)} material={shell} />
          <group visible={!xray}>
            <Fins length={WIN_X0 + 1.55} x={(-1.55 + WIN_X0) / 2} radius={1.08} count={fins} />
            <Fins length={WIN_X1 - WIN_X0} x={(WIN_X0 + WIN_X1) / 2} radius={1.08} count={fins} skipWindow />
          </group>
          {detail && [WIN_X0, WIN_X1].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={MAT.ring}><torusGeometry args={[1.03, 0.012, 6, 72]} /></mesh>
          ))}
          {detail && <Holo />}
          <mesh rotation={X} position={[1.55, 0, 0]} geometry={cyl(0.6, 1.14, 0.3, 48)} material={MAT.body} />
          <mesh rotation={X} position={[-1.68, 0, 0]} geometry={cyl(1.14, 1.14, 0.3, 48)} material={MAT.body} />
          <Bolts r={1.0} n={12} x={-1.52} />
          <mesh rotation={X} position={[1.82, 0, 0]} geometry={cyl(0.28, 0.5, 0.26, 32)} material={MAT.flange} />
          <group position={[-0.9, 1.24, 0]}>
            <mesh material={MAT.body}><boxGeometry args={[1.0, 0.42, 0.9]} /></mesh>
            <mesh position={[0, 0.25, 0]} material={MAT.flange}><boxGeometry args={[1.06, 0.07, 0.96]} /></mesh>
          </group>
          <mesh position={[0.6, 1.3, 0]} material={MAT.shaft}><torusGeometry args={[0.1, 0.03, 8, 20]} /></mesh>
        </Part>

        <Part id="stator">
          <mesh rotation={X} position={[-0.05, 0, 0]} geometry={cyl(0.8, 0.8, 2.6, 48, true)}>
            <meshStandardMaterial color="#39434f" roughness={0.45} metalness={0.8} side={THREE.DoubleSide} />
          </mesh>
          {Array.from({ length: detail ? 9 : 4 }, (_, i) => (
            <mesh key={i} position={[-1.2 + i * (2.5 / ((detail ? 9 : 4) - 1)), 0, 0]} rotation={[0, Math.PI / 2, 0]} material={MAT.copperGlow}>
              <torusGeometry args={[0.76, 0.022, 8, 56]} />
            </mesh>
          ))}
        </Part>

        <Part id="rotor">
          <Spin speed={spin}>
            <mesh rotation={X} position={[-0.1, 0, 0]} geometry={cyl(0.55, 0.55, 2.3, 40)} material={MAT.dark} />
            {detail && Array.from({ length: 18 }, (_, i) => (i / 18) * Math.PI * 2).map((a) => (
              <mesh key={a} position={[-0.1, Math.cos(a) * 0.56, Math.sin(a) * 0.56]} rotation={[a, 0, 0]} material={MAT.copper}><boxGeometry args={[2.24, 0.035, 0.055]} /></mesh>
            ))}
            {[-1.15, -0.55, 0.05, 0.65].map((x) => (
              <mesh key={x} position={[x + 0.25, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={MAT.copper}><torusGeometry args={[0.575, 0.018, 8, 40]} /></mesh>
            ))}
          </Spin>
        </Part>

        <Part id="shaft">
          <Spin speed={spin}>
            <mesh rotation={X} position={[0.45, 0, 0]} geometry={cyl(0.13, 0.13, 6, 24)} material={MAT.shaft} />
          </Spin>
        </Part>

        <Part id="bearings"><Bearing x={1.42} /><Bearing x={-1.5} /></Part>

        <Part id="coupling">
          <Spin speed={spin}>
            <mesh rotation={X} position={[2.75, 0, 0]} geometry={cyl(0.4, 0.4, 0.26, 32)} material={MAT.flange} />
            <mesh rotation={X} position={[3.08, 0, 0]} geometry={cyl(0.4, 0.4, 0.26, 32)} material={MAT.pump} />
            <Bolts r={0.31} n={8} x={2.615} />
            <Bolts r={0.31} n={8} x={3.215} />
          </Spin>
        </Part>

        <Part id="fan">
          <Spin speed={spin}>
            <group position={[-2.2, 0, 0]}>
              {Array.from({ length: 9 }, (_, i) => (
                <mesh key={i} rotation={[(i / 9) * Math.PI * 2, 0, 0.5]} material={MAT.flange}><boxGeometry args={[0.03, 1.5, 0.22]} /></mesh>
              ))}
            </group>
          </Spin>
          <FanCowl />
        </Part>

        {!onlyMotor && <Part id="pump"><Pump /></Part>}

        <Part id="base">
          {[-1.2, 1.1].map((x) => [-0.74, 0.74].map((z) => (
            <mesh key={`${x}${z}`} position={[x, -1.14, z]} material={MAT.dark}><boxGeometry args={[0.7, 0.34, 0.42]} /></mesh>
          )))}
          <mesh position={[onlyMotor ? 0.3 : 2.1, -1.36, 0]} material={MAT.base}><boxGeometry args={[onlyMotor ? 6.8 : 10.4, 0.16, 2.3]} /></mesh>
        </Part>
      </group>
    </PartCtx.Provider>
  )
}

/** Glowing plinth and floor rings. */
export function Plinth({ radius = 7, y = -1.45, x = 2.2 }: { radius?: number; y?: number; x?: number }) {
  const r1 = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => { if (r1.current) r1.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.1) * 0.012) })
  return (
    <group position={[x, y, 0]}>
      <mesh position={[0, -0.2, 0]} material={MAT.concrete}><cylinderGeometry args={[radius - 1.1, radius - 0.85, 0.42, 72]} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={MAT.ring}><torusGeometry args={[radius - 1.1, 0.022, 8, 128]} /></mesh>
      <mesh ref={r1} position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]} material={MAT.ringCool}><torusGeometry args={[radius - 0.55, 0.03, 8, 128]} /></mesh>
      <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]} material={MAT.ringSoft}><torusGeometry args={[radius + 0.3, 0.014, 8, 128]} /></mesh>
    </group>
  )
}

/** Clickable glowing sensor point. */
export function SensorPoint({ position, active, onSelect, onHover, color = 'orange' }: {
  position: [number, number, number]; active?: boolean; onSelect?: () => void; onHover?: (on: boolean) => void; color?: 'orange' | 'red'
}) {
  const halo = useRef<THREE.Mesh>(null)
  const core = useMemo(() => new THREE.MeshBasicMaterial({ color: color === 'red' ? new THREE.Color(3.2, 0.25, 0.2) : new THREE.Color(3, 0.8, 0.08), toneMapped: false }), [color])
  const haloM = useMemo(() => new THREE.MeshBasicMaterial({ color: color === 'red' ? new THREE.Color(2.2, 0.15, 0.12) : new THREE.Color(2, 0.52, 0.05), transparent: true, opacity: 0.45, toneMapped: false, depthWrite: false }), [color])
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.9 + position[0]) % 1
    if (halo.current) { halo.current.scale.setScalar(1 + Math.abs(t) * (active ? 2.6 : 1.8)); haloM.opacity = (1 - Math.abs(t)) * (active ? 0.8 : 0.5) }
  })
  const interactive = !!onSelect
  return (
    <group position={position}>
      <mesh material={core}><sphereGeometry args={[active ? 0.11 : 0.085, 18, 18]} /></mesh>
      <mesh ref={halo} material={haloM} raycast={() => null}><sphereGeometry args={[0.13, 14, 14]} /></mesh>
      {/* a larger invisible target, easier to hit on a projector; material stays in the scene for raycasting */}
      {interactive && (
        <mesh onClick={(e) => { e.stopPropagation(); onSelect?.() }}
          onPointerOver={(e) => { e.stopPropagation(); onHover?.(true); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { onHover?.(false); document.body.style.cursor = '' }}>
          <sphereGeometry args={[0.24, 10, 10]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}

/* Data particles flowing away from the machine along curved paths. */
export function DataStreams({ paths, count = 5, size = 0.05 }: { paths: { from: [number, number, number]; to: [number, number, number]; color: string }[]; count?: number; size?: number }) {
  const curves = useMemo(() => paths.map((p) => {
    const a = new THREE.Vector3(...p.from); const b = new THREE.Vector3(...p.to)
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 1.1, 0.4))
    return { curve: new THREE.QuadraticBezierCurve3(a, mid, b), mat: new THREE.MeshBasicMaterial({ color: new THREE.Color(p.color).multiplyScalar(2.4), toneMapped: false }) }
  }), [paths])
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => {
      if (!m) return
      const c = Math.floor(i / count); const k = i % count
      curves[c].curve.getPoint((clock.elapsedTime * 0.22 + k / count + c * 0.13) % 1, tmp)
      m.position.copy(tmp)
    })
  })
  return (
    <group>
      {curves.flatMap((c, ci) => Array.from({ length: count }, (_, k) => (
        <mesh key={`${ci}-${k}`} ref={(el) => { refs.current[ci * count + k] = el }} material={c.mat} raycast={() => null}><sphereGeometry args={[size, 8, 8]} /></mesh>
      )))}
    </group>
  )
}
