import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LoadingScreen from '@/components/ui/LoadingScreen'
import CustomCursor from '@/components/ui/CustomCursor'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'
import NotFound from '@/pages/NotFound'
import { NavigationProvider, useNavigation } from '@/context/NavigationContext'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function MainContent() {
  const location = useLocation()
  const { isPagePublished, loading } = useNavigation()

  // Dynamic route checking
  const isPublished = isPagePublished(location.pathname)

  if (!loading && !isPublished) {
    return <NotFound />
  }

  return (
    <main key={location.pathname}>
      <Outlet />
    </main>
  )
}

function AppContent() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Disable browser automatic scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Force instant scroll to top on route change
  useEffect(() => {
    if (loading) return

    // Kill stale ScrollTriggers from previous routes to prevent scroll jumping
    ScrollTrigger.getAll().forEach(t => t.kill())

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    resetScroll()

    const rAF = requestAnimationFrame(resetScroll)
    const t1 = setTimeout(resetScroll, 50)
    const t2 = setTimeout(resetScroll, 200)

    return () => {
      cancelAnimationFrame(rAF)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [location.pathname, loading])

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <MainContent />
      <WhatsAppFloat />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  )
}
