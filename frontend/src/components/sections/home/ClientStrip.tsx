import { useEffect, useState } from 'react'
import { api, Client, resolveImageUrl } from '@/lib/api'

import yamahaLogo from '@/assets/clients/yamaha.svg'
import pepsiLogo from '@/assets/clients/pepsi.png'
import britishCouncilLogo from '@/assets/clients/british-council.png'
import nasDailyLogo from '@/assets/clients/nas-daily.png'
import raulandLogo from '@/assets/clients/rauland.png'

const REMOVED_CLIENT_KEYWORDS = [
  'mas',
  'softlogic',
  'havelock',
  'dialog',
  'hemas',
  'commercial bank',
  'combank',
  'keells',
  'cargills',
  'sampath',
  'ceat',
  'elephant house',
  'elephant',
]

function isClientAllowed(name: string): boolean {
  if (!name) return false
  const norm = name.toLowerCase().trim()
  return !REMOVED_CLIENT_KEYWORDS.some(kw => norm.includes(kw))
}

const localClientLogos: Record<string, string> = {
  'yamaha': yamahaLogo,
  'yamaha motor': yamahaLogo,
  'pepsi': pepsiLogo,
  'pepsico': pepsiLogo,
  'british council': britishCouncilLogo,
  'nas daily': nasDailyLogo,
  'nas': nasDailyLogo,
  'rauland australia': raulandLogo,
  'rauland': raulandLogo,
}

const fallbackClients: Client[] = [
  { id: 4, name: 'Yamaha', logo_url: yamahaLogo },
  { id: 5, name: 'PepsiCo', logo_url: pepsiLogo },
  { id: 14, name: 'British Council', logo_url: britishCouncilLogo },
  { id: 15, name: 'Nas Daily', logo_url: nasDailyLogo },
  { id: 16, name: 'Rauland Australia', logo_url: raulandLogo },
]

function ClientLogo({ name, logo_url }: { name: string; logo_url?: string }) {
  const [failed, setFailed] = useState(false)
  const normName = name ? name.toLowerCase().trim() : ''

  if (!isClientAllowed(normName)) {
    return null
  }

  const localUrl = localClientLogos[normName] || Object.entries(localClientLogos).find(([k]) => normName.includes(k))?.[1]
  
  const rawUrl = localUrl || logo_url || ''
  let targetUrl = resolveImageUrl(rawUrl)

  // Filter out low-res 16px google favicon URLs so tiny circle dots are never rendered
  if (targetUrl.includes('google.com/s2/favicons') || targetUrl.includes('favicon')) {
    targetUrl = ''
  }

  // Never render raw text fallback — only clean brand logos
  if (!targetUrl || failed) {
    return null
  }

  return (
    <div className="flex items-center justify-center shrink-0 h-16 md:h-20 w-48 sm:w-56 md:w-64 px-6 select-none group">
      <img
        src={targetUrl}
        alt={name}
        className="max-h-11 md:max-h-14 w-auto max-w-[170px] md:max-w-[210px] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
        onError={() => setFailed(true)}
        loading="eager"
      />
    </div>
  )
}

export default function ClientStrip() {
  const [clients, setClients] = useState<Client[]>(fallbackClients)

  useEffect(() => {
    api.clients
      .list()
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          const validApiData = res.data.filter(c => isClientAllowed(c.name))
          const apiNames = new Set(validApiData.map(c => c.name.toLowerCase()))
          const combined = [
            ...validApiData,
            ...fallbackClients.filter(c => isClientAllowed(c.name) && !apiNames.has(c.name.toLowerCase())),
          ]
          setClients(combined as Client[])
        }
      })
      .catch(() => {})
  }, [])

  // Filter out any unallowed clients and duplicate 5x for a smooth infinite marquee loop
  const activeClients = clients.filter(c => isClientAllowed(c.name))
  const marqueeClients = [...activeClients, ...activeClients, ...activeClients, ...activeClients, ...activeClients]

  return (
    <section className="bg-[#FAFAFA] border-y border-neutral-200/60 py-6 md:py-8 overflow-hidden">
      {/* Logos marquee title */}
      <div className="max-w-7xl mx-auto px-6 mb-4 md:mb-5 text-center">
        <p className="text-brand-dark font-display font-bold text-xl md:text-2xl tracking-tight mb-4">
          Trusted By Leading Brands
        </p>
      </div>

      {/* Seamless single-track infinite marquee */}
      <div className="relative overflow-hidden w-full flex select-none group/strip">
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 md:w-48 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 md:w-48 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent z-10 pointer-events-none" />

        <div className="marquee-track items-center py-3 will-change-transform transform-gpu group-hover/strip:[animation-play-state:paused]">
          {marqueeClients.map((client, i) => (
            <ClientLogo key={`m-${client.id || i}-${i}`} name={client.name} logo_url={client.logo_url} />
          ))}
        </div>
      </div>
    </section>
  )
}
