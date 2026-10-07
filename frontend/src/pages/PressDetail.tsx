import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api, PressItem, resolveImageUrl } from '@/lib/api'
import ParticleField from '@/components/ui/ParticleField'

export default function PressDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<PressItem | null>(null)
  const [related, setRelated] = useState<PressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    if (!isLightboxOpen || !item?.gallery || item.gallery.length === 0) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowRight') {
        setActiveImageIndex(prev => (prev + 1) % item.gallery!.length)
      }
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex(prev => (prev - 1 + item.gallery!.length) % item.gallery!.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, item?.gallery])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (!slug) return

    setLoading(true)
    api.press.show(slug)
      .then(res => {
        if (res && res.data) {
          setItem(res.data)
          document.title = `${res.data.title} | Loops Integrated`
        }
        return api.press.list()
      })
      .then(res => {
        if (res && res.data) {
          // Filter out current story and take related stories for horizontal carousel / grid
          const other = res.data.filter(i => i.slug !== slug).slice(0, 6)
          setRelated(other)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load press story:', err)
        setLoading(false)
      })
  }, [slug])

  // Helper to extract YouTube video ID
  const extractYouTubeId = (url?: string | null) => {
    if (!url) return ''
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0] || ''
    }
    try {
      const parsed = new URL(url)
      return parsed.searchParams.get('v') || url.split('/').pop()?.split('?')[0] || ''
    } catch {
      return ''
    }
  }

  // Helper to extract Vimeo video ID
  const extractVimeoId = (url?: string | null) => {
    if (!url) return ''
    const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/)
    return match ? match[1] : url.split('/').pop()?.split('?')[0] || ''
  }

  // Render video player
  const renderVideoPlayer = (url: string, poster?: string | null) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = extractYouTubeId(url)
      return (
        <div className="relative w-full aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=0`}
            title={item?.title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    if (url.includes('vimeo.com')) {
      const id = extractVimeoId(url)
      return (
        <div className="relative w-full aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
          <iframe
            className="w-full h-full"
            src={`https://player.vimeo.com/video/${id}?autoplay=0`}
            title={item?.title || 'Video'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    // Direct MP4 / WebM video file
    return (
      <div className="relative w-full aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
        <video
          src={resolveImageUrl(url)}
          poster={poster ? resolveImageUrl(poster) : undefined}
          controls
          playsInline
          className="w-full h-full object-contain"
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-[#08080C] min-h-screen text-white flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-xs font-mono tracking-widest uppercase">Loading Story...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="bg-[#08080C] min-h-screen text-white flex flex-col items-center justify-center p-6 text-center pt-28">
        <h1 className="text-3xl font-display font-bold mb-4">Story Not Found</h1>
        <p className="text-white/50 mb-8 max-w-md">The news article or achievement you are looking for may have been moved or unpublished.</p>
        <Link
          to="/press"
          className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-brand-pink hover:text-white transition-all duration-300"
        >
          ← Return to Press &amp; Achievements
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#08080C] min-h-screen text-white pt-24 sm:pt-28 pb-10 sm:pb-16 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-brand-pink/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 h-[650px] overflow-hidden pointer-events-none opacity-30">
        <ParticleField />
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 relative z-10">
        {/* Top Navigation Row */}
        <div className="mb-6 sm:mb-10 flex items-center justify-between">
          <Link
            to="/press"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/60 hover:text-brand-pink transition-colors duration-200 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span>Back to All Press &amp; Achievements</span>
          </Link>
        </div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          {/* Metadata Line */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/50 mb-3 sm:mb-4">
            {item.published_date_formatted && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {item.published_date_formatted}
              </span>
            )}
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-[1.2] sm:leading-[1.12] tracking-tight text-white mb-0 sm:mb-6">
            {item.title}
          </h1>

          {/* Excerpt Lead Box - Hidden in mobile view */}
          {item.excerpt && (
            <div className="hidden sm:block p-4 sm:p-6 rounded-2xl bg-white/[0.04] border-l-4 border-brand-pink border-y border-r border-white/10 backdrop-blur-sm">
              <p className="text-sm sm:text-lg md:text-xl text-white/90 font-medium leading-relaxed italic">
                "{item.excerpt}"
              </p>
            </div>
          )}
        </motion.header>

        {/* Media Section: Video or Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-12 md:mb-16"
        >
          {item.video_url ? (
            <div>
              {renderVideoPlayer(item.video_url, item.image_url)}
            </div>
          ) : item.image_url ? (
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/10] md:aspect-[16/9] max-h-[640px] w-full bg-black shadow-2xl border border-white/15 flex items-center justify-center">
              {/* Ambient backdrop */}
              <img
                src={resolveImageUrl(item.image_url)}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-125"
              />
              {/* Full crisp poster / image */}
              <img
                src={resolveImageUrl(item.image_url)}
                alt={item.title}
                className="relative z-10 w-full h-full object-contain max-h-[640px]"
              />
            </div>
          ) : null}
        </motion.div>

        {/* Full Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="max-w-3xl mx-auto space-y-6 text-white/80 text-base sm:text-lg leading-relaxed font-sans"
        >
          {item.content ? (
            <div className="space-y-6 whitespace-pre-line">
              {item.content}
            </div>
          ) : (
            <p className="text-white/60">{item.excerpt}</p>
          )}

          {/* Photo Gallery Section */}
          {item.gallery && item.gallery.length > 0 && (
            <div className="pt-10 sm:pt-14 border-t border-white/10 mt-10 sm:mt-14">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-brand-pink">
                    Photo Gallery
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                    Event &amp; Office Highlights
                  </h3>
                </div>
                <span className="text-xs text-white/50">
                  {item.gallery.length} photos · Click to view full size
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.gallery.map((photo, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      setActiveImageIndex(idx)
                      setIsLightboxOpen(true)
                    }}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/60 border border-white/10 hover:border-brand-pink/60 cursor-pointer shadow-lg transition-all"
                  >
                    <img
                      src={resolveImageUrl(photo.url)}
                      alt={photo.caption || `${item.title} photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                      <span className="self-end w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </span>
                      {photo.caption && (
                        <p className="text-xs text-white font-medium line-clamp-2">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="mt-8 flex items-center">
            <Link
              to="/press"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors duration-200"
            >
              ← Back to All Press &amp; Achievements
            </Link>
          </div>
        </motion.article>

        {/* More Stories / Related Achievements */}
        {related.length > 0 && (
          <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                More Press &amp; Achievements
              </h2>
              <Link
                to="/press"
                className="text-xs sm:text-sm font-semibold text-brand-pink hover:text-white transition-colors duration-200 whitespace-nowrap shrink-0 inline-flex items-center gap-1 group"
              >
                <span>View all stories</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Mobile horizontal scroll / Desktop 3-column grid */}
            <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-6 overflow-x-auto md:overflow-visible pb-3 md:pb-0 pt-1 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-none no-scrollbar">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/press/${rel.slug}`}
                  className="w-[82vw] max-w-[320px] md:w-auto shrink-0 md:shrink snap-start group rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-brand-pink/50 transition-all duration-300 flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-black/60">
                    {rel.image_url ? (
                      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black/80">
                        {/* Ambient glow backdrop */}
                        <img
                          src={resolveImageUrl(rel.image_url)}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-125"
                        />
                        {/* Full image properly contained */}
                        <img
                          src={resolveImageUrl(rel.image_url)}
                          alt={rel.title}
                          className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 text-white/30 text-xs font-mono">
                        Loops Media
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-white/50 mb-2">
                        {rel.published_date_formatted && <span>{rel.published_date_formatted}</span>}
                      </div>
                      <h3 className="text-base font-display font-bold text-white group-hover:text-brand-pink transition-colors duration-200 line-clamp-2 mb-2">
                        {rel.title}
                      </h3>
                      {rel.excerpt && (
                        <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="pt-3 mt-3 border-t border-white/5 text-xs font-semibold text-brand-pink inline-flex items-center gap-1">
                      <span>Read Story</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && item?.gallery && item.gallery[activeImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer z-50"
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Lightbox Content */}
            <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
              <img
                src={resolveImageUrl(item.gallery[activeImageIndex].url)}
                alt={item.gallery[activeImageIndex].caption || `${item.title} image`}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />

              {/* Caption & Counter */}
              <div className="mt-4 text-center px-4 max-w-2xl">
                {item.gallery[activeImageIndex].caption && (
                  <p className="text-white text-base sm:text-lg font-medium">
                    {item.gallery[activeImageIndex].caption}
                  </p>
                )}
                <span className="text-xs text-white/50 mt-1 inline-block">
                  {activeImageIndex + 1} / {item.gallery.length}
                </span>
              </div>

              {/* Prev / Next Navigation Buttons (if more than 1 image) */}
              {item.gallery.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : item.gallery!.length - 1))
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-brand-pink transition-all cursor-pointer backdrop-blur-md"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImageIndex((prev) => (prev + 1) % item.gallery!.length)
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-brand-pink transition-all cursor-pointer backdrop-blur-md"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
