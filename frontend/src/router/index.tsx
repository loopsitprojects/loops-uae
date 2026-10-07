import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Work from '@/pages/Work'
import CaseStudy from '@/pages/CaseStudy'
import ServicePage from '@/pages/ServicePage'
import Events from '@/pages/Events'
import Contact from '@/pages/Contact'
import Careers from '@/pages/Careers'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import Press from '@/pages/Press'
import PressDetail from '@/pages/PressDetail'
import NotFound from '@/pages/NotFound'

const getBasename = () => {
  const path = window.location.pathname
  if (path.startsWith('/uae')) return '/uae'
  if (path.startsWith('/loopswebsite')) return '/loopswebsite'
  return '/'
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'work', element: <Work /> },
      { path: 'work/:slug', element: <CaseStudy /> },
      { path: 'creative', element: <ServicePage /> },
      { path: 'digital', element: <ServicePage /> },
      { path: 'play', element: <ServicePage /> },
      { path: 'tech', element: <ServicePage /> },
      { path: 'ai-content', element: <ServicePage /> },
      { path: 'performance-marketing', element: <ServicePage /> },
      { path: 'events', element: <Events /> },
      { path: 'press', element: <Press /> },
      { path: 'press/:slug', element: <PressDetail /> },
      { path: 'pr', element: <Press /> },
      { path: 'pr/:slug', element: <PressDetail /> },
      { path: 'contact', element: <Contact /> },
      { path: 'careers', element: <Careers /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], {
  basename: getBasename(),
})
