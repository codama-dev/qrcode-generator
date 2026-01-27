# TypeScript Project Development Standards Setup

A comprehensive guide to implement professional development standards (Biome + Spell Checking + Git Hooks + Testing) in any TypeScript project.

## Overview

This setup provides enterprise-grade development experience with:

- ✅ **Biome.js** - Fast linting and formatting (replaces ESLint + Prettier)
- ✅ **Husky** - Git hooks for quality enforcement
- ✅ **lint-staged** - Efficient staged file processing
- ✅ **cspell** - Comprehensive spell checking
- ✅ **Vitest** - Modern testing framework
- ✅ **Conventional commits** - Standardized commit format with JIRA integration

## Quick Start

### 1. Install Dependencies

```bash
# Essential development tools
pnpm add -D @biomejs/biome husky lint-staged cspell

# Testing framework (recommended)
pnpm add -D vitest @types/node

# TypeScript (if not already installed)
pnpm add -D typescript

# Additional testing tools (for specific project types)
# For React projects:
pnpm add -D @testing-library/jest-dom @testing-library/react @testing-library/user-event jsdom whatwg-fetch

# For Node.js projects:
pnpm add -D @types/node

# For Express/API projects:
pnpm add -D @types/express supertest

# For libraries:
pnpm add -D @types/jest
```

### 2. Core Configuration Files

#### `biome.json` (Root Directory)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "includes": [
      "src/**/*.ts",
      "src/**/*.tsx",
      "src/**/*.js",
      "src/**/*.jsx",
      "*.ts",
      "*.tsx",
      "*.js",
      "*.jsx",
      "*.json"
    ],
    "ignoreUnknown": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf",
    "formatWithErrors": false
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noConsole": "warn",
        "noEmptyInterface": "off"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "warn"
      },
      "style": {
        "useBlockStatements": "error",
        "noNonNullAssertion": "off",
        "useImportType": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "es5",
      "semicolons": "asNeeded",
      "arrowParentheses": "asNeeded",
      "bracketSameLine": false,
      "bracketSpacing": true
    }
  }
}
```

#### `cspell.json` (Root Directory)

````json
{
  "version": "0.2",
  "language": "en",
  "words": ["biome", "vitest", "pnpm", "typescript", "zod"],
  "flagWords": [],
  "ignorePaths": [
    "node_modules/**",
    "dist/**",
    "build/**",
    "coverage/**",
    "pnpm-lock.yaml",
    "yarn.lock",
    "package-lock.json",
    "*.log",
    "*.lock",
    ".git/**",
    ".husky/**"
  ],
  "files": [
    "**/*.{ts,tsx,js,jsx,json,md,txt,html,css}",
    "!node_modules/**",
    "!dist/**",
    "!build/**",
    "!coverage/**"
  ],
  "enabledLanguageIds": [
    "typescript",
    "typescriptreact",
    "javascript",
    "javascriptreact",
    "json",
    "jsonc",
    "markdown",
    "text",
    "html",
    "css"
  ],
  "allowCompoundWords": true,
  "dictionaries": [
    "typescript",
    "node",
    "html",
    "css",
    "bash",
    "en_US",
    "en-gb",
    "companies",
    "softwareTerms",
    "misc"
  ],
  "languageSettings": [
    {
      "languageId": "typescript,typescriptreact,javascript,javascriptreact",
      "ignoreRegExpList": [
        "/\\b[A-Z]{2,}\\b/g",
        "/\\b\\d+\\b/g",
        "/import\\s+.*\\s+from\\s+['\"].*['\"];?/g",
        "/require\\s*\\(['\"].*['\"]\\)/g"
      ]
    },
    {
      "languageId": "json,jsonc",
      "ignoreRegExpList": ["/\"[^\"]*\":/g", "/\\b\\d+\\b/g"]
    },
    {
      "languageId": "markdown",
      "ignoreRegExpList": [
        "/```[\\s\\S]*?```/g",
        "/`[^`]*`/g",
        "/\\[.*?\\]\\(.*?\\)/g",
        "/https?:\\/\\/[^\\s)]+/g"
      ]
    }
  ],
  "overrides": [
    {
      "filename": "**/*.test.{ts,tsx,js,jsx}",
      "words": [
        "vitest",
        "beforeeach",
        "aftereach",
        "beforeall",
        "afterall",
        "testid",
        "mocks",
        "spyon"
      ]
    }
  ]
}
````

