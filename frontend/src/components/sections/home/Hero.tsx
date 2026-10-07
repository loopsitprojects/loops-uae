import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { resolveImageUrl } from '@/lib/api'

const MOBILE_VIDEO_URL = 'https://ai.loopsintegrated.co/loopsvideos/Webshowreel2.1vert.mp4'
const DESKTOP_VIDEO_URL = 'https://ai.loopsintegrated.co/loopsvideos/Showreel/Dubaisw.mp4'

const isMobileViewport = () => window.innerWidth < 768

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(isMobileViewport())
  const [videoReady, setVideoReady] = useState(false)

  // Handle video setup and autoplay on load (always muted)
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    vid.muted = true
    // @ts-ignore
    vid.defaultMuted = true
    vid.volume = 0
    vid.setAttribute('muted', '')
    vid.setAttribute('playsinline', '')
    vid.setAttribute('webkit-playsinline', 'true')
    vid.setAttribute('x5-playsinline', 'true')

    // Pick the video source in JS rather than relying on <source media="">
    let currentIsMobile = isMobileViewport()
    setIsMobile(currentIsMobile)
    vid.src = currentIsMobile ? MOBILE_VIDEO_URL : DESKTOP_VIDEO_URL
    vid.load()

    const playVideo = () => {
      if (!videoRef.current) return
      videoRef.current.muted = true
      // @ts-ignore
      videoRef.current.defaultMuted = true
      videoRef.current.play()
        .then(() => {
          if (videoRef.current && (videoRef.current.currentTime > 0.05 || videoRef.current.readyState >= 2)) {
            setVideoReady(true)
          }
        })
        .catch(() => {})
    }

    playVideo()

    // iOS Safari / Low Power Mode user gesture unlock listener
    const unlockAutoplay = () => {
      playVideo()
    }

    window.addEventListener('touchstart', unlockAutoplay, { passive: true })
    window.addEventListener('touchmove', unlockAutoplay, { passive: true })
    window.addEventListener('touchend', unlockAutoplay, { passive: true })
    window.addEventListener('scroll', unlockAutoplay, { passive: true })
    window.addEventListener('click', unlockAutoplay, { passive: true })

    // Swap the source on window resize if the viewport crosses the mobile/desktop breakpoint
    const handleResize = () => {
      const isMobileNow = isMobileViewport()
      setIsMobile(isMobileNow)
      if (isMobileNow !== currentIsMobile && videoRef.current) {
        currentIsMobile = isMobileNow
        setVideoReady(false)
        videoRef.current.src = isMobileNow ? MOBILE_VIDEO_URL : DESKTOP_VIDEO_URL
        videoRef.current.load()
        videoRef.current.muted = true
        videoRef.current.play().catch(() => {})
      }
    }
    window.addEventListener('resize', handleResize)

    // Entrance animation — runs once on mount
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline()

        // Fade in the video overlay slightly
        tl.from('.hero-vignette', {
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        }, 0)

        // CTAs entrance
        tl.from('.hero-cta', {
          y: 40,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          clearProps: 'transform,opacity,scale',
        }, 0.3)

        // Scroll cue
        tl.from('.hero-scroll-cue', {
          opacity: 0,
          y: -10,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }, 1.0)

        // Floating scroll indicator
        gsap.to('.hero-scroll-line', {
          y: 14,
          duration: 1.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }, sectionRef)

      return () => ctx.revert()
    }, 300)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('touchstart', unlockAutoplay)
      window.removeEventListener('touchmove', unlockAutoplay)
      window.removeEventListener('touchend', unlockAutoplay)
      window.removeEventListener('scroll', unlockAutoplay)
      window.removeEventListener('click', unlockAutoplay)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const markVideoReady = () => {
    if (videoRef.current && (videoRef.current.currentTime > 0.05 || videoRef.current.readyState >= 2)) {
      setVideoReady(true)
    }
  }

  const handleHeroClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().then(() => setVideoReady(true)).catch(() => {})
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white cursor-pointer"
      style={{ height: '100dvh', minHeight: 560 }}
      onClick={handleHeroClick}
      onTouchStart={handleHeroClick}
    >
      {/* ── Hero Thumbnail & Loading Placeholder (Desktop & Mobile) ─────────── */}
      <div
        className={`absolute inset-0 z-20 bg-white flex flex-col items-center justify-center transition-opacity duration-700 ease-out pointer-events-none ${
          videoReady ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img
          src={resolveImageUrl('/images/logo-dark-text.png')}
          alt="LOOPS INTEGRATED"
          className="w-64 sm:w-80 md:w-[420px] max-w-[80vw] h-auto object-contain select-none"
        />
      </div>

      {/* ── Full-screen Background Video ─────────────────────────── */}
      <video
        ref={videoRef}
        className={`bg-video absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: 'scale(1.03)',
          transition: 'transform 8s ease-out, opacity 0.7s ease-out',
        }}
        autoPlay
        muted
        loop
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        // @ts-ignore
        x5-playsinline="true"
        preload="auto"
        onPlaying={markVideoReady}
        onCanPlayThrough={markVideoReady}
        onTimeUpdate={() => {
          if (videoRef.current && videoRef.current.currentTime > 0.05) {
            setVideoReady(true)
          }
        }}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0
            videoRef.current.play().catch(() => {})
          }
        }}
      />

      {/* ── Top Shader Overlay (Header Scrim) ────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-44 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.1) 80%, transparent 100%)',
        }}
      />

      {/* ── Cinematic Overlays ────────────────────────────────────── */}
      <div
        ref={overlayRef}
        className="hero-vignette absolute inset-0 pointer-events-none z-[6]"
        style={{
          background: `
            linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 30%, transparent 55%)
          `,
        }}
      />

      {/* Subtle film grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Content (Bottom-Centered Buttons near browser bottom edge) ─────── */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full px-6 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:pb-8">
        {/* Buttons Container (Bottom Centered) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-md sm:max-w-none">
          <Link
            to="/work"
            className="hero-cta group inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-9 sm:py-5 lg:px-8 lg:py-4 border border-transparent bg-white text-brand-dark font-display font-semibold text-base sm:text-lg lg:text-base tracking-tight rounded-full transition-all duration-400 hover:bg-brand-pink hover:text-white hover:scale-105 hover:shadow-[0_0_50px_rgba(232,0,90,0.4)] text-center w-full sm:w-auto"
          >
            See the Work
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            to="/contact"
            className="hero-cta group inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-9 sm:py-5 lg:px-8 lg:py-4 border border-white/40 text-white font-display font-semibold text-base sm:text-lg lg:text-base tracking-tight rounded-full transition-all duration-400 hover:border-white hover:bg-white/15 hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] backdrop-blur-md text-center w-full sm:w-auto"
          >
            Explore Integrated Services
          </Link>
        </div>

        {/* ── Scroll Indicator (Lowered directly below buttons) ────────────── */}
        <div className="hero-scroll-cue hidden md:flex flex-col items-center gap-1.5 mt-3 sm:mt-4 pointer-events-none">
          <span
            className="text-white/40 tracking-[0.25em] uppercase"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem' }}
          >
            Scroll
          </span>
          <div className="relative w-px h-7 overflow-hidden">
            <div
              className="hero-scroll-line absolute top-0 left-0 w-full h-3.5 bg-gradient-to-b from-white/60 to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
