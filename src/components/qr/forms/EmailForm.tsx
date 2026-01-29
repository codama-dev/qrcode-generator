import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { EmailData } from '@/lib/qrTypes'

interface EmailFormProps {
  value: EmailData
  onChange: (value: EmailData) => void
}

export function EmailForm({ value, onChange }: EmailFormProps) {
  const update = (patch: Partial<EmailData>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="email-to">To</Label>
        <Input
          id="email-to"
          type="email"
          value={value.to}
          onChange={e => update({ to: e.target.value })}
          placeholder="recipient@example.com"
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-subject">Subject</Label>
        <Input
          id="email-subject"
          value={value.subject ?? ''}
          onChange={e => update({ subject: e.target.value })}
          placeholder="Subject line"
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-body">Body</Label>
        <Textarea
          id="email-body"
          value={value.body ?? ''}
          onChange={e => update({ body: e.target.value })}
          placeholder="Message body"
          className="min-h-[100px] resize-y"
        />
      </div>
    </div>
  )
}
