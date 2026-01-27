import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import { API_BASE_URL } from '@/lib/config'
import {
  apiResponseSchema,
  genericEnvelopeSchema,
  jokeArraySchema,
  singleJokeSchema,
} from '@/lib/schemas'
import { ContentType, HTTPHeader, HTTPStatusCodes } from '@/lib/types'

enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

type ServiceResponse<T> = {
  success: boolean
  message: string
  responseObject?: T
  statusCode: number
}

export class ApiError extends Error {
  status: number
  details?: string
  response?: unknown
  constructor(message: string, options: { status: number; details?: string; response?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.details = options.details
    this.response = options.response
  }
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    [HTTPHeader.CONTENT_TYPE]: ContentType.JSON,
  },
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      const networkError = new Error('Network error - please check your connection') as Error & {
        code: string
      }
      networkError.code = error.code || 'NETWORK_ERROR'
      throw networkError
    }

    // Let the apiRequest function handle API-specific errors
    return Promise.reject(error)
  }
)

// Generic API request helper with error handling
export async function apiRequest<T>(
  endpoint: string,
  responseSchema: z.ZodSchema<T>,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await apiClient({
      url: endpoint,
      method: HTTPMethod.GET,
      ...options,
    })

    const json = response.data

    // Parse generic envelope to surface server error details
    const genericParse = genericEnvelopeSchema.safeParse(json)
    if (genericParse.success) {
      const env = genericParse.data
      const failed = env.success === false || response.status >= HTTPStatusCodes.BAD_REQUEST_400
      if (failed) {
        const details =
          env.responseObject &&
          typeof env.responseObject === 'object' &&
          (env.responseObject as { error?: string }).error
            ? (env.responseObject as { error?: string }).error
            : undefined
        throw new ApiError(env.message ?? 'request failed', {
          status: env.statusCode ?? response.status,
          details,
        })
      }
    }
    try {
      const envelope = apiResponseSchema(responseSchema).parse(json) as ServiceResponse<T>
      // For operations that expect null (like delete), responseObject can be null
      if (envelope.responseObject === undefined) {
        throw new ApiError('missing responseObject in service response', {
          status: response.status,
        })
      }
      return envelope.responseObject as T
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
      }
      throw parseError
    }
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response?.data) {
        // Try to parse error response
        const errorData = axiosError.response.data as Record<string, unknown>
        throw new ApiError(
          (typeof errorData.message === 'string' ? errorData.message : null) ||
            axiosError.message ||
            'Request failed',
          {
            status: axiosError.response.status,
            details:
              typeof errorData.error === 'string'
                ? errorData.error
                : typeof errorData.details === 'string'
                  ? errorData.details
                  : undefined,
          }
        )
      }
    }

    // Re-throw if it's already an ApiError
    if (error instanceof ApiError) {
      throw error
    }

    // Handle unknown errors
    throw new ApiError('An unexpected error occurred', {
      status: HTTPStatusCodes.INTERNAL_SERVER_ERROR_500,
    })
  }
}

// Simple API request for direct responses (no envelope)
async function directApiRequest<T>(
  endpoint: string,
  responseSchema: z.ZodSchema<T>,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await apiClient({
      url: endpoint,
      method: HTTPMethod.GET,
      ...options,
    })

    const json = response.data
    try {
      const result = responseSchema.parse(json)
      return result
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        // Create a custom ValidationError for better error handling
        const validationError = new Error('Response validation failed') as Error & {
          zodError: z.ZodError
          details: string
        }
        validationError.zodError = parseError
        validationError.details = parseError.issues
          .map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
          .join(', ')
        throw validationError
      }
      throw parseError
    }
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response?.data) {
        // Try to parse error response
        const errorData = axiosError.response.data as Record<string, unknown>
        throw new ApiError(
          (typeof errorData.message === 'string' ? errorData.message : null) ||
            axiosError.message ||
            'Request failed',
          {
            status: axiosError.response.status,
            details:
              typeof errorData.error === 'string'
                ? errorData.error
                : typeof errorData.details === 'string'
                  ? errorData.details
                  : undefined,
          }
        )
      }
    }

    // Re-throw if it's already an ApiError
    if (error instanceof ApiError) {
      throw error
    }

    // Handle unknown errors
    throw new ApiError('An unexpected error occurred', {
      status: HTTPStatusCodes.INTERNAL_SERVER_ERROR_500,
    })
  }
}

// Official Joke API functions
export const jokeApi = {
  // Get a random joke
  getRandomJoke: async () => {
    return directApiRequest('/random_joke', singleJokeSchema, {
      method: HTTPMethod.GET,
    })
  },

  // Get ten random jokes
  getRandomTen: async () => {
    return directApiRequest('/random_ten', jokeArraySchema, {
      method: HTTPMethod.GET,
    })
  },

  // Alternative endpoint for random joke
  getJokeRandom: async () => {
    return directApiRequest('/jokes/random', singleJokeSchema, {
      method: HTTPMethod.GET,
    })
  },

  // Alternative endpoint for ten jokes
  getJokesTen: async () => {
    return directApiRequest('/jokes/ten', jokeArraySchema, {
      method: HTTPMethod.GET,
    })
  },

  // Get jokes by type/category (if supported by API)
  getJokesByType: async (type: string) => {
    return directApiRequest(`/jokes/${type}/random`, singleJokeSchema, {
      method: HTTPMethod.GET,
    })
  },
}

// Export the API client for backward compatibility and direct usage
export const api = apiClient

// Export default as the joke API for clean imports
export default jokeApi
