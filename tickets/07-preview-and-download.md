# Ticket 07: Preview and Download

## Goal

Provide a clear live preview of the QR code and let users download it as PNG and/or SVG (if supported by the implementation).

## Tasks

1. **Live preview**
   - The main QR area is the “preview”: it updates as options change (content, style, colors, logo). If not already, ensure it’s visibly the “result” (e.g. in a card titled “Preview” or “Your QR code”).

2. **Download actions**
   - **PNG**: Button “Download PNG” that exports the current QR (including style, colors, logo) as a PNG file. Use a sensible default name (e.g. `qrcode.png` or `qrcode-{timestamp}.png`).
   - **SVG** (if feasible): Button “Download SVG” that exports an SVG version. Depends on whether the renderer is SVG or canvas; if canvas-only, you can add a separate SVG export path or skip and document it as future work.

3. **Export logic**
   - Prefer reusing the same rendering pipeline (same canvas or SVG node) for both preview and export, so export is “what you see”.
   - Handle CORS/tainted canvas if the center image is from another origin: either use a proxy pattern, or document that same-origin/cors-enabled images are required for PNG export when logo is used.

4. **Tests**
   - Unit tests for:
     - “Download” triggers the right export method (e.g. a mock for `toBlob` / `toDataURL` or createObjectURL).
     - Filename or format is as expected.
   - No need to assert binary content; assert that the export API is called with expected parameters.

## Acceptance criteria

- [ ] Preview updates live with all options (content, style, colors, logo).
- [ ] “Download PNG” produces a PNG of the current QR.
- [ ] SVG download works if implemented; otherwise it’s clearly out of scope or “later”.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` succeeds.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [08-responsive-mobile-ui](./08-responsive-mobile-ui.md).
