/**
 * Lightweight WebGL Loops O-ring logo for the navbar.
 * 4 brand-coloured segments, slow Y-spin, chase-light pulse.
 * No particles — optimised for small sizes (40–56px).
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

const PINK   = 0xe8005a
const PURPLE = 0x7b2fbe
const BLUE   = 0x1b3fb5
const TEAL   = 0x00b4b4

const GAP = 0.08
const ARC = Math.PI / 2 - GAP

// Clockwise from 12 o'clock: Pink (top-right), Purple (bottom-right), Blue (bottom-left), Teal (top-left)
const SEGS = [
  { hex: PINK,   rotZ: GAP / 2 },
  { hex: PURPLE, rotZ: Math.PI * 1.5 + GAP / 2 },
  { hex: BLUE,   rotZ: Math.PI + GAP / 2 },
  { hex: TEAL,   rotZ: Math.PI * 0.5 + GAP / 2 },
]

interface Props {
  size?: number
}

export default function NavLogoWebGL({ size = 44 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
    camera.position.z = 5.2

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.25))
    const key = new THREE.DirectionalLight(0xffffff, 5.0)
    key.position.set(2, 4, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 1.8)
    fill.position.set(-3, -2, 3)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffffff, 3.0)
    rim.position.set(0, -5, -4)
    scene.add(rim)

    const group = new THREE.Group()
    group.rotation.x = 0.20  // 3-D tilt so ring depth shows while keeping round O letter shape
    scene.add(group)

    const materials: THREE.MeshPhysicalMaterial[] = []

    SEGS.forEach(({ hex, rotZ }) => {
      const geo = new THREE.TorusGeometry(1, 0.38, 64, 200, ARC)
      const mat = new THREE.MeshPhysicalMaterial({
        color: hex,
        metalness: 0.4,
        roughness: 0.10,
        emissive: hex,
        emissiveIntensity: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.z = rotZ
      group.add(mesh)
      materials.push(mat)
    })

    // Chase-light loop — segments light up in sequence, then full bloom
    const runChase = () => {
      const tl = gsap.timeline({ onComplete: () => setTimeout(runChase, 1600) })
      materials.forEach((mat, i) => {
        tl.to(mat, { emissiveIntensity: 1.4, duration: 0.14, ease: 'power2.out' }, i * 0.12)
        tl.to(mat, { emissiveIntensity: 0.5, duration: 0.45, ease: 'power2.in'  }, i * 0.12 + 0.14)
      })
      // Full bloom
      tl.to(materials, { emissiveIntensity: 1.8, duration: 0.12, ease: 'power2.out' }, '+=0.12')
      tl.to(materials, { emissiveIntensity: 0.5, duration: 0.55, ease: 'power2.in'  })
    }
    runChase()

    // RAF loop — gentle constant spin
    let rafId: number
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      group.rotation.y += 0.009
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      gsap.killTweensOf(materials)
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [size])

  return <div ref={mountRef} style={{ width: size, height: size, flexShrink: 0 }} />
}
