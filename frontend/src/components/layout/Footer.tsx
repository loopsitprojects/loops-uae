import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { getRecaptchaToken } from '@/lib/recaptcha'
import BrandLogo from '@/components/ui/BrandLogo'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || submitting) return
    setSubmitting(true)
    try {
      const recaptchaToken = await getRecaptchaToken('newsletter_subscribe')
      const res = await api.newsletter.subscribe(email, 'footer', recaptchaToken)
      setSubmitted(true)
      setMessage(res.message || "You're in the loop ✓")
      setEmail('')
    } catch (err: any) {
      console.error('Footer newsletter error:', err)
      setSubmitted(true)
      setMessage(err?.message || "Thank you! You're subscribed.")
    } finally {
      setSubmitting(false)
    }
  }
  const [footerData, setFooterData] = useState({
    copyright: '© 2026 Loops Integrated (Pvt) Ltd.',
    tagline: "Colombo's fully integrated marketing engine. Bold creative, digital performance, and unforgettable experiences for brave brands.",
    instagram_url: 'https://instagram.com/loopsintegrated',
    linkedin_url: 'https://linkedin.com/company/loops-integrated',
    facebook_url: 'https://facebook.com/loopsintegrated',
    tiktok_url: 'https://tiktok.com/@loopsintegrated',
    youtube_url: '',
    twitter_url: '',
  })

  useEffect(() => {
    api.settings()
      .then(res => {
        if (res && res.data && res.data.footer) {
          const f = res.data.footer
          setFooterData({
            copyright: f.copyright || '© 2026 Loops Integrated (Pvt) Ltd.',
            tagline: f.tagline || "Colombo's fully integrated marketing engine. Bold creative, digital performance, and unforgettable experiences for brave brands.",
            instagram_url: f.instagram_url ?? 'https://instagram.com/loopsintegrated',
            linkedin_url: f.linkedin_url ?? 'https://linkedin.com/company/loops-integrated',
            facebook_url: f.facebook_url ?? 'https://facebook.com/loopsintegrated',
            tiktok_url: f.tiktok_url ?? 'https://tiktok.com/@loopsintegrated',
            youtube_url: f.youtube_url ?? '',
            twitter_url: f.twitter_url ?? '',
          })
        }
      })
      .catch(err => {
        console.error('Failed to load global settings in Footer:', err)
      })
  }, [])

  const socialList = [
    {
      label: 'Instagram',
      href: footerData.instagram_url,
      color: '#E8005A',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.1" strokeWidth="3" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: footerData.linkedin_url,
      color: '#7B2FBE',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: footerData.facebook_url,
      color: '#1B3FB5',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      ),
    },
    {
      label: 'TikTok',
      href: footerData.tiktok_url,
      color: '#E8005A',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.8 1.54V6.78a4.85 4.85 0 01-1.03-.09z"/>
        </svg>
      ),
    },
  ].filter(s => !!s.href)



  return (
    <footer className="bg-brand-dark border-t border-white/5">
      {/* Main footer */}
      <div className="section-padding py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start justify-between">

          {/* Brand col */}
          <div className="max-w-md">
            <Link to="/" className="mb-6 group inline-block" aria-label="Loops Integrated Home">
              <BrandLogo size="md" />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              {footerData.tagline}
            </p>

            {/* Social icons — Loops brand-coloured */}
            <div className="flex gap-3">
              {socialList.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:scale-110"
                  style={{
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}35`,
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.background = `${s.color}40`
                    ;(e.currentTarget as HTMLElement).style.borderColor = `${s.color}80`
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${s.color}30`
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.background = `${s.color}18`
                    ;(e.currentTarget as HTMLElement).style.borderColor = `${s.color}35`
                    ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  }}
                >
                  <span style={{ color: s.color }}>
                    {s.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="max-w-md lg:ml-auto w-full">
            <p className="label text-white/70 mb-5">Newsletter</p>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Monthly creative insights & industry updates delivered to your inbox.
            </p>
            {submitted ? (
              <p className="text-brand-teal label font-medium">{message || "You're in the loop ✓"}</p>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={submitting}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 gradient-bg text-white label rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 section-padding py-6 flex items-center justify-center text-center">
        <p className="label text-white/30 text-center">{footerData.copyright}</p>
      </div>
    </footer>
  )
}
