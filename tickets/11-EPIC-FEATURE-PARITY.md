# Epic: Feature Parity & Design Overhaul

## Overview

Close the feature and design gaps between our current QR code generator and competitor implementations. This epic introduces a modern, mobile-first design with an orange-yellow gradient theme, comprehensive QR type support, advanced styling options, and professional export capabilities.

## Gap Analysis

### ✅ Already Implemented (Working Well)
| Category | Feature | Status |
|----------|---------|--------|
| QR Types | Plain Text/URL | ✅ Complete |
| Module Styles | Squares, Rounded, Dots | ✅ Complete |
| Colors | Solid foreground/background | ✅ Complete |
| Logo | URL input + file upload | ✅ Complete |
| Preview | Live preview with watch | ✅ Complete |
| Export | PNG, SVG | ✅ Complete |
| Quality | Error correction (L/M/Q/H) | ✅ Complete |
| Size | Preset sizes (S/M/L) | ✅ Complete |
| Theme | Dark/Light mode | ✅ Complete |
| A11y | Basic ARIA, keyboard nav | ✅ Complete |

### ❌ Missing Features

| Category | Feature | Priority | Ticket |
|----------|---------|----------|--------|
| **Design** | Mobile-first card layout, orange-yellow theme, icons | P0 | #12 |
| **QR Types** | WiFi, vCard, Email, Phone, SMS, WhatsApp, Facebook, Instagram, Location, Bitcoin | P1 | #13 |
| **Module Styles** | Gapped, Vertical, Horizontal | P1 | #14 |
| **Corner Styles** | Corner style options, per-corner customization, corner colors | P1 | #15 |
| **Colors** | Gradient support (linear/radial) | P2 | #16 |
| **Export** | JPG format | P1 | #17 |
| **Export** | PDF format | P2 | #18 |
| **Quality** | Detail level presets, custom pixel size | P2 | #19 |

## Design Tokens (New Theme)

```css
/* Orange-Yellow Gradient Theme */
--accent-gradient: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
--accent-primary: #f97316;      /* Orange 500 */
--accent-secondary: #fbbf24;    /* Amber 400 */
--accent-hover: #ea580c;        /* Orange 600 */

/* Card Styling */
--card-radius: 1rem;
--card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--card-shadow-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1);

/* Spacing */
--section-gap: 1.5rem;
--card-padding: 1.5rem;
```

## Story Flow

Work through tickets **12** → **19** in order. After each ticket:

1. Implement the changes.
2. Run **`pnpm test`** — fix any failures before continuing.
3. Run **`pnpm build`** — ensure the app builds.
4. Proceed to the next ticket.

## Tickets (in order)

| # | Ticket | Summary | Priority | Complexity |
|---|--------|---------|----------|------------|
| 12 | [12-design-overhaul](./12-design-overhaul.md) | Mobile-first cards, orange-yellow theme, icons | P0 | L |
| 13 | [13-qr-type-selector](./13-qr-type-selector.md) | Support all QR types with type-specific forms | P1 | L |
| 14 | [14-module-styles-extended](./14-module-styles-extended.md) | Add Gapped, Vertical, Horizontal styles | P1 | M |
| 15 | [15-corner-styles](./15-corner-styles.md) | Corner style options and per-corner customization | P1 | M |
| 16 | [16-gradient-colors](./16-gradient-colors.md) | Linear/radial gradient support for QR colors | P2 | M |
| 17 | [17-export-jpg](./17-export-jpg.md) | Add JPG export format | P1 | S |
| 18 | [18-export-pdf](./18-export-pdf.md) | Add PDF export format | P2 | M |
| 19 | [19-quality-size-controls](./19-quality-size-controls.md) | Detail level presets, custom pixel size | P2 | S |

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| QR scanning reliability with advanced styles | Auto-increase error correction, add warnings |
| Logo + gradient + corner styles complexity | Test all combinations, provide presets |
| PDF export library size | Consider lazy loading, tree-shaking |
| Mobile performance with live preview | Debounce updates, optimize renders |
