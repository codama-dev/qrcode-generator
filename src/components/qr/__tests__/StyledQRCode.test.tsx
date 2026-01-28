import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StyledQRCode } from '../StyledQRCode'

describe('StyledQRCode', () => {
  it('renders squares style as path (no circles)', () => {
    const { container } = render(
      <StyledQRCode value="test" size={64} level="M" style="squares" includeMargin />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.querySelectorAll('circle').length).toBe(0)
    expect(svg?.querySelectorAll('path').length).toBeGreaterThan(0)
  })

  it('renders dots style as circles', () => {
    const { container } = render(
      <StyledQRCode value="x" size={64} level="M" style="dots" includeMargin />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.querySelectorAll('circle').length).toBeGreaterThan(0)
  })

  it('renders rounded style as rects with rx/ry', () => {
    const { container } = render(
      <StyledQRCode value="x" size={64} level="M" style="rounded" includeMargin />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    const rects = svg?.querySelectorAll('rect[rx]') ?? []
    expect(rects.length).toBeGreaterThan(0)
  })

  it('uses aria-label for accessibility', () => {
    render(
      <StyledQRCode value="test" size={64} level="M" style="squares" aria-label="Test QR code" />
    )
    expect(screen.getByRole('img', { name: 'Test QR code' })).toBeInTheDocument()
  })

  it('uses fgColor and bgColor in SVG output', () => {
    const { container } = render(
      <StyledQRCode
        value="x"
        size={64}
        level="M"
        style="squares"
        fgColor="#ff0000"
        bgColor="#0000ff"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    const paths = svg?.querySelectorAll('path[fill]') ?? []
    const fills = [...paths].map(p => p.getAttribute('fill'))
    expect(fills).toContain('#0000ff')
    expect(fills).toContain('#ff0000')
  })

  it('defaults to black and white when colors not passed', () => {
    const { container } = render(<StyledQRCode value="x" size={64} level="M" style="squares" />)
    const svg = container.querySelector('svg')
    const paths = svg?.querySelectorAll('path[fill]') ?? []
    const fills = [...paths].map(p => p.getAttribute('fill'))
    expect(fills).toContain('#000000')
    expect(fills).toContain('#ffffff')
  })

  it('does not render image when imageSrc is not passed', () => {
    const { container } = render(<StyledQRCode value="x" size={64} level="M" style="squares" />)
    const svg = container.querySelector('svg')
    expect(svg?.querySelectorAll('image').length).toBe(0)
  })

  it('renders center image when imageSrc is passed and load succeeds', async () => {
    const RealImage = globalThis.Image
    vi.stubGlobal(
      'Image',
      class MockImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        _src = ''
        set src(s: string) {
          this._src = s
          queueMicrotask(() => this.onload?.())
        }
        get src() {
          return this._src
        }
      }
    )

    const { container } = render(
      <StyledQRCode
        value="x"
        size={64}
        level="M"
        style="squares"
        imageSrc="https://example.com/logo.png"
      />
    )

    await waitFor(() => {
      const img = container.querySelector('svg image')
      expect(img).toBeInTheDocument()
      expect(img?.getAttribute('href')).toBe('https://example.com/logo.png')
    })

    vi.stubGlobal('Image', RealImage)
  })

  it('calls onImageLoadError when image fails to load', async () => {
    const RealImage = globalThis.Image
    const onImageLoadError = vi.fn()
    vi.stubGlobal(
      'Image',
      class MockImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        _src = ''
        set src(_: string) {
          queueMicrotask(() => this.onerror?.())
        }
        get src() {
          return this._src
        }
      }
    )

    render(
      <StyledQRCode
        value="x"
        size={64}
        level="M"
        style="squares"
        imageSrc="https://invalid.example/nonexistent.png"
        onImageLoadError={onImageLoadError}
      />
    )

    await waitFor(() => {
      expect(onImageLoadError).toHaveBeenCalled()
    })

    vi.stubGlobal('Image', RealImage)
  })
})
