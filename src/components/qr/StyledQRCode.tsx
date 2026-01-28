import { create } from 'qrcode'
import { forwardRef, useEffect, useId, useMemo, useState } from 'react'
import type { QRStyleOption } from '@/lib/schemas'

const DEFAULT_MARGIN = 4

export interface StyledQRCodeProps {
  value: string
  size: number
  level: 'L' | 'M' | 'Q' | 'H'
  style: QRStyleOption
  fgColor?: string
  bgColor?: string
  /** Center image/logo URL. Shown centered at logoSizeRatio of QR size. */
  imageSrc?: string | null
  /** Logo size as fraction of QR side (0–1). Default 0.2. */
  logoSizeRatio?: number
  includeMargin?: boolean
  role?: string
  'aria-label'?: string
  /** Called when the center image fails to load (e.g. CORS or invalid URL). */
  onImageLoadError?: () => void
}

type ImageLoadStatus = 'idle' | 'loading' | 'loaded' | 'error'

/** Renders a QR code SVG with squares, rounded, or dots style using the qrcode package matrix. */
export const StyledQRCode = forwardRef<SVGSVGElement, StyledQRCodeProps>(function StyledQRCode(
  {
    value,
    size,
    level,
    style,
    fgColor = '#000000',
    bgColor = '#ffffff',
    imageSrc = null,
    logoSizeRatio = 0.2,
    includeMargin = true,
    role = 'img',
    'aria-label': ariaLabel = 'QR code',
    onImageLoadError,
  },
  ref
) {
  const [imageStatus, setImageStatus] = useState<ImageLoadStatus>('idle')
  const clipId = useId().replace(/:/g, '-')

  useEffect(() => {
    if (!imageSrc || !imageSrc.trim()) {
      setImageStatus('idle')
      return
    }
    setImageStatus('loading')
    const img = new Image()
    const src = imageSrc.trim()
    img.onload = () => setImageStatus('loaded')
    img.onerror = () => {
      setImageStatus('error')
      onImageLoadError?.()
    }
    img.src = src
    return () => {
      img.onload = null
      img.onerror = null
      img.src = ''
    }
  }, [imageSrc, onImageLoadError])
  const { viewBox, pathOrElements } = useMemo(() => {
    const qr = create(value, { errorCorrectionLevel: level })
    const modules = qr.modules
    const n = modules.size
    const m = includeMargin ? DEFAULT_MARGIN : 0
    const total = n + 2 * m

    const darkCells: { row: number; col: number }[] = []
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (modules.get(row, col)) {
          darkCells.push({ row, col })
        }
      }
    }

    if (style === 'squares') {
      const path = darkCells
        .map(({ row, col }) => {
          const x = col + m
          const y = row + m
          return `M${x} ${y}h1v1h-1v-1z`
        })
        .join(' ')
      return {
        viewBox: `0 0 ${total} ${total}`,
        pathOrElements: { type: 'path' as const, d: path },
      }
    }

    if (style === 'rounded') {
      const rects = darkCells.map(({ row, col }) => ({
        x: col + m,
        y: row + m,
        rx: 0.25,
        ry: 0.25,
      }))
      return {
        viewBox: `0 0 ${total} ${total}`,
        pathOrElements: { type: 'rounded' as const, rects },
      }
    }

    // dots
    const circles = darkCells.map(({ row, col }) => ({
      cx: col + m + 0.5,
      cy: row + m + 0.5,
      r: 0.45,
    }))
    return {
      viewBox: `0 0 ${total} ${total}`,
      pathOrElements: { type: 'dots' as const, circles },
    }
  }, [value, level, includeMargin, style])

  const n = viewBox.split(' ')[2]
  const numCells = Number.parseInt(n ?? '0', 10)

  const showImage = imageSrc && imageStatus === 'loaded'
  const logoSize = Math.max(1, Math.floor(numCells * logoSizeRatio))
  const logoX = (numCells - logoSize) / 2
  const logoY = (numCells - logoSize) / 2

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={viewBox}
      role={role}
      aria-label={ariaLabel}
      shapeRendering="crispEdges"
    >
      <path fill={bgColor} d={`M0,0 h${numCells}v${numCells}H0z`} shapeRendering="crispEdges" />
      {pathOrElements.type === 'path' && (
        <path fill={fgColor} d={pathOrElements.d} shapeRendering="crispEdges" />
      )}
      {pathOrElements.type === 'rounded' &&
        pathOrElements.rects.map(r => (
          <rect
            key={`${r.x}-${r.y}`}
            x={r.x}
            y={r.y}
            width={1}
            height={1}
            rx={r.rx}
            ry={r.ry}
            fill={fgColor}
          />
        ))}
      {pathOrElements.type === 'dots' &&
        pathOrElements.circles.map(c => (
          <circle key={`${c.cx}-${c.cy}`} cx={c.cx} cy={c.cy} r={c.r} fill={fgColor} />
        ))}
      {showImage && (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect
                x={logoX}
                y={logoY}
                width={logoSize}
                height={logoSize}
                rx={logoSize * 0.1}
                ry={logoSize * 0.1}
              />
            </clipPath>
          </defs>
          <image
            href={imageSrc}
            x={logoX}
            y={logoY}
            width={logoSize}
            height={logoSize}
            preserveAspectRatio="xMidYMid meet"
            clipPath={`url(#${clipId})`}
          />
        </>
      )}
    </svg>
  )
})
