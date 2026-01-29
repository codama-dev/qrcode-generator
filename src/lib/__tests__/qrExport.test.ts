import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportAsJpg, exportAsPdf, exportAsPng, exportAsSvg } from '../qrExport'

const pdfMockState = {
  lastSaved: '' as string,
}

vi.mock('jspdf', () => {
  class MockPdf {
    internal = {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    }

    addImage = vi.fn()

    save(name: string) {
      pdfMockState.lastSaved = name
    }
  }

  return {
    jsPDF: MockPdf,
  }
})

vi.mock('svg2pdf.js', () => {
  return {
    default: vi.fn(async () => {}),
  }
})

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

  it('creates a blob with SVG type and triggers download with default filename', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '100')
    svg.setAttribute('height', '100')

    await exportAsSvg(svg)

    expect(createObjectURLSpy).toHaveBeenCalled()
    const blob = createObjectURLSpy.mock.calls[0]?.[0] as Blob
    expect(blob.type).toBe('image/svg+xml;charset=utf-8')
    const link = appendChildSpy.mock.calls[0]?.[0]
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect((link as HTMLAnchorElement).download).toBe('qrcode.svg')
    expect(clickSpy).toHaveBeenCalled()
  })

  it('uses custom filename when provided', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    await exportAsSvg(svg, 'my-qr.svg')
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

type ToBlobCallback = (b: Blob | null) => void
type MockWithCalls = { mock: { calls: unknown[][] } }
type AppendChildMock = ((node: Node) => Node) & MockWithCalls

describe('exportAsJpg', () => {
  const originalCreateElement = document.createElement.bind(document)
  let toBlobSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    const mockCtx = {
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
      scale: vi.fn(),
    }
    toBlobSpy = vi.fn((callback: ToBlobCallback, _type?: string, _quality?: number) =>
      callback(new Blob([''], { type: 'image/jpeg' }))
    )
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(mockCtx),
      toBlob: toBlobSpy,
    }
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tagName as keyof HTMLElementTagNameMap)
    })

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-jpg')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    vi.spyOn(document.body, 'appendChild').mockImplementation(node => {
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

  it('exports JPG with default filename and background', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '192')
    svg.setAttribute('height', '192')

    await exportAsJpg(svg)

    const appendChildMock = document.body.appendChild as unknown as AppendChildMock
    const link = appendChildMock.mock.calls.find(
      (c: unknown[]) => c[0] instanceof HTMLAnchorElement
    )?.[0] as HTMLAnchorElement
    expect(link?.download).toBe('qrcode.jpg')
  })

  it('uses custom filename and quality when provided', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    await exportAsJpg(svg, 'custom-name', { quality: 0.5, backgroundColor: '#ff0000' })

    const blobArgs = toBlobSpy.mock.calls[0]
    expect(blobArgs[1]).toBe('image/jpeg')
    expect(blobArgs[2]).toBe(0.5)
    const appendChildMock = document.body.appendChild as unknown as AppendChildMock
    const link = appendChildMock.mock.calls.find(
      (c: unknown[]) => c[0] instanceof HTMLAnchorElement
    )?.[0] as HTMLAnchorElement
    expect(link?.download).toBe('custom-name.jpg')
  })
})

describe('exportAsPdf', () => {
  const originalCreateElement = document.createElement.bind(document)

  beforeEach(() => {
    const mockCtx = {
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    }
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(mockCtx),
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock'),
    }

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tagName as keyof HTMLElementTagNameMap)
    })

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

  it('exports PDF with default filename', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    await exportAsPdf(svg)

    expect(pdfMockState.lastSaved).toBe('qrcode.pdf')
  })

  it('exports PDF with custom filename and keeps .pdf extension', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    await exportAsPdf(svg, 'my-qrcode')

    expect(pdfMockState.lastSaved).toBe('my-qrcode.pdf')
  })

  it('exports PDF via raster path when hasGradients is true', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '256')
    svg.setAttribute('height', '256')
    await exportAsPdf(svg, 'gradient-qr.pdf', { hasGradients: true })

    expect(pdfMockState.lastSaved).toBe('gradient-qr.pdf')
  })
})
