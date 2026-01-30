import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { WifiData } from '@/lib/qrTypes'
import { inputAccentClass, selectTriggerAccentClass } from './inputStyles'

interface WifiFormProps {
  value: WifiData
  onChange: (value: WifiData) => void
}

export function WifiForm({ value, onChange }: WifiFormProps) {
  const update = (patch: Partial<WifiData>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="wifi-ssid">Network name (SSID)</Label>
        <Input
          id="wifi-ssid"
          value={value.ssid}
          onChange={e => update({ ssid: e.target.value })}
          placeholder="My WiFi Network"
          className={inputAccentClass}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="wifi-password">Password (optional)</Label>
        <Input
          id="wifi-password"
          type="text"
          value={value.password ?? ''}
          onChange={e => update({ password: e.target.value })}
          placeholder="••••••••"
          className={inputAccentClass}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="wifi-auth-type">Security</Label>
        <Select
          value={value.authType}
          onValueChange={authType => update({ authType: authType as WifiData['authType'] })}
        >
          <SelectTrigger id="wifi-auth-type" className={selectTriggerAccentClass}>
            <SelectValue placeholder="Security type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">Open (no password)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Switch
          id="wifi-hidden"
          checked={value.hidden}
          onCheckedChange={hidden => update({ hidden })}
        />
        <Label htmlFor="wifi-hidden" className="text-sm">
          Hidden network
        </Label>
      </div>
    </div>
  )
}
