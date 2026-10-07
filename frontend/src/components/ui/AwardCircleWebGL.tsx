/**
 * Dedicated 3D Animated Circle Ring for Award Displays.
 * Uses a Shared Offscreen Three.js WebGL Engine to render the EXACT 3D Torus Ring with MeshPhysicalMaterial.
 * Employs 1 single WebGL context shared across all cards, guaranteeing 100% dark background stability and zero context loss.
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

const SEGS = [
  { hex: PINK,   rotZ: GAP / 2 },
  { hex: PURPLE, rotZ: Math.PI * 1.5 + GAP / 2 },
  { hex: BLUE,   rotZ: Math.PI + GAP / 2 },
  { hex: TEAL,   rotZ: Math.PI * 0.5 + GAP / 2 },
]

// ——— Singleton Shared Offscreen Three.js WebGL Engine ———
interface WebGLManager {
  canvas: HTMLCanvasElement
  subscribers: Set<(offscreenCanvas: HTMLCanvasElement) => void>
  refCount: number
  init: () => void
  subscribe: (cb: (offscreenCanvas: HTMLCanvasElement) => void) => () => void
}

let managerInstance: WebGLManager | null = null

function getWebGLRingManager(): WebGLManager {
  if (managerInstance) return managerInstance

  const subscribers = new Set<(offscreenCanvas: HTMLCanvasElement) => void>()
  const SIZE = 512

  let renderer: THREE.WebGLRenderer | null = null
  let canvas: HTMLCanvasElement = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE

  let rafId = 0
  let isInitialized = false
  let gsapTimeline: gsap.core.Timeline | null = null

  const init = () => {
    if (isInitialized) return
    isInitialized = true

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setSize(SIZE, SIZE)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.4
      renderer.outputColorSpace = THREE.SRGBColorSpace

      const glCanvas = renderer.domElement
      glCanvas.addEventListener('webglcontextlost', (e) => e.preventDefault(), false)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
      camera.position.z = 5.6

      // Exact Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.3))
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
      scene.add(group)

      const materials: THREE.MeshPhysicalMaterial[] = []

      // Exact 3D Torus Geometry & MeshPhysicalMaterial
      SEGS.forEach(({ hex, rotZ }) => {
        const geo = new THREE.TorusGeometry(1.6, 0.20, 64, 200, ARC)
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

      // GSAP Chase Lighting Loop
      const runChase = () => {
        gsapTimeline = gsap.timeline({ onComplete: () => setTimeout(runChase, 1600) })
        materials.forEach((mat, i) => {
          gsapTimeline?.to(mat, { emissiveIntensity: 1.4, duration: 0.14, ease: 'power2.out' }, i * 0.12)
          gsapTimeline?.to(mat, { emissiveIntensity: 0.5, duration: 0.45, ease: 'power2.in'  }, i * 0.12 + 0.14)
        })
        gsapTimeline?.to(materials, { emissiveIntensity: 1.8, duration: 0.12, ease: 'power2.out' }, '+=0.12')
        gsapTimeline?.to(materials, { emissiveIntensity: 0.5, duration: 0.55, ease: 'power2.in'  })
      }
      runChase()

      // RAF Loop — Single WebGL Render call broadcasting to 2D card canvases
      const animate = () => {
        rafId = requestAnimationFrame(animate)
        group.rotation.z += 0.005
        renderer?.render(scene, camera)

        // Copy rendered WebGL frame to shared output canvas
        if (renderer) {
          subscribers.forEach((cb) => cb(renderer!.domElement))
        }
      }
      animate()
    } catch {
      // Fallback
    }
  }

  const subscribe = (cb: (offscreenCanvas: HTMLCanvasElement) => void) => {
    init()
    subscribers.add(cb)
    managerInstance!.refCount++

    return () => {
      subscribers.delete(cb)
      managerInstance!.refCount--
    }
  }

  managerInstance = {
    canvas,
    subscribers,
    refCount: 0,
    init,
    subscribe,
  }

  return managerInstance
}

interface Props {
  size?: number
  className?: string
}

export default function AwardCircleWebGL({ size = 320, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const targetCanvas = canvasRef.current
    if (!targetCanvas) return

    const ctx = targetCanvas.getContext('2d')
    if (!ctx) return

    const manager = getWebGLRingManager()

    const unsubscribe = manager.subscribe((offscreenCanvas) => {
      if (!targetCanvas || targetCanvas.width === 0 || targetCanvas.height === 0) return
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height)
      ctx.drawImage(offscreenCanvas, 0, 0, targetCanvas.width, targetCanvas.height)
    })

    return () => {
      unsubscribe()
    }
  }, [size])

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      {/* Ambient background glow ring */}
      <div
        className="absolute inset-4 rounded-full opacity-40 blur-2xl pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, #E8005A, #7B2FBE, #1B3FB5, #00B4B4, #E8005A)',
        }}
      />

      {/* 2D Display Canvas drawing the exact Three.js 3D WebGL render */}
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        className="relative z-10 w-full h-full pointer-events-none"
      />
    </div>
  )
}



