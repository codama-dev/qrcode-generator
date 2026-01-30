import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FacebookData } from '@/lib/qrTypes'
import { inputAccentClass } from './inputStyles'

interface FacebookFormProps {
  value: FacebookData
  onChange: (value: FacebookData) => void
}

export function FacebookForm({ value, onChange }: FacebookFormProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="facebook-username">Username or page</Label>
      <Input
        id="facebook-username"
        value={value.username}
        onChange={e => onChange({ ...value, username: e.target.value })}
        placeholder="your-page-or-profile"
        className={inputAccentClass}
      />
    </div>
  )
}
