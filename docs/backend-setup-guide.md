# Backend Development Setup Guide

A step-by-step guide to implement the same development experience (Biome + Spell Checking + Git Hooks + Conventions) in any TypeScript backend project.

## Quick Setup Checklist

- [ ] Install dependencies
- [ ] Copy configuration files
- [ ] Update package.json scripts
- [ ] Initialize git hooks
- [ ] Test the setup
- [ ] Customize for your project

## 1. Install Dependencies

```bash
# Core development tools
pnpm add -D @biomejs/biome husky lint-staged cspell

# Testing (optional but recommended)
pnpm add -D vitest @types/node

# TypeScript (if not already installed)
pnpm add -D typescript @types/node
```

## 2. Configuration Files

### Create `biome.json` (Root Directory)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "includes": ["src/**/*.ts", "src/**/*.js", "*.ts", "*.js", "*.json"],
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
      "trailingCommas": "es5",
      "semicolons": "asNeeded",
      "arrowParentheses": "asNeeded",
      "bracketSameLine": false,
      "bracketSpacing": true
    }
  }
}
```

### Create `cspell.json` (Root Directory)

```json
{
  "version": "0.2",
  "language": "en",
  "words": [
    "biome",
    "vitest",
    "pnpm",
    "fastify",
    "prisma",
    "zod",
    "jsonwebtoken",
    "bcrypt",
    "nodemon",
    "dotenv"
  ],
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
    "**/*.{ts,js,json,md,txt}",
    "!node_modules/**",
    "!dist/**",
    "!build/**",
    "!coverage/**"
  ],
  "enabledLanguageIds": [
    "typescript",
    "javascript",
    "json",
    "jsonc",
    "markdown",
    "text"
  ],
  "allowCompoundWords": true,
  "ignoreCase": false,
  "caseSensitive": false,
  "checkLimit": 500,
  "minWordLength": 4,
  "maxNumberOfProblems": 1000,
  "dictionaries": [
    "typescript",
    "node",
    "bash",
    "en_US",
    "companies",
    "softwareTerms",
    "misc"
  ],
  "languageSettings": [
    {
      "languageId": "typescript,javascript",
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
    }
  ],
  "overrides": [
    {
      "filename": "**/*.test.{ts,js}",
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
    },
    {
      "filename": "**/*.config.{ts,js}",
      "words": ["vite", "vitest", "rollup", "esbuild", "biome"]
    }
  ]
}
```

### Create `.biomeignore` (Root Directory)

```
node_modules/
dist/
build/
coverage/
.husky/
*.lock
*.log
```

## 3. Update package.json

### Add Scripts Section

```json
{
  "scripts": {
    "dev": "your-dev-command",
    "build": "tsc && your-build-command",
    "lint": "biome lint .",
    "format": "biome format . --write && biome check . --write --unsafe",
    "format:check": "biome check .",
    "lint:biome": "biome lint .",
    "lint:biome:fix": "biome lint . --apply",
    "spell": "cspell \"**/*.{ts,js,json,md,txt}\" --no-progress --show-context --show-suggestions",
    "spell:check": "cspell \"**/*.{ts,js,json,md,txt}\" --no-progress",
    "spell:staged": "cspell --no-progress --show-context",
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage",
    "prepare": "husky"
  }
}
```

### Add lint-staged Configuration

```json
{
  "lint-staged": {
    "*.{ts,js,json,md}": ["biome check --fix --unsafe", "pnpm run spell:staged"]
  }
}
```

## 4. Git Hooks Setup

### Create `.husky/pre-commit`

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

### Create `.husky/pre-push`

```bash
#!/bin/sh

