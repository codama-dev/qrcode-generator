# Ticket 12: Design Overhaul

## Goal

Transform the UI into a modern, mobile-first design with an orange-yellow gradient theme, card-based sections with icons, and a slick, professional appearance that matches competitor quality.

## Design Specifications

### Theme Colors

```css
/* Primary accent: Orange-Yellow Gradient */
--accent-gradient: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
--accent-primary: oklch(0.7 0.18 45);      /* Orange */
--accent-secondary: oklch(0.85 0.16 85);   /* Amber/Yellow */

/* Dark mode specific */
--background: oklch(0.15 0.01 250);        /* Near black with slight blue */
--card: oklch(0.2 0.01 250);               /* Elevated card */
--card-foreground: oklch(0.95 0 0);        /* Light text */

/* Light mode specific */
--background: oklch(0.97 0.01 250);        /* Light gray */
--card: oklch(1 0 0);                      /* White */
--card-foreground: oklch(0.15 0 0);        /* Dark text */
```

### Layout Structure

```
┌─────────────────────────────────────┐
│  Header: Title + Subtitle + Theme   │
├─────────────────────────────────────┤
│  [URL][Text][WiFi][vCard]...        │  ← Type selector pills
├─────────────────────────────────────┤
│  📝 QR Content                      │  ← Card with icon
│  ├─ Type-specific inputs            │
├─────────────────────────────────────┤
│  🎨 Colors                          │  ← Card with icon
│  ├─ QR Color + Background Color     │
│  ├─ [✓] Use Gradient                │
├─────────────────────────────────────┤
│  ◼️ QR Style                         │  ← Card with icon
│  ├─ Module Style tiles              │
│  ├─ Corner Style dropdown           │
├─────────────────────────────────────┤
│  📐 Quality & Size                  │  ← Card with icon
│  ├─ Detail Level tiles              │
├─────────────────────────────────────┤
│  🖼️ Add Logo (Optional)             │  ← Card with icon
│  ├─ Drag & drop upload area         │
├─────────────────────────────────────┤
│  [ Generate QR Code ]               │  ← Primary CTA button
├─────────────────────────────────────┤
│  👁️ Live Preview                    │  ← Preview card
│  ├─ QR Code / Empty state           │
│  ├─ Download buttons                │
└─────────────────────────────────────┘
```

### Component Styling

**Cards**
- Rounded corners: `rounded-xl` (1rem)
- Shadow: `shadow-md` (subtle)
- Padding: `p-6`
- Section title with icon left-aligned
- White background (light) / elevated dark (dark mode)

**Type Selector Pills**
- Grid of pill buttons (3-4 per row on mobile)
- Selected: gradient background, white text
- Unselected: outline/ghost style
- Icons for each type (optional but recommended)

**Primary CTA Button**
- Full width on mobile
- Gradient background (`bg-gradient-to-r from-orange-500 to-amber-400`)
- White text, bold
- Hover: slightly darker, subtle scale
- Active: pressed state

**Form Controls**
- Consistent input styling with focus ring using accent color
- Labels with icons where appropriate
- Toggle switches for options (not checkboxes)

## Tasks

### 1. Theme Configuration

- [ ] Update `src/index.css` with new CSS variables for orange-yellow theme
- [ ] Configure both light and dark mode palettes
- [ ] Ensure accent color applies to focus states, selections, buttons

### 2. Layout Restructure

- [ ] Create `SectionCard` component for consistent card sections
  - Props: `icon`, `title`, `children`
  - Styling: white/elevated card, rounded-xl, shadow, padding
- [ ] Update `QRGeneratorPage` layout:
  - Mobile: single column, stacked cards
  - Desktop (md+): two columns (controls left, preview right sticky)
- [ ] Add page header with title and subtitle

### 3. Type Selector Component

- [ ] Create `QRTypeSelector` component
  - Grid of pill buttons
  - Selected state with gradient
  - Prepare for ticket #13 (currently only URL/Text)
- [ ] Use icons from lucide-react for each type

### 4. Card Section Components

- [ ] Refactor form sections into distinct cards:
  - `ContentCard` - QR content input
  - `ColorsCard` - Color controls
  - `StyleCard` - Module and corner styles
  - `QualityCard` - Size and quality controls
  - `LogoCard` - Logo upload area
- [ ] Each card has icon + title header

### 5. Primary CTA Button

- [ ] Style "Generate QR Code" button with gradient
- [ ] Full width on mobile, appropriate width on desktop
- [ ] Smooth hover/active transitions

### 6. Preview Card Enhancement

- [ ] Sticky positioning on desktop (stays visible while scrolling)
- [ ] Empty state with helpful message
- [ ] Download buttons with icons
- [ ] Show QR metadata (size, type, etc.)

### 7. Icon Integration

- [ ] Add lucide-react icons throughout:
  - Section headers (Link, Palette, Grid, Settings, Image, Eye)
  - Type selector (Link, Type, Wifi, User, Mail, Phone, MessageSquare, etc.)
  - Buttons (Download, RefreshCw, Upload)
- [ ] Ensure icons have proper sizing and color inheritance

### 8. Polish & Animations

- [ ] Add subtle transitions on card hover (optional)
- [ ] Button press animations
- [ ] Smooth focus transitions
- [ ] Loading states where appropriate

## Files to Modify

- `src/index.css` - Theme variables
- `src/pages/QRGeneratorPage.tsx` - Layout restructure
- `src/components/ui/` - May need to extend button/card variants
- New: `src/components/qr/SectionCard.tsx`
- New: `src/components/qr/QRTypeSelector.tsx`

## Acceptance Criteria

- [ ] Orange-yellow gradient theme visible in dark mode
- [ ] Light mode has clean white cards on light gray background
- [ ] All form sections in distinct cards with icons
- [ ] Type selector shows URL/Text as pills (extensible for more types)
- [ ] Primary CTA button has gradient styling
- [ ] Preview card is sticky on desktop
- [ ] Icons present on all section headers
- [ ] Mobile layout is single-column, touch-friendly
- [ ] Desktop layout is two-column with sticky preview
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] Lighthouse accessibility score remains 90+

## Visual Reference

The design should feel:
- **Modern**: Clean lines, generous whitespace, rounded corners
- **Professional**: Consistent spacing, polished interactions
- **Approachable**: Friendly gradient colors, clear labels, helpful empty states
- **Fast**: Snappy interactions, no perceived lag

## Definition of Done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [13-qr-type-selector](./13-qr-type-selector.md).
