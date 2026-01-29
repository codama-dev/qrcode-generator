import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { SmsData } from '@/lib/qrTypes'

interface SmsFormProps {
  value: SmsData
  onChange: (value: SmsData) => void
}

export function SmsForm({ value, onChange }: SmsFormProps) {
  const update = (patch: Partial<SmsData>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="sms-number">Phone number</Label>
        <Input
          id="sms-number"
          type="tel"
          value={value.number}
          onChange={e => update({ number: e.target.value })}
          placeholder="+1 555 000 0000"
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sms-message">Message (optional)</Label>
        <Textarea
          id="sms-message"
          value={value.message ?? ''}
          onChange={e => update({ message: e.target.value })}
          placeholder="Hi! Just scanned your QR code."
          className="min-h-[100px] resize-y"
        />
      </div>
    </div>
  )
}
