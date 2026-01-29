import { create } from 'qrcode'
import { forwardRef, useEffect, useId, useMemo, useState } from 'react'
import type { GradientConfig, QRStyleOption } from '@/lib/schemas'

type RectModule = {
  x: number
  y: number
  width: number
  height: number
  rx?: number
  ry?: number
}

type PathOrElements =
  | { type: 'path'; d: string }
  | { type: 'rects'; rects: RectModule[] }
  | { type: 'dots'; circles: { cx: number; cy: number; r: number }[] }

export interface StyledQRCodeProps {
  value: string
  size: number
  level: 'L' | 'M' | 'Q' | 'H'
  style: QRStyleOption
  fgColor?: string
  bgColor?: string
  foregroundGradient?: GradientConfig | null
  backgroundGradient?: GradientConfig | null
  /** Center image/logo URL. Shown centered at logoSizeRatio of QR size. */
  imageSrc?: string | null
  /** Logo size as fraction of QR side (0–1). Default 0.2. */
  logoSizeRatio?: number
  /** Quiet zone (margin) in modules around the QR; used when includeMargin is true. */
  quietZone?: number
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
    foregroundGradient,
    backgroundGradient,
    imageSrc = null,
    logoSizeRatio = 0.2,
    quietZone = 4,
    includeMargin = true,
    role = 'img',
    'aria-label': ariaLabel = 'QR code',
    onImageLoadError,
  },
  ref
) {
  const [imageStatus, setImageStatus] = useState<ImageLoadStatus>('idle')
  const clipId = useId().replace(/:/g, '-')
  const fgGradientId = `${clipId}-fg-gradient`
  const bgGradientId = `${clipId}-bg-gradient`

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
  const { viewBox, pathOrElements }: { viewBox: string; pathOrElements: PathOrElements } =
    useMemo(() => {
      const qr = create(value, { errorCorrectionLevel: level })
      const modules = qr.modules
      const n = modules.size
      const m = includeMargin ? quietZone : 0
      const total = n + 2 * m

      const darkCells: { row: number; col: number }[] = []
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          if (modules.get(row, col)) {
            darkCells.push({ row, col })
          }
        }
      }

      // Squares use a compact path; other styles use explicit elements
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
        const rects: RectModule[] = darkCells.map(({ row, col }) => ({
          x: col + m,
          y: row + m,
          width: 1,
          height: 1,
          rx: 0.25,
          ry: 0.25,
        }))
        return {
          viewBox: `0 0 ${total} ${total}`,
          pathOrElements: { type: 'rects', rects },
        }
      }

      if (style === 'gapped') {
        const moduleSize = 0.8
        const offset = (1 - moduleSize) / 2
        const rects: RectModule[] = darkCells.map(({ row, col }) => ({
          x: col + m + offset,
          y: row + m + offset,
          width: moduleSize,
          height: moduleSize,
        }))
        return {
          viewBox: `0 0 ${total} ${total}`,
          pathOrElements: { type: 'rects', rects },
        }
      }

      if (style === 'vertical') {
        const moduleWidth = 0.6
        const offsetX = (1 - moduleWidth) / 2
        const rects: RectModule[] = darkCells.map(({ row, col }) => ({
          x: col + m + offsetX,
          y: row + m,
          width: moduleWidth,
          height: 1,
        }))
        return {
          viewBox: `0 0 ${total} ${total}`,
          pathOrElements: { type: 'rects', rects },
        }
      }

      if (style === 'horizontal') {
        const moduleHeight = 0.6
        const offsetY = (1 - moduleHeight) / 2
        const rects: RectModule[] = darkCells.map(({ row, col }) => ({
          x: col + m,
          y: row + m + offsetY,
          width: 1,
          height: moduleHeight,
        }))
        return {
          viewBox: `0 0 ${total} ${total}`,
          pathOrElements: { type: 'rects', rects },
        }
      }

      // dots (default fallback for unknown styles)
      const circles = darkCells.map(({ row, col }) => ({
        cx: col + m + 0.5,
        cy: row + m + 0.5,
        r: 0.45,
      }))
      return {
        viewBox: `0 0 ${total} ${total}`,
        pathOrElements: { type: 'dots', circles },
      }
    }, [value, level, includeMargin, quietZone, style])

  const n = viewBox.split(' ')[2]
  const numCells = Number.parseInt(n ?? '0', 10)

  const showImage = imageSrc && imageStatus === 'loaded'
  const logoSize = Math.max(1, Math.floor(numCells * logoSizeRatio))
  const logoX = (numCells - logoSize) / 2
  const logoY = (numCells - logoSize) / 2

  const bgFill = backgroundGradient?.enabled ? `url(#${bgGradientId})` : bgColor
  const moduleFill = foregroundGradient?.enabled ? `url(#${fgGradientId})` : fgColor

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
      <defs>
        {foregroundGradient?.enabled &&
          (foregroundGradient.type === 'linear' ? (
            <linearGradient
              id={fgGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientUnits="objectBoundingBox"
              gradientTransform={`rotate(${foregroundGradient.angle}, 0.5, 0.5)`}
            >
              <stop offset="0%" stopColor={foregroundGradient.startColor} />
              <stop offset="100%" stopColor={foregroundGradient.endColor} />
            </linearGradient>
          ) : (
            <radialGradient id={fgGradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={foregroundGradient.startColor} />
              <stop offset="100%" stopColor={foregroundGradient.endColor} />
            </radialGradient>
          ))}
        {backgroundGradient?.enabled &&
          (backgroundGradient.type === 'linear' ? (
            <linearGradient
              id={bgGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientUnits="objectBoundingBox"
              gradientTransform={`rotate(${backgroundGradient.angle}, 0.5, 0.5)`}
            >
              <stop offset="0%" stopColor={backgroundGradient.startColor} />
              <stop offset="100%" stopColor={backgroundGradient.endColor} />
            </linearGradient>
          ) : (
            <radialGradient id={bgGradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={backgroundGradient.startColor} />
              <stop offset="100%" stopColor={backgroundGradient.endColor} />
            </radialGradient>
          ))}
      </defs>
      <path fill={bgFill} d={`M0,0 h${numCells}v${numCells}H0z`} shapeRendering="crispEdges" />
      {pathOrElements.type === 'path' && (
        <path fill={moduleFill} d={pathOrElements.d} shapeRendering="crispEdges" />
      )}
      {pathOrElements.type === 'rects' &&
        pathOrElements.rects.map(r => (
          <rect
            key={`${r.x}-${r.y}`}
            x={r.x}
            y={r.y}
            width={r.width}
            height={r.height}
            rx={r.rx ?? 0}
            ry={r.ry ?? 0}
            fill={moduleFill}
          />
        ))}
      {pathOrElements.type === 'dots' &&
        pathOrElements.circles.map(c => (
          <circle key={`${c.cx}-${c.cy}`} cx={c.cx} cy={c.cy} r={c.r} fill={moduleFill} />
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
