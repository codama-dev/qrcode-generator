import { useMutation, useQuery } from '@tanstack/react-query'
import { AlertTriangle, Bug, Wifi, WifiOff, X } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { ErrorDisplay } from '@/components/errors/ErrorDisplay'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useQueryErrorHandler } from '@/hooks/useErrorHandler'
import { apiRequest } from '@/lib/api'

// Schema for testing Zod validation errors
const testResponseSchema = z.object({
  id: z.number(),
  message: z.string(),
  timestamp: z.string().datetime(),
})

// Mock API functions that intentionally trigger different errors
const errorTestApi = {
  // 404 Not Found Error
  trigger404: async (): Promise<unknown> => {
    return apiRequest('/nonexistent-endpoint', z.any(), {
      method: 'GET',
    })
  },

  // 500 Server Error
  trigger500: async (): Promise<unknown> => {
    // We'll simulate this by calling an endpoint that doesn't exist on a real server
    // This will likely result in a network error, but we'll treat it as a server error for demo
    const response = await fetch('https://httpstat.us/500', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
    })

    if (!response.ok) {
      const error = new Error('Internal Server Error') as Error & {
        status: number
      }
      error.status = 500
      throw error
    }

    return response.json()
  },

  // Network Error (offline simulation)
  triggerNetworkError: async (): Promise<unknown> => {
    // Simulate network error by trying to reach an unreachable address
    const response = await fetch('https://nonexistent-domain-that-will-fail.invalid/api/test', {
      method: 'GET',
    })

    if (!response.ok) {
      const error = new Error('Network error - please check your connection') as Error & {
        code: string
      }
      error.code = 'NETWORK_ERROR'
      throw error
    }

    return response.json()
  },

  // Zod Validation Error
  triggerZodError: async (): Promise<z.infer<typeof testResponseSchema>> => {
    // Return malformed data that will fail Zod validation
    const badData = {
      id: 'not-a-number', // Should be number
      message: null, // Should be string
      timestamp: 'invalid-date', // Should be valid datetime
      unexpectedField: 'should not be here',
    }

    // Parse with Zod schema to trigger validation error
    return testResponseSchema.parse(badData)
  },

  // Successful API call for comparison
  triggerSuccess: async (): Promise<z.infer<typeof testResponseSchema>> => {
    const goodData = {
      id: 123,
      message: 'Success! This request worked perfectly.',
      timestamp: new Date().toISOString(),
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return testResponseSchema.parse(goodData)
  },
}

