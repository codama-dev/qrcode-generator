import { Palette } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import type { QRGeneratorFormValues } from '@/lib/schemas'

interface ColorSectionProps {
  form: UseFormReturn<QRGeneratorFormValues>
  foregroundGradient: QRGeneratorFormValues['foregroundGradient']
  backgroundGradient: QRGeneratorFormValues['backgroundGradient']
}

export function ColorSection({ form, foregroundGradient, backgroundGradient }: ColorSectionProps) {
  const { t } = useTranslation()
  return (
    <SectionCard
      icon={<Palette className="size-4" aria-hidden="true" />}
      title={t('sections.colors.title')}
      description={t('sections.colors.description')}
    >
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Foreground block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <FormLabel className="font-medium text-sm">
                {t('sections.colors.foreground')}
              </FormLabel>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  {t('sections.colors.useGradient')}
                </span>
                <Switch
                  checked={foregroundGradient?.enabled ?? false}
                  onCheckedChange={v =>
                    form.setValue('foregroundGradient.enabled', v, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  aria-label={t('sections.colors.toggleForegroundGradient')}
                />
              </div>
            </div>

            {!foregroundGradient?.enabled && (
              <FormField
                control={form.control}
                name="fgColor"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        className="h-11 min-h-11 w-14 cursor-pointer rounded border border-input bg-transparent p-0 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        aria-label={t('sections.colors.foregroundColorPicker')}
                      />
                      <FormControl>
                        <Input
                          type="text"
                          value={field.value}
                          aria-label={t('sections.colors.foregroundLabel')}
                          onChange={e => field.onChange(e.target.value)}
                          onBlur={field.onBlur}
                          className="min-h-11 w-24 font-mono text-sm"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>{t('sections.colors.foregroundModules')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {foregroundGradient?.enabled && (
              <div className="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                  <FormLabel className="font-medium text-xs">{t('common.type')}</FormLabel>
                  <Select
                    value={foregroundGradient.type}
                    onValueChange={v =>
                      form.setValue('foregroundGradient.type', v as 'linear' | 'radial', {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 w-28">
                      <SelectValue placeholder={t('common.type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">{t('common.linear')}</SelectItem>
                      <SelectItem value="radial">{t('common.radial')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <FormLabel className="font-medium text-xs">{t('common.colors')}</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={foregroundGradient.startColor}
                        onChange={e =>
                          form.setValue('foregroundGradient.startColor', e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="h-9 w-10 cursor-pointer rounded border border-input bg-transparent p-0"
                        aria-label={t('sections.colors.foregroundGradientStart')}
                      />
                      <Input
                        type="text"
                        value={foregroundGradient.startColor}
                        onChange={e =>
                          form.setValue('foregroundGradient.startColor', e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="h-9 w-24 font-mono text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={foregroundGradient.endColor}
                        onChange={e =>
                          form.setValue('foregroundGradient.endColor', e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="h-9 w-10 cursor-pointer rounded border border-input bg-transparent p-0"
                        aria-label={t('sections.colors.foregroundGradientEnd')}
                      />
                      <Input
                        type="text"
                        value={foregroundGradient.endColor}
                        onChange={e =>
                          form.setValue('foregroundGradient.endColor', e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="h-9 w-24 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
                {foregroundGradient.type === 'linear' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <FormLabel>{t('common.angle')}</FormLabel>
                      <span className="text-muted-foreground tabular-nums">
                        {Math.round(foregroundGradient.angle)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={foregroundGradient.angle}
                      onChange={e =>
                        form.setValue('foregroundGradient.angle', Number(e.target.value), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className="w-full"
                    />
                  </div>
                )}
                <div
                  className="h-8 w-full rounded border border-border"
                  style={{
                    background:
                      foregroundGradient.type === 'linear'
                        ? `linear-gradient(${foregroundGradient.angle}deg, ${foregroundGradient.startColor}, ${foregroundGradient.endColor})`
                        : `radial-gradient(circle, ${foregroundGradient.startColor}, ${foregroundGradient.endColor})`,
                  }}
                  aria-hidden
                />
              </div>
            )}
          </div>

          {/* Background block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <FormLabel className="font-medium text-sm">
                {t('sections.colors.background')}
              </FormLabel>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  {t('sections.colors.useGradient')}
                </span>
                <Switch
                  checked={backgroundGradient?.enabled ?? false}
                  onCheckedChange={v =>
                    form.setValue('backgroundGradient.enabled', v, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  aria-label={t('sections.colors.toggleBackgroundGradient')}
                />
              </div>
            </div>

            {!backgroundGradient?.enabled && (
              <FormField
                control={form.control}
                name="bgColor"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        className="h-11 min-h-11 w-14 cursor-pointer rounded border border-input bg-transparent p-0 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        aria-label={t('sections.colors.backgroundColorPicker')}
                      />
                      <FormControl>
                        <Input
                          type="text"
                          value={field.value}
                          aria-label={t('sections.colors.backgroundLabel')}
                          onChange={e => field.onChange(e.target.value)}
                          onBlur={field.onBlur}
                          className="min-h-11 w-24 font-mono text-sm"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>{t('sections.colors.backgroundQuietZone')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {backgroundGradient?.enabled && (
              <div className="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                  <FormLabel className="font-medium text-xs">{t('common.type')}</FormLabel>
                  <Select
                    value={backgroundGradient.type}
                    onValueChange={v =>
                      form.setValue('backgroundGradient.type', v as 'linear' | 'radial', {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 w-28">
                      <SelectValue placeholder={t('common.type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">{t('common.linear')}</SelectItem>
                      <SelectItem value="radial">{t('common.radial')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <FormLabel className="font-medium text-xs">{t('common.colors')}</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={backgroundGradient.startColor}
                        onChange={e =>
                          form.setValue('backgroundGradient.startColor', e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="h-9 w-10 cursor-pointer rounded border border-input bg-transparent p-0"
                        aria-label={t('sections.colors.backgroundGradientStart')}
                      />
                      <Input
                        type="text"
                        value={backgroundGradient.startColor}
                        onChange={e =>
                          form.setValue('backgroundGradient.startColor', e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="h-9 w-24 font-mono text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={backgroundGradient.endColor}
                        onChange={e =>
                          form.setValue('backgroundGradient.endColor', e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="h-9 w-10 cursor-pointer rounded border border-input bg-transparent p-0"
                        aria-label={t('sections.colors.backgroundGradientEnd')}
                      />
                      <Input
                        type="text"
                        value={backgroundGradient.endColor}
                        onChange={e =>
                          form.setValue('backgroundGradient.endColor', e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="h-9 w-24 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
                {backgroundGradient.type === 'linear' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <FormLabel>{t('common.angle')}</FormLabel>
                      <span className="text-muted-foreground tabular-nums">
                        {Math.round(backgroundGradient.angle)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={backgroundGradient.angle}
                      onChange={e =>
                        form.setValue('backgroundGradient.angle', Number(e.target.value), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className="w-full"
                    />
                  </div>
                )}
                <div
                  className="h-8 w-full rounded border border-border"
                  style={{
                    background:
                      backgroundGradient.type === 'linear'
                        ? `linear-gradient(${backgroundGradient.angle}deg, ${backgroundGradient.startColor}, ${backgroundGradient.endColor})`
                        : `radial-gradient(circle, ${backgroundGradient.startColor}, ${backgroundGradient.endColor})`,
                  }}
                  aria-hidden
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
