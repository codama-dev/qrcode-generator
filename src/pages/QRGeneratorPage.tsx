import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { QRType } from '@/components/qr'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { exportAsJpg, exportAsPdf, exportAsPng, exportAsSvg } from '@/lib/qrExport'
import { generatePayloadForType } from '@/lib/qrPayloads'
import { defaultQrTypeData, type QRTypeDataMap } from '@/lib/qrTypes'
import {
  DEFAULT_BG_COLOR,
  DEFAULT_FG_COLOR,
  getCenterImageSrc,
  getEffectiveErrorCorrection,
  getOutputSize,
  getQRRenderOptions,
  type QRGeneratorFormValues,
  qrGeneratorFormSchema,
} from '@/lib/schemas'
import { ColorSection } from './ColorSection'
import { FloatingQRPreview } from './FloatingQRPreview'
import { LogoSection } from './LogoSection'
import { PageHeader } from './PageHeader'
import { PreviewPanel } from './PreviewPanel'
import { QRContentSection } from './QRContentSection'
import { QualitySection } from './QualitySection'
import { StyleSection } from './StyleSection'

const defaultValues: QRGeneratorFormValues = {
  content: '',
  errorCorrectionLevel: 'M',
  size: 'medium',
  detailLevel: 'medium',
  style: 'dots',
  fgColor: DEFAULT_FG_COLOR,
  bgColor: DEFAULT_BG_COLOR,
  centerImageEnabled: false,
  centerImageUrl: '',
  centerImageSize: 'default',
  cornerStyle: 'square',
  customizeCornersSeparately: false,
  customCornerColors: false,
  cornerOuterColor: DEFAULT_FG_COLOR,
  cornerInnerColor: DEFAULT_FG_COLOR,
  foregroundGradient: {
    enabled: false,
    type: 'linear',
    startColor: DEFAULT_FG_COLOR,
    endColor: '#666666',
    angle: 135,
  },
  backgroundGradient: {
    enabled: false,
    type: 'linear',
    startColor: DEFAULT_BG_COLOR,
    endColor: '#f0f0f0',
    angle: 135,
  },
  quietZone: 4,
}

