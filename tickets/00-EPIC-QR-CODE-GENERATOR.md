# Epic: QR Code Generator

## Overview

Transform this boilerplate into a modern, front-end-only QR code generator web app. The app will support styling (pixels, circles, rounded), colors (foreground/background), center logo/image, and a mobile-friendly UI. Built for eventual online publish, with room for premium features or ads later.

## Scope

- **Front-end only**: All QR generation happens in the browser (e.g. `qrcode` npm package or similar).
- **Styling**: Dot/circle styles, squares, rounded corners; background and foreground colors; optional center image.
- **UX**: Clean, modern UI; responsive and mobile-friendly; accessible.

## Story flow

Work through tickets **01** → **10** in order. After each ticket:

1. Implement the changes.
2. Run **`pnpm test`** — fix any failures before continuing.
3. Run **`pnpm build`** — ensure the app builds.
4. Proceed to the next ticket.

## Tickets (in order)

| #   | Ticket | Summary |
|-----|--------|---------|
| 01  | [01-deps-and-generator-shell](./01-deps-and-generator-shell.md) | Add QR lib, generator route, minimal page |
| 02  | [02-routing-and-layout](./02-routing-and-layout.md) | Make generator the app focus, simplify layout |
| 03  | [03-content-input-and-options](./03-content-input-and-options.md) | Input (text/URL), error correction, size options |
| 04  | [04-qr-style-dots-circles](./04-qr-style-dots-circles.md) | Style: pixels, squares, rounded, circles |
| 05  | [05-colors-foreground-background](./05-colors-foreground-background.md) | Foreground and background color controls |
| 06  | [06-center-image-logo](./06-center-image-logo.md) | Optional center image/logo (upload or URL) |
| 07  | [07-preview-and-download](./07-preview-and-download.md) | Live preview and download (PNG/SVG) |
| 08  | [08-responsive-mobile-ui](./08-responsive-mobile-ui.md) | Responsive layout and touch-friendly UI |
| 09  | [09-polish-and-a11y](./09-polish-and-a11y.md) | Copy, labels, focus, keyboard, aria |
| 10  | [10-smoke-and-release-prep](./10-smoke-and-release-prep.md) | Full test run, error handling, README |

---

## Phase 2: Feature Parity & Design Overhaul

After completing tickets 01-10, continue with the **Feature Parity Epic** to match competitor features and improve the design:

→ **[11-EPIC-FEATURE-PARITY](./11-EPIC-FEATURE-PARITY.md)** — Design overhaul, all QR types, advanced styling, more exports

| #   | Ticket | Summary | Priority |
|-----|--------|---------|----------|
| 12  | [12-design-overhaul](./12-design-overhaul.md) | Mobile-first cards, orange-yellow theme, icons | P0 |
| 13  | [13-qr-type-selector](./13-qr-type-selector.md) | Support all QR types (WiFi, vCard, Email, etc.) | P1 |
| 14  | [14-module-styles-extended](./14-module-styles-extended.md) | Add Gapped, Vertical, Horizontal styles | P1 |
| 15  | [15-corner-styles](./15-corner-styles.md) | Corner style options and per-corner customization | P1 |
| 16  | [16-gradient-colors](./16-gradient-colors.md) | Linear/radial gradient support | P2 |
| 17  | [17-export-jpg](./17-export-jpg.md) | Add JPG export format | P1 |
| 18  | [18-export-pdf](./18-export-pdf.md) | Add PDF export format | P2 |
| 19  | [19-quality-size-controls](./19-quality-size-controls.md) | Detail level presets, custom pixel size | P2 |
