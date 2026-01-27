# Centralized Error Handling System

This boilerplate includes a comprehensive, reusable error handling system that automatically categorizes and displays errors consistently across your application.

## Features

✅ **Automatic Error Classification** - Network, validation, client, server, and unknown errors  
✅ **Consistent UI Components** - Beautiful error displays with icons, badges, and actions  
✅ **Type Safety** - Full TypeScript support with proper error types  
✅ **React Query Integration** - Seamless integration with data fetching  
✅ **Retry Logic** - Smart retry suggestions based on error type  
✅ **Technical Details** - Expandable error details for debugging

## Error Types Supported

### 1. **Network Errors**

- Connection timeouts
- API unreachable
- Internet connectivity issues

### 2. **Validation Errors**

- Zod schema validation failures
- Malformed API responses
- Data type mismatches

### 3. **Client Errors (4xx)**

- Bad requests (400)
- Unauthorized (401)
- Forbidden (403)
- Not found (404)
- Rate limiting (429)

### 4. **Server Errors (5xx)**

- Internal server errors (500)
- Service unavailable (503)
- Gateway timeouts (504)

### 5. **Unknown Errors**

- Unexpected JavaScript errors
- Unhandled edge cases

## Usage Examples

### Basic Error Display

```tsx
import { ErrorDisplay, useQueryErrorHandler } from '@/components/errors'

function MyComponent() {
  const { data, isLoading, error, refetch } = useQuery(...)
  const { getErrorInfo } = useQueryErrorHandler()

  const errorInfo = getErrorInfo(error)

  if (errorInfo) {
    return (
      <ErrorDisplay
        error={errorInfo}
        onRetry={refetch}
        showDetails={true}
      />
    )
  }

  // ... rest of component
}
```

### Inline Error Display

```tsx
import { ErrorInline, parseError } from '@/components/errors'

function MyForm() {
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    try {
      await api.submitForm(data)
    } catch (err) {
      setError(parseError(err))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <ErrorInline error={error} onRetry={handleSubmit} />}
    </form>
  )
}
```

### Error Toast Notifications

```tsx
import { showErrorToast, parseError } from '@/components/errors'

function handleAsyncAction() {
  try {
    await someAsyncOperation()
    toast.success('Operation completed!')
  } catch (error) {
    const errorInfo = parseError(error)
    showErrorToast(errorInfo, () => handleAsyncAction())
  }
}
```

### Custom Error Handling

```tsx
import { useErrorHandler } from '@/components/errors'

function MyComponent() {
  const { handleError } = useErrorHandler({
    onError: (errorInfo) => {
      // Custom logic for specific error types
      if (errorInfo.type === 'network') {
        // Maybe show offline banner
      }
    },
    logErrors: true, // Log server/unknown errors
  })

  const processData = async () => {
    try {
      await api.fetchData()
    } catch (error) {
      const errorInfo = handleError(error) // Automatically parsed
      setError(errorInfo)
    }
  }
}
```

## Configuration

The error system is configured in:

- `src/lib/errorTypes.ts` - Error type definitions
- `src/lib/errorUtils.ts` - Error parsing and utilities
- `src/components/errors/ErrorDisplay.tsx` - UI components
- `src/hooks/useErrorHandler.ts` - React hooks

## Customization

### Adding New Error Types

```typescript
// In errorTypes.ts
export type ErrorType =
  | 'network'
  | 'validation'
  | 'client'
  | 'server'
  | 'unknown'
  | 'custom'

// In errorUtils.ts
export function parseError(error: unknown): ErrorInfo {
  // Add your custom error detection logic
  if (isCustomError(error)) {
    return {
      type: 'custom',
      title: 'Custom Error',
      message: 'This is a custom error type',
      // ...
    }
  }
  // ... existing logic
}
```

### Styling Error Components

The error components use Tailwind CSS and shadcn/ui. You can customize:

- Error colors by modifying `getErrorColors()`
- Icons by updating `getErrorIcon()`
- Alert variants by changing `getErrorVariant()`

This centralized system ensures consistent error handling across your entire application! 🎯
