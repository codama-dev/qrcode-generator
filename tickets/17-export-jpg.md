# Ticket 17: JPG Export

## Goal

Add JPG/JPEG export format to complement existing PNG and SVG exports. JPG is commonly requested for use cases where smaller file sizes are preferred over transparency.

## Current State

Existing exports in `src/lib/qrExport.ts`:
- `exportAsPng()` - Uses canvas to convert SVG to PNG with transparency
- `exportAsSvg()` - Exports raw SVG markup

## JPG Considerations

### Differences from PNG
- **No transparency** - JPG doesn't support alpha channel
- **Lossy compression** - Quality setting affects file size vs clarity
- **Smaller file sizes** - Good for web use where transparency isn't needed
- **Background required** - Must have solid background (use QR background color)

## Tasks

### 1. Implement JPG Export Function

- [ ] Add `exportAsJpg()` to `src/lib/qrExport.ts`:

```typescript
export interface JpgExportOptions {
  quality?: number; // 0.0 to 1.0, default 0.92
  backgroundColor?: string; // Required for JPG, default white
}

export async function exportAsJpg(
  svgElement: SVGSVGElement,
  filename: string = "qrcode.jpg",
  options: JpgExportOptions = {}
): Promise<void> {
  const { quality = 0.92, backgroundColor = "#ffffff" } = options;
  
  // Get SVG dimensions
  const svgRect = svgElement.getBoundingClientRect();
  const width = svgRect.width || 256;
  const height = svgRect.height || 256;
  
  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = width * 2; // 2x for retina
  canvas.height = height * 2;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }
  
  // Fill background (required for JPG)
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Scale for retina
  ctx.scale(2, 2);
  
  // Convert SVG to image
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      // Convert to JPG blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create JPG blob"));
            return;
          }
          
          // Trigger download
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = filename.endsWith(".jpg") ? filename : `${filename}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
          resolve();
        },
        "image/jpeg",
        quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG as image"));
    };
    
    img.src = url;
  });
}
```

### 2. Quality Setting Option

- [ ] Consider adding quality slider to export options:

```typescript
interface ExportOptions {
  format: "png" | "svg" | "jpg";
  jpgQuality?: number; // Only for JPG
}
```

- [ ] Or use sensible default (0.92) without exposing option

### 3. Update Export UI

- [ ] Add JPG button to download section:

```typescript
<div className="flex gap-2">
  <Button onClick={() => exportAsPng(svgRef.current)}>
    <Download className="mr-2 h-4 w-4" />
    PNG
  </Button>
  <Button onClick={() => exportAsJpg(svgRef.current, "qrcode.jpg", { 
    backgroundColor: form.watch("backgroundColor") 
  })}>
    <Download className="mr-2 h-4 w-4" />
    JPG
  </Button>
  <Button onClick={() => exportAsSvg(svgRef.current)}>
    <Download className="mr-2 h-4 w-4" />
    SVG
  </Button>
</div>
```

### 4. Handle Background Color

- [ ] Pass current background color from form to JPG export
- [ ] If background is transparent, default to white for JPG
- [ ] Consider warning user if background is transparent

### 5. Tests

- [ ] Add tests for JPG export function
- [ ] Test quality parameter
- [ ] Test background color application
- [ ] Test filename handling

## Files to Modify

- `src/lib/qrExport.ts` - Add `exportAsJpg` function
- `src/pages/QRGeneratorPage.tsx` - Add JPG download button
- `src/lib/__tests__/qrExport.test.ts` - Add JPG tests

## Acceptance Criteria

- [ ] JPG download button appears in export section
- [ ] Clicking JPG button downloads `.jpg` file
- [ ] Downloaded JPG has solid background (not transparent)
- [ ] JPG uses current QR background color
- [ ] JPG quality is good (default 0.92)
- [ ] JPG file size is reasonable (<100KB for typical QR)
- [ ] QR code in JPG is scannable
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds

## File Size Comparison (typical 256x256 QR)

| Format | Approx Size | Transparency |
|--------|-------------|--------------|
| SVG | 5-20 KB | Yes |
| PNG | 10-30 KB | Yes |
| JPG | 5-15 KB | No |

## Definition of Done

- Implementation complete.
- **Run `pnpm test`** — all tests pass.
- **Run `pnpm build`** — build succeeds.
- **Continue to** [18-export-pdf](./18-export-pdf.md).
