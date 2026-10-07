const getSubfolder = () => {
  const path = window.location.pathname
  if (path.startsWith('/uae')) return '/uae'
  if (path.startsWith('/loopswebsite')) return '/loopswebsite'
  return ''
}

export function resolveImageUrl(url?: string): string {
  if (!url) return ''
  let cleanUrl = url.trim()

  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    try {
      const parsed = new URL(cleanUrl)
      if (parsed.hostname === window.location.hostname || parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost') {
        cleanUrl = parsed.pathname + parsed.search
      } else {
        return cleanUrl
      }
    } catch {
      cleanUrl = cleanUrl.replace(/^https?:\/\/[^\/]+/i, '')
    }
  }

  if (!cleanUrl.startsWith('/')) {
    cleanUrl = `/${cleanUrl}`
  }

  const subfolder = getSubfolder()
  if (cleanUrl.startsWith('/') && subfolder && !cleanUrl.startsWith(subfolder)) {
    cleanUrl = `${subfolder}${cleanUrl}`
  }
  return cleanUrl
}

const BASE = getSubfolder() + '/api/v1'

async function get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
  const url = new URL(BASE + path, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    })
  }
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, ...data }
  return data
}

// ——— Types ———

export interface Category {
  id: number
  name: string
  slug: string
  color: string
  item_count?: number
}

export interface PortfolioItem {
  id: number
  slug: string
  client: string
  title: string
  brief?: string
  background?: string
  objective?: string
  insight?: string
  idea?: string
  result?: string
  video_url?: string
  year: number
  color: string
  image_position?: string
  image_fit?: string
  featured: boolean
  is_clickable?: boolean
  show_gallery?: boolean
  show_year?: boolean
  show_hero_as_campaign_video?: boolean
  categories: Category[]
  tags: string[]
  hero_url?: string
  thumbnail_url?: string
  campaign_videos?: { title: string; url: string; player_type?: 'landscape' | 'portrait' }[]
  award?: string | null
  gallery: { url: string; thumb: string; alt: string }[]
  meta: {
    title?: string
    description?: string
    canonical?: string
    json_ld?: string
  }
}

export interface Service {
  id: number
  slug: string
  title: string
  headline: string
  subheadline: string
  description: string
  capabilities: string[]
  cta_label: string
  cta_link: string
  accent_color: string
  icon: string
  what_we_do_text?: string | null
  hero_url?: string
  meta: { title?: string; description?: string }
}

export interface Office {
  id: number
  city: string
  country: string
  role: string
  description?: string
  phone?: string
  email?: string
  address?: string
  lat?: number
  lng?: number
  is_headquarters: boolean
  show_in_footer?: boolean
}

export interface Client {
  id: number
  name: string
  logo_url: string
  url?: string
}

export interface Product {
  id: number
  title: string
  description: string
  cta_label: string
  cta_link: string
  image_url?: string | null
}

export interface Award {
  id: number
  tier: string
  count: number
  award_body: string
  year: number
  campaign_name: string
  client_name?: string | null
  category?: string
  insight?: string
  background_path?: string | null
  portfolio_item?: { slug: string; title: string; client: string } | null
}

export interface JobDepartment {
  id: number
  name: string
  slug: string
  sort_order: number
}

export interface Job {
  id: number
  title: string
  slug: string
  department: string
  location: string
  type: string
  experience_level?: string | null
  description: string
  apply_link?: string | null
  apply_email?: string | null
  sort_order: number
  published: boolean
  created_at: string
}

export interface PressGalleryItem {
  url: string
  caption?: string | null
}

export interface PressItem {
  id: number
  title: string
  slug: string
  category: string
  published_date: string | null
  published_date_formatted: string | null
  author?: string | null
  publisher?: string | null
  external_link?: string | null
  excerpt?: string | null
  content?: string | null
  image_url?: string | null
  video_url?: string | null
  gallery?: PressGalleryItem[]
  is_featured: boolean
  sort_order: number
}

export interface NavigationPageItem {
  id: number
  key: string
  label: string
  url: string
  nav_group: 'top' | 'integrated' | 'cta' | 'hidden'
  is_published: boolean
  show_in_nav: boolean
  sort_order: number
  icon?: string | null
  description?: string | null
}

