import { z } from 'zod'
import { QR_TYPE_VALUES } from './qrTypes'

/** Error correction levels supported by qrcode.react */
export const ERROR_CORRECTION_LEVELS = ['L', 'M', 'Q', 'H'] as const
export type ErrorCorrectionLevel = (typeof ERROR_CORRECTION_LEVELS)[number]

/** Size preset labels and their pixel values (or null for custom). */
export const SIZE_PRESET_OPTIONS = [
  { value: 'small', label: 'Small', pixels: 128 },
  { value: 'medium', label: 'Medium', pixels: 256 },
  { value: 'large', label: 'Large', pixels: 512 },
  { value: 'xlarge', label: 'X-Large', pixels: 1024 },
  { value: 'custom', label: 'Custom', pixels: null },
] as const
export type SizePreset = (typeof SIZE_PRESET_OPTIONS)[number]['value']

// Backwards-compatible alias used by existing UI/tests.
export const QR_SIZE_OPTIONS = SIZE_PRESET_OPTIONS
export type QRSizeOption = SizePreset

/** QR module style: dots (default), squares, rounded, and extended variants */
export const QR_STYLE_OPTIONS = [
  { value: 'dots', label: 'Dots' },
  { value: 'squares', label: 'Squares' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'gapped', label: 'Gapped' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
] as const
export type QRStyleOption = (typeof QR_STYLE_OPTIONS)[number]['value']

/** Human-friendly detail levels that map to error correction strengths. */
export const DETAIL_LEVEL_OPTIONS = [
  {
    value: 'low',
    label: 'Low',
    errorCorrection: 'L',
    description: 'Maximum data capacity',
  },
  {
    value: 'medium',
    label: 'Medium',
    errorCorrection: 'M',
    description: 'Balanced reliability',
  },
  {
    value: 'high',
    label: 'High',
    errorCorrection: 'Q',
    description: 'Good for logos',
  },
  {
    value: 'ultra',
    label: 'Ultra',
    errorCorrection: 'H',
    description: 'Maximum reliability',
  },
] as const

export type DetailLevel = (typeof DETAIL_LEVEL_OPTIONS)[number]['value']

/** Quiet zone (margin) options in modules around the QR code. */
export const QUIET_ZONE_OPTIONS = [
  { value: 0, label: 'None' },
  { value: 2, label: 'Minimal (2)' },
  { value: 4, label: 'Standard (4)' },
  { value: 6, label: 'Large (6)' },
  { value: 8, label: 'Extra Large (8)' },
] as const

/** Finder pattern (corner) style options for outer/inner shapes. */
export const CORNER_STYLE_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
] as const
export type CornerStyleOption = (typeof CORNER_STYLE_OPTIONS)[number]['value']

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

const gradientBaseSchema = z.object({
  enabled: z.boolean().default(false),
  type: z.enum(['linear', 'radial']).default('linear'),
  startColor: hexColorSchema.default(DEFAULT_FG_COLOR),
  endColor: hexColorSchema.default('#666666'),
  angle: z.number().min(0).max(360).default(135),
})

export type GradientConfig = z.infer<typeof gradientBaseSchema>

export const qrGeneratorFormSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(2000, 'Content must be at most 2000 characters'),
  errorCorrectionLevel: z.enum(ERROR_CORRECTION_LEVELS),
  size: z.enum(['small', 'medium', 'large', 'xlarge', 'custom']),
  detailLevel: z.enum(['low', 'medium', 'high', 'ultra']).default('medium'),
  style: z.enum(['squares', 'rounded', 'dots', 'gapped', 'vertical', 'horizontal']),
  fgColor: hexColorSchema,
  bgColor: hexColorSchema,
  centerImageEnabled: z.boolean(),
  centerImageUrl: optionalImageUrlSchema,
  centerImageSize: z.enum(['default', 'small']).default('default'),
  /** Global corner style when per-corner customization is disabled. */
  cornerStyle: z.enum(['square', 'rounded', 'circle', 'dot', 'extra-rounded']).default('square'),
  /** When true, allow different styles per finder corner. */
  customizeCornersSeparately: z.boolean().default(false),
  topLeftCornerStyle: z.enum(['square', 'rounded', 'circle', 'dot', 'extra-rounded']).optional(),
  topRightCornerStyle: z.enum(['square', 'rounded', 'circle', 'dot', 'extra-rounded']).optional(),
  bottomLeftCornerStyle: z.enum(['square', 'rounded', 'circle', 'dot', 'extra-rounded']).optional(),
  /** When true, use separate colors for corners instead of module foreground color. */
  customCornerColors: z.boolean().default(false),
  cornerOuterColor: hexColorSchema.default(DEFAULT_FG_COLOR),
  cornerInnerColor: hexColorSchema.default(DEFAULT_FG_COLOR),
  foregroundGradient: gradientBaseSchema.default({
    enabled: false,
    type: 'linear',
    startColor: DEFAULT_FG_COLOR,
    endColor: '#666666',
    angle: 135,
  }),
  backgroundGradient: gradientBaseSchema
    .extend({
      startColor: hexColorSchema.default(DEFAULT_BG_COLOR),
      endColor: hexColorSchema.default('#f0f0f0'),
    })
    .default({
      enabled: false,
      type: 'linear',
      startColor: DEFAULT_BG_COLOR,
      endColor: '#f0f0f0',
      angle: 135,
    }),
  quietZone: z.number().min(0).max(8).default(4),
  customSize: z
    .number()
    .min(64, 'Minimum size is 64px')
    .max(2048, 'Maximum size is 2048px')
    .optional(),
})

