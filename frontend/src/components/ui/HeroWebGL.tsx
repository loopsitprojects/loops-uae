/**
 * Hero WebGL scene — "Convergence"
 *
 * Three layers composited with AdditiveBlending:
 *  1. Wave grid — a tilted plane geometry whose vertices are displaced
 *     by layered sinusoids, coloured pink→purple→blue→teal by height.
 *  2. Flow particles — 1800 brand-coloured points following a sin/cos
 *     flow field that slowly evolves over time.
 *  3. Orbital rings — 4 large semi-transparent torus rings (the Loops O
 *     deconstructed) spinning at different speeds and angles.
 *
 * Mouse: camera parallax + gentle particle attraction.
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Brand palette
const C_PINK   = new THREE.Color(0xe8005a)
const C_PURPLE = new THREE.Color(0x7b2fbe)
const C_BLUE   = new THREE.Color(0x1b3fb5)
const C_TEAL   = new THREE.Color(0x00b4b4)
const PALETTE  = [C_PINK, C_PURPLE, C_BLUE, C_TEAL]

// Lerp between two colours by t ∈ [0,1]
function lerpColor(a: THREE.Color, b: THREE.Color, t: number) {
  return new THREE.Color(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
  )
}

// Map a normalised value (0–1) through the 4-stop brand palette
function paletteColor(n: number): THREE.Color {
  const stops = PALETTE
  const scaled = n * (stops.length - 1)
  const idx    = Math.floor(scaled)
  const frac   = scaled - idx
  return lerpColor(stops[Math.min(idx, stops.length - 2)], stops[Math.min(idx + 1, stops.length - 1)], frac)
}

// Layered sin/cos pseudo-noise → flow angle
function flowAngle(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.35 + t * 0.38) * Math.cos(y * 0.28 + t * 0.32) +
    Math.sin(x * 0.18 + y * 0.22 + t * 0.18) * 0.8 +
    Math.cos(x * 0.55 - y * 0.45 + t * 0.22) * 0.4
  ) * Math.PI
}

export default function HeroWebGL() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth  || window.innerWidth
    const H = mount.clientHeight || window.innerHeight

    // ── Renderer ────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    // ── Scene / Camera ───────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 100)
    camera.position.set(0, 1.5, 7)
    camera.lookAt(0, 0, 0)

    // ── 1. Wave grid ─────────────────────────────────────────────
    // Tilted plane seen from a low angle — looks like a 3D terrain
    const GRID_W = 60, GRID_H = 36
    const waveGeo = new THREE.PlaneGeometry(18, 11, GRID_W, GRID_H)
    const waveColors = new Float32Array(((GRID_W + 1) * (GRID_H + 1)) * 3)
    waveGeo.setAttribute('color', new THREE.BufferAttribute(waveColors, 3))

    const waveMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const waveMesh = new THREE.Mesh(waveGeo, waveMat)
    waveMesh.rotation.x = -Math.PI * 0.38   // tilt so we see it from above
    waveMesh.position.set(0, -1.8, -1)
    scene.add(waveMesh)

    // ── 2. Flow particles ────────────────────────────────────────
    const N = 1800
    const pPositions = new Float32Array(N * 3)
    const pColors    = new Float32Array(N * 3)
    const SPREAD = 7

    for (let i = 0; i < N; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * SPREAD * 2.2
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 3
      const c = PALETTE[i % PALETTE.length]
      pColors[i * 3] = c.r; pColors[i * 3 + 1] = c.g; pColors[i * 3 + 2] = c.b
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors, 3))
    const pMat = new THREE.PointsMaterial({
      size: 0.055, vertexColors: true,
      transparent: true, opacity: 0.75,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── 3. Orbital rings (deconstructed Loops O) ─────────────────
    const ringDefs = [
      { color: C_PINK,   R: 4.8, tube: 0.025, rotX: 0.7,  rotZ: 0.25, speed: 0.0028 },
      { color: C_PURPLE, R: 3.8, tube: 0.020, rotX: -0.4, rotZ: 0.65, speed: -0.0035 },
      { color: C_BLUE,   R: 2.8, tube: 0.022, rotX: 1.1,  rotZ: -0.2, speed: 0.0042 },
      { color: C_TEAL,   R: 1.9, tube: 0.018, rotX: -0.8, rotZ: 0.8,  speed: -0.0028 },
    ]
    const ringGroup = new THREE.Group()
    scene.add(ringGroup)

    interface RingEntry { mesh: THREE.Mesh; speed: number }
    const rings: RingEntry[] = []
    ringDefs.forEach(({ color, R, tube, rotX, rotZ, speed }) => {
      const geo = new THREE.TorusGeometry(R, tube, 16, 140)
      const mat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.35,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.x = rotX
      mesh.rotation.z = rotZ
      ringGroup.add(mesh)
      rings.push({ mesh, speed })
    })

    // ── 4. Large soft glow orbs (4 colours, slowly orbit) ────────
    const orbGeo = new THREE.BufferGeometry()
    const orbPos = new Float32Array(PALETTE.length * 3)
    const orbCol = new Float32Array(PALETTE.length * 3)
    PALETTE.forEach((c, i) => {
      orbPos[i * 3] = 0; orbPos[i * 3 + 1] = 0; orbPos[i * 3 + 2] = 0
      orbCol[i * 3] = c.r; orbCol[i * 3 + 1] = c.g; orbCol[i * 3 + 2] = c.b
    })
    orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPos, 3))
    orbGeo.setAttribute('color',    new THREE.BufferAttribute(orbCol, 3))
    const orbMat = new THREE.PointsMaterial({
      size: 1.8, vertexColors: true,
      transparent: true, opacity: 0.14,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const orbs = new THREE.Points(orbGeo, orbMat)
    scene.add(orbs)

    // ── Mouse tracking ───────────────────────────────────────────
    let mouseX = 0, mouseY = 0
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * -2
    }
    window.addEventListener('mousemove', onMouse)

    // ── Resize ───────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Shared refs into buffer attributes ───────────────────────
    const wavePos = waveGeo.attributes.position as THREE.BufferAttribute
    const waveCol = waveGeo.attributes.color    as THREE.BufferAttribute
    const pPos    = pGeo.attributes.position    as THREE.BufferAttribute
    const orbPosAttr = orbGeo.attributes.position as THREE.BufferAttribute

    // ── RAF loop ─────────────────────────────────────────────────
    let rafId: number
    let t = 0
    const camTarget = new THREE.Vector3()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      t += 0.004

      // Camera slow parallax toward mouse
      camTarget.set(mouseX * 0.6, mouseY * 0.35 + 1.5, 7)
      camera.position.lerp(camTarget, 0.025)
      camera.lookAt(0, 0, 0)

      // ── Wave grid displacement & colour ──────────────────────
      const vCount = (GRID_W + 1) * (GRID_H + 1)
      for (let i = 0; i < vCount; i++) {
        const x = wavePos.getX(i)
        const y = wavePos.getY(i)
        const z =
          Math.sin(x * 0.55 + t * 1.1) * Math.cos(y * 0.45 + t * 0.9) * 0.55 +
          Math.sin(x * 0.25 + y * 0.3  + t * 0.65) * 0.3 +
          Math.cos(x * 0.8  - y * 0.6  + t * 0.8 ) * 0.2
        wavePos.setZ(i, z)
        // Map z (approx -1..1) to palette
        const n = (z + 1.05) / 2.1
        const c = paletteColor(Math.max(0, Math.min(1, n)))
        waveCol.setXYZ(i, c.r, c.g, c.b)
      }
      wavePos.needsUpdate = true
      waveCol.needsUpdate = true

      // ── Flow particle update ──────────────────────────────────
      const mx = mouseX * 4.5
      const my = mouseY * 2.8
      for (let i = 0; i < N; i++) {
        const x = pPos.array[i * 3]
        const y = pPos.array[i * 3 + 1]
        const angle = flowAngle(x, y, t)
        const spd   = 0.007 + Math.abs(Math.sin(i * 0.13 + t)) * 0.005

        // Gentle mouse attraction within radius 2.5
        const dx = mx - x, dy = my - y
        const d  = Math.sqrt(dx * dx + dy * dy)
        const attract = d < 2.5 ? 0.0009 / Math.max(d, 0.08) : 0

        pPos.array[i * 3]     += Math.cos(angle) * spd + dx * attract
        pPos.array[i * 3 + 1] += Math.sin(angle) * spd + dy * attract

        // Wrap
        if (pPos.array[i * 3]     >  SPREAD * 1.1) pPos.array[i * 3]     = -SPREAD * 1.1
        if (pPos.array[i * 3]     < -SPREAD * 1.1) pPos.array[i * 3]     =  SPREAD * 1.1
        if (pPos.array[i * 3 + 1] >  SPREAD * 0.65) pPos.array[i * 3 + 1] = -SPREAD * 0.65
        if (pPos.array[i * 3 + 1] < -SPREAD * 0.65) pPos.array[i * 3 + 1] =  SPREAD * 0.65
      }
      pPos.needsUpdate = true

      // ── Orbital rings ─────────────────────────────────────────
      ringGroup.rotation.y += 0.0025
      rings.forEach(({ mesh, speed }) => {
        mesh.rotation.y += speed
        mesh.rotation.x += speed * 0.35
      })

      // ── Glow orbs orbit ───────────────────────────────────────
      PALETTE.forEach((_, i) => {
        const a = t * 0.28 + (i / PALETTE.length) * Math.PI * 2
        orbPosAttr.array[i * 3]     = Math.cos(a) * 2.8
        orbPosAttr.array[i * 3 + 1] = Math.sin(a * 0.7) * 1.6
        orbPosAttr.array[i * 3 + 2] = Math.sin(a * 1.3) * 1.4
      })
      orbPosAttr.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