export interface NavigationResponse {
  navbar_published: boolean
  pages: NavigationPageItem[]
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

export function keepSriLankaTogether(text?: string | null): string {
  if (!text) return ''
  return text
    .replace(/[\u2014\u2013]|--/g, '-')
    .replace(/ {2,}/g, ' ')
    .replace(/Sri\s+(Lanka|Lankan|Lankans)/gi, 'Sri\u00a0$1')
}

function formatItemText(item: PortfolioItem): PortfolioItem {
  if (!item) return item
  return {
    ...item,
    client: keepSriLankaTogether(item.client),
    title: keepSriLankaTogether(item.title),
    brief: item.brief ? keepSriLankaTogether(item.brief) : item.brief,
    insight: item.insight ? keepSriLankaTogether(item.insight) : item.insight,
    idea: item.idea ? keepSriLankaTogether(item.idea) : item.idea,
    result: item.result ? keepSriLankaTogether(item.result) : item.result,
    background: item.background ? keepSriLankaTogether(item.background) : item.background,
    objective: item.objective ? keepSriLankaTogether(item.objective) : item.objective,
    award: item.award ? keepSriLankaTogether(item.award) : item.award,
  }
}

// ——— API calls ———

export const api = {
  portfolio: {
    list: (params?: { category?: string; tag?: string; featured?: boolean; year?: number; per_page?: number; page?: number }) =>
      get<PaginatedResponse<PortfolioItem>>('/portfolio', params as Record<string, string | number | boolean>).then(res => {
        if (res && Array.isArray(res.data)) {
          res.data = res.data.map(formatItemText)
        }
        return res
      }),
    show: (slug: string) =>
      get<{ data: PortfolioItem }>(`/portfolio/${slug}`).then(res => {
        if (res && res.data) {
          res.data = formatItemText(res.data)
        }
        return res
      }),
  },
  categories: {
    list: () => get<{ data: Category[] }>('/portfolio-categories'),
  },
  services: {
    list: () => get<{ data: Service[] }>('/services'),
    show: (slug: string) => get<{ data: Service }>(`/services/${slug}`),
  },
  offices: {
    list: () => get<{ data: Office[] }>('/offices'),
  },
  clients: {
    list: () => get<{ data: Client[] }>('/clients'),
  },
  products: {
    list: () => get<{ data: Product[] }>('/products'),
  },
  awards: {
    list: () => get<{ data: Award[] }>('/awards'),
  },
  press: {
    list: (params?: { category?: string; featured?: boolean; q?: string }) =>
      get<{ data: PressItem[]; categories: string[] }>('/press', params as Record<string, string | number | boolean>),
    show: (slug: string) => get<{ data: PressItem }>(`/press/${slug}`),
  },
  jobDepartments: {
    list: () => get<{ data: JobDepartment[] }>('/job-departments'),
  },
  jobs: {
    list: () => get<{ data: Job[] }>('/jobs'),
    apply: (id: number, formData: FormData) => {
      return fetch(`${BASE}/jobs/${id}/apply`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      }).then(async res => {
        const data = await res.json()
        if (!res.ok) throw { status: res.status, ...data }
        return data
      })
    }
  },
  pages: {
    get: (page: string) => get<{ data: Record<string, Record<string, any>> }>(`/pages/${page}`),
    section: (page: string, section: string) => get<{ data: Record<string, any> }>(`/pages/${page}/${section}`),
  },
  settings: () => get<{ data: Record<string, Record<string, any>> }>('/settings'),
  navigation: () => get<NavigationResponse>('/navigation'),
  contact: (body: { name: string; email: string; company?: string; service?: string; message: string; office_context?: string; recaptcha_token?: string | null }) =>
    post<{ message: string }>('/contact', body),
  newsletter: {
    subscribe: (email: string, source: string = 'website', recaptcha_token?: string | null) =>
      post<{ success: boolean; message: string }>('/newsletter/subscribe', { email, source, recaptcha_token }),
  },
}
