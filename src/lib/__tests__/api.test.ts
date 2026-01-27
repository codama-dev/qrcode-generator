import { describe, expect, it } from 'vitest'
import { ApiError } from '../api'

describe('API Layer', () => {
  describe('ApiError', () => {
    it('should create ApiError with required properties', () => {
      const error = new ApiError('Test error', {
        status: 404,
        details: 'Not found details',
        response: { error: 'Resource not found' },
      })

      expect(error.name).toBe('ApiError')
      expect(error.message).toBe('Test error')
      expect(error.status).toBe(404)
      expect(error.details).toBe('Not found details')
      expect(error.response).toEqual({ error: 'Resource not found' })
    })

    it('should extend Error class properly', () => {
      const error = new ApiError('Test', { status: 500 })

      expect(error instanceof Error).toBe(true)
      expect(error instanceof ApiError).toBe(true)
    })

    it('should work without optional properties', () => {
      const error = new ApiError('Simple error', { status: 400 })

      expect(error.message).toBe('Simple error')
      expect(error.status).toBe(400)
      expect(error.details).toBeUndefined()
      expect(error.response).toBeUndefined()
    })

    it('should have proper error stack trace', () => {
      const error = new ApiError('Stack test', { status: 500 })

      expect(error.stack).toBeDefined()
      expect(error.stack).toContain('Stack test')
    })
  })

  describe('HTTP Status Code Constants', () => {
    it('should import HTTPStatusCodes from types', async () => {
      const { HTTPStatusCodes } = await import('../types')

      expect(HTTPStatusCodes.OK_200).toBe(200)
      expect(HTTPStatusCodes.NOT_FOUND_404).toBe(404)
      expect(HTTPStatusCodes.INTERNAL_SERVER_ERROR_500).toBe(500)
    })
  })

  describe('Content Type Constants', () => {
    it('should import ContentType from types', async () => {
      const { ContentType } = await import('../types')

      expect(ContentType.JSON).toBe('application/json')
      expect(ContentType.FORM_URLENCODED).toBe('application/x-www-form-urlencoded')
    })
  })

  describe('HTTP Header Constants', () => {
    it('should import HTTPHeader from types', async () => {
      const { HTTPHeader } = await import('../types')

      expect(HTTPHeader.CONTENT_TYPE).toBe('Content-Type')
      expect(HTTPHeader.AUTHORIZATION).toBe('Authorization')
    })
  })

  describe('API Configuration', () => {
    it('should have API_BASE_URL configured', async () => {
      const { API_BASE_URL } = await import('../config')

      expect(typeof API_BASE_URL).toBe('string')
      expect(API_BASE_URL).toBeTruthy()
    })

    it('should have JOKE_API_BASE_URL configured', async () => {
      const { JOKE_API_BASE_URL } = await import('../config')

      expect(JOKE_API_BASE_URL).toBe('https://official-joke-api.appspot.com')
    })
  })

  describe('Schema Integration', () => {
    it('should import joke schemas correctly', async () => {
      const { jokeSchema, jokeArraySchema } = await import('../schemas')

      expect(jokeSchema).toBeDefined()
      expect(jokeArraySchema).toBeDefined()

      // Test valid joke data
      const validJoke = {
        id: 1,
        type: 'general',
        setup: 'Why?',
        punchline: 'Because!',
      }

      expect(() => jokeSchema.parse(validJoke)).not.toThrow()
      expect(() => jokeArraySchema.parse([validJoke])).not.toThrow()
    })

    it('should reject invalid joke data', async () => {
      const { jokeSchema } = await import('../schemas')

      const invalidJoke = {
        id: 'not-a-number',
        type: 'general',
        setup: 'Why?',
        // missing punchline
      }

      expect(() => jokeSchema.parse(invalidJoke)).toThrow()
    })
  })
})
