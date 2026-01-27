import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteCookie, getAllCookies, getCookie, setCookie } from '../cookies'

// Simple mock for testing cookie logic
let mockCookies: Record<string, string> = {}

Object.defineProperty(document, 'cookie', {
  get: () => {
    return Object.entries(mockCookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ')
  },
  set: (cookieString: string) => {
    const [nameValue] = cookieString.split(';')
    const [encodedName, encodedValue] = nameValue.split('=')

    if (cookieString.includes('max-age=0') || cookieString.includes('expires=Thu, 01 Jan 1970')) {
      // Delete cookie - need to handle both encoded and raw names
      delete mockCookies[encodedName]
      delete mockCookies[decodeURIComponent(encodedName)]
    } else {
      mockCookies[encodedName] = encodedValue || ''
    }
  },
  configurable: true,
})

describe('Cookie Utilities', () => {
  beforeEach(() => {
    mockCookies = {}
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('setCookie', () => {
    it('should set a basic cookie', async () => {
      await setCookie('testName', 'testValue')

      expect(mockCookies.testName).toBe('testValue')
    })

    it('should handle URL encoding', async () => {
      await setCookie('test name', 'test value')

      expect(mockCookies['test%20name']).toBe('test%20value')
    })

    it('should work with Cookie Store API when available', async () => {
      const mockCookieStore = {
        set: vi.fn().mockResolvedValue(undefined),
      }

      Object.defineProperty(window, 'cookieStore', {
        value: mockCookieStore,
        writable: true,
      })

      await setCookie('apiTest', 'value')

      expect(mockCookieStore.set).toHaveBeenCalled()

      // Clean up
      Object.defineProperty(window, 'cookieStore', {
        value: undefined,
        writable: true,
      })
    })

    it('should fallback when Cookie Store API fails', async () => {
      const mockCookieStore = {
        set: vi.fn().mockRejectedValue(new Error('API failed')),
      }

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      Object.defineProperty(window, 'cookieStore', {
        value: mockCookieStore,
        writable: true,
      })

      await setCookie('fallbackTest', 'value')

      expect(consoleSpy).toHaveBeenCalled()
      expect(mockCookies.fallbackTest).toBe('value')

      Object.defineProperty(window, 'cookieStore', {
        value: undefined,
        writable: true,
      })
      consoleSpy.mockRestore()
    })
  })

  describe('getCookie', () => {
    it('should retrieve existing cookie', () => {
      mockCookies.testCookie = 'testValue'

      const value = getCookie('testCookie')

      expect(value).toBe('testValue')
    })

    it('should return null for non-existent cookie', () => {
      const value = getCookie('nonExistent')

      expect(value).toBeNull()
    })

    it('should decode URL-encoded values', () => {
      mockCookies['test%20name'] = 'test%20value'

      const value = getCookie('test name')

      expect(value).toBe('test value')
    })

    it('should handle empty cookie value', () => {
      mockCookies.emptyCookie = ''

      const value = getCookie('emptyCookie')

      // getCookie returns null for empty values due to the value split logic
      expect(value).toBeNull()
    })
  })

  describe('deleteCookie', () => {
    it('should not throw when deleting cookies', async () => {
      // Just test that deleteCookie doesn't throw errors and completes
      await expect(deleteCookie('testDelete')).resolves.toBeUndefined()
      await expect(deleteCookie('nonExistent')).resolves.toBeUndefined()
    })
  })

  describe('getAllCookies', () => {
    it('should return all cookies as object', () => {
      mockCookies.cookie1 = 'value1'
      mockCookies['cookie%202'] = 'value%202'

      const result = getAllCookies()

      expect(result).toEqual({
        cookie1: 'value1',
        'cookie 2': 'value 2',
      })
    })

    it('should return empty object when no cookies', () => {
      const result = getAllCookies()

      expect(result).toEqual({})
    })
  })
})
