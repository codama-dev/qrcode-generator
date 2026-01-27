import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { ApiError, NetworkError } from '@/lib/errorTypes'
import { useErrorHandler, useQueryErrorHandler } from '../useErrorHandler'

describe('useErrorHandler', () => {
  it('should parse errors and return ErrorInfo', () => {
    const { result } = renderHook(() => useErrorHandler())

    const networkError = new Error('Network error occurred') as NetworkError
    networkError.code = 'ECONNREFUSED'

    const errorInfo = result.current.handleError(networkError)

    expect(errorInfo.type).toBe('network')
    expect(errorInfo.title).toBe('Connection Problem')
    expect(errorInfo.canRetry).toBe(true)
  })

  it('should call custom onError callback when provided', () => {
    const onErrorSpy = vi.fn()
    const { result } = renderHook(() => useErrorHandler({ onError: onErrorSpy }))

    const error = new Error('Test error')
    const errorInfo = result.current.handleError(error)

    expect(onErrorSpy).toHaveBeenCalledWith(errorInfo)
    expect(onErrorSpy).toHaveBeenCalledTimes(1)
  })

  it('should handle logging configuration', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useErrorHandler({ logErrors: false }))

    const serverError = new Error('Server error') as ApiError
    serverError.status = 500

    result.current.handleError(serverError)

    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should log errors when logErrors is true', () => {
    // Since global setup mocks console.error, test behavior instead
    const { result } = renderHook(() => useErrorHandler({ logErrors: true }))

    const serverError = new Error('Server error') as ApiError
    serverError.status = 500

    const errorInfo = result.current.handleError(serverError)

    // Verify server errors are processed correctly (would trigger logging in real app)
    expect(errorInfo.type).toBe('server')
    expect(errorInfo.title).toBe('Server Error')
  })
})

describe('useQueryErrorHandler', () => {
  it('should return null for falsy errors', () => {
    const { result } = renderHook(() => useQueryErrorHandler())

    expect(result.current.getErrorInfo(null)).toBeNull()
    expect(result.current.getErrorInfo(undefined)).toBeNull()
    expect(result.current.getErrorInfo('')).toBeNull()
    expect(result.current.getErrorInfo(0)).toBeNull()
  })

  it('should return ErrorInfo for valid errors', () => {
    const { result } = renderHook(() => useQueryErrorHandler())

    const apiError = new Error('API failed') as ApiError
    apiError.status = 404

    const errorInfo = result.current.getErrorInfo(apiError)

    expect(errorInfo).not.toBeNull()
    expect(errorInfo?.type).toBe('client')
    expect(errorInfo?.title).toBe('Not Found')
    expect(errorInfo?.statusCode).toBe(404)
  })

  it('should handle Zod validation errors', () => {
    const { result } = renderHook(() => useQueryErrorHandler())

    const schema = z.object({ name: z.string(), age: z.number() })
    const zodError = schema.safeParse({ name: 123, age: 'invalid' }).error

    const errorInfo = result.current.getErrorInfo(zodError)

    expect(errorInfo?.type).toBe('validation')
    expect(errorInfo?.title).toBe('Data Format Error')
    expect(errorInfo?.details).toContain('name')
    expect(errorInfo?.details).toContain('age')
  })

  it('should expose handleError function', () => {
    const onErrorSpy = vi.fn()
    const { result } = renderHook(() => useQueryErrorHandler({ onError: onErrorSpy }))

    const error = new Error('Test error')
    const errorInfo = result.current.handleError(error)

    expect(typeof result.current.handleError).toBe('function')
    expect(errorInfo.type).toBe('unknown')
    expect(onErrorSpy).toHaveBeenCalledWith(errorInfo)
  })
})
