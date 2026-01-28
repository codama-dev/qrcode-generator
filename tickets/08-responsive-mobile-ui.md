# Ticket 08: Responsive and Mobile-Friendly UI

## Goal

Make the QR generator responsive and pleasant on small screens: readable layout, touch-friendly controls, and a preview that scales appropriately.

## Tasks

1. **Layout**
   - On small viewports: stack “options” and “preview” vertically; keep preview visible (e.g. at top or after a short form).
   - On larger viewports: side-by-side or clearly grouped sections. Use existing grid/flex and breakpoints (e.g. Tailwind `sm:`, `md:`).

2. **Touch and targets**
   - Buttons and inputs have enough size (e.g. min 44px touch target where possible).
   - Color inputs and dropdowns work well on mobile (native controls are often OK).

3. **Preview**
   - QR preview scales with container width (e.g. `max-w-full`, aspect ratio preserved) so it doesn’t overflow on narrow screens.
   - Optional: cap max size on large screens so the layout doesn’t look unbalanced.

4. **Tests**
   - If you have layout or “mobile” hooks (e.g. `use-mobile`), keep or add tests for them.
   - Add a simple test that the generator page renders without error at different viewport sizes (e.g. resize in jsdom or a smoke test), or document manual check in the ticket.

## Acceptance criteria

- [ ] Layout is usable and readable on 320px–768px width (portrait phone, small tablet).
- [ ] Layout remains clear on desktop (e.g. 1024px+).
- [ ] Preview does not overflow on small screens.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` succeeds.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [09-polish-and-a11y](./09-polish-and-a11y.md).
