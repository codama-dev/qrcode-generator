import { Grid3X3 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SectionCard } from '@/components/qr'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ERROR_CORRECTION_LEVELS,
  QR_STYLE_OPTIONS,
  type QRGeneratorFormValues,
} from '@/lib/schemas'

const STYLE_PREVIEWS: Record<(typeof QR_STYLE_OPTIONS)[number]['value'], string> = {
  squares: '◼◼\n◼◼',
  rounded: '●●\n●●',
  dots: '○○\n○○',
  gapped: '□ □\n□ □',
  vertical: '║║\n║║',
  horizontal: '══\n══',
}

interface StyleSectionProps {
  form: UseFormReturn<QRGeneratorFormValues>
  style: QRGeneratorFormValues['style']
}

export function StyleSection({ form }: StyleSectionProps) {
  const { t } = useTranslation()
  return (
    <SectionCard
      icon={<Grid3X3 className="size-4" aria-hidden="true" />}
      title={t('sections.style.title')}
      description={t('sections.style.description')}
    >
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('sections.style.moduleStyle')}</FormLabel>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {QR_STYLE_OPTIONS.map(opt => {
                  const isSelected = field.value === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={[
                        'flex min-h-14 min-w-14 flex-col items-center justify-center rounded-lg border text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-background/80 hover:border-primary/60 hover:bg-muted/80',
                      ].join(' ')}
                      aria-pressed={isSelected}
                    >
                      <span className="whitespace-pre font-mono text-[0.65rem] text-foreground/80 leading-tight">
                        {STYLE_PREVIEWS[opt.value]}
                      </span>
                      <span className="mt-1 font-medium text-[0.7rem]">
                        {t(`styleLabels.${opt.value}`)}
                      </span>
                    </button>
                  )
                })}
              </div>
              <FormDescription>{t('sections.style.styleDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="errorCorrectionLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.errorCorrection')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="min-h-11">
                    <SelectValue placeholder={t('sections.style.levelPlaceholder')} />
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
              <FormDescription>{t('sections.style.higherLevels')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  )
}
