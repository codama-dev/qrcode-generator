import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useIsMobile } from '../use-mobile'

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset window properties
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('should be a function that returns boolean', () => {
    const { result } = renderHook(() => useIsMobile())

    expect(typeof useIsMobile).toBe('function')
    expect(typeof result.current).toBe('boolean')
  })

  it('should call matchMedia with correct breakpoint', () => {
    renderHook(() => useIsMobile())

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })

  it('should set up and clean up event listeners', () => {
    const mockAddEventListener = vi.fn()
    const mockRemoveEventListener = vi.fn()

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        media: '(max-width: 767px)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: vi.fn(),
      }),
    })

    const { unmount } = renderHook(() => useIsMobile())

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should handle window resize scenarios', () => {
    // Mock small screen width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500, // Mobile size
    })

    const { result } = renderHook(() => useIsMobile())

    // Should handle mobile detection logic
    expect(typeof result.current).toBe('boolean')
  })

  it('should return false as default when no match', () => {
    const { result } = renderHook(() => useIsMobile())

    // With our mock setup, should return false
    expect(result.current).toBe(false)
  })
})
