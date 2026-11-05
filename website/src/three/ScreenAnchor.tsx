import { useFrame, useThree } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import * as THREE from 'three'

const v = new THREE.Vector3()

/**
 * Pins a DOM element (rendered outside the Canvas) to a point in the 3D scene.
 * Keeps labels in the normal React tree, so scenes can unmount safely mid-transition.
 */
export function ScreenAnchor({ position, target }: { position: [number, number, number]; target: RefObject<HTMLElement | null> }) {
  const g = useRef<THREE.Group>(null)
  const { camera, size } = useThree()
  useFrame(() => {
    if (!g.current || !target.current) return
    g.current.getWorldPosition(v).project(camera)
    const x = (v.x * 0.5 + 0.5) * size.width
    const y = (-v.y * 0.5 + 0.5) * size.height
    target.current.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`
    target.current.style.opacity = v.z < 1 ? '1' : '0'
  })
  return <group ref={g} position={position} />
}
