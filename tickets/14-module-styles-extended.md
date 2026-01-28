# Ticket 14: Extended Module Styles

## Goal

Add three additional module styles to match competitor offerings: Gapped, Vertical, and Horizontal. These styles provide more visual variety while maintaining QR code scannability.

## Current State

Existing module styles in `src/lib/schemas.ts`:
- **Squares** - Standard square modules (default)
- **Rounded** - Rounded corner squares (`rx: 0.25, ry: 0.25`)
- **Dots** - Circular modules

## New Styles to Add

### 1. Gapped
- Square modules with visible gaps between them
- Achieved by reducing module size (e.g., 80% of cell size)
- Creates a "checkerboard" visual effect with spacing

### 2. Vertical
- Rectangular modules, taller than wide
- Aspect ratio approximately 1:2 (width:height)
- Creates vertical bar pattern

### 3. Horizontal
- Rectangular modules, wider than tall
- Aspect ratio approximately 2:1 (width:height)
- Creates horizontal bar pattern

## Tasks

### 1. Update Style Options

- [ ] Add new styles to `QR_STYLE_OPTIONS` in `src/lib/schemas.ts`:

```typescript
export const QR_STYLE_OPTIONS = [
  { value: "squares", label: "Squares" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "gapped", label: "Gapped" },
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
] as const;
```

### 2. Update StyledQRCode Component

- [ ] Extend rendering logic in `src/components/qr/StyledQRCode.tsx`:

```typescript
// In the module rendering function
const renderModule = (x: number, y: number, size: number, style: string) => {
  switch (style) {
    case "squares":
      return { type: "rect", width: size, height: size };
    
    case "rounded":
      return { type: "rect", width: size, height: size, rx: size * 0.25, ry: size * 0.25 };
    
    case "dots":
      return { type: "circle", r: size / 2 };
    
    case "gapped":
      // 80% size creates visible gaps
      const gapSize = size * 0.8;
      const offset = size * 0.1;
      return { type: "rect", width: gapSize, height: gapSize, x: x + offset, y: y + offset };
    
    case "vertical":
      // Taller rectangles (60% width, 100% height)
      const vWidth = size * 0.6;
      const vOffset = size * 0.2;
      return { type: "rect", width: vWidth, height: size, x: x + vOffset };
    
    case "horizontal":
      // Wider rectangles (100% width, 60% height)
      const hHeight = size * 0.6;
      const hOffset = size * 0.2;
      return { type: "rect", width: size, height: hHeight, y: y + hOffset };
    
    default:
      return { type: "rect", width: size, height: size };
  }
};
```

### 3. Style Selector UI

- [ ] Update style selector to show visual previews/icons for each style
- [ ] Consider using small QR-like icons to represent each style
- [ ] Make tiles big tap targets (min 44x44px)

```typescript
const STYLE_PREVIEWS = {
  squares: "◼◼\n◼◼",     // or actual small SVG icons
  rounded: "●●\n●●",
  dots: "○○\n○○",
  gapped: "□ □\n□ □",
  vertical: "║║\n║║",
  horizontal: "══\n══",
};
```

### 4. Export Compatibility

- [ ] Ensure all new styles render correctly in:
  - SVG export (native vector)
  - PNG export (canvas rendering)
  - Future: JPG and PDF exports

### 5. Scannability Testing

- [ ] Test each new style at various sizes
- [ ] Ensure QR codes remain scannable
- [ ] Document any size/error-correction recommendations per style

### 6. Tests

- [ ] Update `StyledQRCode.test.tsx` with new style tests
- [ ] Test rendering for each new style
- [ ] Test export output for each style

## Files to Modify

- `src/lib/schemas.ts` - Add new style options
- `src/components/qr/StyledQRCode.tsx` - Implement rendering
- `src/components/qr/__tests__/StyledQRCode.test.tsx` - Add tests
- `src/pages/QRGeneratorPage.tsx` - Update style selector UI (if needed)

## Visual Examples

```
Squares:        Gapped:         Vertical:       Horizontal:
██ ██ ██        █  █  █         ║  ║  ║         ═══ ═══
██ ██ ██        █  █  █         ║  ║  ║         
██ ██ ██        █  █  █         ║  ║  ║         ═══ ═══
                                                
(standard)      (spaced)        (tall bars)     (wide bars)
```

## Acceptance Criteria

- [ ] Style selector shows all 6 options: Squares, Rounded, Dots, Gapped, Vertical, Horizontal
- [ ] Selecting "Gapped" renders modules with visible spacing
- [ ] Selecting "Vertical" renders tall, narrow rectangles
- [ ] Selecting "Horizontal" renders wide, short rectangles
- [ ] All styles update live preview within 300ms
- [ ] All styles export correctly to SVG
- [ ] All styles export correctly to PNG
- [ ] QR codes with new styles scan successfully
- [ ] Style selector has visual preview icons
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Gapped style may reduce scannability | Recommend minimum size, auto-increase error correction |
| Vertical/Horizontal may look odd at small sizes | Add minimum size recommendations in UI |
| Canvas rendering differences | Test thoroughly across browsers |

## Definition of Done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [15-corner-styles](./15-corner-styles.md).
