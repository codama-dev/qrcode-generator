import { ImageIcon, Upload } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { QRGeneratorFormValues } from '@/lib/schemas'

interface LogoSectionProps {
  form: UseFormReturn<QRGeneratorFormValues>
  centerImageEnabled: boolean
  centerImageSize: QRGeneratorFormValues['centerImageSize']
  centerImageSrc: string | null
  centerImageFileUrl: string | null
  handleCenterImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function LogoSection({
  form,
  centerImageEnabled,
  centerImageSize,
  centerImageSrc,
  centerImageFileUrl,
  handleCenterImageFileChange,
}: LogoSectionProps) {
  const { t } = useTranslation()
  return (
    <SectionCard
      icon={<ImageIcon className="size-4" aria-hidden="true" />}
      title={t('sections.logo.title')}
      description={t('sections.logo.description')}
    >
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="centerImageEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
              <div className="space-y-0.5">
                <FormLabel htmlFor="center-image-toggle" className="text-sm">
                  {t('sections.logo.addCenterImage')}
                </FormLabel>
                <FormDescription>{t('sections.logo.addCenterImageDesc')}</FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="center-image-toggle"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {centerImageEnabled && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="centerImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sections.logo.imageUrl')}</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder={t('sections.logo.imageUrlPlaceholder')}
                      className="min-h-11"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>{t('sections.logo.imageUrlDesc')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label
                htmlFor="center-image-upload"
                className="inline-flex items-center gap-1 font-medium text-sm"
              >
                <Upload className="size-3.5" aria-hidden="true" />
                <span>{t('sections.logo.orUpload')}</span>
              </Label>
              <Input
                id="center-image-upload"
                type="file"
                accept="image/*"
                onChange={handleCenterImageFileChange}
                className="min-h-11 cursor-pointer"
              />
              {centerImageFileUrl && (
                <p className="text-muted-foreground text-xs">{t('sections.logo.fileSelected')}</p>
              )}
            </div>
          </div>
        )}
        {centerImageEnabled && (centerImageSrc || centerImageFileUrl) && (
          <div className="grid gap-3 pt-1 sm:max-w-sm">
            <FormLabel className="text-sm">{t('sections.logo.logoSize')}</FormLabel>
            <div className="inline-flex gap-2 rounded-full bg-muted/60 p-1">
              {[
                { value: 'default', labelKey: 'sections.logo.logoSizeStandard' as const },
                { value: 'small', labelKey: 'sections.logo.logoSizeSmall' as const },
              ].map(option => {
                const isSelected = centerImageSize === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      form.setValue('centerImageSize', option.value as 'default' | 'small', {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={[
                      'flex items-center justify-center rounded-full px-3 py-1 font-medium text-xs transition-colors',
                      isSelected
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted',
                    ].join(' ')}
                    aria-pressed={isSelected}
                  >
                    {t(option.labelKey)}
                  </button>
                )
              })}
            </div>
            <p className="text-[0.7rem] text-muted-foreground">{t('sections.logo.logoSizeHint')}</p>
          </div>
        )}
      </div>
    </SectionCard>
  )
}
