import { useState, useRef } from 'react'
import { motion, useSpring, AnimatePresence } from 'framer-motion'
import { Award, resolveImageUrl } from '@/lib/api'

import AwardCircleWebGL from '@/components/ui/AwardCircleWebGL'

export interface AwardGroup {
  body: string
  trophyImg: string
  wins: {
    year: number
    tier: string
    campaign_name: string
    client_name?: string
    category?: string
  }[]
}

interface GutAwardDisplayProps {
  group?: AwardGroup
  award?: Award
  className?: string
}

export function getCleanAwardImage(bodyName: string, tier?: string, rawBg?: string): string {
  const bLower = (bodyName || '').toLowerCase()
  const tLower = (tier || '').toLowerCase()

  if (bLower.includes('slim')) {
    return resolveImageUrl('/images/awards/slim-digis-2021-nobg.png')
  }
  if (bLower.includes('dragon')) {
    if (tLower.includes('bronze') || (rawBg && rawBg.includes('blue'))) {
      return resolveImageUrl('/images/awards/dragons-of-asia-blue-2025-nobg.png')
    }
    return resolveImageUrl('/images/awards/dragons-of-asia-gold-2025-nobg.png')
  }
  if (bLower.includes('effie')) {
    return resolveImageUrl('/images/awards/effie-awards-2016-nobg.png')
  }
  if (bLower.includes('four') || bLower.includes("4's") || bLower.includes('4s')) {
    return resolveImageUrl('/images/awards/four-as-gold-2024-nobg.png')
  }

  const resolved = resolveImageUrl(rawBg)
  return resolved || resolveImageUrl('/images/awards/four-as-gold-2024-nobg.png')
}

