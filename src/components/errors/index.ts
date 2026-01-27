// Centralized error handling exports

export { useErrorHandler, useQueryErrorHandler } from '@/hooks/useErrorHandler'
export type {
  ApiError,
  ErrorInfo,
  ErrorType,
  NetworkError,
  ValidationError,
} from '@/lib/errorTypes'
export {
  getErrorVariant,
  getRetryDelay,
  parseError,
  shouldLogError,
} from '@/lib/errorUtils'
export { ErrorDisplay, ErrorInline, showErrorToast } from './ErrorDisplay'
