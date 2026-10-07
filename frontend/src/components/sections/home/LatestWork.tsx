import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { api, PortfolioItem, resolveImageUrl } from '@/lib/api'
import { motion } from 'framer-motion'
import { useNavigation } from '@/context/NavigationContext'

gsap.registerPlugin(ScrollTrigger)

export default function LatestWork() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { isPagePublished } = useNavigation()
  const workPagePublished = isPagePublished('/work')

  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState({
    is_visible: true,
    show_view_all: false,
    label: 'Latest Work',
    title_line1: 'Real campaigns.',
    title_line2: 'Real results.',
  })
  const [configLoaded, setConfigLoaded] = useState(false)

  useEffect(() => {
    api.pages.get('home')
      .then(res => {
        if (res && res.data && res.data.latest_work) {
          const lw = res.data.latest_work
          setConfig({
            is_visible: lw.is_visible !== false && lw.is_visible !== '0' && lw.is_visible !== 'false',
            show_view_all: lw.show_view_all === true || lw.show_view_all === '1' || lw.show_view_all === 'true',
            label: lw.label || 'Latest Work',
            title_line1: lw.title_line1 || 'Real campaigns.',
            title_line2: lw.title_line2 || 'Real results.',
          })
        }
        setConfigLoaded(true)
      })
      .catch(err => {
        console.warn('Could not load latest_work page config:', err)
        setConfigLoaded(true)
      })
  }, [])

  useEffect(() => {
    api.portfolio.list({ featured: true })
      .then(res => {
        if (res && res.data) {
          setItems(res.data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch featured portfolio items:', err)
        setLoading(false)
      })
  }, [])

  // Capture wheel events ONLY when user's cursor is over the cards container
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || loading || !items.length) return

    const handleWheel = (e: WheelEvent) => {
      // Only handle vertical scroll gestures on mouse wheel
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth
        const currentScrollLeft = container.scrollLeft

        // Check if we can scroll horizontally in the requested direction
        const canScrollRight = e.deltaY > 0 && currentScrollLeft < maxScrollLeft - 3
        const canScrollLeft  = e.deltaY < 0 && currentScrollLeft > 3

        if (canScrollRight || canScrollLeft) {
          e.preventDefault()
          container.scrollLeft += e.deltaY * 1.15
        }
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [loading, items])

  if (configLoaded && !config.is_visible) {
    return null
  }

  if (loading || !items.length) {
    return (
      <section className="bg-white py-24 flex items-center justify-center">
        <div className="text-brand-dark/40 label animate-pulse">Loading Latest Work...</div>
      </section>
    )
  }

  const showViewAll = config.show_view_all && workPagePublished

  return (
    <section className="bg-white overflow-hidden pt-12 pb-4 md:pt-16 md:pb-6">
      <div className="w-full">
        <div className="section-padding pb-4 flex items-end justify-between">
          <div>
            <p className="text-brand-dark font-display font-bold text-xl md:text-2xl tracking-tight mb-4">{config.label}</p>
            <h2 className="heading-xl fluid-xl text-brand-dark">
              {config.title_line1}<br />{config.title_line2}
            </h2>
          </div>
          {showViewAll && (
            <Link
              to="/work"
              className="hidden md:inline-flex items-center gap-2 label text-brand-dark/50 hover:text-brand-dark transition-colors duration-200 group"
            >
              View All Work
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>

        {/* Horizontal scroll track (scrollable on hover) */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 px-6 md:px-12 lg:px-20 xl:px-32 pb-2 pt-2 overflow-x-auto select-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((item, i) => {
            const accentColor = item.color || '#E8005A'
            const rawThumb = item.thumbnail_url || item.hero_url || '/images/default.jpg'
            const thumb = resolveImageUrl(rawThumb)
            const isClickable = item.is_clickable !== false

            const innerCard = (
              <motion.div
                className={`relative rounded-2xl overflow-hidden bg-brand-dark flex flex-col justify-between border border-white/10 shadow-2xl group/card h-full ${!isClickable ? 'cursor-default' : ''}`}
                whileHover={isClickable ? { y: -6 } : {}}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
              >
                {/* Top: Image container */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-950 border-b border-white/10 flex-shrink-0">
                  <img
                    src={thumb}
                    alt={item.title}
                    className={`w-full h-full transition-transform duration-700 ${isClickable ? 'group-hover/card:scale-105' : ''}`}
                    style={{
                      objectFit: item.image_fit?.startsWith('contain') ? 'contain' : 'cover',
                      objectPosition: item.image_position || 'center',
                      padding: item.image_fit === 'contain-pad' ? '12px' : undefined,
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />

                  {/* Arrow */}
                  {isClickable && (
                    <div className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-x-2 group-hover/card:translate-x-0 border border-white/20">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bottom: Dedicated text content section */}
                <div className="p-5 flex flex-col justify-between flex-grow bg-brand-dark">
                  <div>
                    <p className="label text-white/40 mb-1 text-[0.68rem] tracking-wider uppercase font-mono">{item.client}</p>
                    <h3 className={`font-display font-bold text-white text-base md:text-lg leading-snug line-clamp-2 min-h-[2.7rem] md:min-h-[3.1rem] mb-2 transition-colors ${isClickable ? 'group-hover/card:text-brand-pink' : ''}`}>
                      {item.title}
                    </h3>
                  </div>

                  {item.result ? (
                    <div className="flex items-start gap-2 pt-2.5 border-t border-white/10 mt-2">
                      <span className="text-emerald-400 font-bold text-xs shrink-0 mt-0.5">↑</span>
                      <span className="text-slate-200 text-xs leading-relaxed font-sans font-medium line-clamp-1">{item.result}</span>
                    </div>
                  ) : (
                    <div className="pt-2.5 border-t border-transparent mt-2" />
                  )}
                </div>
              </motion.div>
            )

            return isClickable ? (
              <Link
                key={item.id}
                to={item.slug ? `/work/${item.slug}` : '/work'}
                className="group block flex-shrink-0 flex flex-col"
                style={{ width: 'clamp(280px, 30vw, 420px)' }}
              >
                {innerCard}
              </Link>
            ) : (
              <div
                key={item.id}
                className="block flex-shrink-0 flex flex-col"
                style={{ width: 'clamp(280px, 30vw, 420px)' }}
              >
                {innerCard}
              </div>
            )
          })}

          {/* View all card */}
          {showViewAll && (
            <Link
              to="/work"
              className="flex-shrink-0 rounded-2xl border-2 border-dashed border-brand-dark/20 flex flex-col items-center justify-center gap-4 hover:border-brand-pink hover:bg-brand-pink/5 transition-all duration-300 group p-6 h-full min-h-[310px]"
              style={{ width: 'clamp(200px, 20vw, 280px)' }}
            >
              <div className="w-12 h-12 rounded-full border border-brand-dark/20 group-hover:border-brand-pink flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-brand-dark/40 group-hover:text-brand-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <span className="label text-brand-dark/40 group-hover:text-brand-pink transition-colors text-center">
                View All<br/>Work
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
