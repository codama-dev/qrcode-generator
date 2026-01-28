# Ticket 16: Gradient Colors

## Goal

Implement gradient support for QR code colors, allowing users to apply linear or radial gradients to the foreground (modules) and optionally the background.

## Features to Implement

### 1. Gradient Types
- **Linear Gradient** - Gradient flows in a direction (0-360 degrees)
- **Radial Gradient** - Gradient radiates from center outward

### 2. Gradient Configuration
- Enable/disable gradient toggle
- Gradient type selector (linear/radial)
- Start color (color stop 1)
- End color (color stop 2)
- Gradient angle (for linear, 0-360°)
- Optional: middle color stop

### 3. Application Areas
- Foreground gradient (QR modules)
- Background gradient (optional)

## Tasks

### 1. Schema Updates

- [ ] Add gradient configuration to schema:

```typescript
// Gradient schema
const gradientSchema = z.object({
  enabled: z.boolean().default(false),
  type: z.enum(["linear", "radial"]).default("linear"),
  startColor: z.string().default("#000000"),
  endColor: z.string().default("#666666"),
  angle: z.number().min(0).max(360).default(135),
});

// Add to main form schema
foregroundGradient: gradientSchema,
backgroundGradient: gradientSchema.extend({
  startColor: z.string().default("#ffffff"),
  endColor: z.string().default("#f0f0f0"),
}),
```

### 2. SVG Gradient Definitions

- [ ] Create gradient def generators:

```typescript
const createLinearGradient = (
  id: string,
  startColor: string,
  endColor: string,
  angle: number
): string => {
  // Convert angle to x1,y1,x2,y2 coordinates
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - 50 * Math.cos(rad);
  const y1 = 50 - 50 * Math.sin(rad);
  const x2 = 50 + 50 * Math.cos(rad);
  const y2 = 50 + 50 * Math.sin(rad);
  
  return `
    <linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
      <stop offset="0%" stop-color="${startColor}" />
      <stop offset="100%" stop-color="${endColor}" />
    </linearGradient>
  `;
};

const createRadialGradient = (
  id: string,
  startColor: string,
  endColor: string
): string => {
  return `
    <radialGradient id="${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${startColor}" />
      <stop offset="100%" stop-color="${endColor}" />
    </radialGradient>
  `;
};
```

### 3. Update StyledQRCode Component

- [ ] Add gradient defs to SVG:

```typescript
<svg viewBox={`0 0 ${size} ${size}`}>
  <defs>
    {foregroundGradient.enabled && (
      foregroundGradient.type === "linear" 
        ? createLinearGradient("fg-gradient", ...)
        : createRadialGradient("fg-gradient", ...)
    )}
    {backgroundGradient.enabled && (
      backgroundGradient.type === "linear"
        ? createLinearGradient("bg-gradient", ...)
        : createRadialGradient("bg-gradient", ...)
    )}
  </defs>
  
  {/* Background */}
  <rect 
    fill={backgroundGradient.enabled ? "url(#bg-gradient)" : backgroundColor}
    ...
  />
  
  {/* Modules use foreground gradient or solid */}
  {modules.map(m => (
    <rect 
      fill={foregroundGradient.enabled ? "url(#fg-gradient)" : foregroundColor}
      ...
    />
  ))}
</svg>
```

### 4. UI Components

- [ ] Create gradient controls section:

```typescript
const GradientControls = ({ 
  name, 
  label 
}: { 
  name: "foregroundGradient" | "backgroundGradient";
  label: string;
}) => {
  const { watch, setValue } = useFormContext();
  const gradient = watch(name);
  
  return (
    <div className="space-y-4">
      {/* Enable toggle */}
      <div className="flex items-center gap-2">
        <Switch 
          checked={gradient.enabled}
          onCheckedChange={(v) => setValue(`${name}.enabled`, v)}
        />
        <Label>Use Gradient for {label}</Label>
      </div>
      
      {gradient.enabled && (
        <>
          {/* Gradient type */}
          <Select value={gradient.type} onValueChange={...}>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="radial">Radial</SelectItem>
          </Select>
          
          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker label="Start Color" value={gradient.startColor} />
            <ColorPicker label="End Color" value={gradient.endColor} />
          </div>
          
          {/* Angle (for linear) */}
          {gradient.type === "linear" && (
            <div>
              <Label>Angle: {gradient.angle}°</Label>
              <Slider 
                min={0} 
                max={360} 
                value={[gradient.angle]}
                onValueChange={([v]) => setValue(`${name}.angle`, v)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
```

### 5. Gradient Preview

- [ ] Add visual gradient preview swatch:

```typescript
const GradientPreview = ({ gradient }: { gradient: GradientConfig }) => {
  const style = gradient.type === "linear"
    ? { background: `linear-gradient(${gradient.angle}deg, ${gradient.startColor}, ${gradient.endColor})` }
    : { background: `radial-gradient(circle, ${gradient.startColor}, ${gradient.endColor})` };
  
  return (
    <div 
      className="w-full h-8 rounded border"
      style={style}
    />
  );
};
```

### 6. Export Compatibility

- [ ] Ensure gradients work in SVG export (native support)
- [ ] Ensure gradients render in PNG export via canvas:
  - Canvas supports `createLinearGradient` and `createRadialGradient`
  - May need to convert SVG to canvas gradient

### 7. Contrast Warning

- [ ] Add warning when gradient contrast is low:
  - Calculate luminance of both gradient colors
  - Warn if both are similar lightness against background

### 8. Tests

- [ ] Test gradient rendering in SVG
- [ ] Test gradient export to PNG
- [ ] Test linear vs radial gradient types
- [ ] Test angle variations for linear gradient

## Files to Modify

- `src/lib/schemas.ts` - Add gradient schemas
- `src/components/qr/StyledQRCode.tsx` - Implement gradient rendering
- `src/pages/QRGeneratorPage.tsx` - Add gradient controls
- `src/lib/qrExport.ts` - Update PNG export for gradients

## Acceptance Criteria

- [ ] Toggle "Use Gradient" reveals gradient configuration
- [ ] Linear gradient type shows angle slider (0-360°)
- [ ] Radial gradient type hides angle slider
- [ ] Start and end color pickers work
- [ ] Live preview shows gradient on QR modules
- [ ] Gradient angle changes update preview in real-time
- [ ] SVG export preserves gradient
- [ ] PNG export renders gradient correctly
- [ ] Background gradient option available (optional)
- [ ] Gradient preview swatch shows current configuration
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds

## Example Gradient Configs

```typescript
// Sunset gradient
{
  enabled: true,
  type: "linear",
  startColor: "#ff6b6b",
  endColor: "#feca57",
  angle: 135,
}

// Ocean gradient
{
  enabled: true,
  type: "radial",
  startColor: "#667eea",
  endColor: "#764ba2",
}

// Dark to light
{
  enabled: true,
  type: "linear",
  startColor: "#000000",
  endColor: "#434343",
  angle: 180,
}
```

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Canvas gradient rendering complexity | Pre-calculate gradient coordinates |
| Low contrast gradients unreadable | Add luminance warning |
| Performance with many gradient modules | Use single gradient def, reference with `url()` |

## Definition of Done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [17-export-jpg](./17-export-jpg.md).