/** Draw config for QR module style (for tests and rendering). */
export type QRModuleDrawKind =
  | 'square'
  | 'rounded'
  | 'circle'
  | 'gapped'
  | 'vertical'
  | 'horizontal'

export function getDrawConfigForStyle(style: QRStyleOption): { kind: QRModuleDrawKind } {
  switch (style) {
    case 'squares':
      return { kind: 'square' }
    case 'rounded':
      return { kind: 'rounded' }
    case 'dots':
      return { kind: 'circle' }
    case 'gapped':
      return { kind: 'gapped' }
    case 'vertical':
      return { kind: 'vertical' }
    case 'horizontal':
      return { kind: 'horizontal' }
    default:
      return { kind: 'square' }
  }
}

export type QRGeneratorFormValues = z.infer<typeof qrGeneratorFormSchema>

/** Resolve size preset and optional custom size to an actual pixel output size. */
export function getOutputSize(preset: SizePreset, customSize?: number): number {
  if (preset === 'custom' && typeof customSize === 'number' && Number.isFinite(customSize)) {
    const clamped = Math.min(Math.max(customSize, 64), 2048)
    return clamped
  }
  const presetPixels = SIZE_PRESET_OPTIONS.find(o => o.value === preset)?.pixels
  // Fallback to a sensible default if pixels are null or missing.
  return typeof presetPixels === 'number' ? presetPixels : 256
}

/** Resolve size option to pixel value for QRCodeSVG (backwards compatibility helper). */
export function sizeOptionToPixels(size: QRSizeOption): number {
  return getOutputSize(size)
}

/** Effective error correction level given a human detail level and optional logo. */
export function getEffectiveErrorCorrection(
  detailLevel: DetailLevel,
  hasLogo: boolean
): ErrorCorrectionLevel {
  const baseLevel = DETAIL_LEVEL_OPTIONS.find(o => o.value === detailLevel)?.errorCorrection ?? 'M'

  // If a logo is enabled and the configured level is too low, bump to at least M.
  if (hasLogo && baseLevel === 'L') {
    return 'M'
  }

  return baseLevel as ErrorCorrectionLevel
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

// --- QR content type schemas ---

export const qrTypeSchema = z.enum(QR_TYPE_VALUES)

// URL/Text - basic content
export const urlTextSchema = z.object({
  content: z.string().min(1, 'Content is required'),
})

// WiFi
export const wifiSchema = z.object({
  ssid: z.string().min(1, 'Network name is required'),
  password: z.string().optional(),
  authType: z.enum(['WPA', 'WEP', 'nopass']).default('WPA'),
  hidden: z.boolean().default(false),
})

// vCard
export const vCardSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  organization: z.string().optional(),
  title: z.string().optional(),
  phone: z.string().optional(),
  phoneWork: z.string().optional(),
  email: z.string().email().optional(),
  emailWork: z.string().email().optional(),
  website: z.string().url().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  note: z.string().optional(),
})

// Email
export const emailSchema = z.object({
  to: z.string().email('Valid email required'),
  subject: z.string().optional(),
  body: z.string().optional(),
})

// Phone
export const phoneSchema = z.object({
  number: z.string().min(1, 'Phone number is required'),
})

// SMS
export const smsSchema = z.object({
  number: z.string().min(1, 'Phone number is required'),
  message: z.string().optional(),
})

// WhatsApp
export const whatsappSchema = z.object({
  number: z.string().min(1, 'Phone number is required'),
  message: z.string().optional(),
})

// Facebook
export const facebookSchema = z.object({
  username: z.string().min(1, 'Username or page is required'),
})

// Instagram
export const instagramSchema = z.object({
  username: z.string().min(1, 'Username is required'),
})

// Location
export const locationSchema = z.object({
  latitude: z.string().min(1, 'Latitude is required'),
  longitude: z.string().min(1, 'Longitude is required'),
  label: z.string().optional(),
})

// Bitcoin
export const bitcoinSchema = z.object({
  address: z.string().min(1, 'Bitcoin address is required'),
  amount: z.string().optional(),
  label: z.string().optional(),
  message: z.string().optional(),
})

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
