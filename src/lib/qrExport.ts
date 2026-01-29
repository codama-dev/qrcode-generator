const XLINK_NS = 'http://www.w3.org/1999/xlink'

/** Convert image href (URL or data URL) to a data URL so exports are self-contained and canvas is not tainted. */
async function hrefToDataUrl(href: string): Promise<string> {
  if (href.startsWith('data:')) {
    return href
  }
  const res = await fetch(href, { mode: 'cors' })
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status}`)
  }
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read blob as data URL'))
    reader.readAsDataURL(blob)
  })
}

/**
 * Clone SVG and replace any <image> hrefs (blob:, https:, etc.) with inlined data URLs
 * so exported SVG/PNG/JPG contain the logo and canvas is not tainted.
 */
export async function inlineSvgImages(svg: SVGSVGElement): Promise<SVGSVGElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement
  const images = clone.querySelectorAll('image')
  for (const el of images) {
    const href = el.getAttribute('href') ?? el.getAttributeNS(XLINK_NS, 'href')
    if (!href || href.startsWith('data:')) {
      continue
    }
    try {
      const dataUrl = await hrefToDataUrl(href)
      el.setAttribute('href', dataUrl)
      el.removeAttributeNS(XLINK_NS, 'href')
    } catch {
      // Leave as-is on failure (e.g. CORS); export may show QR without logo
    }
  }
  return clone
}

/**
 * Export QR code SVG element as PNG via canvas.
 * Center logo is inlined as data URL so it appears in the exported file.
 */
export async function exportAsPng(
  svg: SVGSVGElement,
  width: number,
  height: number,
  filename: string = 'qrcode.png'
): Promise<void> {
  const svgWithInlineImages = await inlineSvgImages(svg)
  const svgString = new XMLSerializer().serializeToString(svgWithInlineImages)
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas 2d context not available'))
          return
        }
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('Failed to create PNG blob'))
              return
            }
            const url = URL.createObjectURL(blob)
            triggerDownload(url, filename)
            URL.revokeObjectURL(url)
            resolve()
          },
          'image/png',
          1
        )
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = () =>
      reject(new Error('Failed to load SVG as image (e.g. CORS or invalid content)'))
    img.src = dataUrl
  })
}

/** Export QR code SVG element as SVG file. Center logo is inlined as data URL so the file is self-contained. */
export async function exportAsSvg(
  svg: SVGSVGElement,
  filename: string = 'qrcode.svg'
): Promise<void> {
  const svgWithInlineImages = await inlineSvgImages(svg)
  const svgString = new XMLSerializer().serializeToString(svgWithInlineImages)
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  triggerDownload(url, filename)
  URL.revokeObjectURL(url)
}

export interface JpgExportOptions {
  quality?: number
  /** Solid background color to use for JPG (no transparency). Defaults to white. */
  backgroundColor?: string
}

/** Export QR code SVG element as JPG file via canvas. Center logo is inlined so it appears in the exported file. */
export async function exportAsJpg(
  svgElement: SVGSVGElement,
  filename: string = 'qrcode.jpg',
  options: JpgExportOptions = {}
): Promise<void> {
  const { quality = 0.92, backgroundColor = '#ffffff' } = options

  const svgWithInlineImages = await inlineSvgImages(svgElement)
  const svgRect = svgElement.getBoundingClientRect()
  const width = svgRect.width || 256
  const height = svgRect.height || 256

  const canvas = document.createElement('canvas')
  canvas.width = width * 2
  canvas.height = height * 2
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not get canvas context')
  }

  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.scale(2, 2)

  const svgData = new XMLSerializer().serializeToString(svgWithInlineImages)
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)
        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('Failed to create JPG blob'))
              return
            }
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename.endsWith('.jpg') ? filename : `${filename}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(downloadUrl)
            resolve()
          },
          'image/jpeg',
          quality
        )
      } catch (e) {
        URL.revokeObjectURL(url)
        reject(e)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG as image'))
    }
    img.src = url
  })
}

export interface PdfExportOptions {
  pageSize?: 'a4' | 'letter' | 'custom'
  customWidth?: number // mm
  customHeight?: number // mm
  qrSize?: number // mm, size of QR on page
  centered?: boolean
  margin?: number // mm
  /** @deprecated PDF export now always embeds the SVG as vector; gradients and center images are preserved without rasterizing the whole QR. */
  hasGradients?: boolean
}

/**
 * Export QR code SVG element as a PDF.
 * The QR modules and shapes are kept as vector paths for sharp output.
 * The center logo image remains raster (embedded as an <image>), so only the logo is bitmap.
 */
export async function exportAsPdf(
  svgElement: SVGSVGElement,
  filename: string = 'qrcode.pdf',
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    pageSize = 'a4',
    customWidth = 210,
    customHeight = 297,
    qrSize = 50,
    centered = true,
    margin = 10,
    // kept for backwards compatibility; no longer changes behavior
    hasGradients: _hasGradients = false,
  } = options

  const { jsPDF } = await import('jspdf')

  let width: number
  let height: number
  if (pageSize === 'a4') {
    width = 210
    height = 297
  } else if (pageSize === 'letter') {
    width = 216
    height = 279
  } else {
    width = customWidth
    height = customHeight
  }

  const pdf = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: pageSize === 'custom' ? [width, height] : pageSize,
  })

  let x = margin
  let y = margin
  if (centered) {
    x = (width - qrSize) / 2
    y = (height - qrSize) / 2
  }

  // Vector path: embed SVG via svg2pdf for sharp, scalable output.
  // We inline center images as data URLs so only the logo is raster, while QR modules stay vector.
  const svgWithInlineImages = await inlineSvgImages(svgElement)
  const svg2pdfModule = await import('svg2pdf.js')
  type Svg2PdfFn = (
    svg: SVGSVGElement,
    pdfInstance: unknown,
    opts: { x: number; y: number; width: number; height: number }
  ) => void | Promise<void>
  const mod = svg2pdfModule as unknown as { default?: Svg2PdfFn; svg2pdf?: Svg2PdfFn }
  const svg2pdfFn: Svg2PdfFn = (mod.default ?? mod.svg2pdf) as Svg2PdfFn

  await svg2pdfFn(svgWithInlineImages, pdf, { x, y, width: qrSize, height: qrSize })

  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
}

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