pnpm run format:check || {
  echo "\n✖ Pre-push blocked: repository is not formatted per Biome rules."
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
  echo "\n✖ Pre-push blocked: tests failed."
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

### Create `.husky/commit-msg`

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
	echo "  - feat(PROJ-123): add user authentication" >&2
	echo "  - fix(BUG-456): resolve database connection issue" >&2
	echo "  - chore(MAINT-789): update dependencies" >&2
	echo "Alternative form:" >&2
	echo "  - feat: PROJ-123 add user authentication" >&2
	echo "Allowed types: feat, fix, chore, docs, style, refactor, perf, test, build, ci, revert, infra, release, migration" >&2
	exit 1
fi

# Max length 100 chars
if ! echo "$commit_message" | grep -qE '^.{1,100}$'; then
	echo "./husky/commit-msg: Aborting commit. Your commit message is too long (maximum 100 characters)." >&2
	exit 1
fi
```

## 5. Initialize Setup

```bash
# Install all dependencies
pnpm install

# Husky should auto-initialize via prepare script
# If not, run manually:
npx husky install

# Make hooks executable
chmod +x .husky/pre-commit .husky/pre-push .husky/commit-msg
```

## 6. Test the Setup

```bash
# Test formatting
pnpm format

# Test linting
pnpm lint

# Test spell checking
pnpm spell:check

# Test git workflow
git add .
git commit -m "chore(SETUP-001): implement development workflow"
```

## Commit & Branch Conventions

### Commit Message Format

**Required Pattern:**

```
type(TICKET-123): short description
```

**Alternative Pattern:**

```
type: TICKET-123 short description
```

### Commit Types

| Type       | Purpose                  | Example                                      |
| ---------- | ------------------------ | -------------------------------------------- |
| `feat`     | New features             | `feat(AUTH-123): add JWT authentication`     |
| `fix`      | Bug fixes                | `fix(DB-456): resolve connection pool leak`  |
| `chore`    | Maintenance              | `chore(DEPS-789): update dependencies`       |
| `docs`     | Documentation            | `docs(API-101): add endpoint documentation`  |
| `refactor` | Code restructuring       | `refactor(USER-202): extract user service`   |
| `perf`     | Performance improvements | `perf(QUERY-303): optimize database queries` |
| `test`     | Test additions/changes   | `test(UTIL-404): add validation tests`       |
| `build`    | Build system changes     | `build(DOCKER-505): update container config` |
| `ci`       | CI/CD changes            | `ci(DEPLOY-606): add staging pipeline`       |

### Branch Naming

**Recommended patterns:**

```
feature/PROJ-123-short-description
bugfix/BUG-456-fix-memory-leak
hotfix/CRIT-789-security-patch
chore/MAINT-101-update-deps
```

## Development Workflow

### Daily Development

1. **Create feature branch:**

   ```bash
   git checkout -b feature/PROJ-123-add-api-endpoint
   ```

2. **Make changes** with real-time feedback

3. **Commit with proper format:**

   ```bash
   git add .
   git commit -m "feat(PROJ-123): add user registration endpoint"
   ```

4. **Push changes:**
   ```bash
   git push origin feature/PROJ-123-add-api-endpoint
   ```

### What Happens Automatically

#### On Git Commit:

- ✅ **Auto-formats** code with Biome
- ✅ **Fixes linting** issues automatically
- ✅ **Checks spelling** on changed files
- ✅ **Runs tests** to prevent regressions
- ✅ **Validates build** compilation
- ✅ **Enforces commit** message format

#### On Git Push:

- ✅ **Full codebase** format check
- ✅ **Complete spell** check
- ✅ **Full test suite** execution
- ✅ **Build validation**

## IDE Setup

### VS Code Configuration

Create `.vscode/settings.json`:

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

### VS Code Extensions

Create `.vscode/extensions.json`:

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

**Important:** 
- ✅ **Install Biome extension** for VS Code
- ✅ **Disable ESLint extension** to prevent conflicts
- ✅ **Disable Prettier extension** to avoid formatting conflicts

## Customization for Backend Projects

### Update cspell.json Words

Add backend-specific terms:

```json
{
  "words": [
    "fastify",
    "prisma",
    "sequelize",
    "mongodb",
    "postgresql",
    "redis",
    "jsonwebtoken",
    "bcrypt",
    "nodemailer",
    "dotenv",
    "cors",
    "helmet",
    "winston",
    "pino",
    "joi",
    "yup",
    "multer",
    "swagger",
    "openapi"
  ]
}
```

### Adjust Biome Rules for Backend

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noConsole": "off", // Allow console in backend
        "noProcessEnv": "off" // Allow process.env usage
      },
      "style": {
        "noParameterAssign": "off" // Common in middleware
      }
    }
  }
}
```

### Backend-Specific Scripts

Update package.json for backend needs:

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "biome lint .",
    "format": "biome format . --write && biome check . --write --unsafe",
    "format:check": "biome check .",
    "spell": "cspell \"**/*.{ts,js,json,md,txt}\" --no-progress --show-context --show-suggestions",
    "spell:check": "cspell \"**/*.{ts,js,json,md,txt}\" --no-progress",
    "spell:staged": "cspell --no-progress --show-context",
    "test": "vitest run",
    "test:watch": "vitest",
    "prepare": "husky"
  }
}
```

## Testing Setup (Optional)

### Create `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
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
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## Common Backend Patterns