#### `.biomeignore` (Root Directory)

```
node_modules/
dist/
build/
coverage/
.husky/
*.lock
*.log
```

### 3. Package.json Configuration

#### Essential Scripts

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

### 4. Git Hooks

#### `.husky/pre-commit`

```bash
#!/bin/sh

# Run Biome on staged files via lint-staged
pnpm exec lint-staged || {
  echo "\n✖ Pre-commit blocked: lint-staged tasks failed."
  echo "  Biome formatting/linting issues detected."
  echo "  Please stage the auto-fixed files and commit again."
  exit 1
}

# Run tests before allowing the commit (optional - remove if no tests)
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

#### `.husky/pre-push`

```bash
#!/bin/sh

# Full repository format check
pnpm run format:check || {
  echo "\n✖ Pre-push blocked: repository is not formatted per Biome rules."
  echo "  Run 'pnpm format' to apply fixes, commit them, then push again."
  exit 1
}

# Full spell check
pnpm run spell:check || {
  echo "\n✖ Pre-push blocked: spelling errors detected."
  echo "  Run 'pnpm spell' to see errors and suggestions."
  echo "  Fix spelling errors or add words to cspell.json, then push again."
  exit 1
}

# Full test suite (optional - remove if no tests)
pnpm test || {
  echo "\n✖ Pre-push blocked: tests failed."
  echo "  Fix tests locally and push again."
  exit 1
}

# Build validation
pnpm build || {
  echo "\n✖ Pre-push blocked: build failed."
  echo "  Fix type errors/build issues and push again."
  exit 1
}

exit 0
```

#### `.husky/commit-msg`

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

# Pattern: type(TICKET-123): message  OR  type: TICKET-123 message
REGEX="^(${TYPES})(\([A-Z]+-[0-9]+\))?: .+|^(${TYPES}): [A-Z]+-[0-9]+ .+"

if ! echo "$commit_message" | grep -qE "$REGEX"; then
	echo "./husky/commit-msg: Aborting commit. Message must include a type and ticket number." >&2
	echo "Valid examples:" >&2
	echo "  - feat(PROJ-123): add new feature" >&2
	echo "  - fix(BUG-456): resolve issue" >&2
	echo "  - chore(MAINT-789): update dependencies" >&2
	echo "Alternative form:" >&2
	echo "  - feat: PROJ-123 add new feature" >&2
	echo "Allowed types: feat, fix, chore, docs, style, refactor, perf, test, build, ci, revert, infra, release, migration" >&2
	exit 1
fi

# Max length 100 chars
if ! echo "$commit_message" | grep -qE '^.{1,100}$'; then
	echo "./husky/commit-msg: Aborting commit. Your commit message is too long (maximum 100 characters)." >&2
	exit 1
fi
```

## 5. Project-Specific Customizations

### Frontend Projects (React/Vue/Angular)

#### Additional dependencies:

```bash
pnpm add -D @testing-library/jest-dom @testing-library/react @testing-library/user-event jsdom
```

#### Update `biome.json` for JSX:

```json
{
  "files": {
    "includes": [
      "src/**/*.ts",
      "src/**/*.tsx",
      "src/**/*.js",
      "src/**/*.jsx",
      "*.ts",
      "*.tsx",
      "*.js",
      "*.jsx",
      "*.json"
    ]
  },
  "linter": {
    "rules": {
      "a11y": {
        "useSemanticElements": "warn"
      },
      "suspicious": {
        "noArrayIndexKey": "warn"
      }
    }
  }
}
```

#### Update `cspell.json` words:

```json
{
  "words": [
    "react",
    "reactdom",
    "vite",
    "tailwindcss",
    "shadcn",
    "lucide",
    "radix"
  ]
}
```

### Backend Projects (Node.js/Express/Fastify)

#### Update `biome.json` for backend:

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noConsole": "off",
        "noProcessEnv": "off"
      },
      "style": {
        "noParameterAssign": "off"
      }
    }
  }
}
```

#### Update `cspell.json` words:

```json
{
  "words": [
    "fastify",
    "express",
    "prisma",
    "mongodb",
    "postgresql",
    "redis",
    "jsonwebtoken",
    "bcrypt",
    "cors",
    "helmet",
    "dotenv",
    "nodemailer"
  ]
}
```

### Library Projects

#### Update `biome.json` for libraries:

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noConsole": "error"
      },
      "style": {
        "noDefaultExport": "warn"
      }
    }
  }
}
```

