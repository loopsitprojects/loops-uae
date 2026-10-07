import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { services, Service } from '@/data/services'
import { motion } from 'framer-motion'
import { api, Product, resolveImageUrl } from '@/lib/api'

gsap.registerPlugin(ScrollTrigger)

const CAPABILITY_DESCRIPTIONS: Record<string, string> = {
  // Tech page capabilities
  'Web Design & Dev': 'Designing and developing high-performance, modern, and SEO-optimized web interfaces.',
  'E-commerce Platforms': 'Building scalable, secure online stores with custom cart, checkout, and inventory integrations.',
  'CMS & DAM': 'Implementing flexible Content Management Systems and Digital Asset Management workflows for easy content updates.',
  'Marketing Automation': 'Deploying automated user journeys, custom email triggers, and CRM integrations to nurture leads.',
  'API Integrations': 'Connecting disparate platforms with robust, secure, and fast customized REST/GraphQL API connections.',
  'Data & Analytics Pipelines': 'Tracking conversion events, building analytics dashboards, and streaming clean user data pipelines.',

  // Creative page capabilities
  'Brand Strategy': 'Defining brand purpose, values, positioning, and market opportunities to build strong foundations.',
  'Campaign Concept': 'Crafting viral campaign ideas and attention-grabbing activations that spark consumer conversations.',
  'Art Direction': 'Establishing premium visual identity guidelines, design templates, and aesthetics across channels.',
  'Copywriting': 'Writing clear, punchy, and persuasive content and campaign slogans that drive engagement.',
  'TV & Film Production': 'Shooting high-end TV commercials, documentary shorts, and high-impact social video content.',
  'OOH & Print': 'Designing billboards, banners, print ads, and visual signage for maximum physical presence.',

  // Digital page capabilities
  'Paid Social': 'Optimizing targeted ad spend on platforms like Meta, LinkedIn, and TikTok to drive conversions.',
  'Search & SEO': 'Ranking in organic search engines and building structured paid search funnels.',
  'Performance Creative': 'Designing high-converting ad assets and variations for iterative multivariate testing.',
  'Social Media Management': 'Managing community growth, content calendars, and active profiles daily.',
  'Influencer Strategy': 'Partnering with relevant content creators and thought leaders for authentic brand advocacy.',
  'Analytics & Reporting': 'Providing granular attribution tracking, campaign ROI dashboards, and business insights.',

  // Play page capabilities
  'Brand Activations': 'Designing interactive physical pop-ups and live experiences to engage customers in person.',
  'Product Launches': 'Unveiling new products through memorable press, VIP, and influencer events.',
  'Experiential Design': 'Blending physical environments with digital integrations to create immersive brand worlds.',
  'Event Production': 'Managing end-to-end logistics, staging, and technical operations for conferences.',
  'Pop-up Retail': 'Creating temporary physical storefronts to test markets and drive immediate sales.',
  'Immersive Installations': 'Building spatial audio-visual exhibits and sensory experiences that capture attention.',

  // AI Content page capabilities
  'AI Content Strategy': 'Mapping AI tools to production bottlenecks to scale copy and asset creation.',
  'Large-scale Social Production': 'Generating thousands of on-brand content variants for multi-channel targeting.',
  'Localisation at Scale': 'Translating and cultural-adapting campaigns across languages instantly.',
  'Dynamic Creative Optimisation': 'Serving real-time personalized copy and layout variations matching user segments.',
  'Prompt Engineering': 'Designing precise LLM guidelines to ensure high-fidelity brand voice alignment.',
  'Quality Control & Brand Safety': 'Validating AI outputs with human-in-the-loop editors to prevent deviations.',

  // Performance Marketing page capabilities
  'Paid Search & PPC (Google Ads)': 'Capturing high-intent search traffic with highly targeted keywords, smart bidding, and conversion-focused copy.',
  'Paid Social Campaigns (Meta, LinkedIn, TikTok)': 'Driving acquisition across social platforms with dynamic audience targeting and high-converting ad creative.',
  'Conversion Rate Optimization (CRO)': 'Analyzing user friction and conducting multivariate landing page tests to turn existing traffic into paying customers.',
  'Data Analytics & Multi-Touch Attribution': 'Implementing clean data pipelines, event tracking, and attribution dashboards for complete ROI transparency.',
  'Programmatic & Retargeting Media': 'Re-engaging high-value prospective buyers across ad networks and premium publisher placements automatically.',
  'Funnel Automation & Growth Hacking': 'Automating email/SMS nurture sequences, customer lifecycle triggers, and rapid growth experiments.',

  // Events page capabilities
  'Brand Dinners & VIP Gatherings': 'Curating exclusive menus and invite-only atmospheres for press and partners.',
  'Conferences & Exhibitions': 'Coordinating multi-track keynotes and booth spaces for industry summits.',
  'Award Ceremonies': 'Staging grand awards productions with live stream support and high-end logistics.'
}

