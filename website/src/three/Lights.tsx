import { Environment, Lightformer } from '@react-three/drei'

/** Local studio reflections: built from light cards, so no HDRI download is needed. */
export function StudioLights({ low }: { low?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} color="#a9b6d6" />
      <directionalLight position={[6, 9, 6]} intensity={2} color="#ffe2bd" />
      <directionalLight position={[1, 3, 12]} intensity={1.5} color="#dfe9f5" />
      <directionalLight position={[-7, 4, -4]} intensity={1.5} color="#ff8a2a" />
      <pointLight position={[-1, -0.4, 3.4]} intensity={9} color="#ff8a00" distance={7} />
      <pointLight position={[4.5, 3, 3]} intensity={12} color="#38bdf8" distance={10} />
      <pointLight position={[-5, 3, -3]} intensity={16} color="#a855f7" distance={12} />
      <Environment resolution={low ? 64 : 192} frames={1}>
        <Lightformer form="rect" intensity={5} color="#ffffff" position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 4, 1]} />
        <Lightformer form="rect" intensity={7} color="#ff9a3a" position={[-8, 1.5, 2]} rotation={[0, Math.PI / 2, 0]} scale={[7, 2.2, 1]} />
        <Lightformer form="rect" intensity={4.5} color="#4fb6ff" position={[8, 2, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={3} color="#b67bff" position={[0, 2, -9]} rotation={[0, Math.PI, 0]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffd9b0" position={[0, 1, 9]} scale={[14, 1.2, 1]} />
        <Lightformer form="ring" intensity={4} color="#ff7a00" position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={7} />
      </Environment>
    </>
  )
}
