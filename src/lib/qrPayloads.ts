import type {
  BitcoinData,
  EmailData,
  FacebookData,
  InstagramData,
  LocationData,
  PhoneData,
  QRType,
  SmsData,
  VCardData,
  WhatsappData,
  WifiData,
} from './qrTypes'

export function generateWifiPayload(data: WifiData): string {
  if (!data.ssid.trim()) {
    return ''
  }
  const hidden = data.hidden ? 'true' : 'false'
  const auth = data.authType || 'WPA'
  const pwd = data.password || ''
  return `WIFI:T:${auth};S:${data.ssid};P:${pwd};H:${hidden};;`
}

export function generateVCardPayload(data: VCardData): string {
  if (!data.firstName.trim()) {
    return ''
  }
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName || ''};${data.firstName};;;`,
    `FN:${`${data.firstName} ${data.lastName || ''}`.trim()}`,
  ]
  if (data.organization) {
    lines.push(`ORG:${data.organization}`)
  }
  if (data.title) {
    lines.push(`TITLE:${data.title}`)
  }
  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`)
  }
  if (data.phoneWork) {
    lines.push(`TEL;TYPE=WORK:${data.phoneWork}`)
  }
  if (data.email) {
    lines.push(`EMAIL;TYPE=HOME:${data.email}`)
  }
  if (data.emailWork) {
    lines.push(`EMAIL;TYPE=WORK:${data.emailWork}`)
  }
  if (data.website) {
    lines.push(`URL:${data.website}`)
  }
  if (data.street || data.city || data.state || data.zip || data.country) {
    lines.push(
      `ADR;TYPE=HOME:;;${data.street || ''};${data.city || ''};${data.state || ''};${
        data.zip || ''
      };${data.country || ''}`
    )
  }
  if (data.note) {
    lines.push(`NOTE:${data.note}`)
  }
  lines.push('END:VCARD')
  return lines.join('\n')
}

export function generateEmailPayload(data: EmailData): string {
  if (!data.to.trim()) {
    return ''
  }
  const params = new URLSearchParams()
  if (data.subject) {
    params.set('subject', data.subject)
  }
  if (data.body) {
    params.set('body', data.body)
  }
  const query = params.toString()
  return `mailto:${data.to}${query ? `?${query}` : ''}`
}

export function generatePhonePayload(data: PhoneData): string {
  if (!data.number.trim()) {
    return ''
  }
  return `tel:${data.number}`
}

export function generateSmsPayload(data: SmsData): string {
  if (!data.number.trim()) {
    return ''
  }
  const params = new URLSearchParams()
  if (data.message) {
    params.set('body', data.message)
  }
  const query = params.toString()
  return `sms:${data.number}${query ? `?${query}` : ''}`
}

export function generateWhatsappPayload(data: WhatsappData): string {
  if (!data.number.trim()) {
    return ''
  }
  const params = new URLSearchParams()
  if (data.message) {
    params.set('text', data.message)
  }
  const query = params.toString()
  return `https://wa.me/${encodeURIComponent(data.number)}${query ? `?${query}` : ''}`
}

export function generateFacebookPayload(data: FacebookData): string {
  if (!data.username.trim()) {
    return ''
  }
  return `https://facebook.com/${encodeURIComponent(data.username)}`
}

export function generateInstagramPayload(data: InstagramData): string {
  if (!data.username.trim()) {
    return ''
  }
  return `https://instagram.com/${encodeURIComponent(data.username)}`
}

export function generateLocationPayload(data: LocationData): string {
  if (!data.latitude.trim() || !data.longitude.trim()) {
    return ''
  }
  const params = new URLSearchParams()
  if (data.label) {
    params.set('q', data.label)
  }
  const query = params.toString()
  return `geo:${data.latitude},${data.longitude}${query ? `?${query}` : ''}`
}

export function generateBitcoinPayload(data: BitcoinData): string {
  if (!data.address.trim()) {
    return ''
  }
  const params = new URLSearchParams()
  if (data.amount) {
    params.set('amount', data.amount)
  }
  if (data.label) {
    params.set('label', data.label)
  }
  if (data.message) {
    params.set('message', data.message)
  }
  const query = params.toString()
  return `bitcoin:${data.address}${query ? `?${query}` : ''}`
}

export function generatePayloadForType(type: QRType, data: unknown): string {
  switch (type) {
    case 'url':
    case 'text': {
      const value = (data as { content?: string } | undefined)?.content ?? ''
      return value
    }
    case 'wifi':
      return generateWifiPayload(data as WifiData)
    case 'vcard':
      return generateVCardPayload(data as VCardData)
    case 'email':
      return generateEmailPayload(data as EmailData)
    case 'phone':
      return generatePhonePayload(data as PhoneData)
    case 'sms':
      return generateSmsPayload(data as SmsData)
    case 'whatsapp':
      return generateWhatsappPayload(data as WhatsappData)
    case 'facebook':
      return generateFacebookPayload(data as FacebookData)
    case 'instagram':
      return generateInstagramPayload(data as InstagramData)
    case 'location':
      return generateLocationPayload(data as LocationData)
    case 'bitcoin':
      return generateBitcoinPayload(data as BitcoinData)
    default:
      return ''
  }
}
