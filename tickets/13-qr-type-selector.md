# Ticket 13: QR Type Selector

## Goal

Implement a comprehensive QR type selector with type-specific forms for all common QR code use cases: URL, Text, WiFi, vCard, Email, Phone, SMS, WhatsApp, Facebook, Instagram, Location, and Bitcoin.

## QR Type Specifications

### Type List with Payload Formats

| Type | Icon | Payload Format |
|------|------|----------------|
| URL | `Link` | Raw URL string |
| Text | `Type` | Raw text string |
| WiFi | `Wifi` | `WIFI:T:{auth};S:{ssid};P:{password};H:{hidden};;` |
| vCard | `User` | vCard 3.0 format |
| Email | `Mail` | `mailto:{to}?subject={subject}&body={body}` |
| Phone | `Phone` | `tel:{number}` |
| SMS | `MessageSquare` | `sms:{number}?body={message}` |
| WhatsApp | `MessageCircle` | `https://wa.me/{number}?text={message}` |
| Facebook | `Facebook` | `https://facebook.com/{username}` |
| Instagram | `Instagram` | `https://instagram.com/{username}` |
| Location | `MapPin` | `geo:{lat},{lng}?q={label}` |
| Bitcoin | `Bitcoin` | `bitcoin:{address}?amount={amount}&label={label}&message={message}` |

## Tasks

### 1. Schema Extensions

- [ ] Add `qrType` field to form schema with enum of all types
- [ ] Create type-specific validation schemas:

```typescript
// URL/Text - existing
const urlTextSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

// WiFi
const wifiSchema = z.object({
  ssid: z.string().min(1, "Network name is required"),
  password: z.string().optional(),
  authType: z.enum(["WPA", "WEP", "nopass"]).default("WPA"),
  hidden: z.boolean().default(false),
});

// vCard
const vCardSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  organization: z.string().optional(),
  title: z.string().optional(),
  phone: z.string().optional(),
  phoneWork: z.string().optional(),
  email: z.string().email().optional(),
  emailWork: z.string().email().optional(),
  website: z.string().url().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  note: z.string().optional(),
});

// Email
const emailSchema = z.object({
  to: z.string().email("Valid email required"),
  subject: z.string().optional(),
  body: z.string().optional(),
});

// Phone
const phoneSchema = z.object({
  number: z.string().min(1, "Phone number is required"),
});

// SMS
const smsSchema = z.object({
  number: z.string().min(1, "Phone number is required"),
  message: z.string().optional(),
});

// WhatsApp
const whatsappSchema = z.object({
  number: z.string().min(1, "Phone number is required"),
  message: z.string().optional(),
});

// Facebook
const facebookSchema = z.object({
  username: z.string().min(1, "Username or page is required"),
});

// Instagram
const instagramSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

// Location
const locationSchema = z.object({
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  label: z.string().optional(),
});

// Bitcoin
const bitcoinSchema = z.object({
  address: z.string().min(1, "Bitcoin address is required"),
  amount: z.string().optional(),
  label: z.string().optional(),
  message: z.string().optional(),
});
```

### 2. Payload Generators

- [ ] Create `src/lib/qrPayloads.ts` with generator functions:

