import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { api, resolveImageUrl, PortfolioItem } from '@/lib/api'

gsap.registerPlugin(ScrollTrigger)

const CAPABILITY_DESCRIPTIONS: Record<string, string> = {
  'Brand Activations': 'Multi-sensory experiences that embed your brand into memory. From pop-up installations to city-wide takeovers, we design moments that move people.',
  'Product Launches': 'First impressions are permanent. We orchestrate product launches that generate earned media, social currency, and genuine consumer excitement.',
  'Corporate Events': 'Internal alignment, external credibility. From annual galas to leadership summits, we bring the same creative rigour to B2B that we apply to consumer campaigns.',
  'Experiential Campaigns': 'Campaigns that live beyond screens. We integrate live experience with digital amplification so every attendee becomes a content creator.',
  'Conferences & Exhibitions': 'Coordinating multi-track keynotes, interactive stage setups, and booth spaces for industry summits.',
  'Brand Dinners & VIP Gatherings': 'Curating exclusive menus and invite-only atmospheres for press, influencers, and strategic partners.'
}

function normalizeCapability(item: any, idx: number = 0) {
  if (typeof item === 'string') {
    return {
      title: item,
      description: CAPABILITY_DESCRIPTIONS[item] || 'Crafting bespoke activations, high-impact launches, and memorable live brand experiences.',
      stat: '',
      accentColor: ['#E8005A', '#7B2FBE', '#1B3FB5', '#00B4B4'][idx % 4],
    }
  }
  return {
    title: item.title || item.name || item.heading || 'Capability',
    description: item.description || item.desc || item.subheadline || CAPABILITY_DESCRIPTIONS[item.title || item.name] || '',
    stat: item.stat || item.metric || '',
    accentColor: item.accentColor || item.color || item.accent_color || ['#E8005A', '#7B2FBE', '#1B3FB5', '#00B4B4'][idx % 4],
  }
}

const defaultEventTypes = [
  {
    icon: '✦',
    title: 'Brand Activations',
    description: 'Multi-sensory experiences that embed your brand into memory. From pop-up installations to city-wide takeovers, we design moments that move people.',
    stat: '80+',
    statLabel: 'activations produced',
    accentColor: '#E8005A',
  },
  {
    icon: '◎',
    title: 'Product Launches',
    description: 'First impressions are permanent. We orchestrate product launches that generate earned media, social currency, and genuine consumer excitement.',
    stat: '40+',
    statLabel: 'launches executed',
    accentColor: '#7B2FBE',
  },
  {
    icon: '⬡',
    title: 'Corporate Events',
    description: 'Internal alignment, external credibility. From annual galas to leadership summits, we bring the same creative rigour to B2B that we apply to consumer campaigns.',
    stat: '120+',
    statLabel: 'corporate events',
    accentColor: '#1B3FB5',
  },
  {
    icon: '⌬',
    title: 'Experiential Campaigns',
    description: 'Campaigns that live beyond screens. We integrate live experience with digital amplification so every attendee becomes a content creator for your brand.',
    stat: '2M+',
    statLabel: 'audience reached',
    accentColor: '#00B4B4',
  },
]

const process = [
  { step: '01', title: 'Discovery & Briefing', desc: 'We deep-dive into your brand strategy, audience profile, and success metrics before a single prop is ordered.' },
  { step: '02', title: 'Concept & Creative', desc: 'Our creative team develops full experience concepts — spatial design, sensory journey, content flow, and brand integration.' },
  { step: '03', title: 'Production & Logistics', desc: 'Venue sourcing, vendor management, technical production, and contingency planning handled end-to-end.' },
  { step: '04', title: 'Live Execution', desc: 'On-ground Loops team ensures flawless delivery. Real-time problem-solving. Nothing left to chance.' },
  { step: '05', title: 'Amplification & Reporting', desc: 'Post-event content, PR push, social amplification, and a full impact report measuring ROI against your brief.' },
]

