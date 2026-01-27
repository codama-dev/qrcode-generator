import { z } from 'zod'

// Error classification types
export type ErrorType = 'network' | 'validation' | 'client' | 'server' | 'unknown'

// Structured error information for UI display
export interface ErrorInfo {
  type: ErrorType
  title: string
  message: string
  details?: string
  statusCode?: number
  canRetry?: boolean
  retryAction?: string
}

// Network error (connection issues, API unreachable)
export interface NetworkError extends Error {
  code?: 'ECONNREFUSED' | 'ENOTFOUND' | 'TIMEOUT'
}

// API error with HTTP status and details
export interface ApiError extends Error {
  status: number
  details?: string
  response?: unknown
}

// Validation error (Zod schema validation failed)
export interface ValidationError extends Error {
  zodError: z.ZodError
  details: string
}

// Type guards for error identification
export function isNetworkError(error: unknown): error is NetworkError {
  return (
    error instanceof Error &&
    (error.message.includes('Network error') ||
      error.message.includes('fetch') ||
      error.message.includes('connection') ||
      ('code' in error && ['ECONNREFUSED', 'ENOTFOUND', 'TIMEOUT'].includes(error.code as string)))
  )
}

export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof Error &&
    'status' in error &&
    typeof (error as Error & { status: number }).status === 'number'
  )
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof Error && 'zodError' in error && error.zodError instanceof z.ZodError
}

export function isZodError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError
}

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface ErrorWithSeverity extends ErrorInfo {
  severity: ErrorSeverity
}
