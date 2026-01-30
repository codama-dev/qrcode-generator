import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PhoneData } from '@/lib/qrTypes'
import { inputAccentClass } from './inputStyles'

interface PhoneFormProps {
  value: PhoneData
  onChange: (value: PhoneData) => void
}

export function PhoneForm({ value, onChange }: PhoneFormProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="phone-number">Phone number</Label>
      <Input
        id="phone-number"
        type="tel"
        value={value.number}
        onChange={e => onChange({ ...value, number: e.target.value })}
        placeholder="+1 555 000 0000"
        className={inputAccentClass}
      />
    </div>
  )
}
