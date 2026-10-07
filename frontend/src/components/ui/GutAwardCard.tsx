import { useState, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import { Award, resolveImageUrl } from '@/lib/api'

interface GutAwardCardProps {
  award: Award
  className?: string
}

export default function GutAwardCard({ award, className = '' }: GutAwardCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 })

  // Spring physics for buttery-smooth 3D tilt
  const springConfig = { stiffness: 220, damping: 20 }
  const rotX = useSpring(0, springConfig)
  const rotY = useSpring(0, springConfig)
  const trophyX = useSpring(0, springConfig)
  const trophyY = useSpring(0, springConfig)

  const isGold = award.tier?.toLowerCase().includes('gold')
  const isBronze = award.tier?.toLowerCase().includes('bronze')
  const isSilver = award.tier?.toLowerCase().includes('silver')

  // Resolve high quality transparent trophy image with intelligent fallback mapping
  const rawBg = (award as any).background_url || award.background_path
  let imageSrc = resolveImageUrl(rawBg)

  if (!imageSrc || imageSrc.includes('default.jpg') || imageSrc.includes('placeholder')) {
    const bodyLower = (award.award_body || '').toLowerCase()
    if (bodyLower.includes('slim')) {
      imageSrc = '/images/awards/slim-digis-2021-nobg.png'
    } else if (bodyLower.includes('dragon') && isBronze) {
      imageSrc = '/images/awards/dragons-of-asia-blue-2025-nobg.png'
    } else if (bodyLower.includes('effie')) {
      imageSrc = '/images/awards/effie-awards-2016-clean.png'
    } else if (bodyLower.includes('dragon')) {
      imageSrc = '/images/awards/dragons-of-asia-gold-2025-nobg.png'
    } else {
      imageSrc = '/images/awards/four-as-gold-2024-clean.png'
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const relativeY = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate mouse percentage for gradient lighting
    const posX = (relativeX / rect.width) * 100
    const posY = (relativeY / rect.height) * 100
    setLightPos({ x: posX, y: posY })

    // Calculate 3D tilt angles (max ~14 degrees)
    const tiltX = -((relativeY - centerY) / centerY) * 12
    const tiltY = ((relativeX - centerX) / centerX) * 12
    rotX.set(tiltX)
    rotY.set(tiltY)

    // Parallax displacement for trophy (moves further in 3D space)
    trophyX.set(((relativeX - centerX) / centerX) * 16)
    trophyY.set(((relativeY - centerY) / centerY) * 16)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotX.set(0)
    rotY.set(0)
    trophyX.set(0)
    trophyY.set(0)
  }

  // Badge styling configuration
  const getBadgeStyle = () => {
    if (isGold) {
      return {
        bg: 'rgba(234, 179, 8, 0.12)',
        border: 'rgba(234, 179, 8, 0.4)',
        color: '#EAB308',
        shadow: '0 0 12px rgba(234, 179, 8, 0.25)',
      }
    }
    if (isBronze) {
      return {
        bg: 'rgba(217, 119, 6, 0.12)',
        border: 'rgba(217, 119, 6, 0.4)',
        color: '#F59E0B',
        shadow: '0 0 12px rgba(217, 119, 6, 0.2)',
      }
    }
    if (isSilver) {
      return {
        bg: 'rgba(203, 213, 225, 0.12)',
        border: 'rgba(203, 213, 225, 0.4)',
        color: '#E2E8F0',
        shadow: '0 0 12px rgba(203, 213, 225, 0.2)',
      }
    }
    return {
      bg: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.25)',
      color: '#CBD5E1',
      shadow: 'none',
    }
  }

  const badgeStyle = getBadgeStyle()

  return (
    <div className={`perspective-[1200px] select-none ${className}`}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.025 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="group relative w-full rounded-3xl bg-[#0D0D0F] border border-white/12 hover:border-white/30 transition-colors duration-500 overflow-hidden shadow-2xl cursor-pointer flex flex-col justify-between"
      >
        {/* Dynamic Border Glow spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl z-30"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(500px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, 0.15), transparent 70%)`,
          }}
        />

        {/* ── TOP CONTAINER: Studio Pure White Display Box ─────────────── */}
        <div
          className="relative h-60 sm:h-64 md:h-68 bg-white rounded-t-[1.4rem] sm:rounded-t-[1.7rem] flex items-center justify-center p-6 overflow-hidden"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Interactive Light Sheen & Glare Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0.2,
              background: `radial-gradient(350px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, 0.8), transparent 65%), linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.5) 50%, transparent 65%)`,
            }}
          />

          {/* Realistic Studio Floor Shadow */}
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 w-2/3 h-5 rounded-full bg-black/20 blur-md pointer-events-none transition-all duration-300 group-hover:scale-110 group-hover:bg-black/30"
            style={{ transform: 'translateZ(10px) translateX(-50%)' }}
          />

          {/* Live Floating & Parallax Pop-Out 3D Trophy Image */}
          <motion.div
            style={{
              x: trophyX,
              y: trophyY,
              transformStyle: 'preserve-3d',
              transform: 'translateZ(55px)',
            }}
            animate={{
              y: isHovered ? [0, -6, 0] : [0, -10, 0],
              rotateZ: isHovered ? [0, 1.2, -1.2, 0] : [0, 2, -2, 0],
            }}
            transition={{
              duration: isHovered ? 2.5 : 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 w-full h-full flex items-center justify-center"
          >
            <img
              src={imageSrc}
              alt={`${award.award_body} - ${award.campaign_name}`}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] group-hover:drop-shadow-[0_20px_35px_rgba(0,0,0,0.28)] transition-all duration-500"
            />
          </motion.div>
        </div>

        {/* ── BOTTOM CONTAINER: Dark Card Content Info ─────────────────── */}
        <div
          className="p-6 md:p-7 text-left flex flex-col justify-between flex-1 bg-[#0D0D0F]"
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Top meta row: Pill Badge + Year */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase border transition-all duration-300"
              style={{
                backgroundColor: badgeStyle.bg,
                borderColor: badgeStyle.border,
                color: badgeStyle.color,
                boxShadow: badgeStyle.shadow,
              }}
            >
              {award.tier}
            </span>
            <span className="text-xs text-white/40 font-mono tracking-wider">{award.year}</span>
          </div>

          {/* Title & Organization Details */}
          <div>
            <h3 className="font-display font-bold text-white text-lg md:text-xl leading-snug mb-1 group-hover:text-white transition-colors duration-300">
              {award.campaign_name}
            </h3>
            <p className="label text-white/60 text-xs md:text-sm font-medium tracking-wide mb-3">{award.award_body}</p>

            {/* GUT Agency Format Win Summary Line: "2025, Gold Award, Campaign Name, Client Name" */}
            <p className="text-white/60 text-xs md:text-sm font-sans leading-relaxed pt-2.5 border-t border-white/10 tracking-tight">
              <span className="text-white/90 font-medium">{award.year}, {award.tier} Award</span>
              {award.campaign_name ? `, ${award.campaign_name}` : ''}
              {award.client_name && award.client_name.trim() ? `, ${award.client_name}` : ''}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
