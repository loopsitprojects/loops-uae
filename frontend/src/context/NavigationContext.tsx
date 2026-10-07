import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, NavigationPageItem } from '@/lib/api'

interface NavigationContextType {
  navbarPublished: boolean
  pages: NavigationPageItem[]
  loading: boolean
  isPagePublished: (path: string) => boolean
  getPage: (path: string) => NavigationPageItem | undefined
  refreshNavigation: () => Promise<void>
}

const NavigationContext = createContext<NavigationContextType>({
  navbarPublished: true,
  pages: [],
  loading: true,
  isPagePublished: () => true,
  getPage: () => undefined,
  refreshNavigation: async () => {},
})

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navbarPublished, setNavbarPublished] = useState(true)
  const [pages, setPages] = useState<NavigationPageItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNavigation = useCallback(async () => {
    try {
      const res = await api.navigation()
      if (res) {
        setNavbarPublished(res.navbar_published !== false)
        if (Array.isArray(res.pages)) {
          setPages(res.pages)
        }
      }
    } catch (err) {
      console.warn('Could not fetch navigation settings, defaulting to published:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNavigation()
  }, [fetchNavigation])

  const normalizePath = (path: string) => {
    const clean = path.split('?')[0].split('#')[0].replace(/\/+$/, '')
    return clean === '' ? '/' : clean
  }

  const getPage = useCallback((path: string): NavigationPageItem | undefined => {
    const normalized = normalizePath(path)
    return pages.find(p => normalizePath(p.url) === normalized)
  }, [pages])

  const isPagePublished = useCallback((path: string): boolean => {
    if (loading || pages.length === 0) return true
    const normalized = normalizePath(path)
    const exactPage = getPage(normalized)
    if (exactPage) return exactPage.is_published

    // Check parent route (e.g. /careers/123 -> check /careers)
    const parentPage = pages.find(p => {
      const parentUrl = normalizePath(p.url)
      return parentUrl !== '/' && normalized.startsWith(parentUrl + '/')
    })
    if (parentPage) return parentPage.is_published

    return true // Unregistered dynamic routes remain accessible unless matching a key
  }, [loading, pages, getPage])

  return (
    <NavigationContext.Provider
      value={{
        navbarPublished,
        pages,
        loading,
        isPagePublished,
        getPage,
        refreshNavigation: fetchNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  return useContext(NavigationContext)
}
