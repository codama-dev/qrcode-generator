# Ticket 15: Corner Styles

## Goal

Implement corner (finder pattern) styling options including style variants, per-corner customization, and custom corner colors. QR codes have three finder patterns (top-left, top-right, bottom-left) that can be styled independently from the data modules.

## Background

QR code finder patterns consist of:
- **Outer ring** - 7x7 module square border
- **Inner square** - 3x3 module solid center

These can be styled differently from the main data modules for visual distinction.

## Features to Implement

### 1. Corner Style Options
- Square (default)
- Rounded (rounded corners on outer and inner)
- Circle (circular finder patterns)
- Dot (circular with circular inner)
- Extra-rounded (very rounded, almost circular)

### 2. Per-Corner Customization
Toggle to allow setting different styles for each corner:
- Top-left corner style
- Top-right corner style
- Bottom-left corner style

### 3. Custom Corner Colors
Toggle to allow separate colors for corners:
- Corner outer color
- Corner inner color
- Option for per-corner colors when both toggles are enabled

## Tasks

### 1. Schema Updates

- [ ] Add corner style options to schema:

```typescript
export const CORNER_STYLE_OPTIONS = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
  { value: "dot", label: "Dot" },
  { value: "extra-rounded", label: "Extra Rounded" },
] as const;

// Form schema additions
cornerStyle: z.enum(["square", "rounded", "circle", "dot", "extra-rounded"]).default("square"),
customizeCornersSeparately: z.boolean().default(false),
topLeftCornerStyle: z.enum([...]).optional(),
topRightCornerStyle: z.enum([...]).optional(),
bottomLeftCornerStyle: z.enum([...]).optional(),
customCornerColors: z.boolean().default(false),
cornerOuterColor: z.string().default("#000000"),
cornerInnerColor: z.string().default("#000000"),
```

### 2. Corner Style Rendering

- [ ] Update `StyledQRCode.tsx` to handle corner rendering:

```typescript
interface CornerStyle {
  outer: "square" | "rounded" | "circle" | "dot" | "extra-rounded";
  inner: "square" | "rounded" | "circle" | "dot" | "extra-rounded";
  outerColor?: string;
  innerColor?: string;
}

const renderFinderPattern = (
  x: number, 
  y: number, 
  moduleSize: number,
  style: CornerStyle
) => {
  const outerSize = moduleSize * 7;
  const innerSize = moduleSize * 3;
  const innerOffset = moduleSize * 2;
  
  // Render based on style
  switch (style.outer) {
    case "square":
      // 7x7 square with 5x5 cut-out, then 3x3 center
      break;
    case "rounded":
      // Rounded rectangle paths
      break;
    case "circle":
      // Concentric circles
      break;
    // ... etc
  }
};
```

### 3. Finder Pattern Detection

- [ ] Identify finder pattern positions in QR matrix:
  - Top-left: (0,0) to (6,6)
  - Top-right: (cols-7, 0) to (cols-1, 6)
  - Bottom-left: (0, rows-7) to (6, rows-1)

- [ ] Exclude finder areas from regular module rendering
- [ ] Render finder patterns separately with their styles

### 4. UI Components

- [ ] Create corner style selector (dropdown or tiles):

```typescript
<FormField
  name="cornerStyle"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Corner Style</FormLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select corner style" />
        </SelectTrigger>
        <SelectContent>
          {CORNER_STYLE_OPTIONS.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  )}
/>
```

- [ ] Add toggle for "Customize Each Corner Separately":

```typescript
<FormField
  name="customizeCornersSeparately"
  render={({ field }) => (
    <FormItem className="flex items-center gap-2">
      <FormControl>
        <Switch checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <FormLabel>Customize Each Corner Separately</FormLabel>
    </FormItem>
  )}
/>

{watchCustomizeCorners && (
  <div className="grid grid-cols-3 gap-4">
    {/* Per-corner style selectors */}
  </div>
)}
```

- [ ] Add toggle for "Custom Corner Colors":

```typescript
{watchCustomCornerColors && (
  <div className="space-y-4">
    <ColorPicker label="Corner Outer Color" name="cornerOuterColor" />
    <ColorPicker label="Corner Inner Color" name="cornerInnerColor" />
  </div>
)}
```

### 5. SVG Path Generation

- [ ] Create SVG path generators for each corner style:

```typescript
const getCornerOuterPath = (style: string, size: number): string => {
  switch (style) {
    case "square":
      return `M0,0 h${size} v${size} h-${size} z 
              M${size/7},${size/7} v${size*5/7} h${size*5/7} v-${size*5/7} z`;
    case "rounded":
      const r = size / 7;
      return `M${r},0 h${size-2*r} q${r},0 ${r},${r} v${size-2*r} q0,${r} -${r},${r} 
              h-${size-2*r} q-${r},0 -${r},-${r} v-${size-2*r} q0,-${r} ${r},-${r}`;
    // ... etc
  }
};
```

### 6. Export Compatibility

- [ ] Ensure corner styles render in SVG export
- [ ] Ensure corner styles render in PNG export
- [ ] Test color combinations in exports

### 7. Tests

- [ ] Test corner style rendering for each variant
- [ ] Test per-corner customization
- [ ] Test corner color application
- [ ] Test exports with corner styles

## Files to Modify

- `src/lib/schemas.ts` - Add corner style schemas
- `src/components/qr/StyledQRCode.tsx` - Implement corner rendering
- `src/pages/QRGeneratorPage.tsx` - Add corner style controls
- `src/components/qr/__tests__/StyledQRCode.test.tsx` - Add tests

## Visual Examples

```
Square:         Rounded:        Circle:         Dot:
┌─────┐         ╭─────╮         ○─────○         ●─────●
│ ███ │         │ ███ │         │  ●  │         │  ●  │
│ ███ │         │ ███ │         │  ●  │         │  ●  │
└─────┘         ╰─────╯         ○─────○         ●─────●
```

## Acceptance Criteria

- [ ] Corner Style dropdown shows: Square, Rounded, Circle, Dot, Extra Rounded
- [ ] Changing corner style updates preview within 300ms
- [ ] Toggle "Customize Each Corner Separately" reveals per-corner controls
- [ ] Per-corner controls allow different styles for TL, TR, BL corners
- [ ] Toggle "Custom Corner Colors" reveals color pickers
- [ ] Corner outer color applies to finder outer ring
- [ ] Corner inner color applies to finder inner square
- [ ] Finder patterns render correctly distinct from data modules
- [ ] All corner styles export correctly to SVG
- [ ] All corner styles export correctly to PNG
- [ ] QR codes with custom corners scan successfully
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Complex SVG path generation | Use well-tested path generation functions |
| Finder detection in QR matrix | Use standard positions (0,0), (cols-7,0), (0,rows-7) |
| Performance with many paths | Optimize by grouping similar styled elements |

## Definition of Done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [16-gradient-colors](./16-gradient-colors.md).
