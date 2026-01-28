# QR Code Generator

A front-end-only QR code generator web app built with React 19, TypeScript, and shadcn/ui. Generate QR codes from URLs or text in the browser—no backend required.

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm run dev
```

3. Open the app and enter a URL or any text to generate a QR code.

## Features

- **Browser-only** – QR generation runs entirely in the browser (qrcode.react)
- **Live preview** – QR code updates as you type
- **Modern stack** – React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Responsive** – Works on desktop and mobile

## Tech Stack

- **React 19** with TypeScript
- **Vite** for development and builds
- **Tailwind CSS** + **shadcn/ui** for UI
- **React Router** for navigation
- **qrcode.react** for QR generation
- **Lucide React** for icons

## Project Structure

```
src/
├── components/     # Reusable UI and error components
│   ├── ui/         # shadcn/ui components (manage via CLI)
│   └── errors/     # Error handling components
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── layout/         # App layout and sidebar
├── lib/            # Utilities, types, schemas
├── pages/          # Page components
└── main.tsx        # App entry point
```

## Important: shadcn/ui Components

Do not manually edit files in `src/components/ui/`. Use the shadcn CLI:

- **Add:** `npx shadcn@latest add <component>`
- **Update:** `npx shadcn@latest update`

## Available Scripts

- `pnpm run dev` – Start development server
- `pnpm run build` – Build for production
- `pnpm run preview` – Preview production build
- `pnpm run lint` – Run Biome linting
- `pnpm run format` – Format code with Biome
- `pnpm run test` – Run all tests
- `pnpm run test:watch` – Run tests in watch mode
- `pnpm run coverage` – Generate test coverage report
- `pnpm run spell` – Check spelling with suggestions
- `pnpm run spell:check` – Check spelling (CI mode)

## Testing & Code Quality

- **Vitest** – Unit tests with jsdom
- **Biome** – Linting and formatting
- **Husky** – Git hooks (pre-commit, pre-push)
- **lint-staged** – Lint and format staged files only
- **cspell** – Spell checking

## License

Private.