### Environment Variables

```typescript
// src/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
})

export const env = envSchema.parse(process.env)
```

### API Error Handling

```typescript
// src/utils/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    }
  }

  console.error('Unexpected error:', error)
  return {
    message: 'Internal server error',
    statusCode: 500,
  }
}
```

### Request Validation

```typescript
// src/schemas/user.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

export type CreateUserRequest = z.infer<typeof createUserSchema>
```

## Troubleshooting

### Biome Not Working

```bash
# Check Biome configuration
npx biome check --verbose

# Reinstall Biome
pnpm add -D @biomejs/biome --force
```

### Git Hooks Not Running

```bash
# Reinitialize Husky
npx husky install
chmod +x .husky/*

# Check git hooks directory
ls -la .git/hooks/
```

### Spell Check Errors

```bash
# See detailed errors
pnpm spell

# Add words to cspell.json
# Or fix typos in code
```

### Tests Failing on Commit

```bash
# Run tests locally
pnpm test

# Fix issues before committing
# Tests must pass for commit to succeed
```

## Advanced Configuration

### Coverage Thresholds

Add to vitest.config.ts:

```typescript
export default defineConfig({
  test: {
    coverage: {
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
})
```

### Custom Biome Rules

```json
{
  "linter": {
    "rules": {
      "correctness": {
        "noUnusedVariables": "error"
      },
      "style": {
        "useNamingConvention": {
          "level": "error",
          "options": {
            "strictCase": false,
            "conventions": [
              {
                "selector": {
                  "kind": "function"
                },
                "formats": ["camelCase", "PascalCase"]
              }
            ]
          }
        }
      }
    }
  }
}
```

## Integration with Backend Frameworks

### Express.js Example

```typescript
// src/app.ts
import express from 'express'
import { env } from '@/config/env'
import { handleError } from '@/utils/errors'

const app = express()

app.use(express.json())

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorResponse = handleError(err)
  res.status(errorResponse.statusCode).json(errorResponse)
})

export { app }
```

### Fastify Example

```typescript
// src/server.ts
import Fastify from 'fastify'
import { env } from '@/config/env'

const fastify = Fastify({
  logger: env.NODE_ENV === 'development',
})

fastify.setErrorHandler((error, request, reply) => {
  const errorResponse = handleError(error)
  reply.status(errorResponse.statusCode).send(errorResponse)
})

export { fastify }
```

## Summary

This setup provides:

- ✅ **Consistent code formatting** with Biome
- ✅ **Automated linting** with quality rules
- ✅ **Spell checking** across all files
- ✅ **Git hooks** for quality enforcement
- ✅ **Conventional commits** with JIRA integration
- ✅ **Professional workflow** for teams

The same high-quality development experience from frontend projects, adapted for backend TypeScript development! 🚀
