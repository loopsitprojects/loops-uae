import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { api, Office } from '@/lib/api'
import { offices as fallbackOffices } from '@/data/services'
import LoopsMap from '@/components/ui/LoopsMap'

gsap.registerPlugin(ScrollTrigger)

export default function GlobalOffices() {
  const [activeOffice, setActiveOffice] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [officesList, setOfficesList] = useState<Office[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.offices.list()
      .then(res => {
        if (res && res.data && res.data.length) {
          setOfficesList(res.data)
        } else {
          setOfficesList(fallbackOffices as any[])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load offices in GlobalOffices:', err)
        setOfficesList(fallbackOffices as any[])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (loading || !officesList.length) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          gsap.from('.office-card', {
            y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
            clearProps: 'transform,opacity',
          })
          gsap.from('.office-map', {
            y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4,
            clearProps: 'transform,opacity',
          })
        },
        once: true,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [loading, officesList])

  if (loading || !officesList.length) {
    return (
      <section className="bg-brand-dark py-24 flex items-center justify-center">
        <div className="text-white/40 label animate-pulse">Loading Global Offices...</div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="bg-brand-dark pt-16 pb-10 md:py-28 overflow-hidden relative">
      {/* Top section: copy + office detail card */}
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-20 2xl:px-28 mb-6 md:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 items-center">

          {/* Left — copy */}
          <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-7">
            <p className="text-white font-display font-bold text-xl md:text-2xl tracking-tight mb-4">Global Presence</p>
            <h2 className="heading-xl fluid-xl text-white mb-6">
              {"Sri\u00a0Lankan roots."}<br />
              <span className="gradient-text">Global reach.</span>
            </h2>
            <p className="text-white/50 fluid-sm leading-relaxed mb-10 max-w-2xl">
              What started as a bold idea in Colombo has now grown into an international creative-led agency.
              With offices across Asia, the Middle East, and Oceania, we combine local market expertise with a global perspective.
            </p>

            {/* Office tabs */}
            <div className="flex flex-wrap gap-2.5">
              {officesList.map((office, i) => {
                const isActive = activeOffice === i
                const label = office.city || office.country || office.role || `Office ${i + 1}`
                return (
                  <button
                    key={office.id || office.city || i}
                    onClick={() => setActiveOffice(i)}
                    className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-white text-black border-white shadow-xl shadow-white/15 scale-[1.03]'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white hover:border-white/40'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-transform duration-300 ${
                        isActive ? 'bg-brand-pink scale-125 shadow-[0_0_8px_rgba(232,0,90,0.9)]' : 'bg-white/70'
                      }`}
                    />
                    <span className={isActive ? 'text-black' : 'text-white'}>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right — Active Office Details Card Showcase */}
          <div className="relative lg:col-span-5 xl:col-span-5 2xl:col-span-5 w-full">
            <AnimatePresence mode="wait">
              {officesList[activeOffice] && (
                <motion.div
                  key={officesList[activeOffice].id || officesList[activeOffice].city || activeOffice}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="office-card p-8 rounded-3xl bg-white/5 border border-white/12 backdrop-blur-xl shadow-2xl relative overflow-hidden w-full"
                >
                  {/* Subtle accent glow gradient */}
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none opacity-20 filter blur-3xl"
                    style={{
                      background: activeOffice % 2 === 0 ? '#E8005A' : '#7B2FBE',
                    }}
                  />

                  <div className="relative z-10">
                    {/* Header / City + Badge + Counter */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {Boolean(officesList[activeOffice].city?.trim()) && (
                            <h3 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                              {officesList[activeOffice].city}
                            </h3>
                          )}
                          {Boolean(officesList[activeOffice].country?.trim()) && (
                            <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/15">
                              {officesList[activeOffice].country}
                            </span>
                          )}
                          {officesList[activeOffice].is_headquarters && (
                            <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/25 text-pink-200 border border-pink-400/50 font-bold shadow-sm">
                              HQ
                            </span>
                          )}
                        </div>
                        {Boolean(officesList[activeOffice].role?.trim()) && officesList[activeOffice].role.toLowerCase() !== 'headquarters' && (
                          <p className="text-pink-300 font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider mt-2.5 flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 shadow-[0_0_6px_rgba(244,114,182,0.8)]" />
                            {officesList[activeOffice].role}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 font-mono text-white/40 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                        <span>{String(activeOffice + 1).padStart(2, '0')} / {String(officesList.length).padStart(2, '0')}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {Boolean(officesList[activeOffice].description?.trim()) && (
                      <p className="text-white/70 text-sm leading-relaxed mb-6">
                        {officesList[activeOffice].description}
                      </p>
                    )}

                    {/* Contact Details */}
                    {(Boolean(officesList[activeOffice].phone?.trim()) || Boolean(officesList[activeOffice].email?.trim())) && (
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-sans">
                        {Boolean(officesList[activeOffice].phone?.trim()) && (
                          <a
                            href={`tel:${officesList[activeOffice].phone}`}
                            className="inline-flex items-center gap-2.5 text-white/90 hover:text-brand-pink transition-colors px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 group w-max max-w-full"
                          >
                            <svg className="w-4 h-4 text-brand-pink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-medium whitespace-nowrap text-white/90 tracking-normal">{officesList[activeOffice].phone}</span>
                          </a>
                        )}

                        {Boolean(officesList[activeOffice].email?.trim()) && (
                          <a
                            href={`mailto:${officesList[activeOffice].email}`}
                            className="inline-flex items-center gap-2.5 text-white/90 hover:text-brand-pink transition-colors px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 group w-max max-w-full"
                          >
                            <svg className="w-4 h-4 text-brand-pink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium whitespace-nowrap text-white/90 tracking-normal">{officesList[activeOffice].email}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Address */}
                    {Boolean(officesList[activeOffice].address?.trim()) && (
                      <div className="mt-5 pt-5 border-t border-white/10 flex items-start gap-3 text-sm text-white/80">
                        <svg className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="leading-relaxed font-medium text-white/80 break-words">{officesList[activeOffice].address}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Bottom: interactive world map (Full-bleed edge-to-edge, Desktop only) ── */}
      <div className="office-map w-full hidden md:block my-2">
        <LoopsMap
          height={460}
          activeIndex={activeOffice}
          onOfficeClick={setActiveOffice}
          offices={officesList}
        />
      </div>

      {/* Map caption (Desktop only) */}
      <div className="w-full max-w-[1920px] mx-auto px-6 hidden md:flex flex-nowrap items-center justify-center gap-2 lg:gap-3 mt-6 overflow-x-auto no-scrollbar">
        {officesList.map((o, i) => {
          const colors = ['#E8005A', '#7B2FBE', '#1B3FB5', '#00B4B4']
          const isActive = activeOffice === i
          const label = o.city || o.country || o.role || `Office ${i + 1}`
          return (
            <button
              key={o.id || o.city || i}
              onClick={() => setActiveOffice(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer border whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white/15 text-white font-bold scale-105 border-white/30 shadow-lg'
                  : 'bg-white/5 text-white/90 hover:text-white hover:bg-white/15 hover:border-white/20 border-white/10'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full shrink-0 transition-transform ${
                  isActive ? 'scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''
                }`}
                style={{ background: colors[i % colors.length] }}
              />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
