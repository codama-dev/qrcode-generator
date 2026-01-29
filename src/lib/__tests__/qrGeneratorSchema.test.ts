import { describe, expect, it } from 'vitest'
import {
  bitcoinSchema,
  DEFAULT_BG_COLOR,
  DEFAULT_FG_COLOR,
  emailSchema,
  facebookSchema,
  getCenterImageSrc,
  getDrawConfigForStyle,
  getEffectiveErrorCorrection,
  getOutputSize,
  getQRRenderOptions,
  instagramSchema,
  locationSchema,
  phoneSchema,
  qrGeneratorFormSchema,
  qrTypeSchema,
  sizeOptionToPixels,
  smsSchema,
  urlTextSchema,
  vCardSchema,
  whatsappSchema,
  wifiSchema,
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

describe('qrTypeSchema', () => {
  it('accepts all supported QR types', () => {
    const types = [
      'url',
      'text',
      'wifi',
      'vcard',
      'email',
      'phone',
      'sms',
      'whatsapp',
      'facebook',
      'instagram',
      'location',
      'bitcoin',
    ] as const

    types.forEach(type => {
      const result = qrTypeSchema.safeParse(type)
      expect(result.success).toBe(true)
    })
  })

  it('rejects unsupported types', () => {
    const result = qrTypeSchema.safeParse('unknown')
    expect(result.success).toBe(false)
  })
})

describe('content type schemas', () => {
  it('validates url/text content', () => {
    expect(urlTextSchema.safeParse({ content: 'Hello' }).success).toBe(true)
    expect(urlTextSchema.safeParse({ content: '' }).success).toBe(false)
  })

  it('validates wifi payload fields', () => {
    expect(
      wifiSchema.safeParse({ ssid: 'MyWiFi', password: 'secret', authType: 'WPA', hidden: false })
        .success
    ).toBe(true)
    expect(wifiSchema.safeParse({ ssid: '' }).success).toBe(false)
  })

  it('validates vCard fields', () => {
    expect(
      vCardSchema.safeParse({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        website: 'https://example.com',
      }).success
    ).toBe(true)
    expect(vCardSchema.safeParse({ firstName: '' }).success).toBe(false)
  })

  it('validates email fields', () => {
    expect(emailSchema.safeParse({ to: 'user@example.com' }).success).toBe(true)
    expect(emailSchema.safeParse({ to: 'not-an-email' }).success).toBe(false)
  })

  it('validates phone fields', () => {
    expect(phoneSchema.safeParse({ number: '+1234567890' }).success).toBe(true)
    expect(phoneSchema.safeParse({ number: '' }).success).toBe(false)
  })

  it('validates sms fields', () => {
    expect(smsSchema.safeParse({ number: '+123', message: 'Hi' }).success).toBe(true)
    expect(smsSchema.safeParse({ number: '' }).success).toBe(false)
  })

  it('validates whatsapp fields', () => {
    expect(whatsappSchema.safeParse({ number: '+123', message: 'Hi' }).success).toBe(true)
    expect(whatsappSchema.safeParse({ number: '' }).success).toBe(false)
  })

  it('validates facebook fields', () => {
    expect(facebookSchema.safeParse({ username: 'my-page' }).success).toBe(true)
    expect(facebookSchema.safeParse({ username: '' }).success).toBe(false)
  })

  it('validates instagram fields', () => {
    expect(instagramSchema.safeParse({ username: 'handle' }).success).toBe(true)
    expect(instagramSchema.safeParse({ username: '' }).success).toBe(false)
  })

  it('validates location fields', () => {
    expect(
      locationSchema.safeParse({ latitude: '40.7128', longitude: '-74.0060', label: 'NYC' }).success
    ).toBe(true)
    expect(locationSchema.safeParse({ latitude: '', longitude: '' }).success).toBe(false)
  })

  it('validates bitcoin fields', () => {
    expect(
      bitcoinSchema.safeParse({
        address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
        amount: '0.01',
        label: 'Donation',
      }).success
    ).toBe(true)
    expect(bitcoinSchema.safeParse({ address: '' }).success).toBe(false)
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

  it('returns gapped kind for gapped style', () => {
    expect(getDrawConfigForStyle('gapped').kind).toBe('gapped')
  })

  it('returns vertical kind for vertical style', () => {
    expect(getDrawConfigForStyle('vertical').kind).toBe('vertical')
  })

  it('returns horizontal kind for horizontal style', () => {
    expect(getDrawConfigForStyle('horizontal').kind).toBe('horizontal')
  })
})

describe('sizeOptionToPixels', () => {
  it('maps small to 128', () => {
    expect(sizeOptionToPixels('small')).toBe(128)
  })

  it('maps medium to 192', () => {
    expect(sizeOptionToPixels('medium')).toBe(256)
  })

  it('maps large to 256', () => {
    expect(sizeOptionToPixels('large')).toBe(512)
  })
})

describe('getOutputSize', () => {
  it('returns preset pixels when not custom', () => {
    expect(getOutputSize('small')).toBe(128)
    expect(getOutputSize('medium')).toBe(256)
  })

  it('uses custom size when preset is custom', () => {
    expect(getOutputSize('custom', 300)).toBe(300)
  })

  it('clamps custom size between 64 and 2048', () => {
    expect(getOutputSize('custom', 10)).toBe(64)
    expect(getOutputSize('custom', 10000)).toBe(2048)
  })
})

describe('getEffectiveErrorCorrection', () => {
  it('maps detail levels to base error correction', () => {
    expect(getEffectiveErrorCorrection('low', false)).toBe('L')
    expect(getEffectiveErrorCorrection('medium', false)).toBe('M')
    expect(getEffectiveErrorCorrection('high', false)).toBe('Q')
    expect(getEffectiveErrorCorrection('ultra', false)).toBe('H')
  })

  it('upgrades low level to M when logo is present', () => {
    expect(getEffectiveErrorCorrection('low', true)).toBe('M')
  })
})
