import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BrandLogo from '@/components/ui/BrandLogo'
import NavLogoWebGL from '@/components/ui/NavLogoWebGL'
import { useNavigation } from '@/context/NavigationContext'

// Fallback top-level desktop links if API has not responded yet
const defaultTopLinks = [
  { label: 'Work',                 href: '/work' },
  { label: 'About',                href: '/about' },
  { label: 'Press & Achievements', href: '/press' },
  { label: 'Careers',              href: '/careers' },
]

// Fallback sub-pages under "Integrated" dropdown
const defaultIntegratedLinks = [
  { label: 'Creative',              href: '/creative',              icon: '✦', desc: 'Brand identity & campaigns' },
  { label: 'Digital',               href: '/digital',               icon: '◎', desc: 'Performance & growth' },
  { label: 'Tech',                  href: '/tech',                  icon: '⬡', desc: 'MarTech & automation' },
  { label: 'Play',                  href: '/play',                  icon: '⌬', desc: 'Productions & content' },
  { label: 'AI Content',            href: '/ai-content',            icon: '⬟', desc: 'AI-powered content engine' },
  { label: 'Performance Marketing', href: '/performance-marketing', icon: '📈', desc: 'Data-driven growth & ROI' },
  { label: 'Events & Experiences',  href: '/events',                icon: '⬢', desc: 'Activations & management' },
]

