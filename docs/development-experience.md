# Development Experience & Code Quality Setup

This document provides a comprehensive guide to the development experience, tooling, and code quality standards implemented in this repository.

## Overview

This repository implements a modern, enterprise-grade development workflow with automated code quality enforcement, testing standards, and git workflow management.

## Table of Contents

1. [Core Tools & Features](#core-tools--features)
2. [Git Workflow & Hooks](#git-workflow--hooks)
3. [Code Quality & Formatting](#code-quality--formatting)
4. [Testing Infrastructure](#testing-infrastructure)
5. [Spell Checking](#spell-checking)
6. [Configuration Files](#configuration-files)
7. [Developer Workflow](#developer-workflow)
8. [Setting Up in Another TypeScript Project](#setting-up-in-another-typescript-project)

## Core Tools & Features

### 🛠️ **Biome.js** (Replaces ESLint + Prettier)

- **Fast linting and formatting** in a single tool
- **Zero configuration** with sensible defaults
- **Auto-fixing** of code issues
- **IDE integration** with real-time feedback

### 🐕 **Husky** (Git Hooks)

- **Pre-commit hooks** for quality gates
- **Pre-push hooks** for additional validation
- **Commit message validation** with conventional commits
- **Automatic setup** via `prepare` script

### 🎯 **lint-staged** (Staged File Processing)

- **Fast linting** only on staged files
- **Automatic fixing** of issues before commit
- **Parallel processing** for speed
- **Integrated spell checking** on staged files

### 🔤 **cspell** (Spell Checking)

- **Comprehensive spell checking** across all file types
- **Custom dictionaries** for project-specific terms
- **Language-specific patterns** for code vs documentation
- **CI/CD integration** ready

### 🧪 **Vitest** (Testing Framework)

- **Fast test execution** with Hot Module Reload
- **Coverage reporting** with v8 provider
- **jsdom environment** for React testing
- **Testing Library integration** for component testing

## Git Workflow & Hooks

### Pre-commit Hook (`/.husky/pre-commit`)

The pre-commit hook ensures code quality before any commit:

```bash
#!/bin/sh

# Run Biome on staged files via lint-staged (this will format and fix issues)
pnpm exec lint-staged || {
  echo "\n✖ Pre-commit blocked: lint-staged tasks failed."
  echo "  Biome formatting/linting issues detected."
  echo "  Please stage the auto-fixed files and commit again."
  exit 1
}

# Run tests before allowing the commit
pnpm test || {
  echo "\n✖ Pre-commit blocked: tests failed."
  echo "  Fix tests locally and commit again."
  exit 1
}

# Ensure project builds before allowing the commit
pnpm build || {
  echo "\n✖ Pre-commit blocked: build failed."
  echo "  Fix type errors/build issues and commit again."
  exit 1
}

exit 0
```

**What happens:**

1. **Auto-fixes** formatting and linting issues on staged files
2. **Runs spell check** on staged files
3. **Executes all tests** to ensure no regressions
4. **Validates build** to catch TypeScript errors
5. **Fails gracefully** with helpful error messages

### Pre-push Hook (`/.husky/pre-push`)

Additional validation before pushing to remote:

```bash
#!/bin/sh

pnpm run format:check || {
  echo "
✖ Pre-push blocked: repository is not formatted per Biome rules."
  echo "  Run 'pnpm format' to apply fixes, commit them, then push again."
  exit 1
}

# Run spell check before push
pnpm run spell:check || {
  echo "\n✖ Pre-push blocked: spelling errors detected."
  echo "  Run 'pnpm spell' to see errors and suggestions."
  echo "  Fix spelling errors or add words to cspell.json, commit changes, then push again."
  exit 1
}

pnpm test || {
  echo "
✖ Pre-push blocked: tests failed."
  echo "  Fix tests locally and push again."
  exit 1
}

# Ensure project builds before allowing the push
pnpm build || {
  echo "\n✖ Pre-push blocked: build failed."
  echo "  Fix type errors/build issues and push again."
  exit 1
}

exit 0
```

### Commit Message Validation (`/.husky/commit-msg`)

Enforces conventional commits with JIRA integration:

```bash
#!/usr/bin/env sh

# Current branch
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Skip validation for dependabot branches
if echo "$current_branch" | grep -q "^dependabot/"; then
	exit 0
fi

commit_message=$(head -1 "$1")

# Allow merge/revert commits
if echo "$commit_message" | grep -qE '^(Merge|Revert) '; then
	exit 0
fi

# Conventional types
TYPES='feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert|infra|release|migration'

# Pattern: type(JIRA-123): message  OR  type: JIRA-123 message
REGEX="^(${TYPES})(\([A-Z]+-[0-9]+\))?: .+|^(${TYPES}): [A-Z]+-[0-9]+ .+"

if ! echo "$commit_message" | grep -qE "$REGEX"; then
	echo "./husky/commit-msg: Aborting commit. Message must include a type and Jira ticket." >&2
	echo "Valid examples:" >&2
	echo "  - feat(GXM-123): add authentication logic" >&2
	echo "  - fix(DEV-456): correct login state" >&2
	echo "  - chore(OPS-789): update dependencies" >&2
	echo "Alternative form:" >&2
	echo "  - feat: GXM-123 add authentication logic" >&2
	echo "Allowed types: feat, fix, chore, docs, style, refactor, perf, test, build, ci, revert, infra, release, migration" >&2
	exit 1
fi

# Max length 100 chars
if ! echo "$commit_message" | grep -qE '^.{1,100}$'; then
	echo "./husky/commit-msg: Aborting commit. Your commit message is too long (maximum 100 characters)." >&2
	exit 1
fi
```

**Commit Message Format:**

- `feat(PROJ-123): add new feature`
- `fix(BUG-456): resolve issue with authentication`
- `chore: MAINT-789 update dependencies`

## Code Quality & Formatting

### Biome Configuration (`/biome.json`)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noConsole": "warn",
        "noArrayIndexKey": "off",
        "noDocumentCookie": "off"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "warn",
        "noNestedComponentDefinitions": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "semicolons": "asNeeded",
      "trailingCommas": "es5"
    }
  }
}
```

### Lint-staged Configuration (`/package.json`)

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,css,md}": [
      "biome check --fix --unsafe",
      "pnpm run spell:staged"
    ]
  }
}
```

**What happens on staged files:**

1. **Biome formats and fixes** code issues
2. **Spell check** runs on the specific files
3. **Auto-stages** any fixes made

### Available Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "biome lint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage",
    "format": "biome format . --write && biome check . --write --unsafe",
    "format:check": "biome check .",
    "lint:biome": "biome lint .",
    "lint:biome:fix": "biome lint . --apply",
    "spell": "cspell \"**/*.{ts,tsx,js,jsx,json,md,txt,html,css,scss,less}\" --no-progress --show-context --show-suggestions",
    "spell:check": "cspell \"**/*.{ts,tsx,js,jsx,json,md,txt,html,css,scss,less}\" --no-progress",
    "spell:staged": "cspell --no-progress --show-context",
    "prepare": "husky"
  }
}
```

## Testing Infrastructure

### Vitest Configuration (`/vitest.config.ts`)

```typescript
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['ess-frontend-ref-for-biome-lintstaged-husky-cspell/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'src/components/ui/**', // shadcn/ui components
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**',
        '**/__tests__/**',
      ],
      thresholds: {
        global: { branches: 80, functions: 60, lines: 30, statements: 30 },
        'src/lib/**': {
          branches: 85,
          functions: 60,
          lines: 65,
          statements: 65,
        },
        'src/hooks/**': {
          branches: 100,
          functions: 70,
          lines: 80,
          statements: 80,
        },
        'src/components/errors/**': {
          branches: 75,
          functions: 100,
          lines: 85,
          statements: 85,
        },
      },
    },
  },
})
```

### Test Setup (`/src/test/setup.ts`)

```typescript
/// <reference types="vitest/globals" />
// Extend expect with jest-dom matchers
import '@testing-library/jest-dom/vitest'

// Fetch polyfill (JSDOM)
import 'whatwg-fetch'

// Mock window.matchMedia for Sonner toasts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Optional: quiet React Query errors in test output
let errorSpy: ReturnType<typeof vi.spyOn> | undefined
beforeAll(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterAll(() => {
  errorSpy?.mockRestore()
})
```

### Current Test Coverage

- **99 tests** across 10 test files
- **31.9% overall coverage** with high-quality focused testing
- **Focus on critical utilities** (error handling, API, cookies, hooks)
- **Excludes third-party components** (shadcn/ui)
- **HTML coverage reports** in `./coverage/`

#### Coverage by Category:

- **`src/lib/`** - 69.33% (utilities and core logic)
- **`src/hooks/`** - 84.31% (custom React hooks)
- **`src/components/errors/`** - 90.74% (error handling components)

#### Coverage Thresholds (Enforced):

- **Global minimum:** 30% statements, 60% functions, 80% branches
- **Critical utilities (`src/lib/`):** 65% statements, 60% functions, 85% branches
- **Hooks (`src/hooks/`):** 80% statements, 70% functions, 100% branches
- **Error components:** 85% statements, 100% functions, 75% branches

## Spell Checking

### cspell Configuration (`/cspell.json`)

```json
{
  "version": "0.2",
  "language": "en",
  "words": [
    "biome",
    "VITE",
    "vitest",
    "shadcn",
    "lucide",
    "radix",
    "tanstack",
    "tailwindcss",
    "axios",
    "sonner",
    "zod"
  ],
  "ignorePaths": [
    "node_modules/**",
    "dist/**",
    "coverage/**",
    "pnpm-lock.yaml",
    ".husky/**",
    "**/*.svg",
    "**/*.png"
  ],
  "files": [
    "**/*.{ts,tsx,js,jsx,json,md,txt,html,css,scss,less}",
    "!node_modules/**",
    "!dist/**",
    "!coverage/**"
  ],
  "dictionaries": [
    "typescript",
    "node",
    "html",
    "css",
    "bash",
    "en_US",
    "companies",
    "softwareTerms"
  ]
}
```

**Features:**

- **Multi-language support** for code, docs, and config files
- **Smart ignore patterns** for imports, URLs, and code blocks
- **Custom word lists** for project-specific terminology
- **Test file overrides** for testing vocabulary

## Configuration Files

### Primary Configuration

- **`/biome.json`** - Biome linting and formatting rules
- **`/cspell.json`** - Spell checking configuration
- **`/vitest.config.ts`** - Testing framework setup
- **`/package.json`** - Scripts and lint-staged configuration

### Git Hooks

- **`/.husky/pre-commit`** - Quality gates before commit
- **`/.husky/pre-push`** - Additional validation before push
- **`/.husky/commit-msg`** - Commit message format enforcement

### Ignore Files

- **`/.biomeignore`** - Files excluded from Biome processing
- **`/.gitignore`** - Standard git ignore patterns

### TypeScript Configuration

- **`/tsconfig.json`** - Main TypeScript configuration
- **`/tsconfig.app.json`** - Application-specific settings
- **`/tsconfig.node.json`** - Node.js tooling settings

### Build & Development

- **`/vite.config.ts`** - Vite build configuration
- **`/package.json`** - Dependencies and scripts

## Developer Workflow

### Daily Development

1. **Start development server:**

   ```bash
   pnpm dev
   ```

2. **Make changes** with real-time linting feedback in IDE

3. **Commit changes** (automatic quality checks run):

   ```bash
   git add .
   git commit -m "feat(PROJ-123): add new feature"
   ```

4. **Push changes** (additional validation):
   ```bash
   git push
   ```

### Code Quality Commands

```bash
# Format code
pnpm format

# Check formatting without fixing
pnpm format:check

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:biome:fix

# Check spelling
pnpm spell

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm coverage
```

### What Happens Automatically

#### On File Save (in IDE):

- **Biome formats** the file
- **Shows linting errors** in real-time

#### On Git Commit:

1. **Biome fixes** formatting and auto-fixable issues
2. **Spell check** runs on changed files
3. **Tests execute** to prevent regressions
4. **Build validates** TypeScript compilation
5. **Commit message** is validated for format

#### On Git Push:

1. **Full format check** across entire codebase
2. **Complete spell check** on all files
3. **Full test suite** execution
4. **Complete build** validation

## Commit Message Conventions

### Required Format

```
type(TICKET-123): description
```

### Allowed Types

- **feat** - New features
- **fix** - Bug fixes
- **chore** - Maintenance tasks
- **docs** - Documentation changes
- **style** - Code style changes
- **refactor** - Code refactoring
- **perf** - Performance improvements
- **test** - Test additions/changes
- **build** - Build system changes
- **ci** - CI/CD changes
- **revert** - Reverting changes
- **infra** - Infrastructure changes
- **release** - Release preparation
- **migration** - Data/code migrations

### Examples

```bash
feat(AUTH-123): add user authentication
fix(BUG-456): resolve memory leak in component
chore(MAINT-789): update dependencies
docs: GUIDE-101 add API documentation
```

## Error Handling Standards

### Centralized Error System

- **Consistent error classification** (network, validation, client, server, unknown)
- **Reusable error components** with proper UI/UX
- **Type-safe error handling** with TypeScript
- **Automatic retry logic** based on error type

### Usage Pattern

```typescript
import { ErrorDisplay, useQueryErrorHandler } from '@/components/errors'

const { getErrorInfo } = useQueryErrorHandler()
const errorInfo = getErrorInfo(error)

return errorInfo ? <ErrorDisplay error={errorInfo} onRetry={refetch} /> : null
```

## Feature Development Standards

### Required Stack for Features

- **React Hook Form** + **Zod** for form handling and validation
- **React Query** for server state management and caching
- **shadcn/ui** for consistent UI components
- **Centralized error handling** for all API calls

### Feature Structure

```
src/features/[feature-name]/
├── [Feature]Form.tsx     # Forms with validation
├── [Feature]List.tsx     # Data fetching and display
├── [Feature]Card.tsx     # Individual item components
├── types.ts             # Feature-specific types
├── api.ts               # Feature API functions
├── hooks.ts             # Feature-specific hooks
└── index.ts             # Feature exports
```

### Example Feature Implementation

The repository includes a complete example feature in `src/features/example/` that demonstrates all required patterns.

### Form Pattern (Required)

```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

export function ExampleForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { username: '' },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Use React Query mutation for API calls
    toast.success('Form submitted successfully!')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Setting Up in Another TypeScript Project

### 1. Install Dependencies

```bash
# Core development dependencies
pnpm add -D @biomejs/biome husky lint-staged cspell vitest @vitest/coverage-v8

# Testing dependencies (for React projects)
pnpm add -D @testing-library/jest-dom @testing-library/react @testing-library/user-event jsdom whatwg-fetch

# TypeScript and build tools
pnpm add -D typescript @types/node
```

### 2. Copy Configuration Files

Copy these files to your new project:

#### Essential Files:

- **`biome.json`** - Biome configuration
- **`cspell.json`** - Spell checking setup
- **`vitest.config.ts`** - Testing configuration (adapt paths as needed)

#### Git Hooks:

- **`.husky/pre-commit`** - Pre-commit quality gates
- **`.husky/pre-push`** - Pre-push validation
- **`.husky/commit-msg`** - Commit message validation

#### Optional:

- **`.biomeignore`** - Files to exclude from Biome
- **`src/test/setup.ts`** - Test environment setup

### 3. Update package.json

Add these scripts and configuration:

```json
{
  "scripts": {
    "lint": "biome lint .",
    "format": "biome format . --write && biome check . --write --unsafe",
    "format:check": "biome check .",
    "spell": "cspell \"**/*.{ts,tsx,js,jsx,json,md,txt}\" --no-progress --show-context --show-suggestions",
    "spell:check": "cspell \"**/*.{ts,tsx,js,jsx,json,md,txt}\" --no-progress",
    "spell:staged": "cspell --no-progress --show-context",
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,css,md}": [
      "biome check --fix --unsafe",
      "pnpm run spell:staged"
    ]
  }
}
```

### 4. Initialize Husky

```bash
# Install dependencies
pnpm install

# Husky should auto-initialize via the prepare script
# If not, run manually:
npx husky install

# Make hooks executable
chmod +x .husky/pre-commit .husky/pre-push .husky/commit-msg
```

### 5. Customize for Your Project

#### Update cspell.json:

- Add project-specific words to the `words` array
- Adjust file patterns in `files` array
- Modify ignore patterns as needed

#### Update biome.json:

- Adjust linting rules for your coding standards
- Modify file includes/excludes
- Customize formatting preferences

#### Update commit-msg hook:

- Change JIRA ticket pattern to match your system
- Adjust allowed commit types
- Modify message length limits

### 6. Verification

Test the setup works:

```bash
# Test formatting
pnpm format

# Test linting
pnpm lint

# Test spelling
pnpm spell:check

# Test git hooks
git add .
git commit -m "test: SETUP-001 verify development workflow"
```

## IDE Integration

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "cSpell.enabled": true
}
```

### Recommended Extensions

- **Biome** - `biomejs.biome`
- **Code Spell Checker** - `streetsidesoftware.code-spell-checker`

## Troubleshooting

### Common Issues

1. **Husky hooks not running:**

   ```bash
   npx husky install
   chmod +x .husky/*
   ```

2. **Biome not formatting:**

   - Check `.biomeignore` file
   - Verify file is included in `biome.json`

3. **Tests failing on commit:**

   ```bash
   pnpm test
   # Fix failing tests before committing
   ```

4. **Spell check errors:**
   ```bash
   pnpm spell
   # Add words to cspell.json or fix typos
   ```

## Benefits

### For Development Teams

- **Consistent code style** across all developers
- **Automatic quality enforcement** prevents bad commits
- **Fast feedback loops** with real-time linting
- **Professional git history** with conventional commits

### For Project Maintenance

- **Reduced code review time** (formatting is automated)
- **Higher code quality** through automated testing
- **Better debugging** with consistent error handling
- **Documentation quality** through spell checking

### For CI/CD

- **Fewer pipeline failures** due to local quality gates
- **Faster builds** with pre-validated code
- **Consistent environments** between local and CI

This setup provides enterprise-grade development experience that scales across teams and projects! 🚀
