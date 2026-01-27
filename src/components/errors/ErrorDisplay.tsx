import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Copy,
  RefreshCw,
  Server,
  Shield,
  Wifi,
} from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ErrorInfo } from '@/lib/errorTypes'
import { getErrorVariant } from '@/lib/errorUtils'

interface ErrorDisplayProps {
  error: ErrorInfo
  onRetry?: () => void
  showDetails?: boolean
  className?: string
}

// Get appropriate icon for error type
function getErrorIcon(errorType: ErrorInfo['type']) {
  switch (errorType) {
    case 'network':
      return Wifi
    case 'server':
      return Server
    case 'client':
      return Shield
    case 'validation':
      return AlertTriangle
    default:
      return AlertCircle
  }
}

// Get color scheme for error type
function getErrorColors(errorType: ErrorInfo['type']) {
  switch (errorType) {
    case 'network':
      return {
        badge: 'destructive' as const,
        iconColor: 'text-red-500',
      }
    case 'server':
      return {
        badge: 'destructive' as const,
        iconColor: 'text-red-500',
      }
    case 'client':
      return {
        badge: 'secondary' as const,
        iconColor: 'text-orange-500',
      }
    case 'validation':
      return {
        badge: 'outline' as const,
        iconColor: 'text-yellow-500',
      }
    default:
      return {
        badge: 'outline' as const,
        iconColor: 'text-gray-500',
      }
  }
}

export function ErrorDisplay({ error, onRetry, showDetails = true, className }: ErrorDisplayProps) {
  const [showDetailedInfo, setShowDetailedInfo] = React.useState(false)
  const ErrorIcon = getErrorIcon(error.type)
  const colors = getErrorColors(error.type)
  const variant = getErrorVariant(error.type)

  const handleCopyError = async () => {
    const errorText = `Error: ${error.title}
Message: ${error.message}
Type: ${error.type}
${error.statusCode ? `Status Code: ${error.statusCode}` : ''}
${error.details ? `Details: ${error.details}` : ''}
Timestamp: ${new Date().toISOString()}`

    try {
      await navigator.clipboard.writeText(errorText)
      toast.success('Error details copied to clipboard')
    } catch {
      toast.error('Failed to copy error details')
    }
  }

  return (
    <Alert variant={variant} className={className}>
      <div className="flex items-start gap-3">
        <ErrorIcon className={`h-5 w-5 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <AlertTitle className="font-semibold text-base">{error.title}</AlertTitle>
            <Badge variant={colors.badge} className="text-xs">
              {error.type}
            </Badge>
            {error.statusCode && (
              <Badge variant="outline" className="font-mono text-xs">
                {error.statusCode}
              </Badge>
            )}
          </div>

          <AlertDescription className="mb-3 text-gray-700 text-sm">
            {error.message}
          </AlertDescription>

          {/* Action Buttons */}
          <div className="mb-3 flex items-center gap-2">
            {error.canRetry && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {error.retryAction || 'Try Again'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyError}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Details
            </Button>
          </div>

          {/* Expandable Details */}
          {showDetails && (error.details || error.statusCode) && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedInfo(!showDetailedInfo)}
                className="flex h-auto items-center gap-2 p-0 text-gray-500 text-xs hover:text-gray-700"
              >
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${showDetailedInfo ? 'rotate-180' : ''}`}
                />
                {showDetailedInfo ? 'Hide' : 'Show'} Technical Details
              </Button>
              {showDetailedInfo && (
                <div className="mt-2 rounded bg-gray-50 p-3 font-mono text-gray-600 text-xs">
                  {error.statusCode && (
                    <div className="mb-2">
                      <strong>Status Code:</strong> {error.statusCode}
                    </div>
                  )}
                  {error.details && (
                    <div>
                      <strong>Details:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-words">{error.details}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  )
}

// Simplified error display for inline use
interface ErrorInlineProps {
  error: ErrorInfo
  onRetry?: () => void
}

export function ErrorInline({ error, onRetry }: ErrorInlineProps) {
  const ErrorIcon = getErrorIcon(error.type)
  const colors = getErrorColors(error.type)

  return (
    <div className="flex items-center gap-2 text-gray-600 text-sm">
      <ErrorIcon className={`h-4 w-4 ${colors.iconColor}`} />
      <span>{error.message}</span>
      {error.canRetry && onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="h-auto p-1">
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// Error toast helper
export function showErrorToast(error: ErrorInfo, onRetry?: () => void) {
  toast.error(error.title, {
    description: error.message,
    action:
      error.canRetry && onRetry
        ? {
            label: error.retryAction || 'Retry',
            onClick: onRetry,
          }
        : undefined,
  })
}
