import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyledQRCode } from '@/components/qr'
import { DEFAULT_LOGO_SIZE_RATIO, type QRGeneratorFormValues } from '@/lib/schemas'

interface FloatingQRPreviewProps {
  content: string
  effectiveErrorCorrection: 'L' | 'M' | 'Q' | 'H'
  style: QRGeneratorFormValues['style']
  fgColor: string
  bgColor: string
  centerImageSize: QRGeneratorFormValues['centerImageSize']
  quietZone: number
  foregroundGradient: QRGeneratorFormValues['foregroundGradient']
  backgroundGradient: QRGeneratorFormValues['backgroundGradient']
  centerImageSrc: string | null
  previewAriaLabel: string
  onImageLoadError: () => void
  onClick: () => void
  previewPanelRef: React.RefObject<HTMLDivElement | null>
}

export function FloatingQRPreview({
  content,
  effectiveErrorCorrection,
  style,
  fgColor,
  bgColor,
  centerImageSize,
  quietZone,
  foregroundGradient,
  backgroundGradient,
  centerImageSrc,
  previewAriaLabel,
  onImageLoadError,
  onClick,
  previewPanelRef,
}: FloatingQRPreviewProps) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const hasContent = content.trim().length > 0

  useEffect(() => {
    if (!previewPanelRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPreviewVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    )

    observer.observe(previewPanelRef.current)

    return () => {
      observer.disconnect()
    }
  }, [previewPanelRef])

  if (!hasContent) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed right-6 bottom-6 z-50 rounded-xl border-2 border-border bg-card p-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        opacity: isPreviewVisible ? 0 : 1,
        pointerEvents: isPreviewVisible ? 'none' : 'auto',
      }}
      aria-label={t('common.viewFullPreview')}
      aria-hidden={isPreviewVisible}
    >
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-lg bg-muted/60">
          <StyledQRCode
            value={content}
            size={96}
            level={effectiveErrorCorrection}
            style={style}
            fgColor={fgColor}
            bgColor={bgColor}
            logoSizeRatio={
              centerImageSize === 'small' ? DEFAULT_LOGO_SIZE_RATIO * 0.6 : DEFAULT_LOGO_SIZE_RATIO
            }
            quietZone={quietZone ?? 4}
            foregroundGradient={foregroundGradient}
            backgroundGradient={backgroundGradient}
            imageSrc={centerImageSrc || undefined}
            onImageLoadError={onImageLoadError}
            includeMargin
            role="img"
            aria-label={previewAriaLabel}
          />
        </div>
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
            <span className="font-medium text-white text-xs">{t('common.viewFullSize')}</span>
          </div>
        )}
      </div>
    </button>
  )
}
