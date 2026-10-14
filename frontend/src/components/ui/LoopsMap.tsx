/**
 * LoopsMap — interactive animated world map.
 * Shows Loops Integrated office locations with pulsing markers and
 * arc connections. Supports activeIndex highlight + click callback.
 */
import { useEffect, useRef, useMemo, useState } from 'react'
import { Office } from '@/lib/api'
import worldData from '@/data/world.json'

interface Props {
  height?: number
  className?: string
  activeIndex?: number
  onOfficeClick?: (index: number) => void
  offices?: Office[]
}

type LabelDir = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'

export const HQ_COLOR = '#FF2B43' // Distinctive vibrant red strictly reserved for HQ
export const BRANCH_COLORS = ['#00B4B4', '#7B2FBE', '#1B3FB5', '#06B6D4', '#8B5CF6', '#3B82F6', '#10B981']

export function isOfficeHQ(o: Partial<Office> | undefined | null): boolean {
  if (!o) return false
  const val = o.is_headquarters as unknown
  if (val === true || val === 1 || val === '1' || val === 'true') {
    return true
  }
  const r = (o.role || '').toLowerCase().trim()
  return r === 'headquarters' || r === 'hq' || r.startsWith('headquarter')
}

function getLabelDir(cityOrCountry: string): LabelDir {
  const c = cityOrCountry.toLowerCase()
  if (c.includes('london') || c.includes('united kingdom') || c.includes('uk')) return 'top-left'
  if (c.includes('adliswil') || c.includes('switzerland')) return 'bottom-left'
  if (c.includes('dubai') || c.includes('uae')) return 'top-right'
  if (c.includes('qatar') || c.includes('doha')) return 'bottom-left'
  if (c.includes('colombo') || c.includes('sri lanka') || c.includes('sri\u00a0lanka')) return 'bottom-left'
  if (c.includes('singapore')) return 'bottom-right'
  if (c.includes('sydney') || c.includes('nsw') || c.includes('australia')) return 'top-left'
  if (c.includes('suva') || c.includes('fiji')) return 'top-left'
  return 'top-right'
}

// Dynamic bounding box mapping covering full 360° world presence (Americas to Fiji)
function getMapBounds(W: number) {
  if (W < 640) {
    return {
      lngMin: -165,
      lngMax: 198,
      latMin: -54,
      latMax: 74,
    }
  }
  return {
    lngMin: -168,
    lngMax: 198,
    latMin: -54,
    latMax: 74,
  }
}

// Full-bleed edge-to-edge projection function (no side margins)
function project(lat: number, lng: number, W: number, H: number) {
  const bounds = getMapBounds(W)
  const lngRange = bounds.lngMax - bounds.lngMin
  const latRange = bounds.latMax - bounds.latMin

  return {
    x: ((lng - bounds.lngMin) / lngRange) * W,
    y: ((bounds.latMax - lat) / latRange) * H,
  }
}

function bezier(ax: number, ay: number, bx: number, by: number, t: number): [number, number] {
  const lift = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2) * 0.28
  const mx = (ax + bx) / 2, my = (ay + by) / 2 - lift
  return [
    (1 - t) ** 2 * ax + 2 * (1 - t) * t * mx + t ** 2 * bx,
    (1 - t) ** 2 * ay + 2 * (1 - t) * t * my + t ** 2 * by,
  ]
}

function rgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

function getCustomTransform(cityOrCountry: string, labelDir: LabelDir): string {
  const c = cityOrCountry.toLowerCase()
  if (c.includes('qatar') || c.includes('doha')) {
    // Shift Qatar down-left towards Red Sea/East Africa to create generous spacing from Dubai
    return 'translate(-108%, 14px)'
  }
  if (c.includes('dubai') || c.includes('uae')) {
    // Shift Dubai up-right towards Central Asia
    return 'translate(10px, calc(-100% - 10px))'
  }
  if (c.includes('adliswil') || c.includes('switzerland')) {
    return 'translate(-100%, 14px)'
  }
  if (c.includes('london') || c.includes('united kingdom') || c.includes('uk')) {
    return 'translate(-100%, calc(-100% - 10px))'
  }
  if (c.includes('colombo') || c.includes('sri lanka') || c.includes('sri\u00a0lanka')) {
    return 'translate(-100%, 14px)'
  }
  if (c.includes('singapore')) {
    return 'translate(10px, 10px)'
  }
  if (c.includes('sydney') || c.includes('nsw') || c.includes('australia')) {
    return 'translate(-100%, 12px)'
  }
  if (c.includes('suva') || c.includes('fiji')) {
    return 'translate(-85%, 14px)'
  }

  return labelDir === 'top-left'   ? 'translate(-100%, calc(-100% - 6px))' :
         labelDir === 'top-right'  ? 'translate(6px, calc(-100% - 6px))' :
         labelDir === 'bottom-left' ? 'translate(-100%, 6px)' :
         labelDir === 'bottom-right'? 'translate(6px, 6px)' :
         labelDir === 'bottom'     ? 'translate(-50%, 6px)' :
                                     'translate(-50%, calc(-100% - 6px))'
}

