import Hero from '@/components/sections/home/Hero'
import ClientStrip from '@/components/sections/home/ClientStrip'
import LatestWork from '@/components/sections/home/LatestWork'
import GlobalOffices from '@/components/sections/home/GlobalOffices'
import ServicesGrid from '@/components/sections/home/ServicesGrid'
import NewsletterCTA from '@/components/sections/home/NewsletterCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <ClientStrip />
      <LatestWork />
      <ServicesGrid />
      <GlobalOffices />
      <NewsletterCTA />
    </>
  )
}
