import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api, Job } from '@/lib/api'
import { getRecaptchaToken } from '@/lib/recaptcha'

interface ApplyModalProps {
  job: Job | null
  onClose: () => void
}

export default function ApplyModal({ job, onClose }: ApplyModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [expectedSalary, setExpectedSalary] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!job) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      validateAndSetFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    setError(null)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file format. Please upload a PDF or Word document (.doc, .docx).')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Maximum CV size is 10MB. Please choose a smaller file.')
      return
    }

    setCvFile(file)
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cvFile) {
      setError('Please upload your Resume/CV to apply.')
      return
    }

    setSubmitting(true)
    setError(null)

    const recaptchaToken = await getRecaptchaToken('job_application')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('expected_salary', expectedSalary)
    if (portfolio) formData.append('portfolio', portfolio)
    if (coverLetter) formData.append('cover_letter', coverLetter)
    if (recaptchaToken) formData.append('recaptcha_token', recaptchaToken)
    formData.append('cv', cvFile)

    try {
      await api.jobs.apply(job.id, formData)
      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Failed to submit application. Please verify your fields and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-dark/95 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-[#121214] border border-white/8 w-full max-w-xl rounded-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
        >
          {/* Accent top edge */}
          <div className="h-[3px] w-full shrink-0" style={{ background: 'linear-gradient(90deg, #E8005A, #7B2FBE, #1B3FB5, #00B4B4)' }} />

          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
            <div>
              <p className="text-brand-pink label text-[10px] tracking-wider uppercase mb-1">Apply for position</p>
              <h3 className="font-display font-bold text-white text-xl">{job.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #E8005A 0%, #7B2FBE 50%, #1B3FB5 100%)' }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-display font-semibold text-white text-2xl mb-3">Application Submitted!</h4>
                <p className="text-white/60 text-sm max-w-sm mx-auto mb-8">
                  Thank you for applying, {name}. Our recruitment team will review your CV for the {job.title} role and contact you shortly.
                </p>
                <button onClick={onClose} className="btn-primary">
                  Close Window
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-white/80 text-xs font-bold block">Full Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/80 text-xs font-bold block">Email <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/80 text-xs font-bold block">Phone Number <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="071 234 5678"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/80 text-xs font-bold block">Expected Salary <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                      placeholder="Ex: 100,000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  {/* File Upload Area */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-white/80 text-xs font-bold block">Upload Your CV <span className="text-rose-500">*</span></label>
                      <span className="text-[11px] text-white/40 font-mono">Maximum CV size is 10MB</span>
                    </div>
                    
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={triggerFileSelect}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                        dragActive
                          ? 'border-white bg-white/5'
                          : cvFile
                          ? 'border-emerald-500/50 bg-emerald-500/5'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/2'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />

                      {cvFile ? (
                        <>
                          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-white font-medium text-sm mb-1">{cvFile.name}</p>
                          <p className="text-white/40 text-xs">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB — Click to change</p>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white/5 text-white/40 rounded-full flex items-center justify-center mb-2 group-hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-white/60 text-sm font-medium">
                            Drag & Drop Files, <span className="underline text-white">Choose Files to Upload</span>
                          </p>
                          <p className="text-white/40 text-xs mt-1">PDF, DOC, DOCX — Maximum CV size is 10MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/80 text-xs font-bold block">Portfolio</label>
                    <input
                      type="text"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="Link to your portfolio / website"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-3 py-3.5 px-8 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/90 hover:text-black transition-all duration-300 disabled:bg-white/20 disabled:text-white/40"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting Application...
                      </span>
                    ) : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
