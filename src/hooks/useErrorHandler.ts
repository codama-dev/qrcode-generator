import { useCallback } from 'react'
import type { ErrorInfo } from '@/lib/errorTypes'
import { parseError, shouldLogError } from '@/lib/errorUtils'

interface UseErrorHandlerOptions {
  onError?: (error: ErrorInfo) => void
  logErrors?: boolean
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { onError, logErrors = true } = options

  const handleError = useCallback(
    (error: unknown): ErrorInfo => {
      const errorInfo = parseError(error)

      // Log error if needed (server errors, unknown errors)
      if (logErrors && shouldLogError(errorInfo)) {
      }

      // Call custom error handler if provided
      if (onError) {
        onError(errorInfo)
      }

      return errorInfo
    },
    [onError, logErrors]
  )

  return { handleError }
}

// Hook for React Query error handling
export function useQueryErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { handleError } = useErrorHandler(options)

  const getErrorInfo = useCallback(
    (error: unknown): ErrorInfo | null => {
      if (!error) {
        return null
      }
      return handleError(error)
    },
    [handleError]
  )

  return { getErrorInfo, handleError }
}
