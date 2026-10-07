import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ParticleField from '@/components/ui/ParticleField'
import GutAwardDisplay, { AwardGroup, getCleanAwardImage } from '@/components/ui/GutAwardDisplay'
import { api, Award } from '@/lib/api'

gsap.registerPlugin(ScrollTrigger)

const fallbackAccolades = [
  { icon: '◎', text: 'Campaign Excellence', sub: 'Best in class across integrated, digital, and experiential categories' },
  { icon: '✦', text: 'Creative Effectiveness', sub: 'Awards judged on business results, not just aesthetics' },
  { icon: '⌬', text: 'Industry Recognition', sub: "Recognised by Sri\u00a0Lanka's most rigorous advertising jury" },
]

export default function Awards() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [groupedBodies, setGroupedBodies] = useState<AwardGroup[]>([])
  const [totals, setTotals] = useState({ gold: 0, bronze: 0, years: 0, nominations: 0 })

  const [hero, setHero] = useState({
    label: 'LOOPS INTEGRATED - AWARDS & RECOGNITION',
    headline: 'Work that wins',
    headline_gradient: 'gold.',
    description: "Recognised by Sri\u00a0Lanka's most prestigious advertising awards across creative, integrated, and experiential disciplines."
  })

  const [accoladesList, setAccoladesList] = useState<any[]>(fallbackAccolades)

  useEffect(() => {
    // Load awards list
    api.awards.list()
      .then(res => {
        const awards: Award[] = res.data || []
        
        // Calculate totals
        const gold = awards.filter((a: any) => a.tier.toLowerCase().includes('gold')).reduce((acc: number, a: any) => acc + (a.count || 1), 0)
        const bronze = awards.filter((a: any) => a.tier.toLowerCase().includes('bronze')).reduce((acc: number, a: any) => acc + (a.count || 1), 0)
        const years = Array.from(new Set(awards.map((a: any) => a.year))).length
        const nominations = awards.reduce((acc: number, a: any) => acc + (a.count || 1), 0) + 2
        
        setTotals({ gold, bronze, years, nominations })

        // Group by Award Body (GUT Agency Cardless Style)
        const bodiesMap: Record<string, AwardGroup> = {}

        awards.forEach((a) => {
          const bodyName = a.award_body || "Advertising Award"
          if (!bodiesMap[bodyName]) {
            const rawBg = (a as any).background_url || a.background_path
            const trophy = getCleanAwardImage(bodyName, a.tier, rawBg)

            bodiesMap[bodyName] = {
              body: bodyName,
              trophyImg: trophy,
              wins: [],
            }
          }

          bodiesMap[bodyName].wins.push({
            year: a.year,
            tier: a.tier,
            campaign_name: a.campaign_name,
            client_name: a.client_name,
            category: a.category,
          })
        })

        // Sort wins inside each body by year descending
        Object.values(bodiesMap).forEach(b => {
          b.wins.sort((x, y) => y.year - x.year)
        })

        setGroupedBodies(Object.values(bodiesMap))
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch awards', err)
        setLoading(false)
      })

    // Load Awards page sections
    api.pages.get('awards')
      .then(res => {
        if (res && res.data) {
          const d = res.data
          if (d.hero) {
            setHero({
              label: d.hero.label || 'LOOPS INTEGRATED — AWARDS & RECOGNITION',
              headline: d.hero.headline || 'Work that wins',
              headline_gradient: d.hero.headline_gradient || 'gold.',
              description: d.hero.description || '',
            })
          }
          if (d.accolades && Array.isArray(d.accolades.accolades)) {
            setAccoladesList(d.accolades.accolades)
          }
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (loading) return

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from('.aw-headline > *', {
        y: 80, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.2,
        clearProps: 'transform,opacity',
      })

      // Gold shimmer on trophies
      gsap.fromTo('.trophy-shimmer',
        { backgroundPosition: '-200% center' },
        {
          backgroundPosition: '200% center',
          duration: 3, ease: 'none', repeat: -1, repeatDelay: 1.5,
        }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <div ref={pageRef} className="bg-brand-dark min-h-screen text-white" style={{ backgroundColor: '#0A0A0A', color: '#F5F5F5' }}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center bg-brand-dark overflow-hidden">
        <ParticleField accent="multi" count={450} spread={18} scrollDriven />

        {/* Gold radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(255,200,0,0.07) 0%, rgba(123,47,190,0.07) 40%, transparent 70%)' }}
        />

        <div className="relative z-10 section-padding max-w-7xl mx-auto w-full pt-32 pb-20">
          <div className="aw-headline">
            <p className="label text-white/70 mb-5 tracking-[0.3em]">{hero.label}</p>
            <h1 className="font-display font-bold text-white leading-tight mb-8" style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}>
              {hero.headline}<br />
              <span
                className="trophy-shimmer"
                style={{
                  background: 'linear-gradient(105deg, #E8B84B 20%, #FFE55C 40%, #E8B84B 60%, #C97D20 80%)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  pointerEvents: 'none',
                }}
              >
                {hero.headline_gradient}
              </span>
            </h1>
            <p className="text-white/45 max-w-2xl leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
              {hero.description}
            </p>
          </div>

          {/* Trophy stat row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/8 pt-12">
            {[
              { n: totals.gold,        label: 'Gold Awards',   color: '#FFD700' },
              { n: totals.bronze,      label: 'Bronze Awards', color: '#CD7F32' },
              { n: totals.years,       label: 'Award Years',   color: '#7B2FBE' },
              { n: totals.nominations, label: 'Nominations',   color: '#00B4B4' },
            ].map(({ n, label, color }) => (
              <div key={label}>
                <p
                  className="font-display font-bold leading-none"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color }}
                >
                  {loading ? (
                    <span className="inline-block w-16 h-12 bg-white/5 rounded animate-pulse" />
                  ) : (
                    n
                  )}
                </p>
                <p className="label text-white/70 mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARDLESS GUT AGENCY AWARDS SHOWCASE (Exact Image 2 Format) ── */}
      <section className="relative bg-black py-28 section-padding border-t border-white/10 overflow-hidden text-center">
        <ParticleField accent="purple" count={250} spread={20} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="mb-24">
            <p className="label text-white/60 mb-4 tracking-[0.3em] uppercase">Industry Honors</p>
            <h2 className="font-display font-bold text-white text-3xl md:text-6xl tracking-tight">
              Award Shows & Wins
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-white/30 label animate-pulse">Loading awards...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
              {groupedBodies.map((gb, idx) => (
                <GutAwardDisplay key={idx} group={gb} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Awards Matter ───────────────────────────────────────────── */}
      <section className="bg-white py-20 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="accolades-row grid grid-cols-1 md:grid-cols-3 gap-8">
            {accoladesList.map((ac, i) => (
              <div key={i} className="accolade-item flex flex-col gap-4 p-8 rounded-2xl bg-brand-dark">
                <span className="text-4xl" style={{ color: '#FFD700' }}>{ac.icon}</span>
                <h3 className="font-display font-semibold text-white text-xl">{ac.text}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{ac.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── What the judges said ─────────────────────────────────────────── */}
      <section className="bg-white py-24 section-padding">
        <div className="max-w-5xl mx-auto text-center">
          <p className="label text-brand-dark/30 mb-6 tracking-[0.3em]">{"THE FOUR A's OF SRI\u00a0LANKA"}</p>
          <blockquote
            className="font-display font-bold text-brand-dark leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            {"\"Sri\u00a0Lanka's premier industry benchmark for advertising excellence.\""}
          </blockquote>
          <p className="text-brand-dark/50 max-w-xl mx-auto leading-relaxed">
            The Four A's award panel judges campaigns on creative execution, strategic insight, audience impact, and measurable business results. Winning here is not about spectacle - it is about substance.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-dark py-28 section-padding overflow-hidden">
        <ParticleField accent="teal" count={200} spread={16} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(0,180,180,0.08), transparent)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="label text-white/70 mb-5 tracking-[0.3em]">WORK WITH US</p>
          <h2 className="font-display font-bold text-white mb-6 leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            Ready to create<br />
            <span className="gradient-text">award-worthy work?</span>
          </h2>
          <p className="text-white/40 mb-10 max-w-xl mx-auto leading-relaxed">
            Awards are a byproduct of work that truly moves people. That's always the goal. Let's start the conversation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-brand-pink text-white font-semibold hover:bg-brand-pink/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(232,0,90,0.4)]"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', letterSpacing: '0.05em' }}
            >
              Let's Talk
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', letterSpacing: '0.05em' }}
            >
              See All Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
