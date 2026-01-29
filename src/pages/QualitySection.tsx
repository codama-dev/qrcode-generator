import { Settings2 } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QR_SIZE_OPTIONS, type QRGeneratorFormValues } from '@/lib/schemas'

interface QualitySectionProps {
  form: UseFormReturn<QRGeneratorFormValues>
  detailLevel: QRGeneratorFormValues['detailLevel']
  sizeOption: QRGeneratorFormValues['size']
  customSize: QRGeneratorFormValues['customSize']
}

export function QualitySection({ form, detailLevel, sizeOption, customSize }: QualitySectionProps) {
  const { t } = useTranslation()
  return (
    <SectionCard
      icon={<Settings2 className="size-4" aria-hidden="true" />}
      title={t('sections.quality.title')}
      description={t('sections.quality.description')}
    >
      <div className="space-y-5">
        <FormItem className="space-y-2">
          <FormLabel>{t('sections.quality.detailLevel')}</FormLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {['low', 'medium', 'high', 'ultra'].map(level => {
              const isSelected = detailLevel === level
              const label = t(
                `sections.quality.detail${level.charAt(0).toUpperCase() + level.slice(1)}`
              )
              const description = t(
                `sections.quality.detail${level.charAt(0).toUpperCase() + level.slice(1)}Desc`
              )
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    form.setValue('detailLevel', level as 'low' | 'medium' | 'high' | 'ultra', {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className={[
                    'flex flex-col items-start justify-center rounded-lg border px-3 py-2 text-left text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isSelected
                      ? 'border-transparent bg-linear-to-r from-orange-500 to-amber-400 text-white shadow-sm'
                      : 'border-border bg-background hover:bg-muted',
                  ].join(' ')}
                  aria-pressed={isSelected}
                >
                  <span className="font-medium text-xs">{label}</span>
                  <span
                    className={
                      isSelected
                        ? 'font-bold text-[0.65rem] text-white'
                        : 'text-[0.65rem] text-muted-foreground/80'
                    }
                  >
                    {description}
                  </span>
                </button>
              )
            })}
          </div>
        </FormItem>

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem className="max-w-sm space-y-2">
              <FormLabel>{t('sections.quality.outputSize')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="min-h-11">
                    <SelectValue placeholder={t('sections.quality.sizePreset')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {QR_SIZE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t(`sizeLabels.${opt.value}`)}
                      {typeof opt.pixels === 'number' && ` (${opt.pixels}px)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sizeOption === 'custom' && (
                <div className="space-y-1.5 pt-2">
                  <FormLabel className="text-xs">
                    {t('sections.quality.customSizePixels')}
                  </FormLabel>
                  <Input
                    type="number"
                    min={64}
                    max={2048}
                    value={customSize ?? ''}
                    onChange={e =>
                      form.setValue('customSize', Number(e.target.value) || 0, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="max-w-[140px]"
                  />
                  <p className="text-[0.7rem] text-muted-foreground">
                    {t('sections.quality.customSizeHint')}
                  </p>
                </div>
              )}
              <FormDescription>{t('sections.quality.outputSizeDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quietZone"
          render={({ field }) => (
            <FormItem className="max-w-sm space-y-2">
              <FormLabel>{t('sections.quality.quietZone')}</FormLabel>
              <Select
                value={String(field.value ?? 4)}
                onValueChange={v => field.onChange(Number.parseInt(v, 10) || 4)}
              >
                <FormControl>
                  <SelectTrigger className="min-h-11">
                    <SelectValue placeholder={t('sections.quality.quietZonePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[0, 2, 4, 6, 8].map(v => (
                    <SelectItem key={v} value={String(v)}>
                      {v === 0
                        ? t('sections.quality.quietZoneNone')
                        : v === 2
                          ? t('sections.quality.quietZoneMinimal')
                          : v === 4
                            ? t('sections.quality.quietZoneStandard')
                            : v === 6
                              ? t('sections.quality.quietZoneLarge')
                              : t('sections.quality.quietZoneExtraLarge')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{t('sections.quality.quietZoneDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  )
}
