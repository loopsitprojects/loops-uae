import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { api } from '@/lib/api'

gsap.registerPlugin(ScrollTrigger)

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const [content, setContent] = useState({
    headline: 'Stay in the Loop',
    subheadline: "Get fresh thinking, campaign stories, and industry insights from Sri\u00a0Lanka's most integrated agency.",
    cta_label: 'Subscribe',
    placeholder: 'your@email.com',
  })

  useEffect(() => {
    // Fetch Newsletter section from home page config
    api.pages.get('home')
      .then(res => {
        if (res && res.data && res.data.newsletter) {
          const n = res.data.newsletter
          setContent({
            headline: n.headline || 'Stay in the Loop',
            subheadline: n.subheadline || "Get fresh thinking, campaign stories, and industry insights from Sri\u00a0Lanka's most integrated agency.",
            cta_label: n.cta_label || 'Subscribe',
            placeholder: n.placeholder || 'your@email.com',
          })
        }
      })
      .catch(err => {
        console.error('Failed to load newsletter copy in NewsletterCTA:', err)
      })
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            '.cta-content > *',
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
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
  }, [])

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || submitting) return
    setSubmitting(true)
    try {
      const res = await api.newsletter.subscribe(email, 'home_cta')
      setSubmitted(true)
      setMessage(res.message || "You're in the loop!")
      setEmail('')
    } catch (err: any) {
      console.error('Subscription error:', err)
      setSubmitted(true)
      setMessage(err?.message || "Thank you! You're subscribed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden section-padding py-28"
      style={{ background: 'linear-gradient(95deg, #E8005A 0%, #7B2FBE 50%, #1B3FB5 100%)' }}
    >
      {/* Noise */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Concentric circles watermark */}
      <div className="absolute -right-32 -top-32 opacity-25 select-none pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-[350px] h-[350px] md:w-[600px] md:h-[600px]">
          {/* Inner circle */}
          <circle cx="200" cy="200" r="60" fill="white" opacity="0.15" />
          {/* Middle ring */}
          <circle cx="200" cy="200" r="120" stroke="white" strokeWidth="32" fill="none" opacity="0.1" />
          {/* Outer ring */}
          <circle cx="200" cy="200" r="200" stroke="white" strokeWidth="48" fill="none" opacity="0.05" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl cta-content">
        <p className="label text-white/60 mb-6 tracking-[0.2em]">Stay in the Loop</p>
        <h2 className="heading-xl fluid-xl text-white mb-6 max-w-xl leading-tight font-bold">
          {content.headline === 'Stay in the Loop' ? (
            <>
              Stay in the <br /> Loop
            </>
          ) : (
            content.headline
          )}
        </h2>
        <p className="text-white/80 fluid-sm leading-relaxed mb-10 max-w-xl">
          {content.subheadline}
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur rounded-full">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
              <svg className="w-3 h-3 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="label text-white">{message || "You're in the loop!"}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={content.placeholder}
              required
              disabled={submitting}
              className="flex-1 bg-white/20 backdrop-blur border border-white/30 rounded-full px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/30 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 bg-white text-brand-dark font-mono font-bold rounded-full hover:bg-white/90 transition-colors whitespace-nowrap label disabled:opacity-60"
            >
              {submitting ? 'Subscribing...' : content.cta_label}
            </button>
          </form>
        )}

        <div className="mt-8">
          <Link to="/work" className="inline-flex items-center gap-1 text-white/60 hover:text-white label transition-colors duration-200 group">
            Visit News & Newsletters
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
