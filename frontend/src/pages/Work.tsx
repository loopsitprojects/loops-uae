import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api, PortfolioItem, resolveImageUrl } from '@/lib/api'

interface Filter { label: string; slug: string }

const defaultFilters: Filter[] = [
  { label: 'All', slug: 'all' },
  { label: 'Creative', slug: 'creative' },
  { label: 'Digital', slug: 'digital' },
  { label: 'Productions', slug: 'productions' },
  { label: 'Martech', slug: 'martech' },
  { label: 'Events', slug: 'events' },
  { label: 'AI', slug: 'ai' },
]

function matchesCategory(item: PortfolioItem, activeSlug: string): boolean {
  if (!activeSlug || activeSlug === 'all') return true

  const target = activeSlug.toLowerCase().trim().replace(/[^a-z0-9]/g, '')

  const isAi = target === 'ai' || target === 'aicontent'
  const isMartech = target === 'martech'
  const isCreative = target === 'creative'
  const isDigital = target === 'digital'
  const isProductions = target === 'productions' || target === 'production'
  const isEvents = target === 'events' || target === 'event'
  const isPerformance = target.includes('performance')

  const catStrings: string[] = []

  if (item.categories && Array.isArray(item.categories)) {
    item.categories.forEach(c => {
      if (typeof c === 'string') {
        catStrings.push(c)
      } else if (c) {
        if (c.slug) catStrings.push(c.slug)
        if (c.name) catStrings.push(c.name)
      }
    })
  }

  // @ts-ignore
  if (item.category) {
    // @ts-ignore
    if (Array.isArray(item.category)) {
      // @ts-ignore
      item.category.forEach(c => catStrings.push(String(c)))
    } else {
      // @ts-ignore
      catStrings.push(String(item.category))
    }
  }

  if (item.tags && Array.isArray(item.tags)) {
    item.tags.forEach(t => catStrings.push(t))
  }

  return catStrings.some(raw => {
    const rawLower = raw.toLowerCase().trim()
    const norm = rawLower.replace(/[^a-z0-9]/g, '')

    if (isAi) {
      return (
        norm === 'ai' ||
        norm === 'aicontent' ||
        norm === 'aigenerated' ||
        norm === 'aidesign' ||
        norm === 'artificialintelligence' ||
        rawLower === 'ai' ||
        rawLower.startsWith('ai ') ||
        rawLower.startsWith('ai-') ||
        rawLower.startsWith('ai_')
      )
    }

    if (isMartech && norm.includes('martech')) return true
    if (isCreative && norm.includes('creative')) return true
    if (isDigital && norm.includes('digital')) return true
    if (isProductions && (norm.includes('production') || norm.includes('productions'))) return true
    if (isEvents && (norm.includes('event') || norm.includes('events'))) return true
    if (isPerformance && (norm.includes('performance') || norm.includes('performancemarketing'))) return true
    return norm === target || norm.includes(target) || target.includes(norm)
  })
}