const pastEvents = [
  {
    client: 'Softlogic Invest',
    campaign: 'Dance the Way You Want',
    type: 'Experiential Campaign',
    year: '2023',
    award: '2× Gold — The Four A\'s',
    bg: '/images/softlogic-bg.jpg',
  },
  {
    client: 'Havelock City Mall',
    campaign: 'Bringing My Happy Place to Life',
    type: 'Brand Activation',
    year: '2022',
    award: 'Gold — The Four A\'s',
    bg: '/images/mall-bg.jpg',
  },
  {
    client: 'Vivya / Hemas',
    campaign: 'Remove Stress Make-Up',
    type: 'Product Launch + Activation',
    year: '2023',
    award: 'Bronze — The Four A\'s',
    bg: '/images/vivya-bg.jpg',
  },
]

export default function Events() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  const [hero, setHero] = useState({
    label: 'Services',
    title: 'Events & Experiences',
    headline: 'Moments people talk about for years.',
    description: 'We design unforgettable physical, hybrid, and virtual experiences that turn audiences into loyal advocates and deliver measurable impact.',
    accentColor: '#E8005A',
    what_we_do_text: null as string | null,
  })



  const [disciplines, setDisciplines] = useState<any[]>(defaultEventTypes)
  const [pastEventsList, setPastEventsList] = useState(pastEvents)

  // Portfolio items with Event category for Carousel
  const [eventWorks, setEventWorks] = useState<PortfolioItem[]>([])
  const carouselTrackRef = useRef<HTMLDivElement>(null)

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (carouselTrackRef.current) {
      const scrollAmount = carouselTrackRef.current.offsetWidth * 0.75
      carouselTrackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Events Gallery States
  const [galleryList, setGalleryList] = useState<any[]>([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isHoveredGallery, setIsHoveredGallery] = useState(false)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
  const galleryContainerRef = useRef<HTMLDivElement>(null)

  // Auto-play slideshow
  useEffect(() => {
    if (isLightboxOpen || isHoveredGallery || galleryList.length === 0) return

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev < galleryList.length - 1 ? prev + 1 : 0))
    }, 3500)

    return () => clearInterval(interval)
  }, [galleryList.length, isHoveredGallery, isLightboxOpen])

  // Center active thumbnail horizontally
  useEffect(() => {
    const container = galleryContainerRef.current
    const activeThumb = thumbnailRefs.current[activeImageIndex]
    if (container && activeThumb) {
      const containerWidth = container.offsetWidth
      const thumbLeft = activeThumb.offsetLeft
      const thumbWidth = activeThumb.offsetWidth
      container.scrollTo({
        left: thumbLeft - containerWidth / 2 + thumbWidth / 2,
        behavior: 'smooth',
      })
    }
  }, [activeImageIndex])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Fetch dynamic content from Pages API (Admin Panel -> Pages -> Events)
    api.pages.get('events')
      .then(res => {
        if (!res || !res.data) {
          setLoading(false);
          return;
        }
        const data = res.data;

        if (data.hero) {
          setHero(prev => ({
            ...prev,
            title: data.hero.title || data.hero.headline || prev.title,
            headline: data.hero.subtitle || data.hero.subheadline || prev.headline,
            description: data.hero.description || prev.description,
          }));
        }



        const rawCaps = data.disciplines?.disciplines || data.disciplines || data.capabilities || data.what_we_do;
        if (Array.isArray(rawCaps) && rawCaps.length > 0) {
          setDisciplines(rawCaps.map((c: any, i: number) => normalizeCapability(c, i)));
        }

        if (data.past_events) {
          const pastArr = data.past_events.past_events || data.past_events;
          if (Array.isArray(pastArr) && pastArr.length > 0) setPastEventsList(pastArr);
        }

        if (data.gallery) {
          const gallArr = data.gallery.gallery || data.gallery;
          if (Array.isArray(gallArr) && gallArr.length > 0) setGalleryList(gallArr);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load events page sections', err);
        setLoading(false);
      });

    // Also fetch service details from Services API (Admin Panel -> Services -> Events)
    api.services.show('events')
      .then(res => {
        if (res && res.data) {
          const apiService = res.data
          if (apiService.capabilities && Array.isArray(apiService.capabilities) && apiService.capabilities.length > 0) {
            setDisciplines(prev => (prev && prev.length > 0) ? prev : apiService.capabilities.map((c: any, i: number) => normalizeCapability(c, i)))
          }
          if (apiService.what_we_do_text || apiService.description || apiService.headline) {
            setHero(prev => ({
              ...prev,
              title: prev.title || apiService.title,
              headline: prev.headline || apiService.headline,
              description: prev.description || apiService.description,
              what_we_do_text: apiService.what_we_do_text || prev.what_we_do_text,
            }))
          }
        }
      })
      .catch(() => {});

    // Fetch portfolio items filtered by Events category
    api.portfolio.list({ category: 'events', per_page: 20 })
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          setEventWorks(res.data)
        }
      })
      .catch(err => {
        console.error('Failed to load event portfolio items', err)
      });
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.from('.service-cap', {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.caps-section', start: 'top 75%' },
      })
    }, pageRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <div ref={pageRef}>
      {/* ── 1. Hero — BLACK (Matching ServicePage.tsx) ────────────────── */}
      <section className="bg-brand-dark section-padding pt-36 pb-24 relative overflow-hidden">
        {/* Accent glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: '#E8005A' }}
        />

        <div className="max-w-5xl relative z-10">
          <h1 className="heading-hero fluid-xl text-white mb-6">{hero.title}</h1>
          <p className="heading-lg fluid-md text-white/60 mb-8 max-w-3xl">{hero.headline}</p>
          <p className="text-white/40 fluid-sm leading-relaxed max-w-2xl mb-12">{hero.description}</p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              to="/contact"
              className="btn-primary"
              style={{ backgroundColor: '#E8005A', color: '#fff' }}
            >
              Plan Your Event
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#past-events"
              className="btn-outline text-sm inline-flex items-center gap-2"
            >
              See Our Work
            </a>
          </div>


        </div>
      </section>

      {/* ── 2. Capabilities — WHITE (Matching ServicePage.tsx) ─────────── */}
      <section className="bg-white section-padding py-24 caps-section">
        <div className="max-w-5xl mx-auto">
          <p className="text-xl md:text-2xl font-bold text-black tracking-tight mb-8 font-sans">What We Do</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {disciplines.map((et, i) => {
              const item = typeof et === 'string' ? normalizeCapability(et, i) : (et || {})
              const itemTitle = item.title || item.name || (typeof et === 'string' ? et : 'Capability')
              const itemDesc = item.description || item.desc || CAPABILITY_DESCRIPTIONS[itemTitle] || ''
              const itemStat = item.stat || item.metric || ''
              const itemColor = item.accentColor || item.color || item.accent_color || ['#E8005A', '#7B2FBE', '#1B3FB5', '#00B4B4'][i % 4]
              return (
                <motion.div
                  key={itemTitle + i}
                  className="service-cap flex items-start gap-4 p-6 rounded-2xl border border-brand-dark/8 hover:border-brand-dark/12 bg-brand-dark/[0.02] transition-colors duration-300 group"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-2.5 shrink-0"
                    style={{ backgroundColor: itemColor }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-brand-dark font-semibold text-lg leading-snug transition-colors group-hover:text-black">
                        {itemTitle}
                      </h3>
                      {itemStat && (
                        <span
                          className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-dark/5 text-brand-dark/70"
                          style={{ color: itemColor }}
                        >
                          {itemStat}
                        </span>
                      )}
                    </div>
                    {itemDesc && (
                      <p className="text-brand-dark/50 text-sm leading-relaxed">
                        {itemDesc}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-16 p-8 rounded-2xl gradient-bg text-white">
            <p className="font-display font-700 text-2xl leading-tight mb-4 whitespace-pre-line">
              {hero.what_we_do_text || "We don't just host events.\nWe create immersive brand experiences that leave lasting memories."}
            </p>
            <Link to="/contact" className="btn-outline text-sm inline-flex">
              Plan Your Event
            </Link>
          </div>
        </div>
      </section>



      {/* ── 4. Events Gallery Section — BLACK ───────────────────────────── */}
      {galleryList.length > 0 && (
        <section className="bg-brand-dark py-24 section-padding border-t border-white/5 relative overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h2 className="font-display font-bold text-white leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                  Moments Captured <span className="gradient-text">in Motion.</span>
                </h2>
              </div>
            </div>

            {/* BIG PREVIEW SECTION */}
            <div
              onMouseEnter={() => setIsHoveredGallery(true)}
              onMouseLeave={() => setIsHoveredGallery(false)}
              className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-white/3 border border-white/10 shadow-2xl mb-8 group"
            >
              <div className="relative h-[380px] sm:h-[480px] md:h-[540px] w-full flex items-center justify-center bg-black/40 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={galleryList[activeImageIndex]?.url}
                    src={resolveImageUrl(galleryList[activeImageIndex]?.url)}
                    alt={galleryList[activeImageIndex]?.title || 'Event Image'}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                {/* Active Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-pink/80 backdrop-blur-md text-white text-xs font-mono font-bold tracking-wider uppercase mb-2">
                      {galleryList[activeImageIndex]?.category || 'Event'}
                    </span>
                    <h3 className="font-display font-bold text-white text-xl sm:text-2xl md:text-3xl">
                      {galleryList[activeImageIndex]?.title?.replace(/\s*\d+$/, '')}
                    </h3>
                    {galleryList[activeImageIndex]?.caption && (
                      <p className="text-white/70 text-sm mt-1 max-w-xl">
                        {galleryList[activeImageIndex]?.caption}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs font-mono px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                      {activeImageIndex + 1} / {galleryList.length}
                    </span>
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-all cursor-pointer"
                      title="Expand Lightbox"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Nav Arrows */}
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryList.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-pink hover:border-brand-pink cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < galleryList.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-pink hover:border-brand-pink cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* SMALL THUMBNAILS GRID */}
            <div ref={galleryContainerRef} className="overflow-x-auto pb-4 pt-2 no-scrollbar">
              <div className="flex gap-3 sm:gap-4 min-w-max">
                {galleryList.map((item, idx) => {
                  const isActive = idx === activeImageIndex
                  return (
                    <button
                      key={item.url + idx}
                      ref={(el) => (thumbnailRefs.current[idx] = el)}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shrink-0 ${
                        isActive
                          ? 'ring-2 ring-brand-pink border-2 border-brand-pink scale-105 shadow-[0_0_20px_rgba(232,0,90,0.5)] opacity-100 z-10'
                          : 'opacity-50 hover:opacity-100 hover:scale-102 border border-white/15'
                      } w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28`}
                    >
                      <img
                        src={resolveImageUrl(item.thumb || item.url)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'bg-transparent' : 'bg-black/30'}`} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Case Studies — BLACK (Matching ServicePage.tsx) ─────────── */}
      <section id="past-events" className="bg-brand-dark py-24 section-padding border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-white font-display font-bold text-xl md:text-2xl tracking-tight mb-4">Case Studies</p>
              <h2 className="heading-xl fluid-lg text-white mb-4 font-display font-bold">
                Featured <span className="bg-gradient-to-r from-brand-pink via-purple-400 to-cyan-400 bg-clip-text text-transparent">Works.</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/work?category=events"
                className="label text-white/70 hover:text-brand-pink transition-colors duration-300 flex items-center gap-2 font-display font-bold text-sm"
              >
                View All Events Work
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleScrollCarousel('left')}
                  className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-brand-pink hover:border-brand-pink transition-all duration-300 flex items-center justify-center cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleScrollCarousel('right')}
                  className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-brand-pink hover:border-brand-pink transition-all duration-300 flex items-center justify-center cursor-pointer"
                  aria-label="Next Slide"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* CAROUSEL TRACK */}
          <div
            ref={carouselTrackRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2"
          >
            {(eventWorks.length > 0 ? eventWorks : pastEventsList).map((item: any, i: number) => {
              const title = item.title || item.campaign
              const client = item.client || item.client_name
              const rawImg = item.hero_url || item.thumbnail_url || item.bg
              const image = resolveImageUrl(rawImg)
              const year = item.year
              const award = item.award
              const slug = item.slug

              const cardContent = (
                <div className="group/card relative rounded-2xl md:rounded-3xl overflow-hidden bg-[#121216] border border-white/10 hover:border-white/25 transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 flex flex-col min-w-[300px] sm:min-w-[360px] md:min-w-[380px] shrink-0 h-full">
                  {/* Top: Image container */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-950 border-b border-white/10 shrink-0">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/card:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = resolveImageUrl('/images/default.jpg')
                      }}
                    />

                    {/* Award Badge Pill */}
                    {award && (
                      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full border border-yellow-400/50 bg-black/60 backdrop-blur-md text-yellow-300 text-[0.62rem] font-bold">
                          ★ {award}
                        </span>
                      </div>
                    )}

                    {/* Top Right Hover Arrow */}
                    <div className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-x-2 group-hover/card:translate-x-0 border border-white/20">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom: Dedicated text content section */}
                  <div className="p-6 flex flex-col flex-grow bg-brand-dark">
                    <div className="flex items-center justify-between mb-3">
                      <p className="label text-white/70">{client}</p>
                      {year && <p className="label text-white/60">{year}</p>}
                    </div>
                    <h3 className="font-display font-600 text-white text-xl leading-tight mb-3 group-hover/card:text-brand-pink transition-colors">
                      {title}
                    </h3>
                    {(item.insight || item.brief) && (
                      <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-3">
                        {item.insight || item.brief}
                      </p>
                    )}

                    {item.result && (
                      <div className="mt-auto pt-3.5 border-t border-white/10 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold text-xs shrink-0 mt-0.5">↑</span>
                        <span className="text-slate-200 text-xs leading-relaxed font-sans font-medium line-clamp-2">
                          {item.result}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )

              return slug ? (
                <Link key={item.id || i} to={`/work/${slug}`} className="block">
                  {cardContent}
                </Link>
              ) : (
                <div key={i}>{cardContent}</div>
              )
            })}

            {/* View All Work Card at Carousel End */}
            <Link
              to="/work?category=events"
              className="group/card-more min-w-[300px] sm:min-w-[360px] md:min-w-[380px] shrink-0 self-stretch rounded-2xl md:rounded-3xl border-2 border-dashed border-white/20 hover:border-brand-pink hover:bg-brand-pink/5 transition-all duration-500 flex flex-col items-center justify-center gap-5 p-8 cursor-pointer shadow-xl min-h-[380px]"
            >
              <div className="w-16 h-16 rounded-full border border-white/20 group-hover/card-more:border-brand-pink group-hover/card-more:bg-brand-pink text-white/70 group-hover/card-more:text-white flex items-center justify-center transition-all duration-300 shadow-xl group-hover/card-more:scale-110">
                <svg className="w-6 h-6 transform group-hover/card-more:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-xl text-white group-hover/card-more:text-brand-pink transition-colors">
                  View All Work
                </p>
                <p className="text-white/40 text-xs font-mono mt-1">
                  Explore full portfolio →
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. CTA — WHITE (Matching ServicePage.tsx) ──────────────────── */}
      <section className="bg-white section-padding py-24 text-center border-t border-brand-dark/5">
        <p className="label text-brand-dark/40 mb-4">Get Started</p>
        <h2 className="heading-xl fluid-lg text-brand-dark mb-8">
          Ready to create an unforgettable event experience?
        </h2>
        <Link to="/contact" className="btn-primary inline-flex">
          Let's Talk
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && galleryList[activeImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer z-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
              <img
                src={resolveImageUrl(galleryList[activeImageIndex].url)}
                alt={galleryList[activeImageIndex].title}
                className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                <h4 className="text-white font-display font-bold text-xl">{galleryList[activeImageIndex].title?.replace(/\s*\d+$/, '')}</h4>
                {galleryList[activeImageIndex].caption && (
                  <p className="text-white/60 text-sm mt-1">{galleryList[activeImageIndex].caption}</p>
                )}
              </div>

              <button
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryList.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 text-white hover:bg-brand-pink transition-all cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev < galleryList.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 text-white hover:bg-brand-pink transition-all cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
