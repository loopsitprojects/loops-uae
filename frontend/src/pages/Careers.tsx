import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { api, Job } from '@/lib/api'
import ApplyModal from '@/components/ui/ApplyModal'
import ParticleField from '@/components/ui/ParticleField'

gsap.registerPlugin(ScrollTrigger)

interface Benefit {
  icon: string
  title: string
  description: string
}

const DEPT_GRADIENTS = [
  'linear-gradient(135deg, #E8005A, #7B2FBE)',
  'linear-gradient(135deg, #7B2FBE, #1B3FB5)',
  'linear-gradient(135deg, #1B3FB5, #00B4B4)',
  'linear-gradient(135deg, #00B4B4, #E8005A)',
]

function deptGradient(dept: string) {
  let hash = 0
  for (let i = 0; i < dept.length; i++) hash = dept.charCodeAt(i) + ((hash << 5) - hash)
  return DEPT_GRADIENTS[Math.abs(hash) % DEPT_GRADIENTS.length]
}

export default function Careers() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Careers page config settings from database
  const [hero, setHero] = useState({
    label: 'Careers',
    headline: 'Join the loop',
    description: 'We are always on the lookout for bright minds, bold creators, and disruptive developers. Explore our open roles, challenge the status quo, and help us build what\'s next.'
  })
  const [benefits, setBenefits] = useState<Benefit[]>([
    { icon: 'sparkles', title: 'Award-Winning Team', description: 'Collaborate with top-tier talent and award-winning minds in creative and technology fields.' },
    { icon: 'fire', title: 'Dynamic Growth', description: 'Accelerated career pathways, training budgets, and opportunities to lead next-gen agency solutions.' },
    { icon: 'bolt', title: 'Modern Workstyles', description: 'Hybrid work flexibility, flexible timings, and modern offices designed for deep work and high collaboration.' }
  ])

  // Filters
  const [departments, setDepartments] = useState<string[]>(['All'])
  const [activeDept, setActiveDept] = useState('All')
  const [departmentsCount, setDepartmentsCount] = useState<number>(0)
  const [officesCount, setOfficesCount] = useState<number>(0)

  // Expanded Job Opening Accordion
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null)

  // Active Job for Apply Modal
  const [applyJob, setApplyJob] = useState<Job | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)

    // 1. Fetch careers layout sections
    api.pages.get('careers')
      .then(res => {
        if (res.data) {
          const heroData = res.data.hero
          if (heroData) {
            setHero({
              label: heroData.label || 'Careers',
              headline: (heroData.headline || 'Join the loop').replace(/\.+$/, ''),
              description: heroData.description || ''
            })
          }
          const benefitsData = res.data.benefits
          if (benefitsData && (benefitsData as any).benefits) {
            setBenefits((benefitsData as any).benefits as Benefit[])
          }
        }
      })
      .catch(err => console.error('Failed to load Careers settings:', err))

    // 2. Fetch job listings
    api.jobs.list()
      .then(res => {
        if (res.data) {
          setJobs(res.data)
          setFilteredJobs(res.data)

          // Filter department tabs to show ONLY departments with available jobs
          const availableDepts = Array.from(new Set(res.data.map(j => j.department).filter((d): d is string => Boolean(d))))
          setDepartments(['All', ...availableDepts])
          setDepartmentsCount(availableDepts.length)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load job listings:', err)
        setLoading(false)
      })

    // 4. Fetch active offices
    api.offices.list()
      .then(res => {
        if (res.data) {
          setOfficesCount(res.data.length)
        }
      })
      .catch(err => console.error('Failed to load offices count:', err))
  }, [])

  // Handle department filter changes
  useEffect(() => {
    if (activeDept === 'All') {
      setFilteredJobs(jobs)
    } else {
      setFilteredJobs(jobs.filter(j => j.department === activeDept))
    }
  }, [activeDept, jobs])

  // Scroll-triggered entrance animations
  useEffect(() => {
    if (loading) return

    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      })

      gsap.from('.stat-item', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.3,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      })

      gsap.from('.benefit-card', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.benefits-grid', start: 'top 80%' },
      })

      gsap.from('.job-row', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.jobs-list', start: 'top 85%' },
      })
    }, pageRef)
    return () => ctx.revert()
  }, [loading, filteredJobs.length])

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )
      case 'fire':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'bolt':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  // Basic Markdown Renderer for job descriptions
  const renderMarkdown = (text: string) => {
    if (!text) return null

    const parseInline = (str: string): React.ReactNode => {
      if (!str) return ''
      const parts = str.split(/(\*\*.*?\*\*)/g)
      if (parts.length === 1) return str
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return part
      })
    }

    const isMainHeader = (str: string) => {
      const clean = str.replace(/^\*\*|\*\*$/g, '').replace(/^#+\s*/, '').replace(/:$/, '').trim()
      if (/^(key responsibilities|responsibilities|key requirements|requirements|qualifications & experience|qualifications|about the role|role summary|overview|benefits|about us|why join us\??)$/i.test(clean)) {
        return true
      }
      if ((clean.endsWith(':') || clean.endsWith('?')) && clean.length < 60) {
        return true
      }
      return false
    }

    const formatTitle = (str: string) => str.replace(/^\*\*|\*\*$/g, '').replace(/^#+\s*/, '').trim()

    const rawParagraphs = text.split(/\n\s*\n/)
    const blocks: React.ReactNode[] = []

    rawParagraphs.forEach((paragraph, pIdx) => {
      const trimmedPara = paragraph.trim()
      if (!trimmedPara) return

      const lines = trimmedPara.split('\n')
      const hasListItems = lines.some(l => l.trim().startsWith('-') || l.trim().startsWith('*'))

      if (hasListItems) {
        let currentList: string[] = []
        lines.forEach((line, idx) => {
          const trimmed = line.trim()
          if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
            currentList.push(trimmed.substring(1).trim())
          } else {
            if (currentList.length > 0) {
              blocks.push(
                <ul key={`ul-${pIdx}-${idx}`} className="list-disc pl-5 text-white/70 space-y-1.5 mb-4">
                  {currentList.map((item, i) => (
                    <li key={i} className="text-sm leading-relaxed">
                      {parseInline(item)}
                    </li>
                  ))}
                </ul>
              )
              currentList = []
            }
            if (trimmed) {
              if (isMainHeader(trimmed)) {
                blocks.push(
                  <h4 key={`h4-${pIdx}-${idx}`} className="font-display font-bold text-white mt-7 mb-3 text-lg sm:text-xl tracking-tight">
                    {formatTitle(trimmed)}
                  </h4>
                )
              } else if (trimmed.endsWith(':') || (trimmed.startsWith('**') && trimmed.endsWith('**')) || trimmed.length < 60) {
                blocks.push(
                  <h5 key={`h5-${pIdx}-${idx}`} className="font-display font-semibold text-white/90 mt-5 mb-2 text-base sm:text-lg tracking-tight">
                    {formatTitle(trimmed)}
                  </h5>
                )
              } else {
                blocks.push(
                  <p key={`p-${pIdx}-${idx}`} className="text-white/70 text-sm leading-relaxed mb-3">
                    {parseInline(trimmed)}
                  </p>
                )
              }
            }
          }
        })
        if (currentList.length > 0) {
          blocks.push(
            <ul key={`ul-${pIdx}-end`} className="list-disc pl-5 text-white/70 space-y-1.5 mb-4">
              {currentList.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed">
                  {parseInline(item)}
                </li>
              ))}
            </ul>
          )
        }
      } else {
        if (trimmedPara.startsWith('###')) {
          blocks.push(
            <h4 key={pIdx} className="font-display font-bold text-white mt-6 mb-2.5 text-base sm:text-lg tracking-tight">
              {parseInline(trimmedPara.replace(/^###\s*/, '').trim())}
            </h4>
          )
        } else if (trimmedPara.startsWith('##')) {
          blocks.push(
            <h3 key={pIdx} className="font-display font-bold text-white mt-6 mb-3 text-lg sm:text-xl tracking-tight">
              {parseInline(trimmedPara.replace(/^##\s*/, '').trim())}
            </h3>
          )
        } else if (trimmedPara.startsWith('#')) {
          blocks.push(
            <h2 key={pIdx} className="font-display font-bold text-white mt-6 mb-3 text-xl sm:text-2xl tracking-tight">
              {parseInline(trimmedPara.replace(/^#\s*/, '').trim())}
            </h2>
          )
        } else if (isMainHeader(trimmedPara)) {
          blocks.push(
            <h4 key={pIdx} className="font-display font-bold text-white mt-7 mb-3 text-lg sm:text-xl tracking-tight">
              {formatTitle(trimmedPara)}
            </h4>
          )
        } else if ((trimmedPara.endsWith(':') || trimmedPara.endsWith('?')) && trimmedPara.length < 80) {
          blocks.push(
            <h4 key={pIdx} className="font-display font-bold text-white mt-7 mb-3 text-lg sm:text-xl tracking-tight">
              {formatTitle(trimmedPara)}
            </h4>
          )
        } else {
          const singleParagraphText = lines.map(l => l.trim()).join(' ')
          blocks.push(
            <p key={pIdx} className="text-white/70 text-sm leading-relaxed mb-3">
              {parseInline(singleParagraphText)}
            </p>
          )
        }
      }
    })

    return blocks
  }

  const handleApplyClick = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent accordion toggling
    if (job.apply_link) {
      window.open(job.apply_link, '_blank')
    } else {
      setApplyJob(job)
    }
  }

  const scrollToJobs = () => {
    document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const stats = [
    { value: String(jobs.length).padStart(2, '0'), label: 'Open roles' },
    { value: String(departmentsCount).padStart(2, '0'), label: 'Departments' },
    { value: String(officesCount).padStart(2, '0'), label: 'Offices' },
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-brand-dark">
      {/* 1. Join the loop Intro Hero section (Top of Page) */}
      <section className="relative overflow-hidden section-padding pt-32 sm:pt-40 pb-12 sm:pb-16 border-b border-white/5">
        <ParticleField accent="multi" count={260} spread={16} />

        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full opacity-20 blur-3xl pointer-events-none bg-brand-pink" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none bg-brand-blue" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="heading-xl fluid-lg text-white mb-3 sm:mb-4 md:mb-6 leading-tight hero-reveal">
            {hero.headline.replace(/\.+$/, '').split(' ').slice(0, -1).join(' ')}{' '}
            <span className="gradient-text">{hero.headline.replace(/\.+$/, '').split(' ').slice(-1)}</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed hero-reveal text-pretty">
            {hero.description.replace(/(\s+)(\S+)$/, '\u00a0$2')}
          </p>
        </div>
      </section>

      {/* 2. Open Positions section */}
      <section id="open-positions" className="relative overflow-hidden section-padding py-12 md:py-16 border-b border-white/5 scroll-mt-24">
        <div className="max-w-6xl mx-auto relative z-10">


          {loading ? (
            <div className="text-center py-20">
              <svg className="animate-spin h-8 w-8 text-brand-pink mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-14 rounded-2xl border border-white/5 bg-white/2 text-center">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
                <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white/50 mb-2 text-sm">No open positions found in this department.</p>
              <p className="text-white/25 text-xs">Feel free to check back later or drop your CV to careers@loopsintegrated.com</p>
            </div>
          ) : (
            <div className="jobs-list space-y-4">
              {filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id
                const gradient = deptGradient(job.department)
                return (
                  <div
                    key={job.id}
                    className="job-row relative border border-white/5 bg-white/2 rounded-2xl overflow-hidden hover:border-white/15 transition-colors duration-300"
                  >
                    {/* Accent edge */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: gradient }} />

                    {/* Header Panel */}
                    <div
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span
                            className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white"
                            style={{ background: gradient }}
                          >
                            {job.department}
                          </span>
                          <span className="text-white/30 text-xs">•</span>
                          <span className="text-white/40 text-xs font-medium">
                            {job.location}
                          </span>
                        </div>
                        <h3 className="font-display font-semibold text-white text-xl md:text-2xl pt-1 group-hover:text-brand-pink">
                          {job.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t border-white/5 md:border-t-0">
                        <span className="text-white/40 text-xs font-semibold">
                          {job.type}
                        </span>
                        <div className="flex items-center gap-2.5 sm:gap-4 ml-auto md:ml-0">
                          <button
                            onClick={(e) => handleApplyClick(job, e)}
                            className="btn-primary py-2.5 px-5 text-xs"
                          >
                            Apply Now
                          </button>
                          <span className={`text-white/40 text-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-8 md:px-8 md:pb-8 pt-4 border-t border-white/5 bg-white/[0.01]">
                            <div className="max-w-3xl">
                              {renderMarkdown(job.description)}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>



      {/* 4. Open application CTA */}
      <section className="relative overflow-hidden section-padding py-24" style={{ background: 'linear-gradient(135deg, #E8005A 0%, #7B2FBE 50%, #1B3FB5 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="heading-xl fluid-lg text-white mb-6">
            Don't See Your Role?
          </h2>
          <p className="text-white/80 fluid-sm leading-relaxed mb-10 max-w-xl mx-auto">
            Send us your CV and tell us what you're great at, we'll reach out when the right opportunity opens up.
          </p>
          <a href="mailto:careers@loopsintegrated.com" className="inline-flex items-center justify-center gap-3.5 px-8 py-4 sm:px-11 sm:py-5 bg-white text-brand-dark font-display font-bold text-base sm:text-lg md:text-xl tracking-tight rounded-full shadow-2xl hover:bg-white/95 transition-all duration-300 hover:scale-105">
            careers@loopsintegrated.com
            <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </section>

      {/* Careers modal form */}
      <ApplyModal
        job={applyJob}
        onClose={() => setApplyJob(null)}
      />
    </div>
  )
}
