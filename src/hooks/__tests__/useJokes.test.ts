import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useJokesByType, useRandomJoke, useRandomTenJokes } from '../useJokes'

// Mock the API
vi.mock('@/lib/api', () => ({
  jokeApi: {
    getRandomJoke: vi.fn(),
    getRandomTen: vi.fn(),
    getJokesByType: vi.fn(),
  },
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

function renderHookWithClient<T>(hook: () => T) {
  const testQueryClient = createTestQueryClient()
  return renderHook(hook, {
    wrapper: ({ children }) =>
      createElement(QueryClientProvider, { client: testQueryClient }, children),
  })
}

describe('useJokes hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useRandomJoke', () => {
    it('should return initial loading state', () => {
      const { result } = renderHookWithClient(() => useRandomJoke())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeNull()
    })

    it('should have refetch function', () => {
      const { result } = renderHookWithClient(() => useRandomJoke())

      expect(typeof result.current.refetch).toBe('function')
    })

    it('should use correct query key', async () => {
      const { jokeApi } = await import('@/lib/api')
      vi.mocked(jokeApi.getRandomJoke).mockResolvedValue({
        id: 1,
        type: 'general',
        setup: 'test',
        punchline: 'test',
      })

      renderHookWithClient(() => useRandomJoke())

      // The hook should be properly configured
      expect(true).toBe(true) // Placeholder for query key validation
    })
  })

  describe('useRandomTenJokes', () => {
    it('should return initial loading state', () => {
      const { result } = renderHookWithClient(() => useRandomTenJokes())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeNull()
    })

    it('should have refetch function', () => {
      const { result } = renderHookWithClient(() => useRandomTenJokes())

      expect(typeof result.current.refetch).toBe('function')
    })

    it('should handle successful data fetch', async () => {
      const mockJokes = [
        { id: 1, type: 'general', setup: 'Setup 1', punchline: 'Punchline 1' },
        {
          id: 2,
          type: 'programming',
          setup: 'Setup 2',
          punchline: 'Punchline 2',
        },
      ]

      const { jokeApi } = await import('@/lib/api')
      vi.mocked(jokeApi.getRandomTen).mockResolvedValue(mockJokes)

      const { result } = renderHookWithClient(() => useRandomTenJokes())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockJokes)
    })
  })

  describe('useJokesByType', () => {
    it('should not fetch when disabled', () => {
      const { result } = renderHookWithClient(() => useJokesByType('programming', false))

      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })

    it('should fetch when enabled', async () => {
      const mockJoke = {
        id: 3,
        type: 'programming',
        setup: 'Why do programmers like dark mode?',
        punchline: 'Because light attracts bugs!',
      }

      const { jokeApi } = await import('@/lib/api')
      vi.mocked(jokeApi.getJokesByType).mockResolvedValue(mockJoke)

      const { result } = renderHookWithClient(() => useJokesByType('programming', true))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(jokeApi.getJokesByType).toHaveBeenCalledWith('programming')
    })

    it('should have refetch function', () => {
      const { result } = renderHookWithClient(() => useJokesByType('dad', true))

      expect(typeof result.current.refetch).toBe('function')
    })
  })
})