#### Update package.json:

```json
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "prepublishOnly": "pnpm build && pnpm test"
  }
}
```

### Monorepo Projects

#### Update `biome.json` for workspace:

```json
{
  "files": {
    "includes": [
      "packages/*/src/**/*.ts",
      "packages/*/src/**/*.tsx",
      "apps/*/src/**/*.ts",
      "apps/*/src/**/*.tsx"
    ]
  }
}
```

## 6. Initialize and Test

### Setup Commands

```bash
# Install dependencies
pnpm install

# Initialize Husky (should happen automatically via prepare script)
npx husky install

# Make hooks executable
chmod +x .husky/pre-commit .husky/pre-push .husky/commit-msg

# Test the setup
pnpm format
pnpm lint
pnpm spell:check
```

### Verification Test

```bash
# Create a test file with intentional issues
echo 'const unused_variable = "test";' > test-file.ts

# Add and commit (should trigger hooks)
git add test-file.ts
git commit -m "test(SETUP-001): verify development workflow"

# Clean up
rm test-file.ts
git reset --soft HEAD~1
```

## 7. Customization Guide

### Custom Spell Check Words

Add project-specific terms to `cspell.json`:

```json
{
  "words": [
    "your-company-name",
    "your-product-name",
    "custom-api-names",
    "domain-specific-terms"
  ]
}
```

### Custom Biome Rules

Adjust linting rules in `biome.json`:

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noConsole": "off", // Allow console.log in development
        "noDebugger": "error" // Disallow debugger statements
      },
      "correctness": {
        "noUnusedVariables": "warn" // Change from error to warning
      },
      "style": {
        "useNamingConvention": {
          "level": "warn",
          "options": {
            "strictCase": false
          }
        }
      }
    }
  }
}
```

### Custom Commit Message Pattern

Modify `.husky/commit-msg` for different ticket systems:

```bash
# For GitHub Issues
REGEX="^(${TYPES})(\(#[0-9]+\))?: .+|^(${TYPES}): #[0-9]+ .+"

# For Linear
REGEX="^(${TYPES})(\([A-Z]+-[0-9]+\))?: .+|^(${TYPES}): [A-Z]+-[0-9]+ .+"

# For Azure DevOps
REGEX="^(${TYPES})(\(AB#[0-9]+\))?: .+|^(${TYPES}): AB#[0-9]+ .+"

# No ticket validation (simple)
REGEX="^(${TYPES}): .+"
```

## 8. IDE Integration

### VS Code Configuration

#### Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "cSpell.enabled": true,
  "cSpell.checkLimit": 500,
  "eslint.enable": false,
  "prettier.enable": false,
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

#### Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "biomejs.biome",
    "streetsidesoftware.code-spell-checker"
  ],
  "unwantedRecommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

**Important:** This configuration:
- ✅ **Enables Biome** as the default formatter
- ✅ **Disables ESLint and Prettier** to avoid conflicts
- ✅ **Recommends required extensions** to team members
- ✅ **Prevents conflicting extensions** from being suggested

### ⚠️ Critical: Disable Conflicting Tools

If your project or IDE has existing ESLint/Prettier setup:

1. **Disable ESLint extension** in VS Code
2. **Disable Prettier extension** in VS Code  
3. **Remove ESLint/Prettier dependencies** from package.json
4. **Delete old config files** (.eslintrc, .prettierrc, etc.)

**Why?** Running both Biome and ESLint/Prettier simultaneously causes:
- ❌ Conflicting formatting rules
- ❌ Performance issues (double processing)
- ❌ Inconsistent code style
- ❌ IDE confusion about which tool to use

## 9. Testing Setup (Optional)

### Basic Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node', // Use 'jsdom' for frontend projects
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '**/*.config.*',
        '**/__tests__/**',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Test Setup File (`src/test/setup.ts`)

```typescript
/// <reference types="vitest/globals" />

// For frontend projects
// import '@testing-library/jest-dom/vitest'
// import 'whatwg-fetch'

// For backend projects
import { beforeAll, afterAll, vi } from 'vitest'

