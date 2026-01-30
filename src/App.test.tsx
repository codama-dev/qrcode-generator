import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App routing and layout', () => {
  it('shows the QR generator when visiting /', () => {
    render(<App />)
    // App title and/or hero text contain "QR code generator"
    const matches = screen.getAllByText(/qr code generator/i)
    expect(matches.length).toBeGreaterThan(0)
    expect(matches[0]).toBeInTheDocument()
  })

  it('shows generator-focused content (QR type and URL input)', () => {
    render(<App />)
    expect(screen.getByText(/qr code type/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /^url$/i })).toBeInTheDocument()
  })
})
