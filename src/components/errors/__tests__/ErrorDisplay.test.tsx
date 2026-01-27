import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ErrorInfo } from '@/lib/errorTypes'
import { ErrorDisplay, ErrorInline, showErrorToast } from '../ErrorDisplay'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

describe('ErrorDisplay Components', () => {
  describe('ErrorDisplay', () => {
    const mockNetworkError: ErrorInfo = {
      type: 'network',
      title: 'Connection Problem',
      message: 'Unable to connect to server',
      canRetry: true,
      retryAction: 'Try again',
    }

    const mockValidationError: ErrorInfo = {
      type: 'validation',
      title: 'Validation Error',
      message: 'Invalid data format',
      details: 'name: Expected string, received number',
      statusCode: 400,
      canRetry: true,
    }

    it('should render error information correctly', () => {
      render(<ErrorDisplay error={mockNetworkError} />)

      expect(screen.getByText('Connection Problem')).toBeInTheDocument()
      expect(screen.getByText('Unable to connect to server')).toBeInTheDocument()
      expect(screen.getByText('network')).toBeInTheDocument()
    })

    it('should show retry button when canRetry is true and onRetry is provided', () => {
      const onRetrySpy = vi.fn()

      render(<ErrorDisplay error={mockNetworkError} onRetry={onRetrySpy} />)

      const retryButton = screen.getByText('Try again')
      expect(retryButton).toBeInTheDocument()

      fireEvent.click(retryButton)
      expect(onRetrySpy).toHaveBeenCalledTimes(1)
    })

    it('should not show retry button when canRetry is false', () => {
      const errorWithoutRetry: ErrorInfo = {
        ...mockNetworkError,
        canRetry: false,
      }

      render(<ErrorDisplay error={errorWithoutRetry} onRetry={vi.fn()} />)

      expect(screen.queryByText('Try again')).not.toBeInTheDocument()
    })

    it('should show status code badge when provided', () => {
      render(<ErrorDisplay error={mockValidationError} />)

      expect(screen.getByText('400')).toBeInTheDocument()
    })

    it('should show/hide technical details on click', async () => {
      render(<ErrorDisplay error={mockValidationError} showDetails={true} />)

      const detailsButton = screen.getByText('Show Technical Details')
      expect(detailsButton).toBeInTheDocument()

      fireEvent.click(detailsButton)

      await waitFor(() => {
        expect(screen.getByText('Hide Technical Details')).toBeInTheDocument()
        expect(screen.getByText('name: Expected string, received number')).toBeInTheDocument()
      })
    })

    it('should copy error details to clipboard', async () => {
      const clipboardSpy = vi.spyOn(navigator.clipboard, 'writeText')

      render(<ErrorDisplay error={mockValidationError} />)

      const copyButton = screen.getByText('Copy Details')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(clipboardSpy).toHaveBeenCalledWith(
          expect.stringContaining('Error: Validation Error')
        )
      })
    })

    it('should not show details section when showDetails is false', () => {
      render(<ErrorDisplay error={mockValidationError} showDetails={false} />)

      expect(screen.queryByText('Show Technical Details')).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <ErrorDisplay error={mockNetworkError} className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('ErrorInline', () => {
    const mockError: ErrorInfo = {
      type: 'client',
      title: 'Client Error',
      message: 'Request failed',
      canRetry: true,
    }

    it('should render inline error message', () => {
      render(<ErrorInline error={mockError} />)

      expect(screen.getByText('Request failed')).toBeInTheDocument()
    })

    it('should show retry button when canRetry and onRetry provided', () => {
      const onRetrySpy = vi.fn()

      render(<ErrorInline error={mockError} onRetry={onRetrySpy} />)

      const retryButton = screen.getByRole('button')
      fireEvent.click(retryButton)

      expect(onRetrySpy).toHaveBeenCalledTimes(1)
    })

    it('should not show retry button when canRetry is false', () => {
      const errorNoRetry: ErrorInfo = {
        ...mockError,
        canRetry: false,
      }

      render(<ErrorInline error={errorNoRetry} onRetry={vi.fn()} />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('showErrorToast', () => {
    it('should call toast.error with correct parameters', async () => {
      const { toast } = await import('sonner')
      const mockError: ErrorInfo = {
        type: 'server',
        title: 'Server Error',
        message: 'Internal server error',
        canRetry: true,
        retryAction: 'Retry',
      }

      const onRetry = vi.fn()
      showErrorToast(mockError, onRetry)

      expect(toast.error).toHaveBeenCalledWith(
        'Server Error',
        expect.objectContaining({
          description: 'Internal server error',
          action: expect.objectContaining({
            label: 'Retry',
          }),
        })
      )
    })

    it('should not include action when canRetry is false', async () => {
      const { toast } = await import('sonner')
      const mockError: ErrorInfo = {
        type: 'client',
        title: 'Unauthorized',
        message: 'You are not authorized',
        canRetry: false,
      }

      showErrorToast(mockError)

      expect(toast.error).toHaveBeenCalledWith(
        'Unauthorized',
        expect.objectContaining({
          description: 'You are not authorized',
          action: undefined,
        })
      )
    })
  })
})
