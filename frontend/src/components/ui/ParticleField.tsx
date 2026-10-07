/**
 * Reusable WebGL particle field background.
 * Place inside any section as an absolute-positioned layer.
 * Color palette adapts to the 4 brand hues.
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  className?: string
  /** Number of particles — default 600 */
  count?: number
  /** Spread radius of the particle cloud */
  spread?: number
  /** Scrolls the camera as user scrolls page — use inside dark sections */
  scrollDriven?: boolean
  /** Which brand colour to tint the particles */
  accent?: 'pink' | 'purple' | 'blue' | 'teal' | 'multi'
}

const ACCENTS: Record<string, number[]> = {
  pink:   [0xe8005a],
  purple: [0x7b2fbe],
  blue:   [0x1b3fb5],
  teal:   [0x00b4b4],
  multi:  [0xe8005a, 0x7b2fbe, 0x1b3fb5, 0x00b4b4],
}

export default function ParticleField({
  className = '',
  count = 600,
  spread = 14,
  scrollDriven = false,
  accent = 'multi',
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth  || window.innerWidth
    const H = mount.clientHeight || window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const handleContextLost = (e: Event) => {
      e.preventDefault()
    }
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 8

    // Build particles
    const palette = ACCENTS[accent] ?? ACCENTS.multi
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const spd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.4
      const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)])
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
      spd[i] = 0.2 + Math.random() * 0.8
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Resize handler
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // RAF loop
    let rafId: number
    let t = 0
    const pPos = geo.attributes.position as THREE.BufferAttribute
    const offsets = Array.from({ length: count }, () => Math.random() * Math.PI * 2)

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      t += 0.004

      // Gentle parallax scroll-driven camera drift
      if (scrollDriven) {
        const sect = mount.closest('section') as HTMLElement | null
        if (sect) {
          const rect = sect.getBoundingClientRect()
          const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height)
          camera.position.y = (progress - 0.5) * 2.5
        }
      }

      // Float particles gently
      for (let i = 0; i < count; i++) {
        pPos.array[i * 3 + 1] += Math.sin(t * spd[i] + offsets[i]) * 0.002
        pPos.array[i * 3]     += Math.cos(t * spd[i] * 0.7 + offsets[i]) * 0.001
      }
      pPos.needsUpdate = true

      // Slow rotation
      points.rotation.y = t * 0.04
      points.rotation.x = Math.sin(t * 0.025) * 0.08

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [count, spread, scrollDriven, accent])

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