export default function Work() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [active, setActive] = useState(searchParams.get('category') || 'all')
  const [filters, setFilters] = useState<Filter[]>(defaultFilters)
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(false)

  const [hero, setHero] = useState({
    label: 'Portfolio',
    headline: 'Work',
    description_line1: "We don't just create campaigns - we build brand momentum that delivers real business impact.",
    description_line2: "From bold creative ideas to high-performing digital campaigns, cinematic productions, and smart martech solutions - here's what we've delivered for ambitious brands across Sri\u00a0Lanka and beyond."
  })

  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    resetScroll()
    const rAF = requestAnimationFrame(resetScroll)
    const timer = setTimeout(resetScroll, 100)

    api.categories.list().then(res => {
      if (res && res.data && res.data.length) {
        const cats = res.data.map(c => ({ label: c.name, slug: c.slug }))
        setFilters([{ label: 'All', slug: 'all' }, ...cats])
      }
    }).catch(() => { })

    api.pages.get('work')
      .then(res => {
        if (res && res.data && res.data.hero) {
          const h = res.data.hero
          setHero({
            label: h.label || 'Portfolio',
            headline: h.headline || 'Work',
            description_line1: h.description_line1 || '',
            description_line2: h.description_line2 || '',
          })
        }
      })
      .catch(err => {
        console.error('Failed to fetch work page sections:', err)
      })
  }, [])

  useEffect(() => {
    const catFromUrl = searchParams.get('category') || 'all'
    if (catFromUrl !== active) {
      setActive(catFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    api.portfolio.list({ per_page: 200 })
      .then(res => {
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data)
        }
      })
      .catch(err => {
        console.error('Failed to fetch portfolio list:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleFilter = (slug: string) => {
    setActive(slug)
    const newParams = new URLSearchParams(searchParams)
    if (slug === 'all') {
      newParams.delete('category')
    } else {
      newParams.set('category', slug)
    }
    setSearchParams(newParams)
  }

  const finalItems = items.filter(item => matchesCategory(item, active))

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark section-padding pt-36 pb-16">
        <p className="text-white font-display font-bold text-xl md:text-2xl tracking-tight mb-4">{hero.label}</p>
        <h1 className="heading-hero fluid-xl text-white max-w-3xl mb-6">{hero.headline}</h1>
        {hero.description_line1 && (
          <p className="text-white/55 fluid-sm max-w-2xl leading-relaxed mb-4">
            {hero.description_line1}
          </p>
        )}
        {hero.description_line2 && (
          <p className="text-white/35 fluid-sm max-w-2xl leading-relaxed">
            {hero.description_line2}
          </p>
        )}
      </section>

      {/* Filters */}
      <section className="bg-white sticky top-[68px] z-30 border-b border-brand-dark/10">
        <div className="section-padding py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f.slug}
              onClick={() => handleFilter(f.slug)}
              className={`shrink-0 px-5 py-2 rounded-full label transition-all duration-300 ${active === f.slug
                  ? 'bg-brand-dark text-white'
                  : 'text-brand-dark/50 hover:text-brand-dark border border-brand-dark/15 hover:border-brand-dark/40'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white section-padding py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalItems.map(item => {
            const thumbUrl = item.thumbnail_url || item.hero_url || '/images/default.jpg'
            const isClickable = item.is_clickable !== false

            const cardContent = (
              <>
                {/* Full-bleed Header Image */}
                <div className="relative overflow-hidden w-full aspect-[16/10] bg-neutral-900 flex items-center justify-center">
                  <img
                    src={resolveImageUrl(thumbUrl)}
                    alt={item.title}
                    loading="eager"
                    // @ts-ignore
                    fetchpriority="high"
                    decoding="async"
                    className={`w-full h-full transition-transform duration-700 ${isClickable ? 'group-hover:scale-105' : ''}`}
                    style={{
                      objectFit: item.image_fit?.startsWith('contain') ? 'contain' : 'cover',
                      objectPosition: item.image_position || 'center',
                      padding: item.image_fit === 'contain-pad' ? '12px' : undefined,
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      const fallback = resolveImageUrl('/images/default.jpg')
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback
                      }
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <p className="label text-white/70">{item.client}</p>
                    {item.show_year && <p className="label text-white/60">{item.year}</p>}
                  </div>
                  <h3 className="font-display font-600 text-white text-xl leading-tight mb-3">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-3">{item.insight}</p>
                  {item.result && (
                    <div className="mt-auto pt-3.5 border-t border-white/10 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold text-xs shrink-0 mt-0.5">↑</span>
                      <span className="text-slate-200 text-xs leading-relaxed font-sans font-medium line-clamp-2">
                        {item.result}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )

            return (
              <div key={item.id} className="h-full">
                {isClickable ? (
                  <Link to={`/work/${item.slug}`} className="group flex flex-col h-full rounded-2xl md:rounded-3xl overflow-hidden bg-brand-dark border border-white/10 hover:border-white/25 transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:-translate-y-1">
                    {cardContent}
                  </Link>
                ) : (
                  <div className="flex flex-col h-full rounded-2xl md:rounded-3xl overflow-hidden bg-brand-dark border border-white/10 shadow-xl cursor-default">
                    {cardContent}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!loading && finalItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-brand-dark/30 label">No projects in this category yet.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-brand-dark section-padding py-24 text-center">
        <p className="label text-white/70 mb-4">Next Step</p>
        <h2 className="heading-xl fluid-lg text-white mb-8">Ready to create something great together?</h2>
        <Link to="/contact" className="btn-primary inline-flex">
          Let's Talk
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>
    </>
  )
}
