import {
  Bitcoin,
  Facebook,
  Info,
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { QRType } from '@/lib/qrTypes'
import { cn } from '@/lib/utils'

interface QRTypeSelectorProps {
  value: QRType
  onChange: (value: QRType) => void
}

const TYPES: { value: QRType; icon: React.ReactNode }[] = [
  { value: 'url', icon: <Link className="size-5" aria-hidden="true" /> },
  { value: 'text', icon: <TypeIcon className="size-5" aria-hidden="true" /> },
  { value: 'wifi', icon: <Wifi className="size-5" aria-hidden="true" /> },
  { value: 'vcard', icon: <User className="size-5" aria-hidden="true" /> },
  { value: 'email', icon: <Mail className="size-5" aria-hidden="true" /> },
  { value: 'phone', icon: <Phone className="size-5" aria-hidden="true" /> },
  { value: 'sms', icon: <MessageSquare className="size-5" aria-hidden="true" /> },
  { value: 'whatsapp', icon: <MessageCircle className="size-5" aria-hidden="true" /> },
  { value: 'facebook', icon: <Facebook className="size-5" aria-hidden="true" /> },
  { value: 'instagram', icon: <Instagram className="size-5" aria-hidden="true" /> },
  { value: 'location', icon: <MapPin className="size-5" aria-hidden="true" /> },
  { value: 'bitcoin', icon: <Bitcoin className="size-5" aria-hidden="true" /> },
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
          const helperKey = `qrTypes.${type.value}Helper`
          return (
            <Button
              key={type.value}
              type="button"
              variant="outline"
              onClick={() => onChange(type.value)}
              className={cn(
                'group/type relative flex h-20 flex-col items-center justify-center gap-2 rounded-xl px-2 py-2 text-center text-[0.7rem]',
                'border shadow-xs transition-all duration-150',
                !isActive && [
                  'border-border bg-muted/60 text-foreground',
                  'hover:border-primary/60 hover:bg-muted/80',
                  'focus-visible:border-orange-500/50 focus-visible:ring-2 focus-visible:ring-orange-500/30',
                ],
                isActive && [
                  'border-primary bg-primary/10 text-primary shadow-sm',
                  'hover:bg-primary/15',
                  'dark:border-orange-400 dark:bg-orange-500/20 dark:text-orange-300 dark:shadow-[0_0_0_1px_rgba(251,146,60,0.4)]',
                  'dark:hover:bg-orange-500/25',
                ]
              )}
              aria-pressed={isActive}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                    onClick={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    aria-label={t(helperKey)}
                  >
                    <Info className="size-3.5" aria-hidden />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  {t(helperKey)}
                </TooltipContent>
              </Tooltip>
              <span className="flex flex-col items-center gap-2 font-medium">
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full transition-colors',
                    !isActive && 'bg-muted-foreground/15 group-hover/type:bg-primary/10',
                    isActive && 'bg-primary/15 dark:bg-orange-500/25'
                  )}
                >
                  {type.icon}
                </span>
                <span className="text-sm">{t(`qrTypes.${type.value}`)}</span>
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