export function ErrorHandlingPage() {
  const { getErrorInfo } = useQueryErrorHandler()

  // React Query for testing different error scenarios
  const {
    data: queryData,
    error: queryError,
    isLoading: queryLoading,
    refetch: retryQuery,
  } = useQuery({
    queryKey: ['error-test'],
    queryFn: () => errorTestApi.triggerSuccess(),
    enabled: false, // Don't auto-fetch
    retry: false, // Disable retries for clearer error demonstration
  })

  // Mutations for testing different error types
  const trigger404Mutation = useMutation({
    mutationFn: errorTestApi.trigger404,
    onError: () => {
      toast.error('404 Error Triggered', {
        description: 'The requested endpoint was not found.',
      })
    },
  })

  const trigger500Mutation = useMutation({
    mutationFn: errorTestApi.trigger500,
    onError: () => {
      toast.error('500 Error Triggered', {
        description: 'An internal server error occurred.',
      })
    },
  })

  const triggerNetworkMutation = useMutation({
    mutationFn: errorTestApi.triggerNetworkError,
    onError: () => {
      toast.error('Network Error Triggered', {
        description: 'Failed to connect to the server.',
      })
    },
  })

  const triggerZodMutation = useMutation({
    mutationFn: errorTestApi.triggerZodError,
    onError: () => {
      toast.error('Validation Error Triggered', {
        description: 'The server returned invalid data.',
      })
    },
  })

  const triggerSuccessMutation = useMutation({
    mutationFn: errorTestApi.triggerSuccess,
    onSuccess: data => {
      toast.success('Success!', {
        description: `Received valid response: ${data.message}`,
      })
    },
  })

  const queryErrorInfo = getErrorInfo(queryError)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-bold text-2xl text-gray-900">
          <Bug className="h-6 w-6" />
          Error Handling Demo
        </h1>
        <p className="text-gray-600">
          This demonstrates our comprehensive error handling patterns with React Query
        </p>
      </div>

      {/* Error Testing Controls */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mutation Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Mutation Errors
            </CardTitle>
            <CardDescription>
              Trigger different error types using React Query mutations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => trigger404Mutation.mutate()}
              disabled={trigger404Mutation.isPending}
              variant="outline"
              className="w-full justify-start"
            >
              <X className="mr-2 h-4 w-4" />
              {trigger404Mutation.isPending ? 'Triggering...' : 'Trigger 404 Error'}
            </Button>

            <Button
              onClick={() => trigger500Mutation.mutate()}
              disabled={trigger500Mutation.isPending}
              variant="outline"
              className="w-full justify-start"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              {trigger500Mutation.isPending ? 'Triggering...' : 'Trigger 500 Error'}
            </Button>

            <Button
              onClick={() => triggerNetworkMutation.mutate()}
              disabled={triggerNetworkMutation.isPending}
              variant="outline"
              className="w-full justify-start"
            >
              <WifiOff className="mr-2 h-4 w-4" />
              {triggerNetworkMutation.isPending ? 'Triggering...' : 'Trigger Network Error'}
            </Button>

            <Button
              onClick={() => triggerZodMutation.mutate()}
              disabled={triggerZodMutation.isPending}
              variant="outline"
              className="w-full justify-start"
            >
              <Bug className="mr-2 h-4 w-4" />
              {triggerZodMutation.isPending ? 'Triggering...' : 'Trigger Validation Error'}
            </Button>

            <Separator />

            <Button
              onClick={() => triggerSuccessMutation.mutate()}
              disabled={triggerSuccessMutation.isPending}
              variant="default"
              className="w-full justify-start"
            >
              <Wifi className="mr-2 h-4 w-4" />
              {triggerSuccessMutation.isPending ? 'Loading...' : 'Trigger Success'}
            </Button>
          </CardContent>
        </Card>

        {/* Query Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-500" />
              Query Errors
            </CardTitle>
            <CardDescription>Test error handling with React Query queries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button onClick={() => retryQuery()} disabled={queryLoading} className="w-full">
                {queryLoading ? 'Loading...' : 'Test Successful Query'}
              </Button>

              {queryData && (
                <Alert>
                  <Wifi className="h-4 w-4" />
                  <AlertTitle>Query Success</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2">
                      <strong>ID:</strong> {queryData.id}
                      <br />
                      <strong>Message:</strong> {queryData.message}
                      <br />
                      <strong>Timestamp:</strong> {new Date(queryData.timestamp).toLocaleString()}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {queryErrorInfo && (
                <ErrorDisplay
                  error={queryErrorInfo}
                  onRetry={() => retryQuery()}
                  className="mt-4"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display Examples */}
      <div className="space-y-6">
        <h2 className="font-semibold text-gray-900 text-xl">Error Display Components</h2>

        <div className="flex flex-col gap-6">
          {/* Network Error Example */}
          <Alert
            variant="destructive"
            className="!flex !grid-cols-none w-full max-w-none items-start gap-3"
          >
            <WifiOff className="mt-1 h-5 w-5 flex-shrink-0" />
            <div className="w-full flex-1 space-y-3">
              <AlertTitle className="!col-start-auto font-semibold text-base">
                Connection Problem
              </AlertTitle>
              <AlertDescription className="!col-start-auto text-gray-700 text-sm">
                Unable to connect to the server. Please check your internet connection and try
                again.
              </AlertDescription>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info('Retry clicked for network error')}
                  className="flex items-center gap-2"
                >
                  <WifiOff className="h-4 w-4" />
                  Try Again
                </Button>
                <Button size="sm" variant="ghost" className="flex items-center gap-2">
                  Copy Details
                </Button>
              </div>
            </div>
          </Alert>

          {/* Server Error Example */}
          <Alert
            variant="destructive"
            className="!flex !grid-cols-none w-full max-w-none items-start gap-3"
          >
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0" />
            <div className="w-full flex-1 space-y-3">
              <AlertTitle className="!col-start-auto font-semibold text-base">
                Server Error
              </AlertTitle>
              <AlertDescription className="!col-start-auto text-gray-700 text-sm">
                The server encountered an unexpected error. Please try again later.
              </AlertDescription>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info('Retry clicked for server error')}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Try Again
                </Button>
                <Button size="sm" variant="ghost" className="flex items-center gap-2">
                  Copy Details
                </Button>
              </div>
            </div>
          </Alert>

          {/* Client Error Example */}
          <Alert className="!flex !grid-cols-none w-full max-w-none items-start gap-3 border-orange-200 bg-orange-50">
            <X className="mt-1 h-5 w-5 flex-shrink-0 text-orange-500" />
            <div className="w-full flex-1 space-y-3">
              <AlertTitle className="!col-start-auto font-semibold text-base text-orange-800">
                Request Error
              </AlertTitle>
              <AlertDescription className="!col-start-auto text-orange-700 text-sm">
                There was a problem with your request. Please check your input and try again.
              </AlertDescription>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info('Retry clicked for client error')}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Try Again
                </Button>
                <Button size="sm" variant="ghost" className="flex items-center gap-2">
                  Copy Details
                </Button>
              </div>
            </div>
          </Alert>

          {/* Validation Error Example */}
          <Alert className="!flex !grid-cols-none w-full max-w-none items-start gap-3 border-yellow-200 bg-yellow-50">
            <Bug className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-600" />
            <div className="w-full flex-1 space-y-3">
              <AlertTitle className="!col-start-auto font-semibold text-base text-yellow-800">
                Data Format Error
              </AlertTitle>
              <AlertDescription className="!col-start-auto text-sm text-yellow-700">
                The server returned data in an unexpected format. Please contact support if this
                persists.
              </AlertDescription>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info('Retry clicked for validation error')}
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  Try Again
                </Button>
                <Button size="sm" variant="ghost" className="flex items-center gap-2">
                  Copy Details
                </Button>
              </div>
            </div>
          </Alert>
        </div>
      </div>

      {/* Technical Details */}
      <div className="mt-8 rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 font-semibold text-gray-900 text-lg">Error Handling Features</h3>
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div>
            <h4 className="mb-2 font-medium text-gray-900">Error Types</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>
                • <strong>Network Errors</strong> - Connection issues
              </li>
              <li>
                • <strong>404 Errors</strong> - Not found endpoints
              </li>
              <li>
                • <strong>500 Errors</strong> - Server errors
              </li>
              <li>
                • <strong>Zod Validation</strong> - Schema validation failures
              </li>
              <li>
                • <strong>Generic Errors</strong> - Unexpected errors
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-gray-900">Features</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• Centralized error handling with useErrorHandler</li>
              <li>• Consistent ErrorDisplay component</li>
              <li>• Toast notifications for user feedback</li>
              <li>• Retry functionality for failed requests</li>
              <li>• Type-safe error categorization</li>
              <li>• React Query integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