```typescript
export function generateWifiPayload(data: WifiData): string {
  const hidden = data.hidden ? "true" : "false";
  const auth = data.authType || "WPA";
  const pwd = data.password || "";
  return `WIFI:T:${auth};S:${data.ssid};P:${pwd};H:${hidden};;`;
}

export function generateVCardPayload(data: VCardData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.lastName || ""};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName || ""}`.trim(),
  ];
  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.phoneWork) lines.push(`TEL;TYPE=WORK:${data.phoneWork}`);
  if (data.email) lines.push(`EMAIL;TYPE=HOME:${data.email}`);
  if (data.emailWork) lines.push(`EMAIL;TYPE=WORK:${data.emailWork}`);
  if (data.website) lines.push(`URL:${data.website}`);
  if (data.street || data.city || data.state || data.zip || data.country) {
    lines.push(`ADR;TYPE=HOME:;;${data.street || ""};${data.city || ""};${data.state || ""};${data.zip || ""};${data.country || ""}`);
  }
  if (data.note) lines.push(`NOTE:${data.note}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

export function generateEmailPayload(data: EmailData): string {
  const params = new URLSearchParams();
  if (data.subject) params.set("subject", data.subject);
  if (data.body) params.set("body", data.body);
  const query = params.toString();
  return `mailto:${data.to}${query ? "?" + query : ""}`;
}

// ... similar for Phone, SMS, WhatsApp, Facebook, Instagram, Location, Bitcoin
```

### 3. Type Selector Component

- [ ] Create `src/components/qr/QRTypeSelector.tsx`:

```typescript
interface QRTypeSelectorProps {
  value: QRType;
  onChange: (type: QRType) => void;
}

const QR_TYPES = [
  { id: "url", label: "URL", icon: Link },
  { id: "text", label: "Text", icon: Type },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "vcard", label: "vCard", icon: User },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "location", label: "Location", icon: MapPin },
  { id: "bitcoin", label: "Bitcoin", icon: Bitcoin },
];
```

- [ ] Style as pill/chip buttons in a responsive grid
- [ ] Selected state uses gradient background
- [ ] Unselected state uses outline/ghost style

### 4. Type-Specific Form Components

- [ ] Create form components for each type:
  - `src/components/qr/forms/UrlTextForm.tsx` (existing, refactor)
  - `src/components/qr/forms/WifiForm.tsx`
  - `src/components/qr/forms/VCardForm.tsx`
  - `src/components/qr/forms/EmailForm.tsx`
  - `src/components/qr/forms/PhoneForm.tsx`
  - `src/components/qr/forms/SmsForm.tsx`
  - `src/components/qr/forms/WhatsAppForm.tsx`
  - `src/components/qr/forms/FacebookForm.tsx`
  - `src/components/qr/forms/InstagramForm.tsx`
  - `src/components/qr/forms/LocationForm.tsx`
  - `src/components/qr/forms/BitcoinForm.tsx`

- [ ] Create `src/components/qr/forms/index.tsx` that renders the correct form based on type

### 5. State Management

- [ ] Update form state to handle type switching:
  - Preserve type-specific data when switching back
  - Clear content when switching types (or preserve)
  - Generate payload based on current type

### 6. Integration

- [ ] Update `QRGeneratorPage` to use new type selector
- [ ] Wire payload generation to QR code component
- [ ] Ensure live preview works with all types

### 7. Tests

- [ ] Unit tests for all payload generators
- [ ] Test schema validation for each type
- [ ] Integration tests for type switching

## Files to Create/Modify

- `src/lib/schemas.ts` - Add type schemas
- New: `src/lib/qrPayloads.ts` - Payload generators
- New: `src/lib/qrTypes.ts` - Type definitions
- New: `src/components/qr/QRTypeSelector.tsx`
- New: `src/components/qr/forms/*.tsx` - Type forms
- `src/pages/QRGeneratorPage.tsx` - Integration
- New: `src/lib/__tests__/qrPayloads.test.ts`

## Acceptance Criteria

- [ ] Type selector displays all 12 QR types as pills
- [ ] Selected type has gradient background
- [ ] Switching types shows correct form fields
- [ ] URL type: single URL input
- [ ] Text type: textarea for long text
- [ ] WiFi type: SSID, password, auth type, hidden toggle
- [ ] vCard type: name, org, phones, emails, website, address, note
- [ ] Email type: to, subject, body fields
- [ ] Phone type: phone number input
- [ ] SMS type: number + message fields
- [ ] WhatsApp type: number + message fields
- [ ] Facebook type: username/page input
- [ ] Instagram type: username input
- [ ] Location type: lat/lng inputs + optional label
- [ ] Bitcoin type: address, amount, label, message
- [ ] Payload generation works correctly for all types
- [ ] QR code scans correctly for all types
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds

## Testing Matrix

| Type | Test Scan With |
|------|----------------|
| URL | Browser opens URL |
| Text | Shows text content |
| WiFi | Phone connects to network |
| vCard | Contact is added |
| Email | Opens email client |
| Phone | Opens dialer |
| SMS | Opens messaging app |
| WhatsApp | Opens WhatsApp |
| Facebook | Opens Facebook profile |
| Instagram | Opens Instagram profile |
| Location | Opens maps app |
| Bitcoin | Opens Bitcoin wallet |

## Definition of Done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [14-module-styles-extended](./14-module-styles-extended.md).
