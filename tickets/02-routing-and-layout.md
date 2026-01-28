# Ticket 02: Routing and Layout for QR Generator

## Goal

Make the QR generator the primary experience: it is the main (or only) route, and the layout is simplified so the app feels like “QR Code Generator” rather than a generic boilerplate.

## Tasks

1. **Routing**
   - Set the generator page as the default route (e.g. `/` or the only route).
   - Remove or redirect old “boilerplate” routes (e.g. Examples, Jokes, Error Handling) so the app has a clear, single-purpose entry point. Optionally keep one “About” or “Help” route if useful later.

2. **Layout**
   - Simplify `AppLayout` (and sidebar if used):
     - Either remove the sidebar and use a single full-width area, or keep a minimal header/toolbar with app title and no multi-page nav.
   - Ensure the main content area is clearly “generator” (title, maybe short tagline).

3. **Tests**
   - Update or add route/layout tests as needed so that “home” renders the generator. Do not regress existing tests.

## Acceptance criteria

- [ ] Visiting `/` (or the app root) shows the QR generator page.
- [ ] Layout is simplified (no confusing boilerplate navigation).
- [ ] `pnpm test` passes.
- [ ] `pnpm build` succeeds.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [03-content-input-and-options](./03-content-input-and-options.md).
