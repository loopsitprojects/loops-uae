import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { getRecaptchaToken } from '@/lib/recaptcha'

const SERVICE_OPTIONS = [
  'Creative & Brand Strategy',
  'Digital Performance Marketing',
  'Tech & Web Development',
  'Events & Experiential Marketing',
  'PR & Communications',
  'Other Enquiry',
]

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all required fields (*).')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const recaptchaToken = await getRecaptchaToken('inquiry_modal')

      await api.contact({
        name: formData.name,
        email: formData.email,
        company: formData.company ? `${formData.company} (Phone: ${formData.phone})` : `Phone: ${formData.phone}`,
        service: formData.service,
        message: formData.message,
        office_context: 'Floating Inquiry Modal',
        recaptcha_token: recaptchaToken,
      })
      setSubmitted(true)
    } catch (err: any) {
      console.error('Inquiry submission failed:', err)
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' })
    setSubmitted(false)
    setErrorMsg('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-[#121214] border border-white/10 w-full max-w-xl rounded-3xl overflow-hidden relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col"
          >
            {/* Top Gradient Stripe */}
            <div className="h-1.5 w-full shrink-0 gradient-bg" />

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/8 flex items-center justify-between shrink-0">
              <div>
                <p className="label text-brand-pink text-xs tracking-wider uppercase mb-1">Quick Inquiry</p>
                <h3 className="font-display font-bold text-white text-2xl">Start a Conversation</h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(232,0,90,0.4)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-display font-bold text-white text-2xl mb-3">Inquiry Received!</h4>
                  <p className="text-white/60 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                    Thank you, <span className="text-white font-medium">{formData.name}</span>. Our team will review your project details and get back to you within 24 hours.
                  </p>
                  <button onClick={handleReset} className="btn-primary">
                    Done
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label text-white/70 block text-xs mb-1.5">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="label text-white/70 block text-xs mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label text-white/70 block text-xs mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="071 234 5678"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="label text-white/70 block text-xs mb-1.5">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label text-white/70 block text-xs mb-1.5">Service Interested In</label>
                    <select
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#121214]">Select a service...</option>
                      {SERVICE_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="bg-[#121214]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label text-white/70 block text-xs mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project, goals, and timeline..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 gradient-bg text-white font-display font-semibold text-base rounded-xl transition-opacity hover:opacity-90 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Submitting...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
