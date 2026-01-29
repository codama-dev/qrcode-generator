import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { QRGeneratorPage } from '../QRGeneratorPage'

describe('QRGeneratorPage', () => {
  it('renders content selector and option controls', () => {
    const { container } = render(<QRGeneratorPage />)

    // Type selector and initial URL input are rendered.
    expect(screen.getByText(/qr code type/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /url/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /^url$/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /error correction/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /output size/i })).toBeInTheDocument()
    expect(screen.getByText(/module style/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dots/i })).toBeInTheDocument()
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

  it('shows QR when URL content is entered', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^url$/i }), 'https://example.com')
    const qrImages = screen.getAllByRole('img', {
      name: /qr code preview for https:\/\/example\.com/i,
    })
    expect(qrImages.length).toBeGreaterThan(0)
    expect(qrImages[0]).toBeInTheDocument()
  })

  it('updates preview when URL content is cleared after being entered', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    const input = screen.getByRole('textbox', { name: /^url$/i })
    await user.type(input, 'x')
    await user.clear(input)
    expect(screen.getByText('Waiting for content')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /qr code preview/i })).not.toBeInTheDocument()
  })

  it('passes size and options to QR code', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^url$/i }), 'test-url')
    const qrImages = screen.getAllByRole('img', { name: /qr code preview for test-url/i })
    const qr = qrImages[0]
    // Default size preset is "medium" (256px); options are wired from form to StyledQRCode
    expect(qr).toHaveAttribute('width', '256')
    expect(qr).toHaveAttribute('height', '256')
  })

  it('renders QR with default dots style (circles for modules)', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^url$/i }), 'x')
    const qr = screen.getAllByRole('img', { name: /qr code preview for x/i })[0]
    expect(qr).toBeInTheDocument()
    // Default style is dots: circles for modules
    expect(qr.querySelectorAll('circle').length).toBeGreaterThan(0)
  })

  it('uses default black/white for QR when content is entered', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^url$/i }), 'x')
    const qr = screen.getAllByRole('img', { name: /qr code preview for x/i })[0]
    const withFill = qr.querySelectorAll('path[fill], circle[fill]')
    const fills = [...withFill].map(el => el.getAttribute('fill'))
    expect(fills).toContain('#000000')
    expect(fills).toContain('#ffffff')
  })

  it('shows Add center image toggle and center-image inputs when checked', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    expect(screen.getByRole('switch', { name: /add center image/i })).toBeInTheDocument()
    await user.click(screen.getByRole('switch', { name: /add center image/i }))
    expect(screen.getByRole('textbox', { name: /image url/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/or upload/i)).toBeInTheDocument()
  })

  it('shows Preview card and Download PNG/SVG when content is entered', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)
    await user.type(screen.getByRole('textbox', { name: /^url$/i }), 'x')
    expect(screen.getByRole('heading', { name: /preview/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^png$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^svg$/i })).toBeInTheDocument()
  })

  it('renders without error at narrow viewport (320px)', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 })
    render(<QRGeneratorPage />)
    expect(screen.getByRole('textbox', { name: /^url$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /preview/i })).toBeInTheDocument()
  })

  it('renders without error at desktop viewport (1024px)', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
    render(<QRGeneratorPage />)
    expect(screen.getByRole('textbox', { name: /^url$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /preview/i })).toBeInTheDocument()
  })

  it('switches between URL and Text forms and preserves values', async () => {
    const user = userEvent.setup()
    render(<QRGeneratorPage />)

    // URL is default; enter URL content.
    await user.type(screen.getByRole('textbox', { name: /^url$/i }), 'https://example.com')
    expect(
      screen.getAllByRole('img', { name: /qr code preview for https:\/\/example\.com/i })[0]
    ).toBeInTheDocument()

    // Switch to Text and enter a message.
    await user.click(screen.getByRole('button', { name: /text/i }))
    await user.type(screen.getByRole('textbox', { name: /text content/i }), 'Hello world')
    expect(
      screen.getAllByRole('img', { name: /qr code preview for hello world/i })[0]
    ).toBeInTheDocument()

    // Switch back to URL and ensure URL value is preserved.
    await user.click(screen.getByRole('button', { name: /url/i }))
    expect(screen.getByRole('textbox', { name: /^url$/i })).toHaveValue('https://example.com')
  })
})
