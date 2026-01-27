# Frontend Boilerplate

A modern, responsive frontend application boilerplate built with React 19, TypeScript, and shadcn/ui components. Perfect starting point for any web application project.

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Create environment file (optional):

Create a `.env` file in the root directory if you want to override the default API:

```
# Optional: Override the default Joke API
VITE_API_BASE_URL=https://official-joke-api.appspot.com

# Or use a custom API endpoint for development
# VITE_API_BASE_URL=http://localhost:8080
```

3. Start the development server:

```bash
pnpm run dev
```

## Features

- ✅ **Modern React** - React 19 with TypeScript for type safety
- ✅ **Responsive Design** - Table view on desktop, cards on mobile
- ✅ **Navigation** - Clean routing with React Router
- ✅ **Search & Pagination** - Debounced search and pagination components
- ✅ **Form Handling** - React Hook Form with Zod validation
- ✅ **State Management** - React Query for server state, Context API for UI state
- ✅ **UI Components** - Beautiful shadcn/ui component library
- ✅ **Error Handling** - Comprehensive error boundaries and toast notifications
- ✅ **API Layer** - Axios with proper error handling and response schemas

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** + **shadcn/ui** for modern UI
- **React Query** for state management and caching
- **React Hook Form** + **Zod** for form validation
- **React Router** for navigation
- **Lucide React** for icons
- **Axios** for HTTP requests

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (DO NOT EDIT MANUALLY)
│   ├── errors/         # Centralized error handling components
│   └── ...             # Your custom components
├── contexts/           # React Context providers
├── features/           # Feature-specific components
├── hooks/              # Custom React hooks
├── layout/             # Layout components
├── lib/                # Utilities, types, schemas
├── pages/              # Page components
└── main.tsx           # App entry point
```

## Important: shadcn/ui Components

⚠️ **DO NOT manually edit files in `src/components/ui/`** ⚠️

This folder contains components installed via shadcn/ui CLI. These components should only be:

- **Added** using `npx shadcn@latest add <component>`
- **Updated** using `npx shadcn@latest update`
- **Removed** by deleting the file (if no longer needed)

Manual edits to these files may be overwritten when updating shadcn/ui components.

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run Biome linting
- `pnpm run format` - Format code with Biome
- `pnpm run test` - Run all tests
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run coverage` - Generate test coverage report
- `pnpm run spell` - Check spelling with suggestions
- `pnpm run spell:check` - Check spelling (CI mode)

## API Integration

This boilerplate is pre-configured to work with the [Official Joke API](https://official-joke-api.appspot.com/) as an example. The following endpoints are available:

- `/random_joke` - Get a single random joke
- `/random_ten` - Get ten random jokes
- `/jokes/random` - Alternative endpoint for random joke
- `/jokes/ten` - Alternative endpoint for ten jokes
- `/jokes/{type}/random` - Get random joke by category

### Usage Example

```typescript
import { useRandomJoke, useRandomTenJokes } from '@/hooks/useJokes'

function MyComponent() {
  const { data: joke, isLoading, error } = useRandomJoke()
  const { data: jokes } = useRandomTenJokes()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading joke</div>

  return (
    <div>
      <h2>{joke?.setup}</h2>
      <p>{joke?.punchline}</p>
    </div>
  )
}
```

## Getting Started with Your Project

1. **Customize the branding** - Update app names and titles in components
2. **Define your data models** - Update types and schemas in `/src/lib/`
3. **Configure your API** - Update endpoints and data shapes in `/src/lib/api.ts`
4. **Add your features** - Create feature-specific components in `/src/features/`
5. **Add UI components** - Use `npx shadcn@latest add <component>` for new UI components
6. **Update navigation** - Modify routes and sidebar items for your use case

This boilerplate provides a solid foundation with modern React patterns, comprehensive tooling, and a scalable architecture ready for any frontend project.

## Testing & Code Quality

This boilerplate includes a comprehensive testing and code quality setup:

### Test Coverage

- **81 tests** covering critical utilities and error handling
- **Coverage excludes** `src/components/ui/` (shadcn/ui components)
- **Focus on business logic** rather than third-party UI components
- **HTML coverage reports** generated in `./coverage/` directory

### Code Quality Tools

- **Biome.js** - Fast linting and formatting (replaces ESLint + Prettier)
- **Husky** - Git hooks for pre-commit and pre-push quality checks
- **lint-staged** - Run linters on staged files only
- **cspell** - Spell checking for code and documentation
- **Vitest** - Fast unit testing with jsdom

### Git Workflow

- **Pre-commit hooks** - Auto-format, spell check, test, and build
- **Pre-push hooks** - Additional quality gates before pushing
- **Conventional commits** - Enforced commit message format with JIRA integration
- **Automatic fixes** - Many issues are auto-fixed during commit

### Coverage Exclusions

The following are intentionally excluded from coverage reports:

- `src/components/ui/**` - Third-party shadcn/ui components
- `node_modules/**` - External dependencies
- `**/*.config.*` - Configuration files
- `**/__tests__/**` - Test files themselves
