import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ParticleField from '@/components/ui/ParticleField'
import GutAwardDisplay, { AwardGroup, getCleanAwardImage } from '@/components/ui/GutAwardDisplay'
import { api, Award } from '@/lib/api'

gsap.registerPlugin(ScrollTrigger)

export default function AwardsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [awardGroups, setAwardGroups] = useState<AwardGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [totals, setTotals] = useState({ gold: 3, bronze: 3, years: 2 })

  const [isPaused, setIsPaused] = useState(false)

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (loading || isPaused || !awardGroups.length || !carouselRef.current) return

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          carouselRef.current.scrollBy({ left: 420, behavior: 'smooth' })
        }
      }
    }, 3600)

    return () => clearInterval(interval)
  }, [loading, isPaused, awardGroups.length])

  useEffect(() => {
    api.awards.list()
      .then(res => {
        if (res && res.data && res.data.length) {
          const items: Award[] = res.data

          const gold = items.filter((a: any) => a.tier.toLowerCase().includes('gold')).reduce((acc: number, a: any) => acc + (a.count || 1), 0)
          const bronze = items.filter((a: any) => a.tier.toLowerCase().includes('bronze')).reduce((acc: number, a: any) => acc + (a.count || 1), 0)
          const years = Array.from(new Set(items.map((a: any) => a.year))).length
          setTotals({ gold, bronze, years })

          // Group by Award Body (eliminates duplicate award show headers)
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
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load awards in AwardsSection:', err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (loading || !awardGroups.length) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            '.awards-header > *',
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.15,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            }
          )
        },
        once: true,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [loading, awardGroups])

  if (loading || !awardGroups.length) {
    return (
      <section className="bg-brand-dark py-24 flex items-center justify-center">
        <div className="text-white/40 label animate-pulse">Loading Awards...</div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative bg-brand-dark pt-10 pb-4 md:pt-16 md:pb-6 overflow-hidden">
      <ParticleField accent="purple" count={300} spread={18} scrollDriven />
      <div className="relative z-10 w-full">
        {/* Header copy & stats */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="awards-header max-w-xl">
            <p className="label text-white/70 mb-3 tracking-widest uppercase">Industry Recognition</p>
            <h2 className="heading-xl fluid-xl text-white mb-4 font-display font-bold">
              Work that wins<br />
              <span className="gradient-text">awards.</span>
            </h2>
            <p className="text-white/50 text-sm md:text-base leading-relaxed font-sans">
              {"Recognised by Sri\u00a0Lanka's premier advertising awards across creative excellence, campaign effectiveness, and integrated marketing."}
            </p>
          </div>

          {/* Navigation Controls & Stats */}
          <div className="flex items-center justify-between md:justify-end gap-6 flex-wrap">
            <div className="flex gap-6 border-r border-white/10 pr-6">
              <div>
                <p className="font-display font-bold text-white text-3xl leading-none">{totals.gold}</p>
                <p className="label text-white/60 text-[10px] mt-1">Gold awards</p>
              </div>
              <div>
                <p className="font-display font-bold text-white text-3xl leading-none">{totals.bronze}</p>
                <p className="label text-white/60 text-[10px] mt-1">Bronze awards</p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleScroll('left')}
                className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg"
                aria-label="Previous Award"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg"
                aria-label="Next Award"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Full-Bleed Cardless Display Track (0 Margin from Page Corners) */}
        <div
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="w-full flex gap-20 sm:gap-36 md:gap-52 lg:gap-64 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing items-start justify-start px-6 md:px-12 lg:px-20"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {awardGroups.map((group, i) => (
            <div
              key={i}
              className="w-[85vw] sm:w-[65vw] md:w-[480px] lg:w-[520px] flex-shrink-0 snap-center"
            >
              <GutAwardDisplay group={group} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



