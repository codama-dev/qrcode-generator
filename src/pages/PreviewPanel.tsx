import { Download, Eye, FileImage, FileText, Share2 } from 'lucide-react'
import type { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { StyledQRCode } from '@/components/qr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DEFAULT_LOGO_SIZE_RATIO,
  QR_SIZE_OPTIONS,
  QR_STYLE_OPTIONS,
  type QRGeneratorFormValues,
} from '@/lib/schemas'
import { cn } from '@/lib/utils'

interface PreviewPanelProps {
  qrSvgRef: RefObject<SVGSVGElement | null>
  content: string
  sizePixels: number
  effectiveErrorCorrection: 'L' | 'M' | 'Q' | 'H'
  style: QRGeneratorFormValues['style']
  fgColor: string
  bgColor: string
  centerImageSize: QRGeneratorFormValues['centerImageSize']
  quietZone: number
  foregroundGradient: QRGeneratorFormValues['foregroundGradient']
  backgroundGradient: QRGeneratorFormValues['backgroundGradient']
  centerImageSrc: string | null
  errorCorrectionLevel: string
  qrType: string
  sizeOption: string
  centerImageLoadError: string | null
  exportPngError: string | null
  previewAriaLabel: string
  handleDownloadPng: () => void
  handleDownloadJpg: () => void
  handleDownloadSvg: () => void
  handleDownloadPdf: () => void
  onImageLoadError: () => void
  onShareClick: () => void
}

