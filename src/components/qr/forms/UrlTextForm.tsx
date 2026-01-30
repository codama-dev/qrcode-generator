import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { UrlTextData } from '@/lib/qrTypes'
import { inputAccentBase, inputAccentClassUrl } from './inputStyles'

interface UrlTextFormProps {
  type: 'url' | 'text'
  value: UrlTextData
  onChange: (value: UrlTextData) => void
}

export function UrlTextForm({ type, value, onChange }: UrlTextFormProps) {
  const { t } = useTranslation()
  const handleChange = (content: string) => {
    onChange({ ...value, content })
  }

  if (type === 'text') {
    return (
      <div className="space-y-2">
        <Label htmlFor="qr-text-content">{t('forms.textContent')}</Label>
        <Textarea
          id="qr-text-content"
          value={value.content}
          onChange={e => handleChange(e.target.value)}
          placeholder={t('forms.textPlaceholder')}
          className={`${inputAccentBase} min-h-[140px] resize-y`}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="qr-url-content">{t('forms.urlLabel')}</Label>
      <Input
        id="qr-url-content"
        type="url"
        value={value.content}
        onChange={e => handleChange(e.target.value)}
        placeholder={t('forms.urlPlaceholder')}
        className={inputAccentClassUrl}
      />
    </div>
  )
}
