import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { VCardData } from '@/lib/qrTypes'

interface VCardFormProps {
  value: VCardData
  onChange: (value: VCardData) => void
}

export function VCardForm({ value, onChange }: VCardFormProps) {
  const update = (patch: Partial<VCardData>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="vcard-first-name">First name</Label>
        <Input
          id="vcard-first-name"
          value={value.firstName}
          onChange={e => update({ firstName: e.target.value })}
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vcard-last-name">Last name</Label>
        <Input
          id="vcard-last-name"
          value={value.lastName ?? ''}
          onChange={e => update({ lastName: e.target.value })}
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vcard-organization">Organization</Label>
        <Input
          id="vcard-organization"
          value={value.organization ?? ''}
          onChange={e => update({ organization: e.target.value })}
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vcard-title">Title</Label>
        <Input
          id="vcard-title"
          value={value.title ?? ''}
          onChange={e => update({ title: e.target.value })}
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vcard-phone">Mobile phone</Label>
        <Input
          id="vcard-phone"
          value={value.phone ?? ''}
          onChange={e => update({ phone: e.target.value })}
          placeholder="+1 555 000 0000"
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vcard-phone-work">Work phone</Label>
        <Input
          id="vcard-phone-work"
          value={value.phoneWork ?? ''}
          onChange={e => update({ phoneWork: e.target.value })}
          placeholder="+1 555 000 0001"
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vcard-email">Personal email</Label>
        <Input
          id="vcard-email"
          type="email"
          value={value.email ?? ''}
          onChange={e => update({ email: e.target.value })}
          placeholder="you@example.com"
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vcard-email-work">Work email</Label>
        <Input
          id="vcard-email-work"
          type="email"
          value={value.emailWork ?? ''}
          onChange={e => update({ emailWork: e.target.value })}
          placeholder="you@company.com"
          className="min-h-11"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="vcard-website">Website</Label>
        <Input
          id="vcard-website"
          type="url"
          value={value.website ?? ''}
          onChange={e => update({ website: e.target.value })}
          placeholder="https://example.com"
          className="min-h-11"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="vcard-street">Street address</Label>
        <Input
          id="vcard-street"
          value={value.street ?? ''}
          onChange={e => update({ street: e.target.value })}
          placeholder="123 Main St"
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vcard-city">City</Label>
        <Input
          id="vcard-city"
          value={value.city ?? ''}
          onChange={e => update({ city: e.target.value })}
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vcard-state">State/Region</Label>
        <Input
          id="vcard-state"
          value={value.state ?? ''}
          onChange={e => update({ state: e.target.value })}
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vcard-zip">ZIP/Postal code</Label>
        <Input
          id="vcard-zip"
          value={value.zip ?? ''}
          onChange={e => update({ zip: e.target.value })}
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vcard-country">Country</Label>
        <Input
          id="vcard-country"
          value={value.country ?? ''}
          onChange={e => update({ country: e.target.value })}
          className="min-h-11"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="vcard-note">Notes (optional)</Label>
        <Textarea
          id="vcard-note"
          value={value.note ?? ''}
          onChange={e => update({ note: e.target.value })}
          placeholder="Add a short note or extra details"
          className="min-h-[100px] resize-y"
        />
      </div>
    </div>
  )
}
