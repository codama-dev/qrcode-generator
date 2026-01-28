# Ticket 10: Smoke Tests and Release Prep

## Goal

Run full test and build checks, fix any remaining issues, handle error states gracefully, and update README so the repo is ready to publish as “QR Code Generator”.

## Tasks

1. **Full test run**
   - Run **`pnpm test`** and **`pnpm build`**.
   - Fix any failing tests or build errors.
   - Optionally run **`pnpm run format:check`** and **`pnpm run lint`** (or equivalent) and fix reported issues.

2. **Error handling**
   - QR generation: if content is empty or invalid, show a clear message or placeholder instead of a broken state.
   - Center image: if URL fails to load or upload fails, show an inline error or fallback (no uncaught exceptions in UI).
   - Network: no backend calls required; if you added any optional “fetch config” or similar, handle errors there.

3. **README**
   - Update project name and description to “QR Code Generator” (or similar).
   - Short “Features” list: content input, styles (squares/dots/rounded), colors, center logo, PNG/SVG download, mobile-friendly.
   - How to run locally: `pnpm install`, `pnpm dev`, and open the given URL.
   - How to build: `pnpm build`; output is in `dist/` (or whatever Vite uses).
   - Optional: one-time note that it’s front-end only and safe to host as static files.

4. **Optional clean-up**
   - Remove or hide any leftover boilerplate routes/assets that are no longer used.
   - Ensure `index.html` title and meta description match the app.

## Acceptance criteria

- [ ] **`pnpm test`** — all tests pass.
- [ ] **`pnpm build`** — build succeeds with no errors.
- [ ] Lint/format checks pass (or documented exceptions).
- [ ] Empty/invalid input and failed image load are handled without crashing.
- [ ] README describes the app, how to run and build, and main features.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Epic complete.** The QR Code Generator is ready to publish; you can deploy the `dist/` output and later add premium features or ads.
