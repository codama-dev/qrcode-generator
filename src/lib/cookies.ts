// Modern cookie handling utilities
// Fallback to document.cookie when Cookie Store API is not available

interface CookieOptions {
  path?: string
  maxAge?: number
  expires?: Date
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

// Check if Cookie Store API is available
function isCookieStoreSupported(): boolean {
  return typeof window !== 'undefined' && 'cookieStore' in window
}

// Set a cookie using Cookie Store API or fallback to document.cookie
export async function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): Promise<void> {
  const { path = '/', maxAge, expires, domain, secure, sameSite = 'lax' } = options

  if (isCookieStoreSupported()) {
    try {
      // Use modern Cookie Store API
      // biome-ignore lint/suspicious/noExplicitAny: Cookie Store API is experimental
      const cookieInit: any = {
        name,
        value,
        path,
        expires: expires ? expires.getTime() : maxAge ? Date.now() + maxAge * 1000 : undefined,
        domain,
        sameSite,
      }

      // biome-ignore lint/suspicious/noExplicitAny: Cookie Store API is experimental
      await (window as any).cookieStore?.set(cookieInit)
      return
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: warn needed for debugging
      console.warn('Cookie Store API failed, falling back to document.cookie:', error)
    }
  }

  // Fallback to document.cookie
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (path) {
    cookieString += `; path=${path}`
  }
  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`
  }
  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  }
  if (domain) {
    cookieString += `; domain=${domain}`
  }
  if (secure) {
    cookieString += '; secure'
  }
  if (sameSite) {
    cookieString += `; samesite=${sameSite}`
  }

  // Biome warning suppression: This is the standard fallback for cookie handling
  // biome-ignore lint/suspicious/noDocumentCookie: Fallback when Cookie Store API unavailable
  document.cookie = cookieString
}

// Get a cookie value
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const cookies = document.cookie.split('; ')
  const cookie = cookies.find(cookie => cookie.startsWith(`${encodeURIComponent(name)}=`))

  if (!cookie) {
    return null
  }

  const value = cookie.split('=')[1]
  return value ? decodeURIComponent(value) : null
}

// Delete a cookie
export async function deleteCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): Promise<void> {
  await setCookie(name, '', {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  })
}

// Get all cookies as an object
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') {
    return {}
  }

  const cookies: Record<string, string> = {}

  document.cookie.split('; ').forEach(cookie => {
    const [name, value] = cookie.split('=')
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value)
    }
  })

  return cookies
}
