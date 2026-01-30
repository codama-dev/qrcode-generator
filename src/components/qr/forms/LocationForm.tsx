import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LocationData } from '@/lib/qrTypes'
import { inputAccentClass } from './inputStyles'

interface LocationFormProps {
  value: LocationData
  onChange: (value: LocationData) => void
}

export function LocationForm({ value, onChange }: LocationFormProps) {
  const update = (patch: Partial<LocationData>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="location-latitude">Latitude</Label>
        <Input
          id="location-latitude"
          value={value.latitude}
          onChange={e => update({ latitude: e.target.value })}
          placeholder="40.7128"
          className={inputAccentClass}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location-longitude">Longitude</Label>
        <Input
          id="location-longitude"
          value={value.longitude}
          onChange={e => update({ longitude: e.target.value })}
          placeholder="-74.0060"
          className={inputAccentClass}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="location-label">Label (optional)</Label>
        <Input
          id="location-label"
          value={value.label ?? ''}
          onChange={e => update({ label: e.target.value })}
          placeholder="New York City"
          className={inputAccentClass}
        />
      </div>
    </div>
  )
}
