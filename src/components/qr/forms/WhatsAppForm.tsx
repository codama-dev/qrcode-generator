import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { WhatsappData } from '@/lib/qrTypes'

interface WhatsAppFormProps {
  value: WhatsappData
  onChange: (value: WhatsappData) => void
}

export function WhatsAppForm({ value, onChange }: WhatsAppFormProps) {
  const update = (patch: Partial<WhatsappData>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="whatsapp-number">Phone number</Label>
        <Input
          id="whatsapp-number"
          type="tel"
          value={value.number}
          onChange={e => update({ number: e.target.value })}
          placeholder="+1 555 000 0000"
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp-message">Message (optional)</Label>
        <Textarea
          id="whatsapp-message"
          value={value.message ?? ''}
          onChange={e => update({ message: e.target.value })}
          placeholder="Hi! I'd like to chat."
          className="min-h-[100px] resize-y"
        />
      </div>
    </div>
  )
}
