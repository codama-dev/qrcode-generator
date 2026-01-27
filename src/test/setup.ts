/// <reference types="vitest/globals" />
// Extend expect with jest-dom matchers
import '@testing-library/jest-dom/vitest'

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