const fallbackProducts = [
  {
    id: 1,
    title: 'Custom CRM Development',
    description: "Tailored To Our Workflow: The In-House CRM Solution. Developed a custom CRM platform in-house to centralize customer profiles, history, and sales interactions in a single dashboard without recurring fees. Streamlined daily operations and deal tracking while keeping all sensitive customer data completely secure on private infrastructure.",
    cta_label: 'Request CRM Demo',
    cta_link: '/contact?interest=crm',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Custom Internal HR Portal',
    description: "HR Portal, Built In House For Total Control. Engineered a dedicated internal HR platform digitizing records, recruitment, leave requests, and multi-level approvals. Eliminated manual recruitment & leave tracking errors while ensuring all workforce data remains 100% secure on private internal servers.",
    cta_label: 'Request HR Portal Demo',
    cta_link: '/contact?interest=hr-system',
    image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Custom AI Virtual Try-On App',
    description: "AI Virtual Try Ons, Built Exclusively For Raja Jewellers. Developed a proprietary AI-powered virtual try-on web & mobile app allowing live photo previews of necklaces & earrings without storing customer images internally. Dramatically boosted online engagement, conversion rates, and trust while ensuring full data protection compliance.",
    cta_label: 'Explore Virtual Try-on',
    cta_link: '/contact?interest=tryon',
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Custom AI Virtual "Maliban Real Temptation"',
    description: "Real Temptation. Real People. Real Models. Built an interactive AI kiosk & mobile web experience at One Galle Face Mall where consumer selfies were transformed into stylized photoshoot-quality model images. Generated viral user content across social media as participants became organic brand ambassadors to unlock gifts, driving record engagement and sales.",
    cta_label: 'Experience AI Activation',
    cta_link: '/contact?interest=ai-activation',
    image_url: '/images/tech-works/maliban-real-temptation.png',
  },
  {
    id: 5,
    title: 'AI Integrated Websites',
    description: 'High-performance websites powered by machine learning for personalized user journeys, intelligent search, and dynamic content adaptation.',
    cta_label: 'Build AI Website',
    cta_link: '/contact?interest=ai-web',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Multilingual AI Chatbots',
    description: 'Intelligent conversational agents offering natural customer support, lead qualification, and 24/7 instant assistance across WhatsApp, Facebook, and Web.',
    cta_label: 'Deploy a Chatbot',
    cta_link: '/contact?interest=chatbot',
    image_url: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=800&q=80',
  },
]

function ProductInquiryModal({
  product,
  accentColor,
  onClose,
}: {
  product: Product
  accentColor: string
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState(`I am interested in ${product.title}. Please send me more information.`)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      setError('Name and Email are required.')
      return
    }
    setSubmitting(true)
    setError('')

    api.contact({
      name,
      email,
      message: `[Product Inquiry: ${product.title}]${phone ? ` (Phone: ${phone})` : ''} ${message}`,
    })
      .then(res => {
        if (res && res.message) {
          setSuccess(true)
        } else {
          setError('Something went wrong. Please try again.')
        }
      })
      .catch(() => {
        setError('Failed to send inquiry. Please try again.')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* Close backdrop */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Modal card */}
      <div className="relative w-full max-w-2xl bg-brand-dark/95 border border-white/10 rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col md:flex-row">

        {/* Info panel */}
        <div className="w-full md:w-5/12 bg-white/5 border-r border-white/5 p-6 flex flex-col justify-between">
          <div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-brand-dark mb-4 border border-white/10">
              {product.image_url ? (
                <img src={resolveImageUrl(product.image_url)} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-brand-teal/10 to-brand-blue/10 flex items-center justify-center text-brand-teal/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
              )}
            </div>
            <h3 className="font-display font-600 text-white text-xl mb-3">{product.title}</h3>
            <p className="text-white/60 text-xs leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 hidden md:block">
            <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/30">Loops Technology</span>
          </div>
        </div>

        {/* Form panel */}
        <div className="w-full md:w-7/12 p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {success ? (
            <div className="h-full flex flex-col justify-center text-center py-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: accentColor + '20', color: accentColor }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-white font-display text-lg font-600 mb-2">Inquiry Submitted!</h4>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
                Thank you for contacting us. Our technology agents will reach out to you shortly.
              </p>
              <button onClick={onClose} className="btn-outline text-xs mt-6 mx-auto">Close Window</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-white font-display text-lg font-600 mb-2">Request Information</h4>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[0.65rem] font-mono uppercase tracking-wider text-white/50 mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
                  onFocus={e => e.target.style.borderColor = accentColor}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-mono uppercase tracking-wider text-white/50 mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
                  onFocus={e => e.target.style.borderColor = accentColor}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-mono uppercase tracking-wider text-white/50 mb-1.5">Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+94 XX XXX XXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
                  onFocus={e => e.target.style.borderColor = accentColor}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-mono uppercase tracking-wider text-white/50 mb-1.5">Inquiry Details</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors resize-none"
                  onFocus={e => e.target.style.borderColor = accentColor}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl text-xs font-mono font-600 uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: accentColor, color: '#fff' }}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : 'Submit Request'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}

