import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { BitcoinData } from '@/lib/qrTypes'

interface BitcoinFormProps {
  value: BitcoinData
  onChange: (value: BitcoinData) => void
}

export function BitcoinForm({ value, onChange }: BitcoinFormProps) {
  const update = (patch: Partial<BitcoinData>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="bitcoin-address">Bitcoin address</Label>
        <Input
          id="bitcoin-address"
          value={value.address}
          onChange={e => update({ address: e.target.value })}
          placeholder="1BoatSLRHtKNngkdXEeobR76b53LETtpyT"
          className="min-h-11"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bitcoin-amount">Amount (optional)</Label>
          <Input
            id="bitcoin-amount"
            value={value.amount ?? ''}
            onChange={e => update({ amount: e.target.value })}
            placeholder="0.01"
            className="min-h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bitcoin-label">Label (optional)</Label>
          <Input
            id="bitcoin-label"
            value={value.label ?? ''}
            onChange={e => update({ label: e.target.value })}
            placeholder="Donation"
            className="min-h-11"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bitcoin-message">Message (optional)</Label>
        <Textarea
          id="bitcoin-message"
          value={value.message ?? ''}
          onChange={e => update({ message: e.target.value })}
          placeholder="Thank you for your support!"
          className="min-h-[80px] resize-y"
        />
      </div>
    </div>
  )
}
