# Ticket 19: Quality and Size Controls

## Goal

Enhance the quality and size controls with detail level presets (Low, Medium, High, Ultra) and custom pixel size input, providing users with more control over output quality and QR code density.

## Current State

Existing in `src/lib/schemas.ts`:
- Size options: Small (128px), Medium (192px), Large (256px)
- Error correction: L, M, Q, H levels

## Features to Implement

### 1. Detail Level Presets
User-friendly presets that combine error correction and QR version:

| Level | Error Correction | Typical Use Case |
|-------|-----------------|------------------|
| Low | L (7%) | Maximum data, simple URLs |
| Medium | M (15%) | Balanced, general use |
| High | Q (25%) | With logo, outdoor use |
| Ultra | H (30%) | Maximum reliability, small logos |

### 2. Custom Pixel Size
- Input field for exact pixel dimensions
- Min: 64px, Max: 2048px
- Presets as quick options, custom as override

### 3. Quiet Zone Control
- Margin around QR code (in modules)
- Default: 4 modules (standard)
- Options: 0, 2, 4, 6, 8 modules

## Tasks

### 1. Schema Updates

- [ ] Update size/quality schema:

```typescript
export const DETAIL_LEVEL_OPTIONS = [
  { 
    value: "low", 
    label: "Low", 
    errorCorrection: "L",
    description: "Maximum data capacity" 
  },
  { 
    value: "medium", 
    label: "Medium", 
    errorCorrection: "M",
    description: "Balanced reliability" 
  },
  { 
    value: "high", 
    label: "High", 
    errorCorrection: "Q",
    description: "Good for logos" 
  },
  { 
    value: "ultra", 
    label: "Ultra", 
    errorCorrection: "H",
    description: "Maximum reliability" 
  },
] as const;

export const SIZE_PRESET_OPTIONS = [
  { value: "small", label: "Small", pixels: 128 },
  { value: "medium", label: "Medium", pixels: 256 },
  { value: "large", label: "Large", pixels: 512 },
  { value: "xlarge", label: "X-Large", pixels: 1024 },
  { value: "custom", label: "Custom", pixels: null },
] as const;

export const QUIET_ZONE_OPTIONS = [
  { value: 0, label: "None" },
  { value: 2, label: "Minimal (2)" },
  { value: 4, label: "Standard (4)" },
  { value: 6, label: "Large (6)" },
  { value: 8, label: "Extra Large (8)" },
] as const;

// Schema additions
detailLevel: z.enum(["low", "medium", "high", "ultra"]).default("medium"),
sizePreset: z.enum(["small", "medium", "large", "xlarge", "custom"]).default("medium"),
customSize: z.number().min(64).max(2048).optional(),
quietZone: z.number().min(0).max(8).default(4),
```

### 2. Detail Level UI

- [ ] Create tile selector for detail levels:

```typescript
const DetailLevelSelector = () => {
  const { watch, setValue } = useFormContext();
  const detailLevel = watch("detailLevel");
  
  return (
    <div className="space-y-2">
      <Label>Detail Level</Label>
      <div className="grid grid-cols-4 gap-2">
        {DETAIL_LEVEL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setValue("detailLevel", option.value)}
            className={cn(
              "p-3 rounded-lg border text-center transition-all",
              detailLevel === option.value
                ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white border-transparent"
                : "bg-background hover:bg-muted border-border"
            )}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-xs opacity-75">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

### 3. Size Controls UI

- [ ] Create size preset + custom input:

```typescript
const SizeControls = () => {
  const { watch, setValue } = useFormContext();
  const sizePreset = watch("sizePreset");
  const customSize = watch("customSize");
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Output Size</Label>
        <Select 
          value={sizePreset} 
          onValueChange={(v) => setValue("sizePreset", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SIZE_PRESET_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} {opt.pixels && `(${opt.pixels}px)`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {sizePreset === "custom" && (
        <div>
          <Label>Custom Size (pixels)</Label>
          <Input
            type="number"
            min={64}
            max={2048}
            value={customSize || 256}
            onChange={(e) => setValue("customSize", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Min: 64px, Max: 2048px
          </p>
        </div>
      )}
    </div>
  );
};
```

### 4. Quiet Zone Control

- [ ] Add margin/quiet zone selector:

```typescript
const QuietZoneControl = () => {
  const { watch, setValue } = useFormContext();
  const quietZone = watch("quietZone");
  
  return (
    <div>
      <Label>Quiet Zone (Margin)</Label>
      <Select 
        value={String(quietZone)} 
        onValueChange={(v) => setValue("quietZone", Number(v))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {QUIET_ZONE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Spacing around QR code in modules
      </p>
    </div>
  );
};
```

### 5. Auto Error Correction with Logo

- [ ] Automatically upgrade error correction when logo is enabled:

```typescript
const getEffectiveErrorCorrection = (
  detailLevel: DetailLevel,
  hasLogo: boolean
): ErrorCorrection => {
  const baseLevel = DETAIL_LEVEL_OPTIONS.find(
    (o) => o.value === detailLevel
  )?.errorCorrection || "M";
  
  // If logo enabled and level is L, upgrade to M minimum
  if (hasLogo && baseLevel === "L") {
    return "M";
  }
  
  return baseLevel;
};
```

### 6. Size Helper Function

- [ ] Create size resolver:

```typescript
const getOutputSize = (
  preset: SizePreset,
  customSize?: number
): number => {
  if (preset === "custom" && customSize) {
    return Math.min(Math.max(customSize, 64), 2048);
  }
  
  return SIZE_PRESET_OPTIONS.find(
    (o) => o.value === preset
  )?.pixels || 256;
};
```

### 7. Update QR Generation

- [ ] Pass quiet zone to QR generation:

```typescript
<StyledQRCode
  content={content}
  errorCorrection={effectiveErrorCorrection}
  size={outputSize}
  quietZone={quietZone}
  // ... other props
/>
```

### 8. Tests

- [ ] Test detail level to error correction mapping
- [ ] Test size preset resolution
- [ ] Test custom size validation
- [ ] Test quiet zone application
- [ ] Test auto error correction with logo

## Files to Modify

- `src/lib/schemas.ts` - Update schemas and options
- `src/components/qr/StyledQRCode.tsx` - Handle quiet zone
- `src/pages/QRGeneratorPage.tsx` - Update controls UI

## Acceptance Criteria

- [ ] Detail Level selector shows Low, Medium, High, Ultra as tiles
- [ ] Selected detail level has gradient background
- [ ] Changing detail level updates error correction
- [ ] Size preset dropdown shows Small, Medium, Large, X-Large, Custom
- [ ] Selecting "Custom" reveals pixel input field
- [ ] Custom size validates between 64-2048px
- [ ] Quiet Zone selector shows margin options
- [ ] Quiet zone changes visible in preview
- [ ] When logo is enabled and detail is Low, auto-upgrade to Medium
- [ ] All settings reflected in exports
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds

## Definition of Done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Feature parity epic complete!**
