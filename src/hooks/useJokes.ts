import { useQuery } from '@tanstack/react-query'
import { jokeApi } from '@/lib/api'
import type { Joke } from '@/lib/types'

// Hook for getting a single random joke
export function useRandomJoke() {
  return useQuery<Joke>({
    queryKey: ['joke', 'random'],
    queryFn: jokeApi.getRandomJoke,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for getting ten random jokes
export function useRandomTenJokes() {
  return useQuery<Joke[]>({
    queryKey: ['jokes', 'random-ten'],
    queryFn: jokeApi.getRandomTen,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for getting jokes by type/category
export function useJokesByType(type: string, enabled = true) {
  return useQuery<Joke>({
    queryKey: ['joke', 'type', type],
    queryFn: () => jokeApi.getJokesByType(type),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Alternative endpoints (using the /jokes/ prefix)
export function useJokesRandom() {
  return useQuery<Joke>({
    queryKey: ['jokes', 'alt-random'],
    queryFn: jokeApi.getJokeRandom,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useJokesTen() {
  return useQuery<Joke[]>({
    queryKey: ['jokes', 'alt-ten'],
    queryFn: jokeApi.getJokesTen,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
