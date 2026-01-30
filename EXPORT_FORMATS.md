# QR Code Export Format Behavior

This document explains how gradients and images are handled in each export format.

## SVG Export

**Gradients:** Fully preserved as native SVG elements (linearGradient/radialGradient)
**Center Logo:** Inlined as data URL within the SVG `<image>` element
**Result:** Vector QR + raster logo, file is self-contained

The SVG export uses `exportAsSvg()` which:
1. Clones the SVG element
2. Finds all `<image>` elements and converts their hrefs to data URLs via `inlineSvgImages()`
3. Serializes the SVG (gradients are preserved as SVG elements)
4. Downloads as .svg file

**Why this works:**
- Gradients are native SVG features, so they serialize naturally
- Only the center logo image needs to be inlined to make the file self-contained
- The entire QR pattern remains as vector paths/shapes

## PDF Export

### Without Gradients (default)
**Gradients:** N/A (solid colors only)
**Center Logo:** Inlined as data URL, then embedded via svg2pdf
**QR Pattern:** Vector (sharp, scalable)
**Result:** Fully vector PDF with raster logo only

Process:
1. Clone SVG and inline center images via `inlineSvgImages()` (converts blob/http URLs to data URLs)
2. Embed the SVG as vector into PDF via `svg2pdf.js`
3. Logo appears as raster `<image>` within the vector SVG
4. QR modules remain as sharp vector paths

### With Gradients (`hasGradients: true`)
**Gradients:** Preserved by rasterizing entire QR to PNG
**Center Logo:** Inlined first, then included in rasterized image
**QR Pattern:** Raster (high-quality PNG)
**Result:** Raster QR embedded in PDF

When gradients are enabled:
1. Clone SVG and inline center images via `inlineSvgImages()` (ensures images are available)
2. Serialize the SVG with all gradients and inlined images
3. Render to canvas (browser preserves gradient rendering and embedded images)
4. Convert canvas to PNG data URL
5. Embed PNG in PDF via jsPDF's `addImage()`

**Why gradients require rasterization:**
`svg2pdf.js` has limited support for SVG gradients and they often don't render correctly or at all in the final PDF. Rasterizing ensures the gradient appears exactly as shown in the preview.

**Important:** Both paths call `inlineSvgImages()` first to convert any blob: or external image URLs to data URLs, ensuring center logos appear in the PDF.

## PNG Export

**Gradients:** Preserved via canvas rendering
**Center Logo:** Inlined as data URL, then rendered to canvas
**QR Pattern:** Raster (pixel-perfect at specified size)
**Result:** Standard PNG image

Process:
1. Clone SVG and inline images via `inlineSvgImages()`
2. Serialize to data URL
3. Load into Image element
4. Draw to canvas (browser renders gradients)
5. Export canvas as PNG blob

## JPG Export

**Gradients:** Preserved via canvas rendering
**Center Logo:** Inlined as data URL, then rendered to canvas
**QR Pattern:** Raster with solid background
**Background:** White (configurable via `backgroundColor` option)
**Result:** JPG image (no transparency)

Same process as PNG but:
- Uses `image/jpeg` mime type
- Fills background with solid color first (JPG doesn't support transparency)
- Allows quality setting (default 0.92)

## Summary Table

| Format | Gradients | Center Logo | QR Pattern | Notes |
|--------|-----------|-------------|------------|-------|
| **SVG** | ✅ Vector | 🔄 Inlined | ✅ Vector | Self-contained, scalable |
| **PDF (no gradient)** | N/A | 🔄 Inlined | ✅ Vector | Sharp, scalable via svg2pdf |
| **PDF (with gradient)** | ✅ Raster | ✅ Raster | 🔄 Raster | Exact preview match |
| **PNG** | ✅ Raster | ✅ Raster | 🔄 Raster | Pixel-perfect |
| **JPG** | ✅ Raster | ✅ Raster | 🔄 Raster | Solid background |

**Legend:**
- ✅ Preserved as-is
- 🔄 Converted/processed
- N/A Not applicable

## Code References

- `inlineSvgImages()` - Converts image hrefs to data URLs for self-contained exports
- `exportAsSvg()` - Vector SVG export with inlined images
- `exportAsPdf()` - Conditional vector (svg2pdf) or raster (canvas) based on `hasGradients`
- `exportAsPng()` - Canvas-based raster export
- `exportAsJpg()` - Canvas-based raster export with solid background

All export functions are in `src/lib/qrExport.ts`.
