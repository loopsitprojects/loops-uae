/**
 * Lightweight WebGL 3D trophy — base, stem, and a flared cup, built from
 * simple primitives (predictable proportions, unlike a hand-tuned lathe
 * curve) in gold/silver/bronze metallic material, gently auto-rotating.
 * Used on award cards for a genuine dimensional "3D award" look.
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const TIER_COLORS: Record<string, number> = {
  gold: 0xe8b84b,
  silver: 0xc7ccd6,
  bronze: 0xcd7f32,
}

interface Props {
  size?: number
  tier?: string
}

export default function TrophyWebGL({ size = 90, tier = 'gold' }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.set(0, 0.35, 4.4)
    camera.lookAt(0, 0.35, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const key = new THREE.DirectionalLight(0xffffff, 4.5)
    key.position.set(2, 4, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 1.5)
    fill.position.set(-3, 1, 3)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffffff, 2.5)
    rim.position.set(0, -3, -4)
    scene.add(rim)

    const color = TIER_COLORS[tier?.toLowerCase()] ?? TIER_COLORS.gold
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
    })

    const geometries: THREE.BufferGeometry[] = []
    const addMesh = (geo: THREE.BufferGeometry, y: number) => {
      geometries.push(geo)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.y = y
      group.add(mesh)
    }

    const group = new THREE.Group()
    group.rotation.x = 0.15

    // Base (two stacked discs for a bit of detail)
    addMesh(new THREE.CylinderGeometry(0.42, 0.46, 0.1, 32), 0.05)
    addMesh(new THREE.CylinderGeometry(0.28, 0.34, 0.07, 32), 0.135)
    // Stem
    addMesh(new THREE.CylinderGeometry(0.1, 0.14, 0.42, 24), 0.38)
    // Knop (the small sphere joining stem and cup, classic trophy silhouette)
    addMesh(new THREE.SphereGeometry(0.15, 24, 16), 0.6)
    // Cup — flares wide at the top like an open bowl
    addMesh(new THREE.CylinderGeometry(0.5, 0.18, 0.56, 32), 0.9)
    // Rim lip for a defined edge at the cup's opening
    const rimGeo = new THREE.TorusGeometry(0.5, 0.025, 12, 32)
    geometries.push(rimGeo)
    const rimMesh = new THREE.Mesh(rimGeo, mat)
    rimMesh.rotation.x = Math.PI / 2
    rimMesh.position.y = 1.18
    group.add(rimMesh)

    group.position.y = -0.6
    scene.add(group)

    let rafId: number
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      group.rotation.y += 0.012
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      geometries.forEach(g => g.dispose())
      mat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [size, tier])

  return <div ref={mountRef} style={{ width: size, height: size, flexShrink: 0 }} />
}
