import { z } from 'zod'

/** Error correction levels supported by qrcode.react */
export const ERROR_CORRECTION_LEVELS = ['L', 'M', 'Q', 'H'] as const
export type ErrorCorrectionLevel = (typeof ERROR_CORRECTION_LEVELS)[number]

/** Size preset labels and their pixel values */
export const QR_SIZE_OPTIONS = [
  { value: 'small', label: 'Small', pixels: 128 },
  { value: 'medium', label: 'Medium', pixels: 192 },
  { value: 'large', label: 'Large', pixels: 256 },
] as const
export type QRSizeOption = (typeof QR_SIZE_OPTIONS)[number]['value']

/** QR module style: squares (default), rounded, or dots/circles */
export const QR_STYLE_OPTIONS = [
  { value: 'squares', label: 'Squares' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
] as const
export type QRStyleOption = (typeof QR_STYLE_OPTIONS)[number]['value']

/** Default foreground (modules) and background colors for QR output */
export const DEFAULT_FG_COLOR = '#000000'
export const DEFAULT_BG_COLOR = '#ffffff'

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a 6-digit hex color (e.g. #000000)')

/** Logo size as fraction of QR side (viewBox units). ~0.2 keeps code scannable. */
export const DEFAULT_LOGO_SIZE_RATIO = 0.2

const optionalImageUrlSchema = z
  .string()
  .max(2048)
  .refine(s => s.trim() === '' || z.string().url().safeParse(s.trim()).success, {
    message: 'Must be a valid image URL or empty',
  })

export const qrGeneratorFormSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(2000, 'Content must be at most 2000 characters'),
  errorCorrectionLevel: z.enum(ERROR_CORRECTION_LEVELS),
  size: z.enum(['small', 'medium', 'large']),
  style: z.enum(['squares', 'rounded', 'dots']),
  fgColor: hexColorSchema,
  bgColor: hexColorSchema,
  centerImageEnabled: z.boolean(),
  centerImageUrl: optionalImageUrlSchema,
})

/** Draw config for QR module style (for tests and rendering). */
export type QRModuleDrawKind = 'square' | 'rounded' | 'circle'

export function getDrawConfigForStyle(style: QRStyleOption): { kind: QRModuleDrawKind } {
  switch (style) {
    case 'squares':
      return { kind: 'square' }
    case 'rounded':
      return { kind: 'rounded' }
    case 'dots':
      return { kind: 'circle' }
    default:
      return { kind: 'square' }
  }
}

export type QRGeneratorFormValues = z.infer<typeof qrGeneratorFormSchema>

/** Resolve size option to pixel value for QRCodeSVG */
export function sizeOptionToPixels(size: QRSizeOption): number {
  return QR_SIZE_OPTIONS.find(o => o.value === size)?.pixels ?? 192
}

/** Build QR foreground/background from form state. Uses defaults when values are missing. */
export function getQRRenderOptions(
  values: Partial<Pick<QRGeneratorFormValues, 'fgColor' | 'bgColor'>> | null | undefined
): { fgColor: string; bgColor: string } {
  return {
    fgColor: values?.fgColor ?? DEFAULT_FG_COLOR,
    bgColor: values?.bgColor ?? DEFAULT_BG_COLOR,
  }
}

/**
 * Effective center image URL when “Add center image” is on.
 * Prefers URL from form; falls back to file object URL when provided.
 */
export function getCenterImageSrc(
  enabled: boolean,
  url: string,
  fileObjectUrl: string | null | undefined
): string | null {
  if (!enabled) {
    return null
  }
  const u = (url ?? '').trim()
  if (u) {
    return u
  }
  return fileObjectUrl ?? null
}

// API response schemas (used by api.ts when/if backend is added)
export const genericEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  responseObject: z.unknown().optional(),
  statusCode: z.number().optional(),
})

export const serviceResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema,
    statusCode: z.number(),
  })

export const apiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.nullable(),
    statusCode: z.number(),
  })