export default function Navbar() {
  const { navbarPublished, pages } = useNavigation()

  const [scrolled, setScrolled]             = useState(false)
  const [menuOpen, setMenuOpen]             = useState(false)
  const [dropOpen, setDropOpen]             = useState(false)
  const [mobileIntegratedOpen, setMobileIntegratedOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const location = useLocation()
  const dropRef  = useRef<HTMLDivElement>(null)
  const dropTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Compute active navigation links dynamically from database settings
  const topLinks = useMemo(() => {
    if (!pages || pages.length === 0) return defaultTopLinks
    return pages
      .filter(p => p.nav_group === 'top' && p.show_in_nav && p.is_published)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(p => ({ label: p.label, href: p.url }))
  }, [pages])

  const integratedLinks = useMemo(() => {
    if (!pages || pages.length === 0) return defaultIntegratedLinks
    return pages
      .filter(p => p.nav_group === 'integrated' && p.show_in_nav && p.is_published)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(p => ({
        label: p.label,
        href: p.url,
        icon: p.icon || '✦',
        desc: p.description || '',
      }))
  }, [pages])

  const ctaLink = useMemo(() => {
    if (!pages || pages.length === 0) return { label: "Let's Talk", href: '/contact' }
    const cta = pages.find(p => p.nav_group === 'cta')
    if (cta && cta.show_in_nav && cta.is_published) {
      return { label: cta.label || "Let's Talk", href: cta.url || '/contact' }
    }
    return null
  }, [pages])

  useEffect(() => {
    setMenuOpen(false)
    setDropOpen(false)
    setMobileIntegratedOpen(false)
  }, [location])

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('mobile-menu-open')
    } else {
      document.body.classList.remove('mobile-menu-open')
    }
    return () => {
      document.body.classList.remove('mobile-menu-open')
    }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => {
      const y   = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > 60)
      setScrollProgress(max > 0 ? y / max : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openDrop  = () => { if (dropTimer.current) clearTimeout(dropTimer.current); setDropOpen(true) }
  const closeDrop = () => { dropTimer.current = setTimeout(() => setDropOpen(false), 140) }

  // Check if any integrated sub-page is active
  const integratedActive = integratedLinks.some(l => location.pathname === l.href)

  // If the Nav Bar is unpublished globally from the admin panel, hide it
  if (!navbarPublished) {
    return null
  }

  const firstTopLink = topLinks.length > 0 ? topLinks[0] : null
  const remainingTopLinks = topLinks.length > 1 ? topLinks.slice(1) : []
  const hasAnyLinks = topLinks.length > 0 || integratedLinks.length > 0 || !!ctaLink

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-brand-dark/95 backdrop-blur-xl border-b border-white/8 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'bg-gradient-to-b from-black/85 via-black/40 to-transparent py-4'
        }`}
      >
        {/* Scroll progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-100"
          style={{
            width: `${scrollProgress * 100}%`,
            background: 'linear-gradient(90deg, #E8005A, #7B2FBE, #1B3FB5, #00B4B4)',
          }}
        />

        <div className="section-padding flex items-center justify-between relative min-h-[48px]">
          {/* Left area (Desktop links) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-start z-10">
            {firstTopLink && (
              <Link
                key={firstTopLink.href}
                to={firstTopLink.href}
                className={`transition-all duration-200 relative drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-white after:transition-all after:duration-300 ${
                  location.pathname === firstTopLink.href || (firstTopLink.href === '/press' && location.pathname === '/pr')
                    ? 'text-white font-bold after:w-full'
                    : 'text-white/90 hover:text-white font-semibold after:w-0 hover:after:w-full'
                }`}
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.90rem' }}
              >
                {firstTopLink.label}
              </Link>
            )}

            {/* Integrated dropdown (only if at least 1 sub-service is published) */}
            {integratedLinks.length > 0 && (
              <div
                ref={dropRef}
                className="relative"
                onMouseEnter={openDrop}
                onMouseLeave={closeDrop}
              >
                <button
                  className={`flex items-center gap-1.5 transition-all duration-200 relative drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-white after:transition-all after:duration-300 ${
                    integratedActive || dropOpen
                      ? 'text-white font-bold after:w-full'
                      : 'text-white/90 hover:text-white font-semibold after:w-0 hover:after:w-full'
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.92rem' }}
                >
                  Integrated
                  <motion.svg
                    animate={{ rotate: dropOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-3.5 h-3.5 text-white opacity-90"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-0 mt-4 w-80 rounded-2xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.95)]"
                      style={{
                        background: '#12121A',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                      onMouseEnter={openDrop}
                      onMouseLeave={closeDrop}
                    >
                      {/* Header strip */}
                      <div className="px-5 py-3.5 border-b border-white/15 bg-white/[0.04]">
                        <p
                          className="text-brand-pink font-bold uppercase tracking-wider"
                          style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.75rem', letterSpacing: '0.12em' }}
                        >
                          Integrated Services
                        </p>
                      </div>

                      {integratedLinks.map((link, i) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setDropOpen(false)}
                          className={`group flex items-center gap-4 px-5 py-3.5 transition-all duration-200 ${
                            location.pathname === link.href
                              ? 'bg-brand-pink/15'
                              : 'hover:bg-white/10'
                          } ${i < integratedLinks.length - 1 ? 'border-b border-white/10' : ''}`}
                        >
                          <div className="w-6 h-6 flex items-center justify-center shrink-0">
                            <NavLogoWebGL size={22} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`transition-colors duration-200 leading-snug mb-0.5 ${
                                location.pathname === link.href ? 'text-white font-bold' : 'text-white group-hover:text-brand-pink font-semibold'
                              }`}
                              style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem' }}
                            >
                              {link.label}
                            </p>
                            <p
                              className="text-gray-300 group-hover:text-white transition-colors duration-200"
                              style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.78rem', fontWeight: 400 }}
                            >
                              {link.desc}
                            </p>
                          </div>
                          {location.pathname === link.href && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-brand-pink flex-shrink-0 shadow-[0_0_8px_#E8005A]" />
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Centered Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-auto">
            <Link to="/" className="flex items-center justify-center group" aria-label="Loops Integrated Home">
              <span className="lg:hidden"><BrandLogo size="mobile" /></span>
              <span className="hidden lg:inline-flex"><BrandLogo size="md" /></span>
            </Link>
          </div>

          {/* Right area (Desktop trailing links, CTA & Mobile Hamburger) */}
          <div className="flex items-center gap-6 xl:gap-8 flex-1 justify-end z-10">
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {remainingTopLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`transition-all duration-200 relative drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-white after:transition-all after:duration-300 ${
                    location.pathname === link.href || (link.href === '/press' && location.pathname === '/pr')
                      ? 'text-white font-bold after:w-full'
                      : 'text-white/90 hover:text-white font-semibold after:w-0 hover:after:w-full'
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.90rem' }}
                >
                  {link.label}
                </Link>
              ))}

              {ctaLink && (
                <Link
                  to={ctaLink.href}
                  className="px-5 py-2.5 rounded-full bg-white/12 border border-white/30 text-white hover:bg-brand-pink hover:border-brand-pink hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.80rem', fontWeight: 600 }}
                >
                  {ctaLink.label}
                </Link>
              )}
            </div>

            {/* Hamburger on mobile */}
            {hasAnyLinks && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex flex-col gap-2 p-3 z-[60]"
                aria-label="Toggle menu"
              >
                <motion.span animate={menuOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }} className="block w-7 h-0.5 bg-white" />
                <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} className="block w-7 h-0.5 bg-white origin-left" />
                <motion.span animate={menuOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }} className="block w-7 h-0.5 bg-white" />
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-brand-dark flex flex-col justify-between pt-24 pb-8 section-padding overflow-y-auto"
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #7B2FBE, transparent)' }}
            />

            <div className="relative flex flex-col gap-2 py-2">
              {/* 1. First top link (Work) */}
              {firstTopLink && (
                <motion.div
                  initial={{ x: -25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05, duration: 0.35 }}
                >
                  <Link
                    to={firstTopLink.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-white hover:text-brand-pink transition-colors py-1.5"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 6.5vw, 3rem)', letterSpacing: '-0.02em' }}
                  >
                    {firstTopLink.label}
                  </Link>
                </motion.div>
              )}

              {/* 2. Integrated Services (Collapsible Accordion) */}
              {integratedLinks.length > 0 && (
                <motion.div
                  initial={{ x: -25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="border-y border-white/10 py-2.5 my-1"
                >
                  <button
                    onClick={() => setMobileIntegratedOpen(!mobileIntegratedOpen)}
                    className="w-full flex items-center justify-between text-white hover:text-brand-pink transition-colors py-1 text-left group"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 6.5vw, 3rem)', letterSpacing: '-0.02em' }}
                  >
                    <span className="flex items-center gap-3">
                      Integrated
                      <span className="text-xs font-mono font-normal uppercase tracking-widest text-brand-pink bg-brand-pink/15 px-2.5 py-0.5 rounded-full border border-brand-pink/30">
                        Services
                      </span>
                    </span>
                    <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300 ${mobileIntegratedOpen ? 'rotate-180 bg-brand-pink/20 border-brand-pink' : 'group-hover:border-white/40'}`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Collapsible Sub-Services */}
                  <AnimatePresence>
                    {mobileIntegratedOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden pl-2 mt-3 flex flex-col gap-2 border-l-2 border-brand-pink/40"
                      >
                        {integratedLinks.map((sub) => (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            onClick={() => setMenuOpen(false)}
                            className="group flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/5 transition-all"
                          >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              <NavLogoWebGL size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white font-semibold text-base group-hover:text-brand-pink transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {sub.label}
                              </span>
                              <span className="text-xs text-white/50 group-hover:text-white/70">
                                {sub.desc}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* 3. Trailing top links (About, Press, Careers, etc.) */}
              {remainingTopLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + idx * 0.05, duration: 0.35 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-white hover:text-brand-pink transition-colors py-1.5"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 6.5vw, 3rem)', letterSpacing: '-0.02em' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* 4. Contact / CTA link */}
              {ctaLink && (
                <motion.div
                  initial={{ x: -25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + remainingTopLinks.length * 0.05, duration: 0.35 }}
                >
                  <Link
                    to={ctaLink.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-white hover:text-brand-pink transition-colors py-1.5"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 6.5vw, 3rem)', letterSpacing: '-0.02em' }}
                  >
                    {ctaLink.label}
                  </Link>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative mt-6 flex flex-col gap-3.5 w-full"
            >
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/94755253006"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-display font-bold text-base sm:text-lg tracking-tight shadow-[0_8px_25px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.45)] hover:scale-[1.01] transition-all duration-300 group"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.156-1.352a9.932 9.932 0 0 0 4.854 1.258h.004c5.507 0 9.99-4.478 9.99-9.984 0-2.667-1.037-5.176-2.923-7.062A9.92 9.92 0 0 0 12.012 2zm5.781 14.19c-.317.892-1.84 1.748-2.54 1.81-.6.054-1.201.264-3.834-.772-3.37-1.328-5.525-4.757-5.693-4.979-.168-.22-1.354-1.802-1.354-3.438 0-1.636.85-2.441 1.15-2.772.3-.331.65-.414.867-.414.217 0 .433.001.624.01.196.008.459-.074.721.554.267.64.912 2.228.991 2.392.08.163.132.353.024.568-.109.215-.163.348-.326.537-.162.189-.34.422-.486.566-.16.158-.328.33-.14.653.188.324.836 1.378 1.793 2.229.962.85 1.77 1.112 2.072 1.261.303.15.481.127.662-.078.18-.205.779-.905.986-1.213.208-.309.416-.258.7-.152.285.105 1.81.854 2.122 1.01.312.156.52.234.595.363.075.13.075.752-.243 1.644z" />
                  </svg>
                </div>
                <span>Chat on WhatsApp</span>
              </a>

              {/* Email Button */}
              <a
                href="mailto:hello@loops.lk"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E8005A] via-[#7B2FBE] to-[#1B3FB5] text-white font-display font-bold text-base sm:text-lg tracking-tight shadow-[0_8px_25px_rgba(232,0,90,0.3)] hover:shadow-[0_12px_32px_rgba(232,0,90,0.45)] hover:scale-[1.01] transition-all duration-300 group"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-none stroke-white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Drop Us an Email</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
