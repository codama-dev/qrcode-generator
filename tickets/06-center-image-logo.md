# Ticket 06: Center Image / Logo

## Goal

Support an optional image in the center of the QR code (e.g. logo or icon). User provides it via URL or file upload; it is drawn on top of the QR with sensible size and position so the code stays scannable.

## Tasks

1. **Input methods**
   - **URL**: Text input for an image URL. Load and draw the image in the center (with CORS/error handling: show a fallback or message if load fails).
   - **Upload**: Optional file input (image only). Use an object URL or similar to render it in the center.
   - One of these is enough for the first version; both can be added if scope allows.

2. **Rendering**
   - Draw the QR first, then overlay the image centered, with a configurable or fixed “size vs. QR” ratio (e.g. up to ~20–25% of QR size) so recovery still works.
   - Prefer slightly smaller logos to avoid killing too many modules; ensure error correction is at least M or H when a logo is used (can enforce in UI when “center image” is on).

3. **UX**
   - Toggle or checkbox “Add center image” so the feature is clearly optional.
   - Optional: border or padding around the logo (e.g. white margin) for better scan reliability.

4. **Tests**
   - Unit tests for:
     - “Center image enabled + URL” vs “disabled” affecting the options or render path.
     - Validation (e.g. invalid URL, non-image file) if you add it.
   - Mock image loading where needed so tests don’t hit the network.

## Acceptance criteria

- [ ] User can add an optional center image via URL or upload.
- [ ] Image is scaled and centered so the QR remains scannable (test with a couple of phones/apps).
- [ ] When no image is set, behavior is unchanged from Ticket 05.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` succeeds.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [07-preview-and-download](./07-preview-and-download.md).
