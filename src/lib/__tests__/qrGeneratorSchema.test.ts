import { describe, expect, it } from 'vitest'
import {
  DEFAULT_BG_COLOR,
  DEFAULT_FG_COLOR,
  getCenterImageSrc,
  getDrawConfigForStyle,
  getQRRenderOptions,
  qrGeneratorFormSchema,
  sizeOptionToPixels,
} from '../schemas'

const validOptions = {
  content: 'https://example.com',
  errorCorrectionLevel: 'M' as const,
  size: 'medium' as const,
  style: 'squares' as const,
  fgColor: DEFAULT_FG_COLOR,
  bgColor: DEFAULT_BG_COLOR,
  centerImageEnabled: false,
  centerImageUrl: '',
}

describe('qrGeneratorFormSchema', () => {
  it('rejects empty content', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      content: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid content and options', () => {
    const result = qrGeneratorFormSchema.safeParse(validOptions)
    expect(result.success).toBe(true)
  })

  it('rejects content over 2000 characters', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      content: 'x'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })

  it('accepts content with exactly 2000 characters', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      content: 'x'.repeat(2000),
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid error correction level', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      errorCorrectionLevel: 'X',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid size option', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      size: 'huge',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid style option', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      style: 'diamonds',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid hex colors', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      fgColor: '#ff0000',
      bgColor: '#0000ff',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.fgColor).toBe('#ff0000')
      expect(result.data.bgColor).toBe('#0000ff')
    }
  })

  it('rejects invalid fgColor format', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      fgColor: 'red',
    })
    expect(result.success).toBe(false)
  })

  it('accepts center image URL when provided and valid', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      centerImageEnabled: true,
      centerImageUrl: 'https://example.com/logo.png',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.centerImageEnabled).toBe(true)
      expect(result.data.centerImageUrl).toBe('https://example.com/logo.png')
    }
  })

  it('rejects invalid center image URL when non-empty', () => {
    const result = qrGeneratorFormSchema.safeParse({
      ...validOptions,
      centerImageEnabled: true,
      centerImageUrl: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })
})

describe('getCenterImageSrc', () => {
  it('returns null when disabled', () => {
    expect(getCenterImageSrc(false, '', null)).toBe(null)
    expect(getCenterImageSrc(false, 'https://x.co/img.png', 'blob:xxx')).toBe(null)
  })

  it('returns URL when enabled and URL provided', () => {
    expect(getCenterImageSrc(true, 'https://example.com/logo.png', null)).toBe(
      'https://example.com/logo.png'
    )
    expect(getCenterImageSrc(true, 'https://example.com/logo.png', 'blob:yyy')).toBe(
      'https://example.com/logo.png'
    )
  })

  it('returns file object URL when enabled and no URL', () => {
    expect(getCenterImageSrc(true, '', 'blob:abc')).toBe('blob:abc')
  })

  it('returns null when enabled but neither URL nor file', () => {
    expect(getCenterImageSrc(true, '', null)).toBe(null)
  })
})

describe('getQRRenderOptions', () => {
  it('returns default colors when given undefined', () => {
    const out = getQRRenderOptions(undefined)
    expect(out.fgColor).toBe(DEFAULT_FG_COLOR)
    expect(out.bgColor).toBe(DEFAULT_BG_COLOR)
  })

  it('returns default colors when given null', () => {
    const out = getQRRenderOptions(null)
    expect(out.fgColor).toBe(DEFAULT_FG_COLOR)
    expect(out.bgColor).toBe(DEFAULT_BG_COLOR)
  })

  it('returns default colors when given empty object', () => {
    const out = getQRRenderOptions({})
    expect(out.fgColor).toBe(DEFAULT_FG_COLOR)
    expect(out.bgColor).toBe(DEFAULT_BG_COLOR)
  })

  it('returns form values when provided', () => {
    const out = getQRRenderOptions({
      fgColor: '#ff0000',
      bgColor: '#00ff00',
    })
    expect(out.fgColor).toBe('#ff0000')
    expect(out.bgColor).toBe('#00ff00')
  })

  it('uses default for missing bgColor only', () => {
    const out = getQRRenderOptions({ fgColor: '#111111' })
    expect(out.fgColor).toBe('#111111')
    expect(out.bgColor).toBe(DEFAULT_BG_COLOR)
  })
})

describe('getDrawConfigForStyle', () => {
  it('returns square kind for squares style', () => {
    expect(getDrawConfigForStyle('squares').kind).toBe('square')
  })

  it('returns rounded kind for rounded style', () => {
    expect(getDrawConfigForStyle('rounded').kind).toBe('rounded')
  })

  it('returns circle kind for dots style', () => {
    expect(getDrawConfigForStyle('dots').kind).toBe('circle')
  })
})

describe('sizeOptionToPixels', () => {
  it('maps small to 128', () => {
    expect(sizeOptionToPixels('small')).toBe(128)
  })

  it('maps medium to 192', () => {
    expect(sizeOptionToPixels('medium')).toBe(192)
  })

  it('maps large to 256', () => {
    expect(sizeOptionToPixels('large')).toBe(256)
  })
})
