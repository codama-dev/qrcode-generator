import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))

    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    })

    expect(result.current).toBe('initial')

    // Change value
    rerender({ value: 'changed', delay: 500 })

    // Should still be initial value before delay
    expect(result.current).toBe('initial')

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should now have the new value
    expect(result.current).toBe('changed')
  })

  it('should reset debounce timer on rapid changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    })

    // Make rapid changes
    rerender({ value: 'change1' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'change2' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'final' })

    // Should still have initial value
    expect(result.current).toBe('initial')

    // Fast-forward full delay
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should have final value
    expect(result.current).toBe('final')
  })

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    })

    rerender({ value: 'changed', delay: 1000 })

    // Advance by old delay amount
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should still be initial (new delay is 1000ms)
    expect(result.current).toBe('initial')

    // Advance by remaining time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now should be changed
    expect(result.current).toBe('changed')
  })

  it('should handle different value types', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: { name: 'test' } },
    })

    const newValue = { name: 'changed' }
    rerender({ value: newValue })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toEqual(newValue)
  })

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 0), {
      initialProps: { value: 'initial' },
    })

    rerender({ value: 'immediate' })

    // With zero delay, still need to advance timers by at least one tick
    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toBe('immediate')
  })
})
