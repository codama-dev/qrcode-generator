# Ticket 09: Polish and Accessibility

## Goal

Improve copy, labels, focus states, keyboard use, and ARIA so the app feels polished and is usable with keyboard and screen readers.

## Tasks

1. **Copy and labels**
   - Ensure every control has a visible or associated label (“Content”, “Error correction”, “Foreground color”, etc.).
   - Add short hints or placeholder text where it helps (e.g. “Paste a URL or type any text”).
   - App title and main heading describe “QR Code Generator” (or similar).

2. **Focus and keyboard**
   - All interactive elements are focusable and reachable via Tab.
   - Focus order is logical (e.g. content → options → preview → download).
   - Buttons/links have visible focus style (Tailwind `focus-visible:` or existing design system).

3. **ARIA and semantics**
   - Use `aria-label` or `aria-labelledby` where the label isn’t obvious (e.g. icon-only buttons).
   - Preview region: `aria-label="QR code preview"` or similar; optional `role="img"` with a short description for screen readers (“QR code for [content]”).
   - Form fields are associated with labels (`<label for="...">` or wrapping).

4. **Tests**
   - Add or extend tests:
     - Critical interactive elements are in the DOM and (where possible) focusable.
     - No duplicate IDs; form labels linked to inputs.
   - Optional: run axe or similar in tests if the project already uses it; otherwise document “manual a11y check” in the ticket.

## Acceptance criteria

- [ ] Every control has a clear label.
- [ ] Full flow can be completed with keyboard only.
- [ ] Focus order and focus indicators are sensible.
- [ ] Screen reader can understand main sections and actions (manual check or automated if already in use).
- [ ] `pnpm test` passes.
- [ ] `pnpm build` succeeds.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [10-smoke-and-release-prep](./10-smoke-and-release-prep.md).