export default function LoopsMap({
  height = 380,
  className = '',
  activeIndex,
  onOfficeClick,
  offices,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const activeRef = useRef<number | undefined>(activeIndex)

  // Track the actual wrapper dimensions in order to position the HTML labels correctly
  const [dims, setDims] = useState({ w: 800, h: 300 })

  // Keep activeRef in sync without restarting the RAF loop
  useEffect(() => { activeRef.current = activeIndex }, [activeIndex])

  // Map dynamic or static fallback offices without hardcoding any headquarters
  const mappedOffices = useMemo(() => {
    const list = offices && offices.length ? offices : [
      { city: 'Colombo', country: 'Sri\u00a0Lanka', role: 'Headquarters', lat: 6.9147, lng: 79.8484, is_headquarters: false },
      { city: 'Dubai', country: 'UAE', role: 'Middle East & Africa', lat: 25.1972, lng: 55.2744, is_headquarters: false },
      { city: 'London', country: 'UK', role: 'Europe', lat: 51.5144, lng: -0.0803, is_headquarters: false },
      { city: 'Singapore', country: 'Singapore', role: 'Southeast Asia', lat: 1.2838, lng: 103.8516, is_headquarters: false },
    ]

    let branchCount = 0
    return list.map((o, idx) => {
      const isHq = isOfficeHQ(o)
      const color = isHq ? HQ_COLOR : BRANCH_COLORS[(branchCount++) % BRANCH_COLORS.length]

      return {
        name: o.city || o.country || o.role || `Office ${idx + 1}`,
        country: o.country || '',
        role: o.role || o.country || '',
        lat: o.lat ?? 0,
        lng: o.lng ?? 0,
        color,
        labelDir: getLabelDir(`${o.city || ''} ${o.country || ''}`),
        is_headquarters: isHq,
      }
    })
  }, [offices])

  // Generate connection arcs dynamically connecting branches to headquarters
  const arcs = useMemo(() => {
    const hqIdx = mappedOffices.findIndex(o => o.is_headquarters)
    const hqIndex = hqIdx !== -1 ? hqIdx : 0
    const list: [number, number][] = []
    mappedOffices.forEach((_, i) => {
      if (i !== hqIndex) {
        list.push([hqIndex, i])
      }
    })
    return list
  }, [mappedOffices])

  // Compute label percentage coordinates based on dims and aspect-ratio locked projection
  const labels = useMemo(() => {
    const W = dims.w
    const H = dims.h

    return mappedOffices.map(o => {
      const { x, y } = project(o.lat, o.lng, W, H)
      // Clamp coordinates to keep labels safely within canvas boundaries
      const xp = Math.max(4, Math.min(95, (x / W) * 100))
      const yp = Math.max(8, Math.min(88, (y / H) * 100))
      return {
        ...o,
        xp,
        yp
      }
    })
  }, [mappedOffices, dims])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let t = 0

    let staticCanvas: HTMLCanvasElement | null = null

    const setup = () => {
      const W = wrap.clientWidth
      const H = wrap.clientHeight
      if (W <= 0 || H <= 0) return

      canvas.width  = W
      canvas.height = H
      setDims({ w: W, h: H })

      // Pre-render static world map background and grid to canvas cache
      staticCanvas = document.createElement('canvas')
      staticCanvas.width = W
      staticCanvas.height = H
      const staticCtx = staticCanvas.getContext('2d')
      if (staticCtx) {
        // Subtle fill so the map reads against dark background
        staticCtx.fillStyle = 'rgba(255,255,255,0.005)'
        staticCtx.fillRect(0, 0, W, H)

        // Dot grid
        staticCtx.fillStyle = 'rgba(255,255,255,0.04)'
        for (let gx = 0; gx <= W; gx += 20) {
          for (let gy = 0; gy <= H; gy += 20) {
            staticCtx.beginPath()
            staticCtx.arc(gx, gy, 0.65, 0, Math.PI * 2)
            staticCtx.fill()
          }
        }

        // Draw GeoJSON country boundaries in light color
        staticCtx.fillStyle = 'rgba(255,255,255,0.12)'
        staticCtx.strokeStyle = 'rgba(255,255,255,0.28)'
        staticCtx.lineWidth = 0.5

        const drawRing = (ring: [number, number][]) => {
          if (ring.length < 3) return
          const first = project(ring[0][1], ring[0][0], W, H)
          staticCtx.moveTo(first.x, first.y)
          for (let i = 1; i < ring.length; i++) {
            const p = project(ring[i][1], ring[i][0], W, H)
            staticCtx.lineTo(p.x, p.y)
          }
        }

        worldData.features.forEach((feature: any) => {
          const geom = feature.geometry
          if (!geom) return
          staticCtx.beginPath()
          if (geom.type === 'Polygon') {
            geom.coordinates.forEach((ring: [number, number][]) => {
              drawRing(ring)
            })
          } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach((polygon: [number, number][][]) => {
              polygon.forEach((ring: [number, number][]) => {
                drawRing(ring)
              })
            })
          }
          staticCtx.fill()
          staticCtx.stroke()
        })
      }
    }
    
    setup()
    const ro = new ResizeObserver(setup)
    ro.observe(wrap)

    // Click handling — find nearest office dot
    const handleClick = (e: MouseEvent) => {
      if (!onOfficeClick) return
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const cx = (e.clientX - rect.left) * (canvas.width / rect.width)
      const cy = (e.clientY - rect.top)  * (canvas.height / rect.height)
      const W = canvas.width, H = canvas.height
      let nearest = -1, minDist = 30 // px threshold
      mappedOffices.forEach((o, i) => {
        const { x, y } = project(o.lat, o.lng, W, H)
        const d = Math.sqrt((cx - x) ** 2 + (cy - y) ** 2)
        if (d < minDist) { minDist = d; nearest = i }
      })
      if (nearest >= 0) onOfficeClick(nearest)
    }
    canvas.addEventListener('click', handleClick)
    canvas.style.cursor = onOfficeClick ? 'pointer' : 'default'

    const draw = () => {
      const W = canvas.width, H = canvas.height
      if (W <= 0 || H <= 0) return

      const act = activeRef.current
      ctx.clearRect(0, 0, W, H)

      // Draw the static cached background canvas (dot grid + countries map)
      if (staticCanvas && staticCanvas.width > 0 && staticCanvas.height > 0) {
        ctx.drawImage(staticCanvas, 0, 0)
      }

      const pts = mappedOffices.map(o => project(o.lat, o.lng, W, H))

      // Arc connections
      arcs.forEach(([ai, bi], idx) => {
        const a = pts[ai]
        const b = pts[bi]
        if (!a || !b) return
        const isActive = act === ai || act === bi
        const col = mappedOffices[ai].color

        // Glow backdrop
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        for (let s = 1; s <= 80; s++) {
          const [bx, by] = bezier(a.x, a.y, b.x, b.y, s / 80)
          ctx.lineTo(bx, by)
        }
        ctx.strokeStyle = rgba(col, isActive ? 0.32 : 0.12)
        ctx.lineWidth = isActive ? 3 : 2
        ctx.setLineDash([])
        ctx.stroke()

        // Thin dashed line on top
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        for (let s = 1; s <= 80; s++) {
          const [bx, by] = bezier(a.x, a.y, b.x, b.y, s / 80)
          ctx.lineTo(bx, by)
        }
        ctx.strokeStyle = rgba(col, isActive ? 0.55 : 0.28)
        ctx.lineWidth = 1
        ctx.setLineDash([4, 7])
        ctx.stroke()
        ctx.restore()

        // Particles (2 per arc)
        ;[0, 0.5].forEach(offset => {
          const prog = ((t * 0.15 + idx * 0.3 + offset) % 1)
          const [px, py] = bezier(a.x, a.y, b.x, b.y, prog)
          const radius = isActive ? 12 : 8
          const alpha  = isActive ? 1.0 : 0.75
          const g = ctx.createRadialGradient(px, py, 0, px, py, radius)
          g.addColorStop(0, rgba(col, alpha))
          g.addColorStop(0.4, rgba(col, alpha * 0.5))
          g.addColorStop(1, rgba(col, 0))
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(px, py, radius, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      // Office markers
      mappedOffices.forEach((o, i) => {
        const pt = pts[i]
        if (!pt) return
        const { x, y } = pt
        const isActive = act === i
        const isHq = o.is_headquarters
        const phase = t * 1.6 + i * 1.3

        // Pulse ring 1 (dynamic red pulse for HQ, standard pulse for branches)
        const p1 = (phase % (Math.PI * 2)) / (Math.PI * 2)
        const alpha1 = (1 - p1) * (isActive ? 0.9 : isHq ? 0.8 : 0.45)
        ctx.strokeStyle = rgba(o.color, alpha1)
        ctx.lineWidth = isActive ? 2.2 : isHq ? 2.0 : 1.2
        ctx.beginPath()
        const baseR1 = isActive ? 14 : isHq ? 12 : 9
        const expandR1 = isActive ? 36 : isHq ? 32 : 22
        ctx.arc(x, y, baseR1 + p1 * expandR1, 0, Math.PI * 2)
        ctx.stroke()

        // Pulse ring 2 (always animated for active or HQ in red)
        if (isActive || isHq) {
          const p2 = ((phase + Math.PI) % (Math.PI * 2)) / (Math.PI * 2)
          ctx.strokeStyle = rgba(o.color, (1 - p2) * (isActive ? 0.6 : 0.45))
          ctx.lineWidth = 1.2
          ctx.beginPath()
          const baseR2 = isActive ? 8 : 7
          const expandR2 = isActive ? 22 : 18
          ctx.arc(x, y, baseR2 + p2 * expandR2, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Glow halo
        const hR = isActive ? 28 : isHq ? 24 : 16
        const halo = ctx.createRadialGradient(x, y, 0, x, y, hR)
        halo.addColorStop(0, rgba(o.color, isActive ? 0.75 : isHq ? 0.65 : 0.35))
        halo.addColorStop(0.5, rgba(o.color, isActive ? 0.28 : isHq ? 0.22 : 0.1))
        halo.addColorStop(1, rgba(o.color, 0))
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(x, y, hR, 0, Math.PI * 2)
        ctx.fill()

        // Static outer ring (visible on active OR HQ red point)
        if (isActive || isHq) {
          ctx.strokeStyle = rgba(o.color, isActive ? 0.9 : 0.7)
          ctx.lineWidth = isActive ? 2 : 1.6
          ctx.beginPath()
          ctx.arc(x, y, isActive ? 9 : 7.5, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Centre dot (red pointed for HQ)
        ctx.fillStyle = o.color
        ctx.beginPath()
        ctx.arc(x, y, isActive ? 5.5 : isHq ? 5 : 3.8, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(x, y, isActive ? 2.5 : isHq ? 2.2 : 1.6, 0, Math.PI * 2)
        ctx.fill()
      })

      t += 0.016
    }

    const loop = () => { rafId = requestAnimationFrame(loop); draw() }
    loop()

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('click', handleClick)
      ro.disconnect()
    }
  }, [mappedOffices, arcs, onOfficeClick])

  return (
    <div ref={wrapRef} className={`relative ${className}`} style={{ height }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {labels.map(o => {
        const transform = getCustomTransform(`${o.name} ${o.country || ''}`, o.labelDir)

        return (
          <div
            key={o.name}
            className="absolute pointer-events-none select-none z-20"
            style={{ left: `${o.xp}%`, top: `${o.yp}%`, transform }}
          >
            <div
              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-black/90 backdrop-blur-md border shadow-2xl text-left transition-all ${
                o.is_headquarters ? 'ring-1 ring-red-500/60 shadow-[0_0_20px_rgba(255,43,67,0.35)]' : ''
              }`}
              style={{
                borderColor: o.is_headquarters ? '#FF2B43' : `${o.color}88`,
                boxShadow: o.is_headquarters
                  ? '0 4px 16px rgba(0,0,0,0.8), 0 0 16px rgba(255,43,67,0.45)'
                  : `0 4px 16px rgba(0,0,0,0.8), 0 0 12px ${o.color}33`,
                whiteSpace: 'nowrap',
              }}
            >
              <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                <p
                  className="text-white font-bold leading-none tracking-tight text-[0.56rem] sm:text-[0.72rem]"
                  style={{ fontFamily: "'Poppins', sans-serif", textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                >
                  {o.name}
                </p>
                {o.is_headquarters && (
                  <span className="px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/50 text-[0.45rem] font-mono font-bold tracking-wider uppercase leading-none shadow-sm">
                    HQ
                  </span>
                )}
              </div>
              {Boolean(o.role?.trim()) && (
                <p
                  className="font-mono text-[0.44rem] sm:text-[0.54rem] font-semibold uppercase tracking-wider leading-none"
                  style={{ color: '#F1F5F9', textShadow: '0 1px 4px rgba(0,0,0,0.95)' }}
                >
                  <span style={{ color: o.color, marginRight: 3 }}>●</span>
                  {o.role}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