export default function GutAwardDisplay({ group, award, className = '' }: GutAwardDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const INITIAL_LIMIT = 4

  // Smooth 3D tilt spring physics
  const springConfig = { stiffness: 200, damping: 20 }
  const rotX = useSpring(0, springConfig)
  const rotY = useSpring(0, springConfig)
  const trophyX = useSpring(0, springConfig)
  const trophyY = useSpring(0, springConfig)

  // Normalize input data into a unified structure
  const bodyName = group ? group.body : award?.award_body || 'Advertising Award'
  
  let winsList: { year: number; tier: string; campaign_name: string; client_name?: string; category?: string }[] = []
  if (group) {
    winsList = group.wins
  } else if (award) {
    winsList = [{
      year: award.year,
      tier: award.tier,
      campaign_name: award.campaign_name,
      client_name: award.client_name,
      category: award.category,
    }]
  }

  // Determine clean trophy image with reliable mapping
  let imageSrc = group?.trophyImg || ''
  if (!imageSrc) {
    const rawBg = award ? ((award as any).background_url || award.background_path) : undefined
    const tier = award?.tier || group?.wins?.[0]?.tier
    imageSrc = getCleanAwardImage(bodyName, tier, rawBg)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const relativeY = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Smooth tilt
    const tiltX = -((relativeY - centerY) / centerY) * 14
    const tiltY = ((relativeX - centerX) / centerX) * 14
    rotX.set(tiltX)
    rotY.set(tiltY)

    // Trophy 3D parallax displacement
    trophyX.set(((relativeX - centerX) / centerX) * 18)
    trophyY.set(((relativeY - centerY) / centerY) * 18)
  }

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotX.set(0)
    rotY.set(0)
    trophyX.set(0)
    trophyY.set(0)
  }

  return (
    <div className={`perspective-[1200px] select-none ${className}`}>
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
        }}
        className="flex flex-col items-center text-center p-4 cursor-pointer group"
      >
        {/* ── CARDLESS FLOATING 3D TROPHY DISPLAY WITH WIDE 3D ANIMATED CIRCLE ── */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 mb-6 sm:mb-8 flex items-center justify-center">
          {/* 3D Animated WebGL Circle Background (Wide Center Hole) */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            style={{ transform: 'translateZ(10px)' }}
          >
            <div className="hidden sm:block">
              <AwardCircleWebGL size={360} />
            </div>
            <div className="block sm:hidden">
              <AwardCircleWebGL size={270} />
            </div>
          </div>

          {/* Ambient Glow */}
          <div
            className="absolute w-44 h-44 rounded-full bg-brand-pink/20 blur-3xl group-hover:bg-brand-pink/35 transition-all duration-500 pointer-events-none"
            style={{ transform: 'translateZ(5px)' }}
          />

          {/* Trophy Asset Sitting 100% INSIDE the 3D Circle Center Opening */}
          <motion.div
            style={{
              x: trophyX,
              y: trophyY,
              transformStyle: 'preserve-3d',
              transform: 'translateZ(45px)',
            }}
            animate={{
              y: isHovered ? [0, -6, 0] : [0, -10, 0],
              rotateZ: isHovered ? [0, 1.5, -1.5, 0] : [0, 2.5, -2.5, 0],
            }}
            transition={{
              duration: isHovered ? 2.5 : 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 w-full h-full flex items-center justify-center p-6 sm:p-10"
          >
            <img
              src={imageSrc || resolveImageUrl('/images/awards/four-as-gold-2024-nobg.png')}
              alt={bodyName}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                const fallback = resolveImageUrl('/images/awards/four-as-gold-2024-nobg.png')
                if (target.src !== fallback) {
                  target.src = fallback
                }
              }}
              className="max-h-[56%] max-w-[56%] object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_24px_40px_rgba(0,0,0,0.7)] transition-all duration-500"
            />
          </motion.div>
        </div>

        {/* ── AWARD BODY TITLE ── */}
        <h3
          className="font-serif font-bold text-white text-2xl sm:text-3xl tracking-tight mb-4 group-hover:text-white transition-colors"
          style={{ transform: 'translateZ(25px)' }}
        >
          {bodyName}
        </h3>

        {/* ── WIN SUMMARY LINES (LATEST 4 AT FIRST GLANCE WITH EXPANDER) ── */}
        {(() => {
          const sortedWins = [...winsList].sort((a, b) => (b.year || 0) - (a.year || 0))
          const initialWins = sortedWins.slice(0, INITIAL_LIMIT)
          const remainingWins = sortedWins.slice(INITIAL_LIMIT)

          const renderWinItem = (win: typeof winsList[0], idx: number) => {
            const yearStr = win.year ? `${win.year}.` : ''
            const catStr = (win.category || win.tier) ? `${win.category || win.tier}.` : ''

            let brand = ''
            if (win.client_name && win.client_name.trim()) {
              brand = win.client_name.split(/\s*\(/)[0].trim()
              if (brand.includes(',')) {
                brand = brand.split(',')[0].trim()
              }
            }

            const campaign = (win.campaign_name || '').replace(/^['"]|['"]$/g, '').trim()
            const brandCampaign = brand && campaign ? `${brand} - ${campaign}` : (brand || campaign)

            return (
              <p key={idx} className="hover:text-white transition-colors duration-200 font-sans tracking-tight">
                <span className="font-semibold text-white">
                  {yearStr} {catStr}
                </span>{' '}
                <span>{brandCampaign}</span>
              </p>
            )
          }

          return (
            <div
              className="space-y-2.5 text-center text-white/70 font-sans text-sm sm:text-base leading-relaxed max-w-md w-full"
              style={{ transform: 'translateZ(20px)' }}
            >
              {initialWins.map((win, idx) => renderWinItem(win, idx))}

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    key="expanded-wins"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-2.5 overflow-hidden pt-2.5"
                  >
                    {remainingWins.map((win, idx) => renderWinItem(win, INITIAL_LIMIT + idx))}
                  </motion.div>
                )}
              </AnimatePresence>

              {remainingWins.length > 0 && (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpanded(!expanded)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-brand-pink text-white/90 hover:text-white border border-white/20 hover:border-brand-pink transition-all duration-300 shadow-sm cursor-pointer group/btn"
                  >
                    <span>{expanded ? 'Show less' : 'See more'}</span>
                    <motion.svg
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-3.5 h-3.5 text-white/70 group-hover/btn:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                </div>
              )}
            </div>
          )
        })()}
      </motion.div>
    </div>
  )
}