// Mock console for cleaner test output
let consoleSpy: ReturnType<typeof vi.spyOn> | undefined
beforeAll(() => {
  consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterAll(() => {
  consoleSpy?.mockRestore()
})
```

## 10. Common Workflows

### Daily Development

```bash
# Start development
pnpm dev

# Format code
pnpm format

# Check for issues
pnpm lint

# Run tests
pnpm test

# Commit changes (triggers automatic checks)
git add .
git commit -m "feat(PROJ-123): implement new feature"

# Push changes (triggers additional validation)
git push
```

### Continuous Integration

Add to your CI pipeline:

```yaml
# GitHub Actions example
- name: Format Check
  run: pnpm format:check

- name: Lint Check
  run: pnpm lint

- name: Spell Check
  run: pnpm spell:check

- name: Test
  run: pnpm test

- name: Build
  run: pnpm build
```

## 11. Project Type Examples

### Node.js API Project

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### React Frontend Project

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### CLI Tool Project

```json
{
  "scripts": {
    "dev": "tsx src/cli.ts",
    "build": "tsc",
    "start": "node dist/cli.js"
  }
}
```

### npm Library Project

```json
{
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "pnpm build && pnpm test && pnpm lint"
  }
}
```

## 12. Migrating from ESLint/Prettier

### Remove Old Dependencies

```bash
# Remove ESLint and related packages
pnpm remove eslint @eslint/js @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-*

# Remove Prettier and related packages  
pnpm remove prettier @prettier/plugin-*

# Remove related config files
rm eslint.config.js .eslintrc.json .eslintrc.js .eslintignore
rm prettier.config.js .prettierrc .prettierrc.json .prettierignore
```

### Update VS Code Settings

If you have existing VS Code settings, update them:

```json
{
  // Remove these old settings
  // "editor.defaultFormatter": "esbenp.prettier-vscode",
  // "eslint.format.enable": true,
  // "editor.codeActionsOnSave": { "source.fixAll.eslint": true },
  
  // Add these new settings
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "eslint.enable": false,
  "prettier.enable": false
}
```

### Migration Commands

```bash
# Format entire codebase with Biome
pnpm format

# Check for any remaining issues
pnpm lint

# Fix auto-fixable issues
pnpm lint:biome:fix

# Commit the migration
git add .
git commit -m "chore(MIGRATION-001): migrate from ESLint/Prettier to Biome"
```

## 13. Troubleshooting

### Biome Issues

```bash
# Check configuration
npx biome --help

# Verify file inclusion
npx biome check --verbose

# Fix common issues
pnpm add -D @biomejs/biome --force
```

### Husky Issues

```bash
# Reinitialize Husky
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "pnpm exec lint-staged"

# Check hook permissions
ls -la .husky/
chmod +x .husky/*
```

### Spell Check Issues

```bash
# Interactive spell check with suggestions
pnpm spell

# Add words to dictionary
# Edit cspell.json words array

# Check specific files
npx cspell "src/**/*.ts"
```

## 13. Team Guidelines

### For Team Members

1. **Install recommended IDE extensions**
2. **Run `pnpm format` before committing** (or rely on pre-commit hooks)
3. **Use conventional commit format** with ticket numbers
4. **Add new technical terms** to cspell.json
5. **Write tests** for new functionality

### For Project Leads

1. **Customize biome.json** for project coding standards
2. **Update cspell.json** with domain-specific terms
3. **Adjust git hooks** based on project needs
4. **Set coverage thresholds** appropriate for project maturity
5. **Document project-specific patterns** in README

## 14. Advanced Features

### Coverage Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        'src/utils/**': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
})
```

### Pre-commit Hook Variations

#### Minimal (No Tests/Build)

```bash
#!/bin/sh
pnpm exec lint-staged
```

#### With Build Only

```bash
#!/bin/sh
pnpm exec lint-staged || exit 1
pnpm build || exit 1
```

#### Full Validation

```bash
#!/bin/sh
pnpm exec lint-staged || exit 1
pnpm test || exit 1
pnpm build || exit 1
```

## Summary

This setup provides:

- ✅ **Consistent code formatting** across team
- ✅ **Automated quality enforcement** via git hooks
- ✅ **Professional commit standards** with ticket tracking
- ✅ **Spell checking** for documentation and code
- ✅ **Fast linting** with Biome (faster than ESLint)
- ✅ **Flexible configuration** for any TypeScript project

### Benefits

- **Reduces code review time** (formatting is automated)
- **Prevents bad commits** from reaching remote repository
- **Ensures consistent quality** across projects
- **Professional git history** with searchable commit format
- **Scales across teams** and project types

**Total setup time: ~10 minutes for immediate professional development experience!** 🚀
