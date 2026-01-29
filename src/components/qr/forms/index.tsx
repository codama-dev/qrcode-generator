import type { QRType, QRTypeDataMap } from '@/lib/qrTypes'
import { BitcoinForm } from './BitcoinForm'
import { EmailForm } from './EmailForm'
import { FacebookForm } from './FacebookForm'
import { InstagramForm } from './InstagramForm'
import { LocationForm } from './LocationForm'
import { PhoneForm } from './PhoneForm'
import { SmsForm } from './SmsForm'
import { UrlTextForm } from './UrlTextForm'
import { VCardForm } from './VCardForm'
import { WhatsAppForm } from './WhatsAppForm'
import { WifiForm } from './WifiForm'

interface QRTypeFormProps {
  type: QRType
  value: QRTypeDataMap[QRType]
  onChange: (value: QRTypeDataMap[QRType]) => void
}

export function QRTypeForm({ type, value, onChange }: QRTypeFormProps) {
  switch (type) {
    case 'url':
    case 'text':
      return (
        <UrlTextForm
          type={type}
          // Type is narrowed by switch; cast to satisfy TS
          value={value as QRTypeDataMap['url']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'wifi':
      return (
        <WifiForm
          value={value as QRTypeDataMap['wifi']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'vcard':
      return (
        <VCardForm
          value={value as QRTypeDataMap['vcard']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'email':
      return (
        <EmailForm
          value={value as QRTypeDataMap['email']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'phone':
      return (
        <PhoneForm
          value={value as QRTypeDataMap['phone']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'sms':
      return (
        <SmsForm
          value={value as QRTypeDataMap['sms']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'whatsapp':
      return (
        <WhatsAppForm
          value={value as QRTypeDataMap['whatsapp']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'facebook':
      return (
        <FacebookForm
          value={value as QRTypeDataMap['facebook']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'instagram':
      return (
        <InstagramForm
          value={value as QRTypeDataMap['instagram']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'location':
      return (
        <LocationForm
          value={value as QRTypeDataMap['location']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    case 'bitcoin':
      return (
        <BitcoinForm
          value={value as QRTypeDataMap['bitcoin']}
          onChange={next => onChange(next as QRTypeDataMap[QRType])}
        />
      )
    default:
      return null
  }
}