export default function ServicePage() {
  const location = useLocation()
  const slug = location.pathname.replace('/', '')
  const pageRef = useRef<HTMLDivElement>(null)

  const fallbackService = services.find(s => s.slug === slug)
  const [service, setService] = useState<Service | null>(fallbackService || null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>(fallbackProducts as Product[])
  const [relatedWork, setRelatedWork] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    // Instant scroll to top on page navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Set fallback service for instant full-height rendering
    const currentFallback = services.find(s => s.slug === slug)
    if (currentFallback) {
      setService(currentFallback)
    }

    // Load Service details from database
    api.services.show(slug)
      .then(res => {
        if (res && res.data) {
          const apiService = res.data
          setService({
            slug: apiService.slug,
            title: apiService.title,
            headline: apiService.headline,
            subheadline: apiService.subheadline,
            description: apiService.description,
            capabilities: apiService.capabilities || [],
            cta: apiService.cta_label,
            ctaLink: apiService.cta_link,
            accentColor: apiService.accent_color,
            icon: apiService.icon,
            what_we_do_text: apiService.what_we_do_text,
          })
        }
      })
      .catch(err => {
        console.error('Failed to load service from database:', err)
      })

    // Load products from API if viewing the Tech page
    if (slug === 'tech') {
      api.products.list()
        .then(res => {
          if (res && res.data && res.data.length) {
            setProducts(res.data)
          } else {
            setProducts(fallbackProducts as Product[])
          }
        })
        .catch(err => {
          console.error('Failed to load products from API:', err)
          setProducts(fallbackProducts as Product[])
        })
    } else {
      setProducts([])
    }

    // Load related work dynamically from API database
    let categoryParam = slug
    if (slug === 'tech') {
      categoryParam = 'martech'
    } else if (slug === 'play') {
      categoryParam = 'productions,production'
    } else if (slug === 'ai-content') {
      categoryParam = 'ai'
    } else if (slug.toLowerCase() === 'performance-marketing' || slug === 'Performance Marketing') {
      categoryParam = 'Performance Marketing,performance-marketing'
    }

    api.portfolio.list({ category: categoryParam, per_page: 3 })
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          setRelatedWork(res.data)
        } else {
          // Fallback to featured portfolio items if specific category returns empty
          api.portfolio.list({ featured: true, per_page: 3 })
            .then(featRes => {
              if (featRes && featRes.data) {
                setRelatedWork(featRes.data)
              }
            })
            .catch(() => setRelatedWork([]))
        }
      })
      .catch(err => {
        console.error('Failed to load related works from API:', err)
        api.portfolio.list({ featured: true, per_page: 3 })
          .then(featRes => {
            if (featRes && featRes.data) {
              setRelatedWork(featRes.data)
            }
          })
          .catch(() => setRelatedWork([]))
      })
  }, [location.pathname])

  useEffect(() => {
    if (loading || !service) return

    const ctx = gsap.context(() => {
      gsap.from('.service-cap', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.caps-section', start: 'top 75%' },
      })
    }, pageRef)
    return () => ctx.revert()
  }, [loading, location.pathname, service])

  if (!service) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/70 label mb-4">404</p>
          <Link to="/" className="btn-outline">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef}>
      {/* Hero — BLACK */}
      <section
        className="bg-brand-dark section-padding pt-36 pb-24 relative overflow-hidden"
      >
        {/* Accent glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: service.accentColor }}
        />

        <div className="max-w-5xl relative z-10">
          <h1 className="heading-hero fluid-xl text-white mb-6">{service.title}</h1>
          <p className="heading-lg fluid-md text-white/60 mb-8 max-w-3xl">{service.headline}</p>
          <p className="text-white/40 fluid-sm leading-relaxed max-w-2xl mb-12">{service.description}</p>
          <Link
            to={service.ctaLink}
            className="btn-primary"
            style={{ backgroundColor: service.accentColor, color: '#fff' }}
          >
            {service.cta}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Capabilities — WHITE */}
      <section className="bg-white section-padding py-24 caps-section">
        <div className="max-w-5xl mx-auto">
          <p className="text-xl md:text-2xl font-bold text-black tracking-tight mb-8 font-sans">What We Do</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.capabilities.map((capItem: any, i) => {
              const title = typeof capItem === 'string' ? capItem : (capItem.label || capItem.title || 'Capability')
              const description = (typeof capItem === 'object' && capItem.description) ? capItem.description : (CAPABILITY_DESCRIPTIONS[title] || '')
              return (
                <motion.div
                  key={title + i}
                  className="service-cap flex items-start gap-4 p-6 rounded-2xl border border-brand-dark/8 hover:border-brand-dark/12 bg-brand-dark/[0.02] transition-colors duration-300 group"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2.5 shrink-0"
                    style={{ backgroundColor: service.accentColor }}
                  />
                  <div>
                    <h3 className="text-brand-dark font-semibold text-lg leading-snug mb-1 transition-colors group-hover:text-black">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-brand-dark/50 text-sm leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-16 p-8 rounded-2xl gradient-bg text-white">
            <p className="font-display font-700 text-2xl leading-tight mb-4 whitespace-pre-line">
              {service.what_we_do_text || "We don't do safe.\nWe do work that cuts through the noise."}
            </p>
            <Link to={service.ctaLink} className="btn-outline text-sm inline-flex">
              {service.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section — BLACK (Tech page only) */}
      {slug === 'tech' && products.length > 0 && (
        <section className="bg-brand-dark border-t border-white/5 section-padding py-24">
          <div className="max-w-5xl mx-auto">
            <p className="label text-brand-teal mb-4">Our Software &amp; Tools</p>
            <h2 className="heading-xl fluid-lg text-white mb-12">
              Custom <span className="gradient-text">Products</span> we've built.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-brand-teal/40 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
                >
                  {/* Card Image */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-brand-dark border-b border-white/5">
                    {product.image_url ? (
                      <img
                        src={resolveImageUrl(product.image_url)}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-brand-teal/10 to-brand-blue/10 flex items-center justify-center p-6 text-white/10 group-hover:text-brand-teal/20 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16">
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-display font-600 text-white text-xl leading-tight mb-3 group-hover:text-brand-teal transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-6">
                      {product.description}
                    </p>

                    <button
                      className="mt-auto inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/70 hover:text-white transition-all group-hover:translate-x-1 duration-200 text-left"
                    >
                      {product.cta_label || 'Learn More'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related work — BLACK */}
      {relatedWork.length > 0 && (
        <section className="bg-brand-dark section-padding py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <p className="text-white font-display font-bold text-xl md:text-2xl tracking-tight mb-4">Case Studies</p>
            <h2 className="heading-xl fluid-lg text-white mb-12 font-display font-bold">
              Featured <span className="bg-gradient-to-r from-brand-pink via-purple-400 to-cyan-400 bg-clip-text text-transparent">Works.</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedWork.map(item => {
                const rawThumb = item.thumbnail_url || item.hero_url || item.thumbnail || item.image_url || '/images/default.jpg'
                const thumbUrl = resolveImageUrl(rawThumb)
                const isClickable = item.is_clickable !== false
                const resultText = item.result

                const cardContent = (
                  <>
                    {/* Full-bleed Header Image */}
                    <div className="relative overflow-hidden w-full aspect-[16/10] bg-neutral-900 flex items-center justify-center">
                      <img
                        src={thumbUrl}
                        alt={item.title}
                        loading="eager"
                        // @ts-ignore
                        fetchpriority="high"
                        decoding="async"
                        className={`w-full h-full object-cover transition-transform duration-700 ${isClickable ? 'group-hover:scale-105' : ''}`}
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
                      <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-3">{item.insight || item.brief}</p>
                      {resultText && (
                        <div className="mt-auto pt-3.5 border-t border-white/10 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold text-xs shrink-0 mt-0.5">↑</span>
                          <span className="text-slate-200 text-xs leading-relaxed font-sans font-medium line-clamp-2">
                            {resultText}
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

            {/* View More Button */}
            <div className="mt-12 text-center">
              <Link
                to={`/work?category=${slug === 'tech' ? 'martech' : slug === 'play' ? 'productions' : slug}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 hover:border-white/50 text-white/80 hover:text-white text-xs font-mono tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] bg-white/[0.02]"
              >
                View More {service.title} Works
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-white section-padding py-24 text-center border-t border-brand-dark/5">
        <p className="label text-brand-dark/40 mb-4">Get Started</p>
        <h2 className="heading-xl fluid-lg text-brand-dark mb-8">
          Ready to {service.title === 'Creative' ? 'create' : service.title === 'Digital' ? 'grow' : 'build'} something amazing?
        </h2>
        <Link to="/contact" className="btn-primary inline-flex">
          Let's Talk
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>

      {/* Selected Product Modal */}
      {selectedProduct && (
        <ProductInquiryModal
          product={selectedProduct}
          accentColor={service.accentColor}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
