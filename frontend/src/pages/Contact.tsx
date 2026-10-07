import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { offices as fallbackOffices } from '@/data/services'
import { api } from '@/lib/api'
import { getRecaptchaToken } from '@/lib/recaptcha'

const fallbackServices = ['Creative', 'Digital', 'Play / Productions', 'Tech', 'AI Content', 'Performance Marketing', 'Events & Experiences', 'Full Integrated']

export default function Contact() {
  const [activeOffice, setActiveOffice] = useState(0)
  const [formData, setFormData] = useState({ name: '', email: '', company: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [hero, setHero] = useState({
    title: 'Contact Us',
    description: "Let's create something great together. We're ready to partner with ambitious brands across Sri\u00a0Lanka and the world."
  })

  const [servicesList, setServicesList] = useState<string[]>(fallbackServices)
  const [officesList, setOfficesList] = useState<any[]>(fallbackOffices)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)

    // Load contact page sections
    api.pages.get('contact')
      .then(res => {
        if (res && res.data) {
          const data = res.data
          if (data.hero) {
            setHero({
              title: data.hero.headline || 'Contact Us',
              description: data.hero.subheadline || "Let's create something great together. We're ready to partner with ambitious brands across Sri\u00a0Lanka and the world."
            })
          }
          if (data.form_fields && data.form_fields.service_options) {
            const parsed = data.form_fields.service_options.split(',').map((s: string) => s.trim()).filter(Boolean)
            if (parsed.length) {
              setServicesList(parsed)
            }
          }
        }
      })
      .catch(err => {
        console.error('Failed to load contact page sections:', err)
      })

    // Load offices list
    api.offices.list()
      .then(res => {
        if (res && Array.isArray(res.data) && res.data.length) {
          setOfficesList(res.data)
        }
      })
      .catch(err => {
        console.error('Failed to load offices list:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
      return
    }

    setSubmitting(true)
    setSubmitError('')

    const activeOfficeContext = officesList[activeOffice]?.city || 'Colombo'
    const recaptchaToken = await getRecaptchaToken('contact_form')

    api.contact({
      ...formData,
      office_context: activeOfficeContext,
      recaptcha_token: recaptchaToken
    })
      .then(() => {
        setSubmitted(true)
        setFormData({ name: '', email: '', company: '', service: '', message: '' })
      })
      .catch(err => {
        console.error('Failed to submit contact form:', err)
        setSubmitError(err.message || 'Failed to send message. Please try again.')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const update = (field: string, val: string) => setFormData(p => ({ ...p, [field]: val }))

  return (
    <>
      {/* Hero — BLACK */}
      <section className="relative bg-[#07070A] section-padding pt-36 sm:pt-40 lg:pt-44 pb-20 overflow-hidden">
        {/* Subtle Ambient Lighting Orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(138,43,226,0.15)_0%,rgba(255,0,122,0.06)_45%,transparent_70%)] blur-[120px] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-4xl">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white mb-6 leading-[1.08] tracking-tight">
            {hero.title}
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-2xl leading-relaxed">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Offices — WHITE */}
      <section className="bg-white section-padding py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-dark font-display font-bold text-xl md:text-2xl tracking-tight mb-4">Our Offices</p>

          {/* Office tabs */}
          <div className="flex flex-wrap gap-3 mb-10">
            {officesList.map((office, i) => {
              const label = office.city || office.country || office.role || `Office ${i + 1}`
              return (
                <button
                  key={office.id || office.city || i}
                  onClick={() => setActiveOffice(i)}
                  className={`px-5 py-2.5 rounded-full label transition-all duration-300 ${
                    activeOffice === i
                      ? 'bg-brand-dark text-white'
                      : 'border border-brand-dark/15 text-brand-dark/50 hover:border-brand-dark/40 hover:text-brand-dark'
                  }`}
                >
                  {label}
                  {office.is_headquarters && <span className="ml-2 text-[0.6rem] opacity-60">HQ</span>}
                </button>
              )
            })}
          </div>

          {/* Active office detail */}
          <AnimatePresence mode="wait">
            {officesList[activeOffice] && (
              <motion.div
                key={officesList[activeOffice].id || officesList[activeOffice].city || activeOffice}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-10 rounded-3xl bg-brand-dark/[0.03] border border-brand-dark/10 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8"
              >
                {/* Left: Location & Role */}
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {Boolean(officesList[activeOffice].city?.trim()) && (
                      <h3 className="font-display font-bold text-brand-dark text-3xl md:text-4xl tracking-tight">
                        {officesList[activeOffice].city}
                      </h3>
                    )}
                    {Boolean(officesList[activeOffice].country?.trim()) && (
                      <span className="px-3 py-1 rounded-full text-[0.7rem] font-mono tracking-wider uppercase font-semibold text-brand-dark/60 bg-brand-dark/5 border border-brand-dark/12">
                        {officesList[activeOffice].country}
                      </span>
                    )}
                  </div>
                  {Boolean(officesList[activeOffice].role?.trim()) && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs font-mono uppercase tracking-widest text-brand-dark/60 font-semibold">
                        {officesList[activeOffice].role}
                      </p>
                    </div>
                  )}
                </div>

                {/* Middle: Address */}
                {Boolean(officesList[activeOffice].address && officesList[activeOffice].address.trim()) && (
                  <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-brand-dark/10 pt-6 lg:pt-0 lg:pl-8 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-brand-dark/5 border border-brand-dark/10 flex items-center justify-center shrink-0 mt-0.5 text-brand-dark/70">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest text-brand-dark/40 mb-1.5 font-bold">Location</p>
                      <p className="text-brand-dark/80 text-sm leading-relaxed font-medium">
                        {officesList[activeOffice].address}
                      </p>
                    </div>
                  </div>
                )}

                {/* Right: Contact */}
                {(Boolean(officesList[activeOffice].phone?.trim()) || Boolean(officesList[activeOffice].email?.trim())) && (
                  <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-brand-dark/10 pt-6 lg:pt-0 lg:pl-8 flex flex-col gap-3">
                    <p className="text-xs font-mono uppercase tracking-widest text-brand-dark/40 mb-0.5 font-bold">Direct Line</p>
                    
                    {Boolean(officesList[activeOffice].phone?.trim()) && (
                      <a
                        href={`tel:${officesList[activeOffice].phone}`}
                        className="inline-flex items-center gap-3 text-brand-dark font-semibold text-sm hover:text-black transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-brand-dark/5 border border-brand-dark/10 flex items-center justify-center text-brand-dark/70 group-hover:bg-brand-dark group-hover:text-white group-hover:border-brand-dark transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span>{officesList[activeOffice].phone}</span>
                      </a>
                    )}

                    {Boolean(officesList[activeOffice].email?.trim()) && (
                      <a
                        href={`mailto:${officesList[activeOffice].email}`}
                        className="inline-flex items-center gap-3 text-brand-dark font-semibold text-sm hover:text-black transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-brand-dark/5 border border-brand-dark/10 flex items-center justify-center text-brand-dark/70 group-hover:bg-brand-dark group-hover:text-white group-hover:border-brand-dark transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span>{officesList[activeOffice].email}</span>
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Form — BLACK */}
      <section className="bg-brand-dark section-padding py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-white font-display font-bold text-xl md:text-2xl tracking-tight mb-4">Send Us a Message</p>
          <h2 className="heading-xl fluid-lg text-white mb-4">Let's start a conversation</h2>
          <p className="text-white/40 mb-12">Fill out the form below and our team will get back to you within 24 hours.</p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display font-700 text-white text-3xl mb-4">Message Sent!</h3>
                <p className="text-white/40 mb-8">We'll be in touch within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-outline inline-flex">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                animate={shaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { field: 'name', label: 'Name', placeholder: 'Your full name', type: 'text' },
                    { field: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
                  ].map(({ field, label, placeholder, type }) => (
                    <div key={field}>
                      <label className="label text-white/70 block mb-2">{label} *</label>
                      <input
                        type={type}
                        value={formData[field as keyof typeof formData]}
                        onChange={e => update(field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="label text-white/70 block mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => update('company', e.target.value)}
                    placeholder="Your company name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors"
                  />
                </div>

                <div>
                  <label className="label text-white/70 block mb-2">Service Interested In</label>
                  <select
                    value={formData.service}
                    onChange={e => update('service', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-pink transition-colors appearance-none"
                  >
                    <option value="" className="bg-brand-dark">Select a service...</option>
                    {servicesList.map(s => (
                      <option key={s} value={s} className="bg-brand-dark">{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label text-white/70 block mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={e => update('message', e.target.value)}
                    placeholder="Tell us about your project, goals, and timeline..."
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors resize-none"
                  />
                </div>

                {submitError && (
                  <p className="text-brand-pink text-sm font-semibold mb-4">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-5 gradient-bg text-white font-display font-600 text-lg rounded-xl hover:opacity-90 transition-opacity ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
