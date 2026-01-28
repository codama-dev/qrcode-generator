# Ticket 04: QR Style (Dots, Squares, Rounded, Circles)

## Goal

Let users choose how the QR modules look: classic square pixels, rounded squares, or circles (“dots”). All rendering stays front-end only.

## Tasks

1. **Style option in the UI**
   - Add a control (select, segmented control, or radio) with at least: **Squares** (default), **Rounded**, **Dots/Circles** (or similar labels).

2. **Rendering modes**
   - **Squares**: Standard square modules (default behavior of most libs).
   - **Rounded**: Same layout, rounded corners per module (e.g. via SVG/canvas path or overlays).
   - **Dots/Circles**: Each module drawn as a circle. Ensure quiet zone and alignment are preserved so the code remains scannable.

3. **Implementation**
   - Prefer canvas or SVG so we can draw shapes ourselves if the library only outputs a buffer. Options:
     - Use a library that supports custom draw (e.g. “dot style”); or
     - Get a matrix from the QR lib and render with custom shapes in a small canvas/SVG component.

4. **Tests**
   - Add tests for “style” state and that the correct style is applied (e.g. unit tests for a helper that returns draw config by style, or shallow render of the QR component with different styles). No need to assert pixel-perfect output; assert that the right style key is used.

## Acceptance criteria

- [ ] User can switch between at least Squares, Rounded, and Dots/Circles.
- [ ] Generated QR remains scannable for common content (e.g. short URL).
- [ ] `pnpm test` passes.
- [ ] `pnpm build` succeeds.

## Definition of done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [05-colors-foreground-background](./05-colors-foreground-background.md).
