import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ParticleField from '@/components/ui/ParticleField'
import GlobalOffices from '@/components/sections/home/GlobalOffices'
import GutAwardDisplay, { AwardGroup, getCleanAwardImage } from '@/components/ui/GutAwardDisplay'
import { api, Award } from '@/lib/api'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const pageRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [awardGroups, setAwardGroups] = useState<AwardGroup[]>([])
  const [awardsLoading, setAwardsLoading] = useState(true)

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (awardsLoading || isPaused || !awardGroups.length || !scrollRef.current) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: 420, behavior: 'smooth' })
        }
      }
    }, 3600)

    return () => clearInterval(interval)
  }, [awardsLoading, isPaused, awardGroups.length])

  const [hero, setHero] = useState({
    label: 'Who We Are',
    headline: 'A creative-led agency for ambitious brands.',
    description: "We're a collective of strategists, designers, technologists, and storytellers building brand momentum for companies across Sri\u00a0Lanka and beyond.",
  })

  const [statement, setStatement] = useState({
    label: 'Our Philosophy',
    text: "We believe bold ideas, backed by sharp strategy, are what move people - and move business. Every discipline under one roof, working as one integrated team.",
  })

  const [recognition, setRecognition] = useState({
    label: 'Industry Recognition',
    headline_line1: 'Work that wins',
    headline_highlight: 'awards.',
  })

  const [cta, setCta] = useState({
    label: 'Next Step',
    headline: 'Ready to create something great together?',
    button_label: "Let's Talk",
    button_link: '/contact',
  })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    api.pages.get('about')
      .then(res => {
        if (res && res.data) {
          const d = res.data
          if (d.hero) {
            setHero({
              label: d.hero.label || 'Who We Are',
              headline: d.hero.headline || hero.headline,
              description: d.hero.description || hero.description,
            })
          }
          if (d.statement) {
            setStatement({
              label: d.statement.label || 'Our Philosophy',
              text: d.statement.text || statement.text,
            })
          }
          if (d.recognition) {
            setRecognition({
              label: d.recognition.label || 'Industry Recognition',
              headline_line1: d.recognition.headline_line1 || 'Work that wins',
              headline_highlight: d.recognition.headline_highlight || 'awards.',
            })
          }
          if (d.cta) {
            setCta({
              label: d.cta.label || 'Next Step',
              headline: d.cta.headline || 'Ready to create something great together?',
              button_label: d.cta.button_label || "Let's Talk",
              button_link: d.cta.button_link || '/contact',
            })
          }
        }
      })
      .catch(() => {})

    api.awards.list()
      .then(res => {
        if (res && res.data && res.data.length) {
          const items: Award[] = res.data
          const groupsMap: Record<string, AwardGroup> = {}

          items.forEach(a => {
            const bodyName = a.award_body || 'Advertising Award'
            if (!groupsMap[bodyName]) {
              const rawBg = (a as any).background_url || a.background_path
              const imageSrc = getCleanAwardImage(bodyName, a.tier, rawBg)

              groupsMap[bodyName] = {
                body: bodyName,
                trophyImg: imageSrc,
                wins: [],
              }
            }

            groupsMap[bodyName].wins.push({
              year: a.year,
              tier: a.tier,
              campaign_name: a.campaign_name,
              client_name: a.client_name,
              category: a.category,
            })
          })

          Object.values(groupsMap).forEach(g => {
            g.wins.sort((x, y) => y.year - x.year)
          })

          setAwardGroups(Object.values(groupsMap))
        }
        setAwardsLoading(false)
      })
      .catch(() => setAwardsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-hero-in > *', {
        y: 60, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.15,
        clearProps: 'transform,opacity',
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const revealProps = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, ease: 'easeOut' },
  } as const

  const formattedStatementText = (statement.text || '').includes('\n')
    ? statement.text
    : (statement.text || '').replace(/(?<=\.)\s+/g, '\n')

  return (
    <div ref={pageRef} className="bg-brand-dark min-h-screen text-white" style={{ backgroundColor: '#0A0A0A', color: '#F5F5F5' }}>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-brand-dark section-padding pt-36 pb-20 overflow-hidden">
        <ParticleField accent="purple" count={250} spread={22} />
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(123,47,190,0.25), transparent)' }}
        />

        <div className="about-hero-in relative z-10 max-w-6xl mx-auto text-center">
          <p className="text-white font-display font-bold text-xl md:text-2xl tracking-tight mb-4">{hero.label}</p>
          <h1 className="heading-hero fluid-xl text-white mb-6 font-display">{hero.headline}</h1>
          <p className="text-white/50 fluid-sm leading-relaxed max-w-5xl mx-auto">{hero.description}</p>
        </div>
      </section>

      {/* ── Offices ──────────────────────────────────────────────────────── */}
      <GlobalOffices />

      {/* ── Industry Recognition / Awards (Full-Bleed GUT Agency Style) ──────── */}
      <section
        className="relative bg-brand-dark text-white pt-10 pb-4 md:pt-16 md:pb-6 border-t border-white/10 overflow-hidden"
        style={{ backgroundColor: '#0A0A0A', color: '#F5F5F5' }}
      >
        <ParticleField accent="purple" count={280} spread={20} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 30% 40%, rgba(255,200,0,0.05), transparent)' }}
        />

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-8 flex items-end justify-between flex-wrap gap-6">
            <div>
              <p className="text-white font-display font-bold text-xl md:text-2xl tracking-tight mb-4">Industry Recognition</p>
              <h2 className="heading-xl fluid-xl text-white font-display">
                {recognition.headline_line1}<br />
                <span className="gradient-text">{recognition.headline_highlight}</span>
              </h2>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleScroll('left')}
                className="w-12 h-12 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 hover:border-white/40 text-white flex items-center justify-center transition-all duration-300 active:scale-95 shadow-xl backdrop-blur-md"
                aria-label="Previous Award"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-12 h-12 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 hover:border-white/40 text-white flex items-center justify-center transition-all duration-300 active:scale-95 shadow-xl backdrop-blur-md"
                aria-label="Next Award"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Full-Bleed Horizontal Display Track (0 Margin from Page Corners) */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="w-full flex gap-6 sm:gap-12 md:gap-16 lg:gap-24 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing items-start justify-start px-6 md:px-12 lg:px-20"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {awardsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[88vw] sm:w-[380px] md:w-[460px] lg:w-[500px] h-[400px] bg-white/5 rounded-3xl animate-pulse flex-shrink-0" />
              ))
            ) : awardGroups.length === 0 ? (
              <p className="text-white/30 label col-span-full text-center py-10">No awards registered yet.</p>
            ) : (
              awardGroups.map((group, i) => (
                <div key={i} className="w-[88vw] sm:w-[380px] md:w-[460px] lg:w-[500px] flex-shrink-0 snap-center">
                  <GutAwardDisplay group={group} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-brand-dark section-padding py-12 md:py-16 text-center border-t border-white/10">
        <p className="text-white font-display font-bold text-xl md:text-2xl tracking-tight mb-4">{cta.label}</p>
        <h2 className="heading-xl fluid-lg text-white mb-8">{cta.headline}</h2>
        <Link to={cta.button_link} className="btn-primary inline-flex">
          {cta.button_label}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>
    </div>
  )
}
