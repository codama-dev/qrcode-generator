import {
  type ApiError,
  type ErrorInfo,
  type ErrorType,
  isApiError,
  isNetworkError,
  isValidationError,
  isZodError,
} from './errorTypes'

// Centralized error parsing function
export function parseError(error: unknown): ErrorInfo {
  if (!error) {
    return {
      type: 'unknown',
      title: 'Unknown Error',
      message: 'An unexpected error occurred.',
      canRetry: true,
      retryAction: 'Try again',
    }
  }

  // 1. Network errors (connection issues, API unreachable)
  if (isNetworkError(error)) {
    return {
      type: 'network',
      title: 'Connection Problem',
      message:
        'Unable to connect to the server. Please check your internet connection and try again.',
      details: error.message,
      canRetry: true,
      retryAction: 'Retry connection',
    }
  }

  // 2. Validation errors (Zod schema validation failed)
  if (isValidationError(error)) {
    return {
      type: 'validation',
      title: 'Data Validation Error',
      message: 'The server returned data in an unexpected format.',
      details: error.details,
      canRetry: true,
      retryAction: 'Try again',
    }
  }

  // 3. Direct Zod errors
  if (isZodError(error)) {
    const zodDetails = error.issues
      .map((err: import('zod').ZodIssue) => `${err.path.join('.')}: ${err.message}`)
      .join(', ')

    return {
      type: 'validation',
      title: 'Data Format Error',
      message: 'The server returned data in an unexpected format.',
      details: `Validation errors: ${zodDetails}`,
      canRetry: true,
      retryAction: 'Try again',
    }
  }

  // 4. API errors with HTTP status codes
  if (isApiError(error)) {
    const apiError = error as ApiError

    // Server errors (5xx)
    if (apiError.status >= 500) {
      return {
        type: 'server',
        title: 'Server Error',
        message: 'The server encountered an unexpected error. Please try again later.',
        details: apiError.details || apiError.message,
        statusCode: apiError.status,
        canRetry: true,
        retryAction: 'Try again later',
      }
    }

    // Client errors (4xx)
    if (apiError.status >= 400) {
      let title = 'Request Error'
      let message = 'There was a problem with your request.'
      let canRetry = true
      let retryAction = 'Try again'

      // Specific 4xx status codes
      switch (apiError.status) {
        case 400:
          title = 'Bad Request'
          message = 'The request was invalid. Please check your input and try again.'
          break
        case 401:
          title = 'Unauthorized'
          message = 'You are not authorized to access this resource.'
          canRetry = false
          break
        case 403:
          title = 'Forbidden'
          message = 'You do not have permission to access this resource.'
          canRetry = false
          break
        case 404:
          title = 'Not Found'
          message = 'The requested resource was not found.'
          break
        case 429:
          title = 'Too Many Requests'
          message = 'You have made too many requests. Please wait a moment and try again.'
          retryAction = 'Wait and retry'
          break
        default:
          message = apiError.message || message
      }

      return {
        type: 'client',
        title,
        message,
        details: apiError.details,
        statusCode: apiError.status,
        canRetry,
        retryAction: canRetry ? retryAction : undefined,
      }
    }
  }

  // 5. Generic JavaScript errors
  if (error instanceof Error) {
    return {
      type: 'unknown',
      title: 'Unexpected Error',
      message: error.message || 'An unexpected error occurred.',
      details: error.stack,
      canRetry: true,
      retryAction: 'Try again',
    }
  }

  // 6. Fallback for any other error types
  return {
    type: 'unknown',
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try refreshing the page.',
    details: typeof error === 'string' ? error : JSON.stringify(error),
    canRetry: true,
    retryAction: 'Refresh page',
  }
}

// Helper function to get error variant for UI components
export function getErrorVariant(errorType: ErrorType): 'default' | 'destructive' {
  switch (errorType) {
    case 'network':
    case 'server':
      return 'destructive'
    default:
      return 'default'
  }
}

// Helper function to determine if error should be logged
export function shouldLogError(errorInfo: ErrorInfo): boolean {
  return errorInfo.type === 'server' || errorInfo.type === 'unknown'
}

// Helper function to get retry delay based on error type
export function getRetryDelay(errorType: ErrorType): number {
  switch (errorType) {
    case 'network':
      return 2000 // 2 seconds
    case 'server':
      return 5000 // 5 seconds
    case 'client':
      return 1000 // 1 second
    default:
      return 3000 // 3 seconds
  }
}