export function PreviewPanel({
  qrSvgRef,
  content,
  sizePixels,
  effectiveErrorCorrection,
  style,
  fgColor,
  bgColor,
  centerImageSize,
  quietZone,
  foregroundGradient,
  backgroundGradient,
  centerImageSrc,
  errorCorrectionLevel,
  qrType,
  sizeOption,
  centerImageLoadError,
  exportPngError,
  previewAriaLabel,
  handleDownloadPng,
  handleDownloadJpg,
  handleDownloadSvg,
  handleDownloadPdf,
  onImageLoadError,
  onShareClick,
}: PreviewPanelProps) {
  const { t } = useTranslation()
  const hasContent = content.trim().length > 0

  return (
    <aside className="lg:sticky lg:top-24 lg:w-[360px]">
      <Card className="rounded-xl border border-border/70 bg-card/95 shadow-md md:min-w-0">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30">
              <Eye className="size-5" aria-hidden="true" />
              <div
                className="absolute inset-0 rounded-full bg-linear-to-br from-orange-500 to-amber-400 opacity-50 blur-md"
                aria-hidden="true"
              />
            </div>
            <div>
              <CardTitle className="bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text font-bold text-lg text-transparent leading-tight dark:from-orange-400 dark:to-amber-300">
                {t('common.preview')}
              </CardTitle>
              <CardDescription>{t('common.previewDescription')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {centerImageLoadError && (
            <p className="text-destructive text-xs" role="alert">
              {centerImageLoadError}
            </p>
          )}
          {exportPngError && (
            <p className="text-destructive text-xs" role="alert">
              {exportPngError}
            </p>
          )}
          <section
            aria-label="QR code preview"
            className="flex flex-col items-center gap-3 rounded-xl border border-border/70 border-dashed bg-muted/60 p-4 [&_svg]:h-auto [&_svg]:max-w-full"
          >
            {hasContent ? (
              <StyledQRCode
                ref={qrSvgRef}
                value={content}
                size={sizePixels}
                level={effectiveErrorCorrection}
                style={style}
                fgColor={fgColor}
                bgColor={bgColor}
                logoSizeRatio={
                  centerImageSize === 'small'
                    ? DEFAULT_LOGO_SIZE_RATIO * 0.6
                    : DEFAULT_LOGO_SIZE_RATIO
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
            ) : (
              <div
                className="flex h-48 w-48 items-center justify-center rounded border border-border border-dashed bg-card text-muted-foreground text-sm"
                aria-hidden
              >
                {t('common.waitingForContent')}
              </div>
            )}
          </section>

          {hasContent && (
            <div className="space-y-3">
              <p className="bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text font-bold text-transparent text-xs uppercase tracking-[0.14em] dark:from-orange-400 dark:to-amber-300">
                {t('common.download')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadPng}
                  className={cn(
                    'group relative flex h-20 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl px-2 py-3 text-center',
                    'border-2 border-border bg-card text-foreground shadow-sm',
                    'transition-all duration-200 hover:scale-[1.02] hover:border-orange-500/60 hover:text-white hover:shadow-lg hover:shadow-orange-500/20',
                    'active:scale-100'
                  )}
                >
                  <div
                    className="absolute inset-0 bg-linear-to-br from-orange-500 to-amber-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <FileImage
                    className="relative size-6 transition-transform duration-200 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="relative font-semibold text-sm">PNG</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadJpg}
                  className={cn(
                    'group relative flex h-20 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl px-2 py-3 text-center',
                    'border-2 border-border bg-card text-foreground shadow-sm',
                    'transition-all duration-200 hover:scale-[1.02] hover:border-orange-500/60 hover:text-white hover:shadow-lg hover:shadow-orange-500/20',
                    'active:scale-100'
                  )}
                >
                  <div
                    className="absolute inset-0 bg-linear-to-br from-orange-500 to-amber-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <FileImage
                    className="relative size-6 transition-transform duration-200 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="relative font-semibold text-sm">JPG</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadSvg}
                  className={cn(
                    'group relative flex h-20 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl px-2 py-3 text-center',
                    'border-2 border-border bg-card text-foreground shadow-sm',
                    'transition-all duration-200 hover:scale-[1.02] hover:border-orange-500/60 hover:text-white hover:shadow-lg hover:shadow-orange-500/20',
                    'active:scale-100'
                  )}
                >
                  <div
                    className="absolute inset-0 bg-linear-to-br from-orange-500 to-amber-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <Download
                    className="relative size-6 transition-transform duration-200 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="relative font-semibold text-sm">SVG</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadPdf}
                  className={cn(
                    'group relative flex h-20 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl px-2 py-3 text-center',
                    'border-2 border-border bg-card text-foreground shadow-sm',
                    'transition-all duration-200 hover:scale-[1.02] hover:border-orange-500/60 hover:text-white hover:shadow-lg hover:shadow-orange-500/20',
                    'active:scale-100'
                  )}
                >
                  <div
                    className="absolute inset-0 bg-linear-to-br from-orange-500 to-amber-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <FileText
                    className="relative size-6 transition-transform duration-200 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="relative font-semibold text-sm">PDF</span>
                </Button>
              </div>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-background/80 p-3 text-[0.7rem] text-muted-foreground">
            <div>
              <dt className="font-medium text-foreground">{t('common.size')}</dt>
              <dd>
                {t(
                  `sizeLabels.${QR_SIZE_OPTIONS.find(opt => opt.value === sizeOption)?.value ?? 'medium'}`
                )}{' '}
                ({sizePixels}×{sizePixels})
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">{t('common.style')}</dt>
              <dd>
                {t(
                  `styleLabels.${QR_STYLE_OPTIONS.find(opt => opt.value === style)?.value ?? 'dots'}`
                )}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">{t('common.errorCorrection')}</dt>
              <dd>{errorCorrectionLevel}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">{t('common.contentType')}</dt>
              <dd className="uppercase">{qrType}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="mt-3 overflow-hidden rounded-xl border border-border/70 shadow-md md:min-w-0">
        <button
          type="button"
          onClick={onShareClick}
          className="group relative flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:shadow-lg"
        >
          <div
            className="absolute inset-0 bg-linear-to-r from-orange-500/5 to-amber-400/5 transition-opacity duration-200 group-hover:from-orange-500/10 group-hover:to-amber-400/10"
            aria-hidden="true"
          />
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/20 transition-transform duration-200 group-hover:scale-110">
            <Share2 className="size-4" aria-hidden="true" />
          </div>
          <div className="relative min-w-0 flex-1">
            <p className="truncate font-semibold text-sm">{t('share.button')}</p>
            <p className="truncate text-muted-foreground text-xs">{t('share.cardHint')}</p>
          </div>
          <span
            className="relative text-lg text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            &rsaquo;
          </span>
        </button>
      </Card>
    </aside>
  )
}