export function QRGeneratorPage() {
  const { t } = useTranslation()
  const qrSvgRef = useRef<SVGSVGElement>(null)
  const previewPanelRef = useRef<HTMLDivElement>(null)
  const [centerImageFileUrl, setCenterImageFileUrl] = useState<string | null>(null)
  const [centerImageLoadError, setCenterImageLoadError] = useState<string | null>(null)
  const [exportPngError, setExportPngError] = useState<string | null>(null)
  const [qrType, setQrType] = useState<QRType>('url')
  const [qrTypeData, setQrTypeData] = useState<QRTypeDataMap>(defaultQrTypeData)

  const form = useForm<QRGeneratorFormValues>({
    // Cast resolver/defaults to avoid overly strict generic inference issues in TS build
    resolver: zodResolver(qrGeneratorFormSchema) as never,
    defaultValues: defaultValues as never,
    mode: 'onTouched',
  })

  const content = form.watch('content')
  const errorCorrectionLevel = form.watch('errorCorrectionLevel')
  const sizeOption = form.watch('size')
  const style = form.watch('style')
  const centerImageEnabled = form.watch('centerImageEnabled')
  const centerImageUrl = form.watch('centerImageUrl')
  const centerImageSize = form.watch('centerImageSize')
  const detailLevel = form.watch('detailLevel')
  const customSize = form.watch('customSize')
  const quietZone = form.watch('quietZone')
  const foregroundGradient = form.watch('foregroundGradient')
  const backgroundGradient = form.watch('backgroundGradient')
  const formValues = form.watch()
  const { fgColor, bgColor } = getQRRenderOptions(formValues)
  const centerImageSrc = getCenterImageSrc(centerImageEnabled, centerImageUrl, centerImageFileUrl)
  const sizePixels = getOutputSize(sizeOption, customSize)
  const hasContent = content.trim().length > 0

  const effectiveErrorCorrection = getEffectiveErrorCorrection(
    detailLevel ?? 'medium',
    !!centerImageEnabled
  )

  const previewAriaLabel = hasContent
    ? t('preview.ariaFor', {
        content: content.trim().slice(0, 80) + (content.trim().length > 80 ? '…' : ''),
      })
    : t('preview.ariaEmpty')

  const handleCenterImageFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setCenterImageLoadError(null)
    setCenterImageFileUrl(prev => {
      if (prev) {
        URL.revokeObjectURL(prev)
      }
      return file?.type.startsWith('image/') && file ? URL.createObjectURL(file) : null
    })
  }, [])

  // Clear load error when user changes image source (URL or file)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-run when URL or file changes to clear error
  useEffect(() => {
    setCenterImageLoadError(null)
  }, [centerImageUrl, centerImageFileUrl])

  // Keep underlying errorCorrectionLevel field in sync with the chosen detail level + logo.
  useEffect(() => {
    const nextLevel = getEffectiveErrorCorrection(detailLevel ?? 'medium', !!centerImageEnabled)
    form.setValue('errorCorrectionLevel', nextLevel, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }, [centerImageEnabled, detailLevel, form])

  useEffect(() => {
    const current = centerImageFileUrl
    return () => {
      if (current) {
        URL.revokeObjectURL(current)
      }
    }
  }, [centerImageFileUrl])

  const handleDownloadPng = useCallback(() => {
    if (!qrSvgRef.current || !hasContent) {
      return
    }
    setExportPngError(null)
    exportAsPng(qrSvgRef.current, sizePixels, sizePixels, 'qrcode.png')
      .then(() => toast.success(t('common.downloadSuccess', { format: 'PNG' })))
      .catch(() => {
        const msg = t('errors.pngExportFailed')
        setExportPngError(msg)
        toast.error(msg)
      })
  }, [hasContent, sizePixels, t])

  const handleDownloadJpg = useCallback(() => {
    if (!qrSvgRef.current || !hasContent) {
      return
    }
    setExportPngError(null)
    exportAsJpg(qrSvgRef.current, 'qrcode.jpg', { backgroundColor: bgColor })
      .then(() => toast.success(t('common.downloadSuccess', { format: 'JPG' })))
      .catch(() => {
        const msg = t('errors.jpgExportFailed')
        setExportPngError(msg)
        toast.error(msg)
      })
  }, [bgColor, hasContent, t])

  const handleDownloadSvg = useCallback(() => {
    if (!qrSvgRef.current || !hasContent) {
      return
    }
    setExportPngError(null)
    exportAsSvg(qrSvgRef.current, 'qrcode.svg')
      .then(() => toast.success(t('common.downloadSuccess', { format: 'SVG' })))
      .catch(() => {
        const msg = t('errors.svgExportFailed')
        setExportPngError(msg)
        toast.error(msg)
      })
  }, [hasContent, t])

  const handleDownloadPdf = useCallback(() => {
    if (!qrSvgRef.current || !hasContent) {
      return
    }
    setExportPngError(null)
    const hasGradients =
      (foregroundGradient?.enabled ?? false) || (backgroundGradient?.enabled ?? false)
    exportAsPdf(qrSvgRef.current, 'qrcode.pdf', { hasGradients })
      .then(() => toast.success(t('common.downloadSuccess', { format: 'PDF' })))
      .catch(() => {
        const msg = t('errors.pdfExportFailed')
        setExportPngError(msg)
        toast.error(msg)
      })
  }, [hasContent, foregroundGradient?.enabled, backgroundGradient?.enabled, t])

  const onSubmit = useCallback((_values: QRGeneratorFormValues) => {
    // QR preview updates live via form.watch; submit primarily triggers validation
  }, [])

  const updateContentFromType = useCallback(
    (type: QRType, data: QRTypeDataMap[QRType]) => {
      const payload = generatePayloadForType(type, data)
      form.setValue('content', payload, { shouldValidate: true, shouldDirty: true })
    },
    [form]
  )

  const handleTypeChange = useCallback(
    (nextType: QRType) => {
      setQrType(nextType)
      const dataForType = qrTypeData[nextType]
      updateContentFromType(nextType, dataForType)
    },
    [qrTypeData, updateContentFromType]
  )

  const handleTypeDataChange = useCallback(
    (type: QRType, data: QRTypeDataMap[QRType]) => {
      setQrTypeData(prev => ({ ...prev, [type]: data }))
      updateContentFromType(type, data)
    },
    [updateContentFromType]
  )

  const scrollToPreview = useCallback(() => {
    previewPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  return (
    <>
      <div className="-m-6 mb-6">
        <PageHeader />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-start"
        >
          <div className="flex flex-1 flex-col gap-5">
            <QRContentSection
              qrType={qrType}
              qrTypeData={qrTypeData}
              onTypeChange={handleTypeChange}
              onTypeDataChange={handleTypeDataChange}
            />

            <ColorSection
              form={form}
              foregroundGradient={foregroundGradient}
              backgroundGradient={backgroundGradient}
            />

            <StyleSection form={form} style={style} />

            <QualitySection
              form={form}
              detailLevel={detailLevel}
              sizeOption={sizeOption}
              customSize={customSize}
            />

            <LogoSection
              form={form}
              centerImageEnabled={centerImageEnabled}
              centerImageSize={centerImageSize}
              centerImageSrc={centerImageSrc}
              centerImageFileUrl={centerImageFileUrl}
              handleCenterImageFileChange={handleCenterImageFileChange}
            />

            <div className="pt-1">
              <Button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-sm text-white shadow-md transition-all hover:from-orange-600 hover:to-amber-500 hover:shadow-lg active:translate-y-px active:shadow-md sm:w-auto"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                <span>{t('common.generate')}</span>
              </Button>
            </div>
          </div>

          <div ref={previewPanelRef}>
            <PreviewPanel
              qrSvgRef={qrSvgRef}
              content={content}
              sizePixels={sizePixels}
              effectiveErrorCorrection={effectiveErrorCorrection}
              style={style}
              fgColor={fgColor}
              bgColor={bgColor}
              centerImageSize={centerImageSize}
              quietZone={quietZone ?? 4}
              foregroundGradient={foregroundGradient}
              backgroundGradient={backgroundGradient}
              centerImageSrc={centerImageSrc}
              errorCorrectionLevel={errorCorrectionLevel}
              qrType={qrType}
              sizeOption={sizeOption}
              centerImageLoadError={centerImageLoadError}
              exportPngError={exportPngError}
              previewAriaLabel={previewAriaLabel}
              handleDownloadPng={handleDownloadPng}
              handleDownloadJpg={handleDownloadJpg}
              handleDownloadSvg={handleDownloadSvg}
              handleDownloadPdf={handleDownloadPdf}
              onImageLoadError={() => setCenterImageLoadError(t('errors.imageLoadFailed'))}
            />
          </div>
        </form>
      </Form>

      <FloatingQRPreview
        content={content}
        effectiveErrorCorrection={effectiveErrorCorrection}
        style={style}
        fgColor={fgColor}
        bgColor={bgColor}
        centerImageSize={centerImageSize}
        quietZone={quietZone ?? 4}
        foregroundGradient={foregroundGradient}
        backgroundGradient={backgroundGradient}
        centerImageSrc={centerImageSrc}
        previewAriaLabel={previewAriaLabel}
        onImageLoadError={() =>
          setCenterImageLoadError('Image failed to load. Check URL or try another image.')
        }
        onClick={scrollToPreview}
        previewPanelRef={previewPanelRef as React.RefObject<HTMLDivElement | null>}
      />
    </>
  )
}
