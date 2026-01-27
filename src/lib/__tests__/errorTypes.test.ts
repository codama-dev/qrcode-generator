import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  type ApiError,
  isApiError,
  isNetworkError,
  isValidationError,
  isZodError,
  type NetworkError,
  type ValidationError,
} from '../errorTypes'

describe('Error Type Guards', () => {
  describe('isNetworkError', () => {
    it('should identify network errors by message content', () => {
      const networkError = new Error('Network error occurred')
      const fetchError = new Error('fetch failed')
      const connectionError = new Error('connection refused')

      expect(isNetworkError(networkError)).toBe(true)
      expect(isNetworkError(fetchError)).toBe(true)
      expect(isNetworkError(connectionError)).toBe(true)
    })

    it('should identify network errors by error code', () => {
      const econnRefusedError = new Error('Connection failed') as NetworkError
      econnRefusedError.code = 'ECONNREFUSED'

      const enotFoundError = new Error('Host not found') as NetworkError
      enotFoundError.code = 'ENOTFOUND'

      const timeoutError = new Error('Request timeout') as NetworkError
      timeoutError.code = 'TIMEOUT'

      expect(isNetworkError(econnRefusedError)).toBe(true)
      expect(isNetworkError(enotFoundError)).toBe(true)
      expect(isNetworkError(timeoutError)).toBe(true)
    })

    it('should return false for non-network errors', () => {
      const regularError = new Error('Regular error')
      const apiError = new Error('API error') as ApiError
      apiError.status = 500

      expect(isNetworkError(regularError)).toBe(false)
      expect(isNetworkError(apiError)).toBe(false)
      expect(isNetworkError(null)).toBe(false)
      expect(isNetworkError(undefined)).toBe(false)
      expect(isNetworkError('string error')).toBe(false)
    })
  })

  describe('isApiError', () => {
    it('should identify API errors with status codes', () => {
      const apiError = new Error('API failed') as ApiError
      apiError.status = 404

      const serverError = new Error('Server error') as ApiError
      serverError.status = 500

      expect(isApiError(apiError)).toBe(true)
      expect(isApiError(serverError)).toBe(true)
    })

    it('should return false for errors without status codes', () => {
      const regularError = new Error('Regular error')
      const errorWithStringStatus = new Error('Error') as Error & {
        status: string
      }
      errorWithStringStatus.status = 'not a number'

      expect(isApiError(regularError)).toBe(false)
      expect(isApiError(errorWithStringStatus)).toBe(false)
      expect(isApiError(null)).toBe(false)
      expect(isApiError('string')).toBe(false)
    })
  })

  describe('isValidationError', () => {
    it('should identify validation errors with zodError property', () => {
      const zodError = z.object({ name: z.string() }).safeParse({ name: 123 })
      const validationError = new Error('Validation failed') as ValidationError
      if (zodError.error) {
        validationError.zodError = zodError.error
      }

      expect(isValidationError(validationError)).toBe(true)
    })

    it('should return false for errors without zodError property', () => {
      const regularError = new Error('Regular error')
      const apiError = new Error('API error') as ApiError
      apiError.status = 400

      expect(isValidationError(regularError)).toBe(false)
      expect(isValidationError(apiError)).toBe(false)
    })
  })

  describe('isZodError', () => {
    it('should identify ZodError instances', () => {
      const schema = z.object({ name: z.string() })
      const result = schema.safeParse({ name: 123 })

      expect(isZodError(result.error)).toBe(true)
    })

    it('should return false for non-ZodError instances', () => {
      const regularError = new Error('Regular error')

      expect(isZodError(regularError)).toBe(false)
      expect(isZodError(null)).toBe(false)
      expect(isZodError('string')).toBe(false)
    })
  })
})
