# Ticket 01: Dependencies and Generator Shell

## Goal

Add a front-end QR generation library and a minimal generator page so the app can produce a basic QR code from text/URL. No styling yet—focus on “it works” and tests still pass.

## Tasks

1. **Add QR library**
   - Install a client-side QR library (e.g. `qrcode` with `qrcode.react` or `qrcode` + canvas/SVG). Prefer one that runs entirely in the browser.
   - Ensure types are available (`@types/qrcode` if needed).

2. **Generator route and page**
   - Add a new route (e.g. `/generator` or `/`) and a `QRGeneratorPage` (or similar) that:
     - Has a simple text input (or textarea) for “content” (URL or plain text).
     - Renders a QR code for that content using the chosen library.
     - Uses existing UI components (e.g. `Input`, `Card`) where it makes sense.

3. **Keep existing tests green**
   - Do not remove or break existing tests. New code should not require changes to unrelated specs unless the route/layout change is intentional and scoped.

## Acceptance criteria

- [ ] QR dependency is in `package.json` and installs with `pnpm install`.
- [ ] Navigating to the generator route shows an input and a QR code that updates when the content changes.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` succeeds.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [02-routing-and-layout](./02-routing-and-layout.md).
