import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App routing and layout', () => {
  it('shows the QR generator when visiting /', () => {
    render(<App />)
    const headings = screen.getAllByRole('heading', { name: /qr code generator/i })
    expect(headings.length).toBeGreaterThan(0)
    expect(headings[0]).toBeInTheDocument()
  })

  it('shows generator-focused content (content input)', () => {
    render(<App />)
    expect(screen.getByRole('textbox', { name: /^content$/i })).toBeInTheDocument()
  })
})
