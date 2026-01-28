import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyledQRCode } from '@/components/qr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { exportAsPng, exportAsSvg } from '@/lib/qrExport'
import {
  DEFAULT_BG_COLOR,
  DEFAULT_FG_COLOR,
  ERROR_CORRECTION_LEVELS,
  getCenterImageSrc,
  getQRRenderOptions,
  QR_SIZE_OPTIONS,
  QR_STYLE_OPTIONS,
  type QRGeneratorFormValues,
  qrGeneratorFormSchema,
  sizeOptionToPixels,
} from '@/lib/schemas'

const defaultValues: QRGeneratorFormValues = {
  content: '',
  errorCorrectionLevel: 'M',
  size: 'medium',
  style: 'squares',
  fgColor: DEFAULT_FG_COLOR,
  bgColor: DEFAULT_BG_COLOR,
  centerImageEnabled: false,
  centerImageUrl: '',
}

export function QRGeneratorPage() {
  const qrSvgRef = useRef<SVGSVGElement>(null)
  const [centerImageFileUrl, setCenterImageFileUrl] = useState<string | null>(null)
  const [centerImageLoadError, setCenterImageLoadError] = useState<string | null>(null)
  const [exportPngError, setExportPngError] = useState<string | null>(null)

  const form = useForm<QRGeneratorFormValues>({
    resolver: zodResolver(qrGeneratorFormSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const content = form.watch('content')
  const errorCorrectionLevel = form.watch('errorCorrectionLevel')
  const sizeOption = form.watch('size')
  const style = form.watch('style')
  const centerImageEnabled = form.watch('centerImageEnabled')
  const centerImageUrl = form.watch('centerImageUrl')
  const formValues = form.watch()
  const { fgColor, bgColor } = getQRRenderOptions(formValues)
  const centerImageSrc = getCenterImageSrc(centerImageEnabled, centerImageUrl, centerImageFileUrl)
  const sizePixels = sizeOptionToPixels(sizeOption)
  const hasContent = content.trim().length > 0

  const previewAriaLabel = hasContent
    ? `QR code preview for ${content.trim().slice(0, 80)}${content.trim().length > 80 ? '…' : ''}`
    : 'QR code preview'

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
    exportAsPng(qrSvgRef.current, sizePixels, sizePixels, 'qrcode.png').catch(() => {
      setExportPngError('PNG export failed. Try SVG or use a same-origin logo.')
    })
  }, [hasContent, sizePixels])

  const handleDownloadSvg = useCallback(() => {
    if (!qrSvgRef.current || !hasContent) {
      return
    }
    exportAsSvg(qrSvgRef.current, 'qrcode.svg')
  }, [hasContent])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl text-foreground">QR Code Generator</h1>
        <p className="mt-1 text-muted-foreground">Enter a URL or any text to generate a QR code.</p>
      </div>

      <Form {...form}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>URL or plain text to encode in the QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com or any text"
                        className="min-h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>URL or any text</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="errorCorrectionLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Error correction</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-h-11">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ERROR_CORRECTION_LEVELS.map(level => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Higher levels allow more damage recovery</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-h-11">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QR_SIZE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label} ({opt.pixels}×{opt.pixels})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Output dimensions in pixels</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module style</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-h-11">
                            <SelectValue placeholder="Style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QR_STYLE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Squares, rounded corners, or dots</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foreground</FormLabel>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={field.value}
                          onChange={e => field.onChange(e.target.value)}
                          onBlur={field.onBlur}
                          className="h-11 min-h-11 w-14 cursor-pointer rounded border border-input bg-transparent p-0 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          aria-label="Foreground color picker"
                        />
                        <FormControl>
                          <Input
                            type="text"
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            className="min-h-11 w-24 font-mono text-sm"
                          />
                        </FormControl>
                      </div>
                      <FormDescription>Color of QR modules</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background</FormLabel>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={field.value}
                          onChange={e => field.onChange(e.target.value)}
                          onBlur={field.onBlur}
                          className="h-11 min-h-11 w-14 cursor-pointer rounded border border-input bg-transparent p-0 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          aria-label="Background color picker"
                        />
                        <FormControl>
                          <Input
                            type="text"
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            className="min-h-11 w-24 font-mono text-sm"
                          />
                        </FormControl>
                      </div>
                      <FormDescription>Color of background and quiet zone</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="centerImageEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={v => field.onChange(v === true)}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Add center image</FormLabel>
                        <FormDescription>
                          Optional logo or icon in the center. Use M or H error correction for best
                          scans.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {centerImageEnabled && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="centerImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://example.com/logo.png"
                              className="min-h-11"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormDescription>URL of the image to place in the center</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="center-image-upload">Or upload</Label>
                      <Input
                        id="center-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCenterImageFileChange}
                        className="min-h-11 cursor-pointer"
                      />
                      {centerImageFileUrl && (
                        <p className="text-muted-foreground text-sm">
                          File selected. Clear by choosing another or using URL.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:min-w-0">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your QR code. Download as PNG or SVG.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {centerImageLoadError && (
                <p className="text-destructive text-sm" role="alert">
                  {centerImageLoadError}
                </p>
              )}
              {exportPngError && (
                <p className="text-destructive text-sm" role="alert">
                  {exportPngError}
                </p>
              )}
              <section
                aria-label="QR code preview"
                className="max-w-full rounded-md border border-border bg-card p-4 md:max-w-[280px] [&_svg]:h-auto [&_svg]:max-w-full"
              >
                {hasContent ? (
                  <StyledQRCode
                    ref={qrSvgRef}
                    value={content}
                    size={sizePixels}
                    level={errorCorrectionLevel}
                    style={style}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    imageSrc={centerImageSrc || undefined}
                    onImageLoadError={() =>
                      setCenterImageLoadError(
                        'Image failed to load. Check URL or try another image.'
                      )
                    }
                    includeMargin
                    role="img"
                    aria-label={previewAriaLabel}
                  />
                ) : (
                  <div
                    className="flex h-48 w-48 items-center justify-center rounded border border-border border-dashed bg-muted text-muted-foreground text-sm"
                    aria-hidden
                  >
                    Waiting for content
                  </div>
                )}
              </section>
              {hasContent && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPng}
                    className="min-h-11 min-w-[44px]"
                  >
                    Download PNG
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadSvg}
                    className="min-h-11 min-w-[44px]"
                  >
                    Download SVG
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  )
}
