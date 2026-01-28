# Ticket 18: PDF Export

## Goal

Add PDF export format for professional print use cases. PDFs maintain vector quality at any size and are commonly required for print materials, business cards, and marketing collateral.

## Library Options

### Recommended: jsPDF + svg2pdf.js
- `jspdf` - Popular PDF generation library
- `svg2pdf.js` - Converts SVG to PDF maintaining vector quality

### Alternative: pdf-lib
- Pure JavaScript, no dependencies
- More complex SVG handling required

## Tasks

### 1. Install Dependencies

- [ ] Add PDF libraries:

```bash
pnpm add jspdf svg2pdf.js
pnpm add -D @types/jspdf
```

### 2. Implement PDF Export Function

- [ ] Add `exportAsPdf()` to `src/lib/qrExport.ts`:

```typescript
import { jsPDF } from "jspdf";
import { svg2pdf } from "svg2pdf.js";

export interface PdfExportOptions {
  pageSize?: "a4" | "letter" | "custom";
  customWidth?: number; // mm
  customHeight?: number; // mm
  qrSize?: number; // mm, size of QR on page
  centered?: boolean;
  margin?: number; // mm
}

export async function exportAsPdf(
  svgElement: SVGSVGElement,
  filename: string = "qrcode.pdf",
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    pageSize = "a4",
    customWidth = 210,
    customHeight = 297,
    qrSize = 50, // 50mm default
    centered = true,
    margin = 10,
  } = options;

  // Determine page dimensions
  let width: number, height: number;
  if (pageSize === "a4") {
    width = 210;
    height = 297;
  } else if (pageSize === "letter") {
    width = 216;
    height = 279;
  } else {
    width = customWidth;
    height = customHeight;
  }

  // Create PDF
  const pdf = new jsPDF({
    orientation: width > height ? "landscape" : "portrait",
    unit: "mm",
    format: pageSize === "custom" ? [width, height] : pageSize,
  });

  // Calculate position
  let x = margin;
  let y = margin;
  if (centered) {
    x = (width - qrSize) / 2;
    y = (height - qrSize) / 2;
  }

  // Clone SVG to avoid modifying original
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Convert SVG to PDF
  await svg2pdf(svgClone, pdf, {
    x,
    y,
    width: qrSize,
    height: qrSize,
  });

  // Save PDF
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
```

### 3. Simple Export Option

- [ ] For simpler implementation without svg2pdf.js, use canvas approach:

```typescript
export async function exportAsPdfSimple(
  svgElement: SVGSVGElement,
  filename: string = "qrcode.pdf"
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  
  // Convert SVG to canvas first
  const canvas = await svgToCanvas(svgElement);
  const imgData = canvas.toDataURL("image/png");
  
  // Create PDF with QR centered
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const qrSize = 60; // 60mm
  const x = (pageWidth - qrSize) / 2;
  const y = (pageHeight - qrSize) / 2;
  
  pdf.addImage(imgData, "PNG", x, y, qrSize, qrSize);
  pdf.save(filename);
}
```

### 4. Lazy Loading

- [ ] Lazy load PDF library to reduce initial bundle size:

```typescript
export async function exportAsPdf(
  svgElement: SVGSVGElement,
  filename: string = "qrcode.pdf",
  options: PdfExportOptions = {}
): Promise<void> {
  // Lazy load jsPDF
  const { jsPDF } = await import("jspdf");
  const { svg2pdf } = await import("svg2pdf.js");
  
  // ... rest of implementation
}
```

### 5. Update Export UI

- [ ] Add PDF button to download section:

```typescript
<Button 
  onClick={async () => {
    try {
      await exportAsPdf(svgRef.current);
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  }}
>
  <FileText className="mr-2 h-4 w-4" />
  PDF
</Button>
```

### 6. PDF Options UI (Optional)

- [ ] Consider adding PDF options dialog:
  - Page size selector (A4, Letter, Custom)
  - QR size on page (mm)
  - Centered vs top-left positioning

### 7. Tests

- [ ] Test PDF generation
- [ ] Test different page sizes
- [ ] Test QR positioning
- [ ] Mock jsPDF for unit tests

## Files to Modify

- `package.json` - Add jspdf dependency
- `src/lib/qrExport.ts` - Add `exportAsPdf` function
- `src/pages/QRGeneratorPage.tsx` - Add PDF download button
- `src/lib/__tests__/qrExport.test.ts` - Add PDF tests (mocked)

## Acceptance Criteria

- [ ] PDF download button appears in export section
- [ ] Clicking PDF button downloads `.pdf` file
- [ ] PDF contains QR code centered on page
- [ ] QR code in PDF is vector (scalable without pixelation)
- [ ] PDF default size is A4
- [ ] QR styling (colors, module style, corners) preserved in PDF
- [ ] Lazy loading doesn't impact initial page load
- [ ] QR code in PDF is scannable
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds

## Bundle Size Considerations

| Library | Size (gzipped) |
|---------|----------------|
| jspdf | ~300 KB |
| svg2pdf.js | ~50 KB |

**Mitigation**: Lazy load both libraries so they're only downloaded when user clicks PDF export.

## Definition of Done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [19-quality-size-controls](./19-quality-size-controls.md).
