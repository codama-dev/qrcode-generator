# Ticket 03: Content Input and Options

## Goal

Turn the generator into a proper form: content input (text/URL), error correction level, and size (or similar) options, with validation and clear UX.

## Tasks

1. **Content input**
   - Single input (or textarea) for “Content” that accepts URLs and plain text.
   - Optional: label/hint clarifying “URL or any text”.
   - Enforce non-empty content before showing or updating the QR (or show a placeholder/empty state).

2. **Error correction level**
   - Add a control (select or radio) for error correction: L / M / Q / H (or the levels supported by the chosen library).
   - Wire this to the QR generation options.

3. **Size / module options**
   - Add a way to set size (e.g. pixel size of modules, or overall dimensions). Keep it simple (e.g. small / medium / large or a numeric input with sensible min/max).

4. **Validation and tests**
   - Validate content (required, max length if needed).
   - Add or extend tests for:
     - Form validation (e.g. empty content, invalid options).
     - That options (error correction, size) are passed correctly into the QR generation (unit tests for options or for the component that builds options).

## Acceptance criteria

- [ ] User can enter content and choose error correction and size.
- [ ] Validation prevents invalid or empty content where appropriate.
- [ ] QR code reflects chosen options.
- [ ] `pnpm test` passes (including new/updated tests).
- [ ] `pnpm build` succeeds.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [04-qr-style-dots-circles](./04-qr-style-dots-circles.md).
