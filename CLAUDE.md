# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Front-end only QR code generator web app. 100% browser-based — no backend. Built with React 19, TypeScript, Vite, Tailwind CSS 4, and shadcn/ui (new-york style, Radix UI primitives). Uses `pnpm` as package manager.

Live site: https://free-qr-code.codama.dev/

## Commands

| Task | Command |
|---|---|
| Dev server | `pnpm dev` |
| Build | `pnpm build` (runs `tsc -b && vite build`) |
| Lint | `pnpm lint` |
| Format | `pnpm format` (Biome — auto-runs on commit via Husky) |
| Test (single run) | `pnpm test` |
| Test (watch) | `pnpm test:watch` |
| Run single test | `pnpm vitest run src/lib/__tests__/qrPayloads.test.ts` |
| Coverage | `pnpm coverage` |
| Spell check | `pnpm spell` |
| Add shadcn component | `pnpm dlx shadcn@latest add <component>` |

## Architecture

### QR Generation Flow

1. User selects QR type via `QRTypeSelector` (12 types: URL, WiFi, vCard, Email, Phone, SMS, WhatsApp, Facebook, Instagram, Location, Bitcoin)
2. Type-specific form in `src/components/qr/forms/` validates input via Zod schemas (`src/lib/schemas.ts`)
3. Payload generators in `src/lib/qrPayloads.ts` encode data into QR-compatible strings (WiFi format, vCard spec, etc.)
4. `StyledQRCode` (`src/components/qr/StyledQRCode.tsx`) renders the QR via `qrcode.react` with customizations (gradients, dot styles, corner shapes, center logos)
5. Export functions in `src/lib/qrExport.ts` handle PNG/SVG/JPG/PDF output — PDF uses svg2pdf.js for vector output, falls back to raster PNG when gradients are present

### Key Directories

- `src/pages/` — Page components. `QRGeneratorPage.tsx` is the main page, with `ColorSection`, `StyleSection`, `QualitySection`, `LogoSection`, `PreviewPanel` as sub-sections
- `src/components/qr/forms/` — One form component per QR type
- `src/components/ui/` — shadcn/ui components (auto-generated, don't manually edit)
- `src/lib/` — Business logic: QR types/payloads/export, Zod schemas, error utils, API client
- `src/hooks/` — Custom hooks: `useErrorHandler`, `useDebounce`, `use-mobile`
- `src/locales/` — i18n JSON files (en, de, es, he). Hebrew has RTL support
- `src/layout/AppLayout.tsx` — Main layout wrapper with header/footer/nav

### State Management

- **Form state**: React Hook Form + Zod validation
- **Server state**: React Query (TanStack) — currently minimal since app is front-end only
- **Theme**: next-themes (light/dark, persisted to localStorage)
- **Language**: i18next with browser language detection, persisted to localStorage

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig and vite).

## Linting & Formatting

Biome handles both. Key enforced rules:
- `noExplicitAny`: error
- `noUnusedVariables`: error
- `noConsole`: warn
- `noNonNullAssertion`: error
- `useSortedClasses`: error (Tailwind class ordering)
- `noNestedComponentDefinitions`: error
- `useBlockStatements`: error

Formatting runs automatically on commit via Husky + lint-staged (also runs cspell). Don't worry about formatting manually.

## Testing

Vitest with jsdom, React Testing Library. Tests live in `__tests__/` directories next to source. Coverage thresholds are enforced per-directory (see `vitest.config.ts`). `src/components/ui/` is excluded from coverage.

## Internationalization

All user-facing strings must use `t('key')` from `react-i18next`. Translation files are in `src/locales/{en,de,es,he}.json`. Hebrew (`he`) requires RTL layout support.

## Deployment

Deployed on Railway using RAILPACK builder. SPA with client-side routing (React Router v7).
