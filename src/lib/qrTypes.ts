export const QR_TYPE_VALUES = [
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

export type QRType = (typeof QR_TYPE_VALUES)[number]

export interface UrlTextData {
  content: string
}

export type WifiAuthType = 'WPA' | 'WEP' | 'nopass'

export interface WifiData {
  ssid: string
  password?: string
  authType: WifiAuthType
  hidden: boolean
}

export interface VCardData {
  firstName: string
  lastName?: string
  organization?: string
  title?: string
  phone?: string
  phoneWork?: string
  email?: string
  emailWork?: string
  website?: string
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  note?: string
}

export interface EmailData {
  to: string
  subject?: string
  body?: string
}

export interface PhoneData {
  number: string
}

export interface SmsData {
  number: string
  message?: string
}

export interface WhatsappData {
  number: string
  message?: string
}

export interface FacebookData {
  username: string
}

export interface InstagramData {
  username: string
}

export interface LocationData {
  latitude: string
  longitude: string
  label?: string
}

export interface BitcoinData {
  address: string
  amount?: string
  label?: string
  message?: string
}

export interface QRTypeDataMap {
  url: UrlTextData
  text: UrlTextData
  wifi: WifiData
  vcard: VCardData
  email: EmailData
  phone: PhoneData
  sms: SmsData
  whatsapp: WhatsappData
  facebook: FacebookData
  instagram: InstagramData
  location: LocationData
  bitcoin: BitcoinData
}

export const defaultQrTypeData: QRTypeDataMap = {
  url: { content: '' },
  text: { content: '' },
  wifi: { ssid: '', password: '', authType: 'WPA', hidden: false },
  vcard: {
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    phone: '',
    phoneWork: '',
    email: '',
    emailWork: '',
    website: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    note: '',
  },
  email: { to: '', subject: '', body: '' },
  phone: { number: '' },
  sms: { number: '', message: '' },
  whatsapp: { number: '', message: '' },
  facebook: { username: '' },
  instagram: { username: '' },
  location: { latitude: '', longitude: '', label: '' },
  bitcoin: { address: '', amount: '', label: '', message: '' },
}
