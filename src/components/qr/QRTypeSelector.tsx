import {
  Bitcoin,
  Facebook,
  Instagram,
  Link,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Type as TypeIcon,
  User,
  Wifi,
} from 'lucide-react'
import type * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { QRType } from '@/lib/qrTypes'
import { cn } from '@/lib/utils'

interface QRTypeSelectorProps {
  value: QRType
  onChange: (value: QRType) => void
}

const TYPES: { value: QRType; icon: React.ReactNode }[] = [
  { value: 'url', icon: <Link className="size-4" aria-hidden="true" /> },
  { value: 'text', icon: <TypeIcon className="size-4" aria-hidden="true" /> },
  { value: 'wifi', icon: <Wifi className="size-4" aria-hidden="true" /> },
  { value: 'vcard', icon: <User className="size-4" aria-hidden="true" /> },
  { value: 'email', icon: <Mail className="size-4" aria-hidden="true" /> },
  { value: 'phone', icon: <Phone className="size-4" aria-hidden="true" /> },
  { value: 'sms', icon: <MessageSquare className="size-4" aria-hidden="true" /> },
  { value: 'whatsapp', icon: <MessageCircle className="size-4" aria-hidden="true" /> },
  { value: 'facebook', icon: <Facebook className="size-4" aria-hidden="true" /> },
  { value: 'instagram', icon: <Instagram className="size-4" aria-hidden="true" /> },
  { value: 'location', icon: <MapPin className="size-4" aria-hidden="true" /> },
  { value: 'bitcoin', icon: <Bitcoin className="size-4" aria-hidden="true" /> },
]

export const QR_TYPE_META: Record<QRType, (typeof TYPES)[number]> = TYPES.reduce(
  (acc, type) => {
    acc[type.value] = type
    return acc
  },
  {} as Record<QRType, (typeof TYPES)[number]>
)

export function QRTypeSelector({ value, onChange }: QRTypeSelectorProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.14em]">
        {t('qrTypes.label')}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {TYPES.map(type => {
          const isActive = type.value === value
          return (
            <Button
              key={type.value}
              type="button"
              variant="outline"
              onClick={() => onChange(type.value)}
              className={cn(
                'group/type flex h-20 flex-col items-center justify-center gap-2 rounded-xl px-2 py-2 text-center text-[0.7rem]',
                'border shadow-xs transition-all duration-150',
                !isActive && [
                  'border-border bg-muted/60 text-foreground',
                  'hover:border-transparent hover:bg-linear-to-r hover:from-orange-500 hover:to-amber-400 hover:text-white hover:shadow-md',
                  'focus-visible:border-orange-500/50 focus-visible:ring-2 focus-visible:ring-orange-500/30',
                ],
                isActive && [
                  'border-transparent bg-linear-to-r from-orange-500 to-amber-400 text-white shadow-md',
                  'hover:from-orange-600 hover:to-amber-500',
                ]
              )}
              aria-pressed={isActive}
            >
              <span className="flex flex-col items-center gap-1 font-medium">
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full transition-colors',
                    !isActive && 'bg-muted-foreground/15 group-hover/type:bg-white/15',
                    isActive && 'bg-white/15'
                  )}
                >
                  {type.icon}
                </span>
                <span>{t(`qrTypes.${type.value}`)}</span>
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
