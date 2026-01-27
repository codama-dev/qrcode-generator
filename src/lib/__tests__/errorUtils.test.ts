import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import type { ApiError, NetworkError, ValidationError } from '../errorTypes'
import { getErrorVariant, getRetryDelay, parseError, shouldLogError } from '../errorUtils'

describe('Error Utils', () => {
  describe('parseError', () => {
    it('should handle network errors', () => {
      const networkError = new Error('Network error occurred') as NetworkError
      networkError.code = 'ECONNREFUSED'

      const result = parseError(networkError)

      expect(result.type).toBe('network')
      expect(result.title).toBe('Connection Problem')
      expect(result.message).toContain('Unable to connect')
      expect(result.canRetry).toBe(true)
      expect(result.retryAction).toBe('Retry connection')
    })

    it('should handle validation errors with Zod details', () => {
      const zodError = z.object({ name: z.string() }).safeParse({ name: 123 })
      const validationError = new Error('Validation failed') as ValidationError
      if (zodError.error) {
        validationError.zodError = zodError.error
        validationError.details = 'name: Expected string, received number'
      }

      const result = parseError(validationError)

      expect(result.type).toBe('validation')
      expect(result.title).toBe('Data Validation Error')
      expect(result.details).toContain('name: Expected string')
      expect(result.canRetry).toBe(true)
    })

    it('should handle direct Zod errors', () => {
      const schema = z.object({ email: z.string().email() })
      const zodError = schema.safeParse({ email: 'invalid' }).error

      const result = parseError(zodError)

      expect(result.type).toBe('validation')
      expect(result.title).toBe('Data Format Error')
      expect(result.details).toContain('email')
      expect(result.canRetry).toBe(true)
    })

    it('should handle API server errors (5xx)', () => {
      const serverError = new Error('Internal server error') as ApiError
      serverError.status = 500
      serverError.details = 'Database connection failed'

      const result = parseError(serverError)

      expect(result.type).toBe('server')
      expect(result.title).toBe('Server Error')
      expect(result.statusCode).toBe(500)
      expect(result.details).toBe('Database connection failed')
      expect(result.canRetry).toBe(true)
      expect(result.retryAction).toBe('Try again later')
    })

    it('should handle API client errors (4xx)', () => {
      const clientError = new Error('Bad request') as ApiError
      clientError.status = 400

      const result = parseError(clientError)

      expect(result.type).toBe('client')
      expect(result.title).toBe('Bad Request')
      expect(result.statusCode).toBe(400)
      expect(result.canRetry).toBe(true)
    })

    it('should handle unauthorized errors (401)', () => {
      const authError = new Error('Unauthorized') as ApiError
      authError.status = 401

      const result = parseError(authError)

      expect(result.type).toBe('client')
      expect(result.title).toBe('Unauthorized')
      expect(result.canRetry).toBe(false)
    })

    it('should handle rate limiting errors (429)', () => {
      const rateLimitError = new Error('Too many requests') as ApiError
      rateLimitError.status = 429

      const result = parseError(rateLimitError)

      expect(result.type).toBe('client')
      expect(result.title).toBe('Too Many Requests')
      expect(result.canRetry).toBe(true)
    })

    it('should handle generic JavaScript errors', () => {
      const jsError = new Error('Something went wrong')

      const result = parseError(jsError)

      expect(result.type).toBe('unknown')
      expect(result.title).toBe('Unexpected Error')
      expect(result.message).toBe('Something went wrong')
      expect(result.canRetry).toBe(true)
    })

    it('should handle null/undefined errors', () => {
      const nullResult = parseError(null)
      const undefinedResult = parseError(undefined)

      expect(nullResult.type).toBe('unknown')
      expect(undefinedResult.type).toBe('unknown')
      expect(nullResult.canRetry).toBe(true)
      expect(undefinedResult.canRetry).toBe(true)
    })

    it('should handle string errors', () => {
      const stringError = 'String error message'

      const result = parseError(stringError)

      expect(result.type).toBe('unknown')
      expect(result.title).toBe('Something went wrong')
      expect(result.details).toBe('String error message')
    })
  })

  describe('getErrorVariant', () => {
    it('should return destructive for network and server errors', () => {
      expect(getErrorVariant('network')).toBe('destructive')
      expect(getErrorVariant('server')).toBe('destructive')
    })

    it('should return default for other error types', () => {
      expect(getErrorVariant('validation')).toBe('default')
      expect(getErrorVariant('client')).toBe('default')
      expect(getErrorVariant('unknown')).toBe('default')
    })
  })

  describe('shouldLogError', () => {
    it('should return true for server and unknown errors', () => {
      expect(shouldLogError({ type: 'server', title: '', message: '' })).toBe(true)
      expect(shouldLogError({ type: 'unknown', title: '', message: '' })).toBe(true)
    })

    it('should return false for client, network, and validation errors', () => {
      expect(shouldLogError({ type: 'client', title: '', message: '' })).toBe(false)
      expect(shouldLogError({ type: 'network', title: '', message: '' })).toBe(false)
      expect(shouldLogError({ type: 'validation', title: '', message: '' })).toBe(false)
    })
  })

  describe('getRetryDelay', () => {
    it('should return appropriate delays for different error types', () => {
      expect(getRetryDelay('network')).toBe(2000)
      expect(getRetryDelay('server')).toBe(5000)
      expect(getRetryDelay('client')).toBe(1000)
      expect(getRetryDelay('validation')).toBe(3000)
      expect(getRetryDelay('unknown')).toBe(3000)
    })
  })
})
