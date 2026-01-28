/**
 * Export QR code SVG element as PNG via canvas.
 * When the SVG contains cross-origin images (e.g. center logo from URL), canvas may be tainted and export can fail;
 * use same-origin or CORS-enabled images for reliable PNG export.
 */
export function exportAsPng(
  svg: SVGSVGElement,
  width: number,
  height: number,
  filename: string = 'qrcode.png'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const svgString = new XMLSerializer().serializeToString(svg)
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
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

/** Export QR code SVG element as SVG file. */
export function exportAsSvg(svg: SVGSVGElement, filename: string = 'qrcode.svg'): void {
  const svgString = new XMLSerializer().serializeToString(svg)
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  triggerDownload(url, filename)
  URL.revokeObjectURL(url)
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
