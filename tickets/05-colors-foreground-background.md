# Ticket 05: Colors (Foreground and Background)

## Goal

Allow custom foreground (QR modules) and background colors via color inputs (e.g. color picker and/or hex input), while keeping contrast good enough for scanning.

## Tasks

1. **Color controls**
   - **Foreground**: Color for the “on” modules. Default typically black/dark.
   - **Background**: Color for the “off” modules and quiet zone. Default typically white.
   - Use native `<input type="color">` and/or a hex text field; consider using an existing UI component (e.g. from shadcn or a small wrapper) for consistency.

2. **Wiring**
   - Pass foreground and background into the QR rendering (canvas fill/stroke or equivalent in the library API).

3. **Contrast (optional but recommended)**
   - Optionally warn or block low-contrast pairs (e.g. both very light or both very dark). At minimum, avoid breaking layout when extreme colors are chosen.

4. **Tests**
   - Unit tests for:
     - Color options being passed into the generator (e.g. a function that builds options from form state).
     - Default colors when none are set.
   - No need for visual regression; assert data flow.

## Acceptance criteria

- [ ] User can set foreground and background colors.
- [ ] QR output uses the chosen colors.
- [ ] Default remains high-contrast (e.g. black on white).
- [ ] `pnpm test` passes.
- [ ] `pnpm build` succeeds.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [06-center-image-logo](./06-center-image-logo.md).
