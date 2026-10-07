import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  // Entrance animation — runs once on mount
  useEffect(() => {
    // Delay to ensure the site-wide loading animation has completed
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

    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: '100vh', minHeight: 600 }}
    >
      {/* ── Full-screen Background Video ─────────────────────────── */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: 'scale(1.03)',
          transition: 'transform 8s ease-out',
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
      >
        <source src="https://ai.loopsintegrated.co/loopsvideos/WebsiteShowreel.mp4" type="video/mp4" />
      </video>

      {/* ── Cinematic Overlays ────────────────────────────────────── */}
      <div
        ref={overlayRef}
        className="hero-vignette absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%),
            linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)
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

      {/* ── Content (Buttons positioned in lower section) ───────────── */}
      <div className="relative z-10 flex items-end justify-center h-full px-6 pb-24 sm:pb-28 md:pb-32">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md sm:max-w-none">
          <Link
            to="/work"
            className="hero-cta group inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-9 sm:py-4.5 bg-white text-brand-dark font-display font-semibold text-sm sm:text-base tracking-tight rounded-full transition-all duration-400 hover:bg-brand-pink hover:text-white hover:scale-105 hover:shadow-[0_0_50px_rgba(232,0,90,0.4)] text-center w-full sm:w-auto"
          >
            See the Work
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            to="/contact"
            className="hero-cta group inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-9 sm:py-4.5 border border-white/40 text-white font-display font-semibold text-sm sm:text-base tracking-tight rounded-full transition-all duration-400 hover:border-white hover:bg-white/15 hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] backdrop-blur-md text-center w-full sm:w-auto"
          >
            Explore Integrated Services
          </Link>
        </div>
      </div>

      {/* ── Scroll Indicator ─────────────────────────────────────── */}
      <div className="hero-scroll-cue hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 z-10 pointer-events-none">
        <span
          className="text-white/40 tracking-[0.25em] uppercase"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem' }}
        >
          Scroll
        </span>
        <div className="relative w-px h-12 overflow-hidden">
          <div
            className="hero-scroll-line absolute top-0 left-0 w-full h-5 bg-gradient-to-b from-white/60 to-transparent"
          />
        </div>
      </div>
    </section>
  )
}
