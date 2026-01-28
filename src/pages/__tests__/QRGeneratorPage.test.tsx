import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { QRGeneratorPage } from '../QRGeneratorPage'

describe('QRGeneratorPage', () => {
  it('renders content input and option controls', () => {
    const { container } = render(<QRGeneratorPage />)

    // Form labels are associated with their controls (no aria-label required).
    expect(screen.getByRole('textbox', { name: /^content$/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /error correction/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /^size$/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /module style/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /^foreground$/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /^background$/i })).toBeInTheDocument()

    // Guard against accidental duplicate ids (important for label/description wiring).
    const ids = [...container.querySelectorAll('[id]')]
      .map(el => el.getAttribute('id'))
      .filter((v): v is string => typeof v === 'string' && v.length > 0)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('shows placeholder when content is empty', () => {
    render(<QRGeneratorPage />)
    expect(screen.getByText('Waiting for content')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /qr code preview/i })).not.toBeInTheDocument()
  })

  it('shows QR when content is entered', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^content$/i }), 'https://example.com')
    expect(
      screen.getByRole('img', { name: /qr code preview for https:\/\/example\.com/i })
    ).toBeInTheDocument()
  })

  it('shows validation error when content is cleared after being touched', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    const input = screen.getByRole('textbox', { name: /^content$/i })
    await user.type(input, 'x')
    await user.clear(input)
    await user.tab()
    expect(screen.getByText('Content is required')).toBeInTheDocument()
  })

  it('passes size and options to QR code', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^content$/i }), 'test')
    const qr = screen.getByRole('img', { name: /qr code preview for test/i })
    // Default size is "medium" (192px); options are wired from form to StyledQRCode
    expect(qr).toHaveAttribute('width', '192')
    expect(qr).toHaveAttribute('height', '192')
  })

  it('renders QR with default squares style (single path, no circles)', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^content$/i }), 'x')
    const qr = screen.getByRole('img', { name: /qr code preview for x/i })
    expect(qr).toBeInTheDocument()
    // Default style is squares: one path for foreground, no circles
    expect(qr.querySelectorAll('circle').length).toBe(0)
    expect(qr.querySelectorAll('path').length).toBeGreaterThan(0)
  })

  it('uses default black/white for QR when content is entered', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^content$/i }), 'x')
    const qr = screen.getByRole('img', { name: /qr code preview for x/i })
    const paths = qr.querySelectorAll('path[fill]')
    const fills = [...paths].map(p => p.getAttribute('fill'))
    expect(fills).toContain('#000000')
    expect(fills).toContain('#ffffff')
  })

  it('shows Add center image toggle and center-image inputs when checked', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    expect(screen.getByRole('checkbox', { name: /add center image/i })).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: /add center image/i }))
    expect(screen.getByRole('textbox', { name: /image url/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/or upload/i)).toBeInTheDocument()
  })

  it('shows Preview card and Download PNG/SVG when content is entered', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^content$/i }), 'x')
    expect(screen.getByRole('heading', { name: /preview/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download png/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download svg/i })).toBeInTheDocument()
  })

  it('renders without error at narrow viewport (320px)', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 })
    render(<QRGeneratorPage />)
    expect(screen.getByRole('textbox', { name: /^content$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /preview/i })).toBeInTheDocument()
  })

  it('renders without error at desktop viewport (1024px)', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
    render(<QRGeneratorPage />)
    expect(screen.getByRole('textbox', { name: /^content$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /preview/i })).toBeInTheDocument()
  })
})
