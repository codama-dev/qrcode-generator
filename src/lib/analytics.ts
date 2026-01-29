/**
 * Google Analytics and Search Console configuration.
 *
 * Set these to non-empty strings to enable:
 * - GA_MEASUREMENT_ID: loads gtag.js and sends page views (e.g. "G-XXXXXXXXXX")
 * - GOOGLE_SITE_VERIFICATION: adds the meta tag for Google Search Console verification
 *
 * Leave empty to keep analytics and Search Console features disabled.
 */
export const GA_MEASUREMENT_ID = ''
export const GOOGLE_SITE_VERIFICATION = ''

const GA_SCRIPT_URL = 'https://www.googletagmanager.com/gtag/js'

function loadGoogleAnalytics(measurementId: string): void {
  if (typeof window === 'undefined' || !measurementId) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `${GA_SCRIPT_URL}?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: true })
}

function addSearchConsoleVerification(content: string): void {
  if (typeof document === 'undefined' || !content) {
    return
  }

  let meta = document.querySelector('meta[name="google-site-verification"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'google-site-verification')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

/**
 * Initializes Google Analytics (if GA_MEASUREMENT_ID is set) and adds
 * Search Console verification meta tag (if GOOGLE_SITE_VERIFICATION is set).
 * Call once on app load (e.g. from main.tsx).
 */
export function initAnalytics(): void {
  if (GA_MEASUREMENT_ID) {
    loadGoogleAnalytics(GA_MEASUREMENT_ID)
  }
  if (GOOGLE_SITE_VERIFICATION) {
    addSearchConsoleVerification(GOOGLE_SITE_VERIFICATION)
  }
}
