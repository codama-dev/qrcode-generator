import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportAsPng, exportAsSvg } from '../qrExport'

describe('exportAsSvg', () => {
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let clickSpy: ReturnType<typeof vi.fn>
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    clickSpy = vi.fn()
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(node => {
      if (node instanceof HTMLAnchorElement) {
        node.click = clickSpy as () => void
      }
      return node
    })
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as unknown as Node)
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-svg')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a blob with SVG type and triggers download with default filename', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '100')
    svg.setAttribute('height', '100')

    exportAsSvg(svg)

    expect(createObjectURLSpy).toHaveBeenCalled()
    const blob = createObjectURLSpy.mock.calls[0]?.[0] as Blob
    expect(blob.type).toBe('image/svg+xml;charset=utf-8')
    const link = appendChildSpy.mock.calls[0]?.[0]
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect((link as HTMLAnchorElement).download).toBe('qrcode.svg')
    expect(clickSpy).toHaveBeenCalled()
  })

  it('uses custom filename when provided', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    exportAsSvg(svg, 'my-qr.svg')
    const link = appendChildSpy.mock.calls[0]?.[0]
    expect((link as HTMLAnchorElement).download).toBe('my-qr.svg')
  })
})

describe('exportAsPng', () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  const originalCreateElement = document.createElement.bind(document)

  beforeEach(() => {
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-png')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const mockToBlob = vi.fn((callback: (b: Blob | null) => void) => {
      callback(new Blob([''], { type: 'image/png' }))
    })
    const mockCtx = {
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    }
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(mockCtx),
      toBlob: mockToBlob,
    }
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tagName as keyof HTMLElementTagNameMap)
    })

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(node => {
      if (node instanceof HTMLAnchorElement) {
        node.click = vi.fn()
      }
      return node
    })
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as unknown as Node)

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
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('calls createObjectURL with a PNG blob and uses default filename', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '192')
    svg.setAttribute('height', '192')

    const p = exportAsPng(svg, 192, 192)
    await p

    expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob))
    const blob = createObjectURLSpy.mock.calls[0]?.[0] as Blob
    expect(blob.type).toBe('image/png')
    const link = appendChildSpy.mock.calls.find(
      (c: unknown[]) => c[0] instanceof HTMLAnchorElement
    )?.[0] as HTMLAnchorElement
    expect(link?.download).toBe('qrcode.png')
  })

  it('uses custom filename when provided', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    await exportAsPng(svg, 64, 64, 'custom.png')
    const link = appendChildSpy.mock.calls.find(
      (c: unknown[]) => c[0] instanceof HTMLAnchorElement
    )?.[0] as HTMLAnchorElement
    expect(link?.download).toBe('custom.png')
  })
})
