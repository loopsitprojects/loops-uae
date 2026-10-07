import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import InquiryModal from '@/components/ui/InquiryModal'

export default function WhatsAppFloat() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)

  const cleanNumber = '94755253006'
  const whatsappUrl = `https://wa.me/${cleanNumber}`

  useEffect(() => {
    const checkMenu = () => {
      setIsMenuOpen(document.body.classList.contains('mobile-menu-open'))
    }
    checkMenu()
    const observer = new MutationObserver(checkMenu)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const isPressPage = location.pathname.startsWith('/press')

  if (isMenuOpen || location.pathname.startsWith('/careers')) return null

  return (
    <>
      {/* Docked Floating Buttons - Icon-only for Mobile and Web (hidden on mobile on press pages) */}
      <div className={`fixed top-1/2 -translate-y-1/2 right-0 z-40 flex-col items-end gap-3 ${isPressPage ? 'hidden sm:flex' : 'flex'}`}>
        {/* 1. Book a Consultation Button (Brand Purple) */}
        <motion.button
          onClick={() => setIsInquiryOpen(true)}
          title="Book a consultation"
          aria-label="Book a consultation"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="p-3.5 sm:p-4 rounded-l-full bg-[#7B2FBE] hover:bg-[#6b25a8] text-white border-y border-l border-[#7B2FBE] border-r-0 shadow-[-8px_0_30px_rgba(123,47,190,0.5)] transition-all duration-300 group cursor-pointer flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-white shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </motion.button>

        {/* 2. WhatsApp / Get Quote Button (WhatsApp Green) */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="p-3.5 sm:p-4 rounded-l-full bg-[#25D366] hover:bg-[#20bd5a] text-white border-y border-l border-[#25D366] border-r-0 shadow-[-8px_0_30px_rgba(37,211,102,0.45)] transition-all duration-300 group cursor-pointer flex items-center justify-center"
        >
          <svg className="w-5 h-5 fill-white text-white shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.156-1.352a9.932 9.932 0 0 0 4.854 1.258h.004c5.507 0 9.99-4.478 9.99-9.984 0-2.667-1.037-5.176-2.923-7.062A9.92 9.92 0 0 0 12.012 2zm5.781 14.19c-.317.892-1.84 1.748-2.54 1.81-.6.054-1.201.264-3.834-.772-3.37-1.328-5.525-4.757-5.693-4.979-.168-.22-1.354-1.802-1.354-3.438 0-1.636.85-2.441 1.15-2.772.3-.331.65-.414.867-.414.217 0 .433.001.624.01.196.008.459-.074.721.554.267.64.912 2.228.991 2.392.08.163.132.353.024.568-.109.215-.163.348-.326.537-.162.189-.34.422-.486.566-.16.158-.328.33-.14.653.188.324.836 1.378 1.793 2.229.962.85 1.77 1.112 2.072 1.261.303.15.481.127.662-.078.18-.205.779-.905.986-1.213.208-.309.416-.258.7-.152.285.105 1.81.854 2.122 1.01.312.156.52.234.595.363.075.13.075.752-.243 1.644z"/>
          </svg>
        </motion.a>
      </div>

      {/* Inquiry Popup Dialog */}
      <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />
    </>
  )
}
