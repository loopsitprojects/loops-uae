import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { api, PortfolioItem, resolveImageUrl } from '@/lib/api'

gsap.registerPlugin(ScrollTrigger)

function CampaignVideoSection({
  videos,
  insight,
  color,
  posterImage,
}: {
  videos: { title: string; url: string; player_type?: 'landscape' | 'portrait' }[]
  insight?: string
  color?: string
  posterImage?: string
}) {
  const [activeIdx, setActiveIdx] = useState(0)

  if (!videos || videos.length === 0) return null

  const currentVideo = videos[activeIdx] || videos[0]
  const currentUrl = currentVideo.url.startsWith('http://')
    ? currentVideo.url.replace('http://', 'https://')
    : currentVideo.url
  const isPortrait = currentVideo.player_type === 'portrait'

  const getYouTubeId = (url: string) => {
    if (!url) return ''
    if (url.includes('youtu.be')) {
      return url.split('/').pop()?.split('?')[0] || ''
    }
    try {
      const parsed = new URL(url)
      return parsed.searchParams.get('v') || url.split('/').pop()?.split('?')[0] || ''
    } catch {
      return ''
    }
  }

  const getVideoThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const ytId = getYouTubeId(url)
      if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    }
    return posterImage || ''
  }

  const renderPlayer = (url: string, title: string, portrait: boolean = false) => {
    const aspectClass = portrait ? 'aspect-[9/16]' : 'aspect-[16/9]'

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = getYouTubeId(url)
      return (
        <iframe
          className={`w-full h-full ${aspectClass} rounded-2xl`}
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0]
      return (
        <iframe
          className={`w-full h-full ${aspectClass} rounded-2xl`}
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    }
    return (
      <video
        key={url}
        className={`w-full h-full ${portrait ? 'object-contain bg-black' : 'object-cover'} rounded-2xl`}
        src={url}
        controls
        autoPlay
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        playsInline
        preload="metadata"
        poster={posterImage}
      />
    )
  }

  const hasMultiple = videos.length > 1

  return (
    <section className="bg-brand-dark section-padding py-16 border-t border-b border-white/10">
      <div className="max-w-6xl mx-auto space-y-10">
        {insight && (
          <div className="pb-2 text-left w-full cs-reveal">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: color || '#E8005A' }} />
              <p className="label text-slate-400 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">THE INSIGHT</p>
            </div>
            <blockquote className="text-white/90 text-base md:text-lg lg:text-xl font-normal leading-relaxed tracking-tight w-full max-w-full whitespace-normal break-words">
              "{insight}"
            </blockquote>
          </div>
        )}

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 cs-reveal">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: color || '#E8005A' }} />
              <p className="label text-slate-400 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
                {hasMultiple ? 'CAMPAIGN VIDEOS' : 'CAMPAIGN VIDEO'}
              </p>
            </div>

            {hasMultiple && (
              <span className="text-white/40 text-xs font-mono">
                Video <strong className="text-white">{activeIdx + 1}</strong> of {videos.length}
              </span>
            )}
          </div>

          {/* Main Layout Container */}
          <div className={`flex flex-col lg:flex-row ${isPortrait ? 'items-center lg:items-start justify-center' : 'items-start'} gap-6 sm:gap-8 w-full`}>
            {/* Main Video Preview Player */}
            <div className={`w-full ${isPortrait ? 'max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] mx-auto' : 'flex-1 min-w-0'}`}>
              <div className={`cs-reveal relative rounded-3xl overflow-hidden bg-black/95 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${isPortrait ? 'aspect-[9/16]' : 'aspect-[16/9]'} w-full transition-all duration-500`}>
                {renderPlayer(currentUrl, currentVideo.title, isPortrait)}
              </div>
            </div>

            {/* Right Side Video Gallery (Thumbnails Only) */}
            {hasMultiple && (
              <div className="flex flex-row lg:flex-col gap-3.5 shrink-0 cs-reveal overflow-x-auto lg:overflow-y-auto max-w-full lg:max-h-[520px] p-1 custom-scrollbar">
                {videos.map((vid, idx) => {
                  const isActive = idx === activeIdx
                  const vidIsPortrait = vid.player_type === 'portrait'
                  const thumbUrl = getVideoThumbnail(vid.url)
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      aria-label={vid.title || `Video ${idx + 1}`}
                      className={`group relative ${vidIsPortrait ? 'w-20 sm:w-24 aspect-[9/16]' : 'w-28 sm:w-36 aspect-[16/9]'} shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'scale-105 shadow-[0_0_20px_rgba(232,0,90,0.4)] z-10'
                          : 'opacity-50 hover:opacity-100 hover:scale-102 border-white/10'
                      }`}
                      style={{
                        borderColor: isActive ? (color || '#E8005A') : 'transparent',
                      }}
                    >
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={vid.title || ''}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      )}

                      {/* Play Icon / Wave Bars Overlay */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                        isActive ? 'bg-black/30' : 'bg-black/45 group-hover:bg-black/20'
                      }`}>
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-transform duration-300 ${
                            isActive ? 'scale-110 shadow-lg' : 'group-hover:scale-110'
                          }`}
                          style={{ background: isActive ? (color || '#E8005A') : 'rgba(0,0,0,0.65)' }}
                        >
                          {isActive ? (
                            /* Equalizer Wave Bars Animation */
                            <div className="flex items-end justify-center gap-0.5 h-4 w-4">
                              <motion.span
                                className="w-0.5 bg-white rounded-full"
                                animate={{ height: ['25%', '100%', '40%', '85%', '25%'] }}
                                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                              />
                              <motion.span
                                className="w-0.5 bg-white rounded-full"
                                animate={{ height: ['85%', '30%', '100%', '50%', '85%'] }}
                                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                              />
                              <motion.span
                                className="w-0.5 bg-white rounded-full"
                                animate={{ height: ['40%', '90%', '20%', '100%', '40%'] }}
                                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                              />
                              <motion.span
                                className="w-0.5 bg-white rounded-full"
                                animate={{ height: ['95%', '35%', '75%', '25%', '95%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                              />
                            </div>
                          ) : (
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function CampaignGallery({ gallery, color, title, tags, showGallery = true }: { gallery: { url: string; thumb?: string; alt?: string }[]; color?: string; title: string; tags: string[]; showGallery?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (gallery.length <= 1 || isPaused) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % gallery.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [gallery.length, isPaused])

  if (!showGallery || !gallery || gallery.length === 0) return null

  const activeImage = gallery[activeIndex] || gallery[0]

  return (
    <section className="bg-white section-padding py-24 border-t border-brand-dark/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8 cs-reveal">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: color || '#E8005A' }} />
            <p className="label text-slate-500 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">CAMPAIGN GALLERY</p>
          </div>
          {gallery.length > 1 && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="font-bold text-brand-dark">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(gallery.length).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* ── Main Widescreen Featured Preview ─────────────────── */}
        <div
          className="relative rounded-3xl overflow-hidden bg-brand-dark/5 border border-brand-dark/10 shadow-lg aspect-[16/9] w-full mb-6 group cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.img
            key={activeImage.url}
            src={resolveImageUrl(activeImage.url)}
            alt={activeImage.alt || title}
            initial={{ opacity: 0.3, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full object-cover object-center"
          />

          {/* Navigation Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-black/90 shadow-lg"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((prev) => (prev + 1) % gallery.length)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-black/90 shadow-lg"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* ── Interactive Square Thumbnails ────────────────────── */}
        {gallery.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4">
            {gallery.map((img, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                  }`}
                  style={{ borderColor: isActive ? (color || '#E8005A') : 'transparent' }}
                >
                  <img
                    src={resolveImageUrl(img.thumb || img.url)}
                    alt={img.alt || ''}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.currentTarget
                      if (img.url && target.src !== resolveImageUrl(img.url)) {
                        target.src = resolveImageUrl(img.url)
                      }
                    }}
                  />
                  {isActive && (
                    <span
                      className="absolute inset-0 bg-black/10 border-2 rounded-2xl"
                      style={{ borderColor: color || '#E8005A' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {tags.length > 0 && (
          <div className="cs-reveal mt-12 flex flex-wrap gap-2.5">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{ color: color || '#E8005A', border: `1px solid ${color || '#E8005A'}30`, background: `${color || '#E8005A'}08` }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FormattedTextContent({ text, color }: { text: string; color?: string }) {
  if (!text) return null
  const lines = text
    .split(/[\n•]/)
    .map(line => line.replace(/^[\s•\-*]+/, '').trim())
    .filter(Boolean)

  if (lines.length > 1) {
    return (
      <ul className="cs-reveal space-y-3 my-2">
        {lines.map((line, idx) => (
          <li key={idx} className="flex items-start gap-3.5 text-brand-dark/80 text-base md:text-lg leading-relaxed">
            <span
              className="w-2 h-2 rounded-full shrink-0 mt-2.5"
              style={{ background: color || '#E8005A' }}
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <p className="cs-reveal font-normal text-brand-dark/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
      {text}
    </p>
  )
}

export default function CaseStudy() {
  const { slug }   = useParams<{ slug: string }>()
  const navigate   = useNavigate()
  const pageRef    = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null)

  const [item, setItem]     = useState<PortfolioItem | null>(null)
  const [next, setNext]     = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHeroPlaying, setIsHeroPlaying] = useState(false)

  useEffect(() => {
    // Instant scroll to top on slug change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    if (!slug) return
    api.portfolio.show(slug)
      .then(res => {
        const currentItem = res?.data || null
        if (currentItem) {
          if (currentItem.is_clickable === false) {
            navigate('/work', { replace: true })
            return null
          }
          setItem(currentItem)
        }
        return api.portfolio.list({ per_page: 100 }).then(listRes => ({
          currentItem,
          all: listRes?.data || [],
        }))
      })
      .then(data => {
        if (!data) return
        const { currentItem, all } = data
        if (all.length > 0 && currentItem) {
          // Filter out non-clickable items from Next Project selection
          const clickableAll = all.filter(p => p.is_clickable !== false)
          const currentIndex = clickableAll.findIndex(p => p.slug === currentItem.slug)

          if (clickableAll.length > 1) {
            // Cycle through all projects sequentially across all categories
            const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % clickableAll.length : 0
            setNext(clickableAll[nextIndex])
          } else {
            setNext(null)
          }
        }
      })
      .catch(() => {
        navigate('/work', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [slug, navigate])

  // Mobile & iOS Safari Autoplay unlock listener
  useEffect(() => {
    if (!item?.video_url) return

    const tryPlayHeroVideo = () => {
      if (heroVideoRef.current) {
        heroVideoRef.current.muted = true
        // @ts-ignore
        heroVideoRef.current.defaultMuted = true
        heroVideoRef.current.play()
          .then(() => setIsHeroPlaying(true))
          .catch(() => setIsHeroPlaying(false))
      }
    }

    tryPlayHeroVideo()

    const unlock = () => {
      tryPlayHeroVideo()
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('scroll', unlock)
      window.removeEventListener('click', unlock)
    }

    window.addEventListener('touchstart', unlock, { passive: true })
    window.addEventListener('scroll', unlock, { passive: true })
    window.addEventListener('click', unlock, { passive: true })

    return () => {
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('scroll', unlock)
      window.removeEventListener('click', unlock)
    }
  }, [item?.video_url])

  useEffect(() => {
    if (!item) return
    const ctx = gsap.context(() => {
      gsap.to('.cs-hero-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cs-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.utils.toArray<HTMLElement>('.cs-reveal').forEach(el => {
        gsap.from(el, {
          y: 50, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
          clearProps: 'transform,opacity',
        })
      })
    }, pageRef)
    return () => ctx.revert()
  }, [item])

  if (loading) {
    return (
      <div className="bg-brand-dark min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!item) return null

  const heroImage = resolveImageUrl(item.hero_url || item.thumbnail_url)
  const videoUrl = item.video_url?.startsWith('http://')
    ? item.video_url.replace('http://', 'https://')
    : item.video_url

  const campaignVideos = (item.campaign_videos && item.campaign_videos.length > 0)
    ? item.campaign_videos
    : (item.video_url && item.show_hero_as_campaign_video !== false ? [{ title: 'Main Campaign Video', url: item.video_url }] : [])

  const isPerformanceMarketing = item.categories.some(
    c => c.slug.toLowerCase().includes('performance') || c.name.toLowerCase().includes('performance')
  )

  return (
    <div ref={pageRef}>

      {/* ── 1. Full-screen hero ──────────────────────────── */}
      <section
        className="cs-hero relative h-screen overflow-hidden bg-brand-dark cursor-pointer"
        onClick={() => {
          if (heroVideoRef.current) {
            heroVideoRef.current.muted = true
            heroVideoRef.current.play().then(() => setIsHeroPlaying(true)).catch(() => {})
          }
        }}
      >
        {/* Background Thumbnail Image — always present & visible while video is loading/buffering */}
        <div
          className={`cs-hero-bg absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            videoUrl && isHeroPlaying ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage: heroImage ? `url(${heroImage})` : 'none',
            backgroundColor: item.color || '#0A0A0A',
          }}
        />

        {videoUrl && (
          <video
            ref={(el) => {
              if (el) {
                heroVideoRef.current = el
                el.muted = true
                // @ts-ignore
                el.defaultMuted = true
                el.setAttribute('muted', '')
                el.setAttribute('playsinline', '')
                el.setAttribute('webkit-playsinline', 'true')
                el.setAttribute('x5-playsinline', 'true')
                el.play().then(() => {
                  if (el.currentTime > 0.05) setIsHeroPlaying(true)
                }).catch(() => {})
              }
            }}
            className={`bg-video cs-hero-bg absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-opacity duration-700 ${
              isHeroPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            src={videoUrl}
            poster={heroImage}
            autoPlay
            muted
            // @ts-ignore
            defaultMuted
            loop
            playsInline
            // @ts-ignore
            webkit-playsinline="true"
            // @ts-ignore
            x5-playsinline="true"
            disablePictureInPicture
            // @ts-ignore
            disableRemotePlayback="true"
            preload="auto"
            onPlaying={() => setIsHeroPlaying(true)}
            onCanPlayThrough={() => setIsHeroPlaying(true)}
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime > 0.05) {
                setIsHeroPlaying(true)
              }
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-24 left-0 right-0 section-padding z-20"
        >
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.68rem', letterSpacing: '0.08em' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            ALL WORK
          </Link>
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-end section-padding pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center gap-2 mb-5"
          >
            {item.categories.map(c => (
              <span
                key={c.slug}
                className="label px-3 py-1.5 rounded-full border border-white/15 bg-white/8 text-white/60"
                style={{ fontSize: '0.6rem' }}
              >
                {c.name}
              </span>
            ))}
            {item.show_year && (
              <span
                className="text-white/70 font-mono font-medium"
                style={{ fontSize: '0.72rem' }}
              >
                {item.year}
              </span>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-white/90 font-mono font-bold tracking-[0.18em] mb-2"
            style={{ fontSize: '0.95rem' }}
          >
            {item.client.toUpperCase()}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="font-display font-bold text-white leading-none mb-7"
            style={{ fontSize: 'clamp(3rem, 7vw, 7.5rem)', letterSpacing: '-0.04em' }}
          >
            {item.title}
          </motion.h1>

          {item.result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.75 }}
              className="inline-flex items-start sm:items-center gap-3 px-5 py-3 rounded-2xl max-w-3xl bg-black/80 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            >
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0 mt-1 sm:mt-0"
                style={{ background: item.color || '#E8005A' }}
              />
              <span className="text-white text-xs md:text-sm font-sans font-medium leading-relaxed tracking-wide">
                {item.result}
              </span>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
            <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. Brief ──────────────────────────────────────── */}
      <section className="bg-white section-padding py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-7xl">
          <div className="lg:col-span-3">
            <div className="sticky top-28 space-y-7">
              {item.show_year && (
                <div>
                  <p className="label text-slate-500 font-bold mb-2 tracking-[0.18em]">YEAR</p>
                  <p className="font-display font-semibold text-brand-dark text-lg">{item.year}</p>
                </div>
              )}
              <div>
                <p className="label text-slate-500 font-bold mb-2 tracking-[0.18em]">CLIENT</p>
                <p className="font-display font-bold text-brand-dark text-xl md:text-2xl leading-snug">{item.client}</p>
              </div>
              {item.tags.length > 0 && (
                <div>
                  <p className="label text-slate-500 font-bold mb-2 tracking-[0.18em]">SERVICES</p>
                  <div className="space-y-1.5">
                    {item.tags.map(tag => (
                      <p key={tag} className="text-brand-dark/70 text-sm font-medium">{tag}</p>
                    ))}
                  </div>
                </div>
              )}
              <div className="h-0.5 w-12 rounded-full bg-brand-dark/10" />
            </div>
          </div>

          <div className="lg:col-span-9">
            {isPerformanceMarketing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                {(item.brief || item.background) && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 cs-reveal">
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color || '#E8005A' }} />
                      <p className="label text-slate-500 font-bold text-xs uppercase tracking-[0.18em]">
                        {!item.brief ? 'BACKGROUND' : 'THE BRIEF'}
                      </p>
                    </div>
                    <FormattedTextContent text={(item.brief || item.background) || ''} color={item.color} />
                  </div>
                )}

                {item.result && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 cs-reveal">
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#A855F7' }} />
                      <p className="label text-slate-500 font-bold text-xs uppercase tracking-[0.18em]">THE RESULT</p>
                    </div>
                    <FormattedTextContent text={item.result} color="#A855F7" />
                  </div>
                )}

                {item.objective && (
                  <div className="md:col-span-2 pt-6 border-t border-brand-dark/10">
                    <div className="flex items-center gap-2 mb-3 cs-reveal">
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color || '#E8005A' }} />
                      <p className="label text-slate-500 font-bold text-xs uppercase tracking-[0.18em]">THE OBJECTIVE</p>
                    </div>
                    <FormattedTextContent text={item.objective} color={item.color} />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {(item.brief || item.background) && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 cs-reveal">
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color || '#E8005A' }} />
                      <p className="label text-slate-500 font-bold text-xs uppercase tracking-[0.18em]">THE BRIEF</p>
                    </div>
                    <FormattedTextContent text={(item.brief || item.background) || ''} color={item.color} />
                  </div>
                )}

                {item.objective && (
                  <>
                    <div className="cs-reveal h-px bg-brand-dark/10" />
                    <div>
                      <div className="flex items-center gap-2 mb-3 cs-reveal">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color || '#E8005A' }} />
                        <p className="label text-slate-500 font-bold text-xs uppercase tracking-[0.18em]">THE OBJECTIVE</p>
                      </div>
                      <FormattedTextContent text={item.objective} color={item.color} />
                    </div>
                  </>
                )}

                {item.idea && (
                  <>
                    <div className="cs-reveal h-px bg-brand-dark/10" />
                    <div>
                      <div className="flex items-center gap-2 mb-3 cs-reveal">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color || '#E8005A' }} />
                        <p className="label text-slate-500 font-bold text-xs uppercase tracking-[0.18em]">THE IDEA</p>
                      </div>
                      <FormattedTextContent text={item.idea} color={item.color} />
                    </div>
                  </>
                )}

                {item.result && (
                  <>
                    <div className="cs-reveal h-px bg-brand-dark/10" />
                    <div>
                      <div className="flex items-center gap-2 mb-3 cs-reveal">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color || '#E8005A' }} />
                        <p className="label text-slate-500 font-bold text-xs uppercase tracking-[0.18em]">THE RESULT</p>
                      </div>
                      <FormattedTextContent text={item.result} color={item.color} />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>



      {/* ── 4. Campaign Videos & Insight Section ─────────── */}
      {campaignVideos.length > 0 ? (
        <CampaignVideoSection
          videos={campaignVideos}
          insight={item.insight}
          color={item.color}
          posterImage={heroImage}
        />
      ) : (
        item.insight && (
          <section className="bg-[#0D0D11] border-t border-b border-white/10 section-padding py-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto text-left relative z-10">
              <div className="flex items-center gap-2.5 mb-4 cs-reveal">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: item.color || '#E8005A' }} />
                <p className="label text-slate-400 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">THE INSIGHT</p>
              </div>
              <blockquote className="cs-reveal text-white/90 text-base md:text-lg lg:text-xl font-normal leading-relaxed tracking-tight w-full max-w-full whitespace-normal break-words">
                "{item.insight}"
              </blockquote>
            </div>
          </section>
        )
      )}

      {/* ── 5. Campaign Gallery ─────────────────────────── */}
      <CampaignGallery gallery={item.gallery} color={item.color} title={item.title} tags={item.tags} showGallery={item.show_gallery} />

      {/* ── 6. Results bar ───────────────────────────────── */}
      {item.result && (
        <section className="bg-[#0D0D11] border-t border-b border-white/10 section-padding py-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 max-w-7xl">
            <div className="cs-reveal max-w-3xl border-l-4 pl-6 md:pl-8" style={{ borderColor: item.color || '#E8005A' }}>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: item.color || '#E8005A' }} />
                <p className="label text-white/50 tracking-[0.2em] text-xs uppercase">THE RESULT</p>
              </div>
              <p className="text-white text-lg md:text-xl lg:text-2xl font-normal leading-relaxed tracking-tight">
                {item.result}
              </p>
            </div>
            <div className="flex-1 h-px bg-white/10 hidden lg:block" />
            <Link to="/contact" className="btn-primary flex-shrink-0 cs-reveal">
              Work With Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* ── 7. Next project ──────────────────────────────── */}
      {next && (
        <Link to={`/work/${next.slug}`} className="block group">
          <div className="relative overflow-hidden" style={{ height: '60vh', minHeight: 380 }}>
            <div
              className="absolute inset-0 scale-105 transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: next.thumbnail_url ? `url(${next.thumbnail_url})` : 'none',
                backgroundColor: next.color || '#0A0A0A',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-black/65 transition-colors duration-500 group-hover:bg-black/55" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center section-padding">
              <p className="text-white font-display font-bold text-xl md:text-2xl tracking-tight mb-4">Next Project</p>
              <h3
                className="font-display font-bold text-white leading-none transition-colors duration-300 group-hover:text-brand-pink"
                style={{ fontSize: 'clamp(2.2rem, 6vw, 5.5rem)', letterSpacing: '-0.04em' }}
              >
                {next.title}
              </h3>
              <p className="text-white/45 mt-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                {next.client.toUpperCase()}
              </p>
              <div
                className="mt-7 w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300"
                style={{ borderColor: 'rgba(255,255,255,0.3)' }}
              >
                <svg className="w-5 h-5 text-white transition-colors duration-300 group-hover:text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
