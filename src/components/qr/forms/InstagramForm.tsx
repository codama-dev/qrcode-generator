import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { InstagramData } from '@/lib/qrTypes'
import { inputAccentClass } from './inputStyles'

interface InstagramFormProps {
  value: InstagramData
  onChange: (value: InstagramData) => void
}

export function InstagramForm({ value, onChange }: InstagramFormProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="instagram-username">Username</Label>
      <Input
        id="instagram-username"
        value={value.username}
        onChange={e => onChange({ ...value, username: e.target.value })}
        placeholder="your.handle"
        className={inputAccentClass}
      />
    </div>
  )
}
