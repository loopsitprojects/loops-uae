export function getRecaptchaToken(action: string): Promise<string | null> {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LcFKoAtAAAAACxsTvWYRiK3O8RApX0vuHoXaUSd'
  if (!siteKey) return Promise.resolve(null)

  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null)

    const execute = () => {
      if ((window as any).grecaptcha && (window as any).grecaptcha.execute) {
        (window as any).grecaptcha.ready(() => {
          (window as any).grecaptcha.execute(siteKey, { action })
            .then((token: string) => resolve(token))
            .catch((err: any) => {
              console.warn('reCAPTCHA v3 execution error:', err)
              resolve(null)
            })
        })
      } else {
        resolve(null)
      }
    }

    if (!(window as any).grecaptcha) {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.async = true
      script.onload = execute
      script.onerror = () => resolve(null)
      document.head.appendChild(script)
    } else {
      execute()
    }
  })
}
