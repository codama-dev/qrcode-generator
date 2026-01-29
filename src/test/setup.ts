/// <reference types="vitest/globals" />
// Extend expect with jest-dom matchers
import '@testing-library/jest-dom/vitest'

// Initialize i18n so useTranslation works in tests
import '@/i18n'

// Fetch polyfill (JSDOM)
import 'whatwg-fetch'

// Mock window.matchMedia for Sonner toasts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Basic ResizeObserver polyfill for Radix UI components in JSDOM
class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}
}

// IntersectionObserver polyfill for FloatingQRPreview in JSDOM
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  readonly root: Element | null = null
  readonly rootMargin = ''
  readonly thresholds: number[] = []
}

interface TestGlobals {
  ResizeObserver: typeof ResizeObserver
  IntersectionObserver: typeof IntersectionObserverMock
}
;(globalThis as unknown as TestGlobals).ResizeObserver = ResizeObserver
;(globalThis as unknown as TestGlobals).IntersectionObserver = IntersectionObserverMock

// MSW test server (if you plan to use MSW for API mocking)
// import { server } from '@/mocks/server'

// Fail tests on unexpected network calls
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

// Optional: quiet React Query errors in test output
// Silence console.error during tests to avoid noisy output from React Query
let errorSpy: ReturnType<typeof vi.spyOn> | undefined
beforeAll(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterAll(() => {
  errorSpy?.mockRestore()
})
