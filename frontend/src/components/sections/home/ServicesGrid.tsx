import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { api, Service } from '@/lib/api'
import { services as fallbackServices } from '@/data/services'

gsap.registerPlugin(ScrollTrigger)

function renderServiceIcon(icon: string) {
  switch (icon) {
    case 'sparkles':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5 5 3Z" opacity="0.6"/>
          <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" opacity="0.6"/>
        </svg>
      )
    case 'chart-bar':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    case 'code-bracket':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      )
    case 'cpu-chip':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <rect x="4" y="4" width="16" height="16" rx="2"/>
          <rect x="9" y="9" width="6" height="6" rx="1"/>
          <path d="M9 1v3"/>
          <path d="M15 1v3"/>
          <path d="M9 20v3"/>
          <path d="M15 20v3"/>
          <path d="M20 9h3"/>
          <path d="M20 15h3"/>
          <path d="M1 9h3"/>
          <path d="M1 15h3"/>
        </svg>
      )
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    default:
      return <span>{icon || '◈'}</span>
  }
}

export default function ServicesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [servicesList, setServicesList] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.services.list()
      .then(res => {
        if (res && res.data && res.data.length) {
          setServicesList(res.data)
        } else {
          setServicesList(fallbackServices as any[])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load services in ServicesGrid:', err)
        setServicesList(fallbackServices as any[])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (loading || !servicesList.length) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          // Header wipe-in
          gsap.fromTo(
            '.sg-header',
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            }
          )

          // Each tile: clip-path reveal from bottom + stagger
          gsap.fromTo(
            '.service-tile',
            { clipPath: 'inset(100% 0 0 0)', y: 30, opacity: 0 },
            {
              clipPath: 'inset(0% 0 0 0)',
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: { amount: 0.6, grid: 'auto', from: 'start' },
              ease: 'power3.out',
              clearProps: 'clipPath,y,opacity',
            }
          )
        },
        once: true,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [loading, servicesList])

  if (loading || !servicesList.length) {
    return (
      <section className="bg-white py-24 flex items-center justify-center">
        <div className="text-brand-dark/40 label animate-pulse">Loading Services Grid...</div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="bg-white section-padding pt-10 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="sg-header flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <p className="text-xl md:text-2xl font-bold text-black tracking-tight mb-4 font-sans">What We Do</p>
            <h2 className="heading-xl fluid-xl text-brand-dark">
              Integrated services<br />
              for brave brands.
            </h2>
          </div>
          <p className="text-brand-dark/50 max-w-sm fluid-sm leading-relaxed">
            Seven disciplines. One team. Zero gaps in your marketing ecosystem.
          </p>
        </div>

        {/* Grid */}
        <div className="tiles-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicesList.map((service, i) => {
            const accentColor = service.accent_color || '#E8005A'
            return (
              <Link
                key={service.slug}
                to={`/${service.slug}`}
                className="service-tile group relative p-8 rounded-2xl bg-brand-dark overflow-hidden min-h-[240px] flex flex-col justify-between"
              >
                {/* Gradient hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(ellipse 100% 100% at 20% 20%, ${accentColor}, transparent 60%)`,
                  }}
                />

                {/* Corner number watermark */}
                <div
                  className="absolute -bottom-3 -right-1 font-display text-white/[0.04] select-none pointer-events-none leading-none"
                  style={{ fontSize: '7rem', fontWeight: 700 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="text-3xl mb-5 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12 inline-block"
                    style={{ color: accentColor }}
                  >
                    {renderServiceIcon(service.icon)}
                  </div>

                  <h3 className="font-display font-semibold text-white text-2xl mb-3 tracking-tight">
                    {service.slug === 'events' || service.title === 'Events' ? 'Events & Experiences' : service.title}
                  </h3>

                  <p className="text-white/35 text-sm leading-relaxed">
                    {service.subheadline}
                  </p>
                </div>

                {/* Bottom arrow */}
                <div className="relative z-10 mt-6 flex items-center gap-2 label text-white/70 group-hover:text-white transition-all duration-300">
                  <span>Explore</span>
                  <svg
                    className="w-3.5 h-3.5 -translate-x-1 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

                {/* Accent line that slides in on hover */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
