import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api, PressItem, resolveImageUrl } from '@/lib/api'
import ParticleField from '@/components/ui/ParticleField'

export default function Press() {
  const [items, setItems] = useState<PressItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Press & Achievements | Loops Integrated'
    api.press.list()
      .then(res => {
        if (res && res.data) {
          setItems(res.data)
        }
        if (res && res.categories) {
          setCategories(['All', ...res.categories])
        } else {
          setCategories(['All', 'Achievement', 'Award Win', 'Press Release', 'Media Coverage', 'Milestone'])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load press items:', err)
        setLoading(false)
      })
  }, [])

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
        (item.content && item.content.toLowerCase().includes(q)) ||
        (item.publisher && item.publisher.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [items, selectedCategory, searchQuery])

  // Featured story: first item marked as is_featured, or first item overall
  const featuredItem = useMemo(() => {
    if (searchQuery || selectedCategory !== 'All') return null
    return items.find(i => i.is_featured) || items[0] || null
  }, [items, searchQuery, selectedCategory])

  // Rest of items (excluding featured on initial view)
  const regularItems = useMemo(() => {
    if (featuredItem && selectedCategory === 'All' && !searchQuery) {
      return filteredItems.filter(i => i.id !== featuredItem.id)
    }
    return filteredItems
  }, [filteredItems, featuredItem, selectedCategory, searchQuery])

  return (
    <div className="bg-[#08080C] min-h-screen text-white pt-28 pb-12 sm:pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-brand-pink/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Ambient particle field in hero */}
      <div className="absolute inset-0 h-[650px] overflow-hidden pointer-events-none opacity-40">
        <ParticleField />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-14"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.08]">
            Milestones, headlines &amp; <br />
            <span className="bg-gradient-to-r from-brand-pink via-brand-purple to-cyan-400 bg-clip-text text-transparent">
              industry recognition.
            </span>
          </h1>
        </motion.div>

        {/* Search Bar */}
        <div className="flex items-center justify-end mb-10 pb-6 border-b border-white/10">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search headlines or publications..."
              className="w-full pl-10 pr-9 py-2.5 bg-white/[0.05] border border-white/10 rounded-full text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-pink/60 focus:bg-white/[0.08] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white/40 text-sm font-mono tracking-widest uppercase">Loading Press &amp; News...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Featured Headline Spotlight (only on default view) */}
            {featuredItem && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-14 rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent border border-white/15 p-6 md:p-10 relative group hover:border-brand-pink/40 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Media preview */}
                  <Link
                    to={`/press/${featuredItem.slug}`}
                    className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/60 block"
                  >
                    {featuredItem.image_url ? (
                      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black/80">
                        {/* Ambient glow backdrop */}
                        <img
                          src={resolveImageUrl(featuredItem.image_url)}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125"
                        />
                        {/* Full poster / photo */}
                        <img
                          src={resolveImageUrl(featuredItem.image_url)}
                          alt={featuredItem.title}
                          className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 text-white/40 font-mono text-sm">
                        Loops Integrated News
                      </div>
                    )}
                  </Link>

                  {/* Headline & Details */}
                  <div className="lg:col-span-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
                      {featuredItem.published_date_formatted && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {featuredItem.published_date_formatted}
                        </span>
                      )}
                    </div>

                    <Link to={`/press/${featuredItem.slug}`} className="block">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold leading-tight mb-4 text-white group-hover:text-brand-pink transition-colors duration-300">
                        {featuredItem.title}
                      </h2>
                    </Link>

                    {featuredItem.excerpt && (
                      <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                        {featuredItem.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={`/press/${featuredItem.slug}`}
                        className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-brand-pink hover:text-white transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.2)] inline-block"
                      >
                        Read Story →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid of Stories — Horizontal scroll on mobile, 2/3 col grid on desktop */}
            {regularItems.length > 0 ? (
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 overflow-x-auto md:overflow-visible pb-6 md:pb-0 pt-1 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-none no-scrollbar">
                {regularItems.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                    className="w-[84vw] max-w-[340px] md:w-auto shrink-0 md:shrink snap-start group rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-brand-pink/50 transition-all duration-300 flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                  >
                    {/* Card Thumbnail */}
                    <Link
                      to={`/press/${item.slug}`}
                      className="aspect-[16/10] relative overflow-hidden bg-black/60 block cursor-pointer"
                    >
                      {item.image_url ? (
                        <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black/80">
                          {/* Ambient glow backdrop */}
                          <img
                            src={resolveImageUrl(item.image_url)}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-125"
                          />
                          {/* Full image properly contained */}
                          <img
                            src={resolveImageUrl(item.image_url)}
                            alt={item.title}
                            className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 text-white/30 text-xs font-mono">
                          Loops Media
                        </div>
                      )}
                    </Link>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Date */}
                        <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
                          {item.published_date_formatted && (
                            <span>{item.published_date_formatted}</span>
                          )}
                        </div>

                        {/* Headline */}
                        <Link to={`/press/${item.slug}`} className="block">
                          <h3 className="text-lg sm:text-xl font-display font-bold leading-snug text-white group-hover:text-brand-pink transition-colors duration-200 mb-3 line-clamp-2">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        {item.excerpt && (
                          <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6">
                            {item.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <Link
                          to={`/press/${item.slug}`}
                          className="text-xs sm:text-sm font-semibold text-brand-pink hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5"
                        >
                          <span>Read Story</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (!featuredItem || searchQuery.trim()) ? (
              <div className="text-center py-20 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-white/60 text-base mb-2">No news items found matching your search.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-brand-pink hover:underline text-sm font-semibold"
                >
                  Clear search
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

