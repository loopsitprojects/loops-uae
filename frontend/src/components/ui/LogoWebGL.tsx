/**
 * WebGL 3D recreation of the Loops Integrated O-ring logo.
 * Uses Three.js: 4 metallic torus segments, orbiting colored lights,
 * particle field, and a continuous chase-light animation loop.
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

interface Props {
  width?: number
  height?: number
  className?: string
  /** 'loading' = entrance animation then loop
   *  'loop'    = immediate continuous loop (for decorative use) */
  mode?: 'loading' | 'loop'
  onReady?: () => void
}

// ── Brand colours ────────────────────────────────────────────────
const PINK   = 0xe8005a
const PURPLE = 0x7b2fbe
const BLUE   = 0x1b3fb5
const TEAL   = 0x00b4b4

// Gap between each segment (radians)
const GAP = 0.075
const ARC = Math.PI / 2 - GAP   // ≈ 84°

// Segment: hex colour, starting z-rotation so each spans a different quadrant
const SEGS = [
  { hex: PINK,   rotZ: GAP / 2 },                        // Pink   — top-right
  { hex: PURPLE, rotZ: Math.PI * 1.5 + GAP / 2 },        // Purple — bottom-right
  { hex: BLUE,   rotZ: Math.PI + GAP / 2 },              // Blue   — bottom-left
  { hex: TEAL,   rotZ: Math.PI * 0.5 + GAP / 2 },        // Teal   — top-left
]

export default function LogoWebGL({
  width = 300,
  height = 300,
  className = '',
  mode = 'loop',
  onReady,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    // ── Scene / camera ──────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50)
    camera.position.z = 5.8

    // ── Static lights ───────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.2))
    const key = new THREE.DirectionalLight(0xffffff, 5)
    key.position.set(3, 5, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x8888ff, 2)
    fill.position.set(-4, -2, 3)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffffff, 2)
    rim.position.set(0, -5, -4)
    scene.add(rim)

    // ── Ring group ──────────────────────────────────────────────
    const group = new THREE.Group()
    // Very slight forward-tilt so the ring looks like the logo (mostly face-on)
    group.rotation.x = 0.18
    scene.add(group)

    // Build each segment
    const materials: THREE.MeshPhysicalMaterial[] = []
    const meshes: THREE.Mesh[] = []

    SEGS.forEach(({ hex, rotZ }) => {
      const geo = new THREE.TorusGeometry(1, 0.40, 72, 220, ARC)
      const mat = new THREE.MeshPhysicalMaterial({
        color: hex,
        metalness: 0.5,
        roughness: 0.08,
        emissive: hex,
        emissiveIntensity: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.z = rotZ
      group.add(mesh)
      materials.push(mat)
      meshes.push(mesh)
    })

    // ── Particles ───────────────────────────────────────────────
    const N = 400
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const colors = [new THREE.Color(PINK), new THREE.Color(PURPLE), new THREE.Color(BLUE), new THREE.Color(TEAL)]
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2
      const spread = (Math.random() - 0.5) * 0.9
      const r = 1 + spread * 0.55
      pos[i * 3]     = Math.cos(a) * r
      pos[i * 3 + 1] = Math.sin(a) * r
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.7
      const c = colors[Math.floor(a / (Math.PI * 0.5)) % 4]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    const pMat = new THREE.PointsMaterial({
      size: 0.022, vertexColors: true, transparent: true, opacity: 0.65,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const particles = new THREE.Points(pGeo, pMat)
    group.add(particles)

    // ── Orbiting coloured accent lights ─────────────────────────
    const accentLights = SEGS.map(({ hex }, i) => {
      const light = new THREE.PointLight(hex, 3.5, 7)
      scene.add(light)
      return { light, baseAngle: (i / SEGS.length) * Math.PI * 2 }
    })

    // ── Entrance animation (loading mode) ───────────────────────
    if (mode === 'loading') {
      meshes.forEach(m => m.scale.setScalar(0))
      particles.scale.setScalar(0)
      meshes.forEach((mesh, i) => {
        gsap.to(mesh.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.65, delay: 0.12 + i * 0.1, ease: 'back.out(1.7)',
          onComplete: i === meshes.length - 1 ? () => {
            gsap.to(particles.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'power3.out' })
            onReady?.()
            startLoop()
          } : undefined,
        })
      })
    } else {
      startLoop()
    }

    // ── Chase-light loop animation ───────────────────────────────
    // Continuously runs: segments pulse in sequence, then all flash together
    function startLoop() {
      const loop = () => {
        const tl = gsap.timeline({ onComplete: () => setTimeout(loop, 1800) })
        // Chase: each segment brightens in turn
        materials.forEach((mat, i) => {
          tl.to(mat, { emissiveIntensity: 1.2, duration: 0.18, ease: 'power2.out' }, i * 0.14)
          tl.to(mat, { emissiveIntensity: 0.4,  duration: 0.5,  ease: 'power2.in'  }, i * 0.14 + 0.18)
        })
        // Bloom: brief full-ring flash
        tl.to(materials, { emissiveIntensity: 1.5, duration: 0.15, ease: 'power2.out' }, '+=0.2')
        tl.to(materials, { emissiveIntensity: 0.4, duration: 0.6,  ease: 'power2.in'  })
      }
      loop()
    }

    // ── Mouse reactive tilt ─────────────────────────────────────
    let targetX = 0.18, targetY = 0
    const onMouse = (e: MouseEvent) => {
      targetY = (e.clientX / window.innerWidth  - 0.5) *  0.9
      targetX = 0.18 + (e.clientY / window.innerHeight - 0.5) * -0.35
    }
    window.addEventListener('mousemove', onMouse)

    // ── Particle animation data ─────────────────────────────────
    const pPos = pGeo.attributes.position as THREE.BufferAttribute
    const pSpeeds = Array.from({ length: N }, () => 0.3 + Math.random() * 0.7)
    const pOffsets = Array.from({ length: N }, () => Math.random() * Math.PI * 2)

    // ── Render loop ─────────────────────────────────────────────
    let rafId: number
    let t = 0
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      t += 0.009

      group.rotation.y += 0.010
      group.rotation.x += (targetX - group.rotation.x) * 0.04

      // Orbit accent lights
      accentLights.forEach(({ light, baseAngle }, i) => {
        const a = baseAngle + t * (0.35 + i * 0.12)
        light.position.set(
          Math.cos(a) * 2.4,
          Math.sin(a) * 2.4 * 0.55,
          Math.cos(a * 1.4) * 0.9 + 1.2
        )
        light.intensity = 3 + Math.sin(t * 2 + i) * 1.0
      })

      // Particle drift
      for (let i = 0; i < N; i++) {
        pPos.array[i * 3 + 2] = Math.sin(t * pSpeeds[i] + pOffsets[i]) * 0.28
      }
      pPos.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouse)
      gsap.killTweensOf(materials)
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [width, height, mode, onReady])

  return <div ref={mountRef} className={className} style={{ width, height }} />
}
