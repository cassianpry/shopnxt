# shopnxt Update & Migration Plan

**Date:** 2026-06-10
**Project:** shopnxt (Next.js e-commerce)

## Overview

Update the shopnxt codebase from outdated dependency versions to latest stable releases, fix security vulnerabilities, and add test coverage. The work is split into three phases: safe updates + security, Tailwind v4 migration, and end-to-end testing.

---

## Phase 1 — Safe Updates, Security Fixes & Dep Cleanup

Goal: bring all dependencies to their latest compatible versions while preserving the existing architecture. All code/config changes are minimal.

### Package Bumps

| Package | From | To | Risk |
|---------|------|----|------|
| `next` | ^16.2.7 | ^16.2.9 | None (patch) |
| `next-auth` | ^4.24.6 | ^4.24.14 | Low (patches) |
| `cloudinary` | ^2.0.0 | ^2.7.0 | Low (fixes GHSA-g4mf) |
| `eslint-config-next` | ^16.2.7 | ^16.2.9 | None |
| `@tanstack/eslint-plugin-query` | ^5.101.0 | latest | None |
| `typescript` | ^5 | ^6.0.3 | Medium (config change) |
| `mongoose` | ^8.1.0 | ^9.7.0 | Medium (API changes) |
| `tailwindcss` | ^3.3.0 | ^4.3.0 | **Phase 2** |

Run `npm audit fix` for all transitive dependency vulnerabilities (cookie, braces, lodash, micromatch, etc.).

### Package Cleanup

- Remove `dotenv` — Next.js has native `.env` support since v9.4
- Move `@types/nodemailer` from `dependencies` to `devDependencies`
- Remove `pg` (Postgres client — unused; project uses Mongoose/MongoDB. Reinstall during Postgres migration when Prisma is set up)
- Keep `moment` for now (replacing it is low priority and would require auditing all usage; remove during Postgres migration)

### TypeScript 5 → 6 Migration

**tsconfig.json changes:**
- `"target": "es5"` → `"es2017"` (es5 is deprecated in TS6, will error in TS7)
- Add `"ignoreDeprecations": "6.0"` if any other deprecated options trigger warnings
- Run `npm run build` and fix any new type errors from stricter checking

Known risks: `lib/authOptions.ts` uses `@ts-ignore` and loose `any` types — these may surface new warnings.

### Mongoose 8 → 9 Migration

Breaking changes in v9:
- `caster` and `casterConstructor` removed → use `embeddedSchemaType` and `Constructor`
- `Document.prototype.updateOne` no longer accepts callbacks → use async/await
- Various deprecated v8 options removed (`new`, `returnOriginal` → `returnDocument`)

The project's 6 models are simple schemas with no complex virtuals or custom types, so migration is straightforward. Check for `findOneAndRemove()`, `count()`, `update()` usage in API routes — these were removed in v8.

Critical: v9 fixes three NoSQL injection CVEs (GHSA-m7xq, GHSA-vg7j, GHSA-wpg9) that affect v8.1.0.

### Code Cleanup

- `src/styles/theme.css`: remove duplicate `@tailwind base/components/utilities` (handled in Phase 2)
- `src/app/globals.css`: remove commented-out CSS (Clerk, scrollbar-hide)
- `src/lib/authOptions.ts`: remove commented-out `generateHashedPassword`
- `src/lib/actions/mongoose.ts`: remove `@ts-nocheck` and dead commented code

### Phase 1 Tests

**Unit tests:**
- `lib/utils.ts` — `cn()` function
- `lib/actions/validations.ts` — Zod schemas (product, user, order validation)
- `lib/authOptions.ts` — helper functions

**API integration tests:**
- All `src/app/api/*` routes: wishlist, auth, products, orders, users
- Test authenticated and unauthenticated access
- Test CRUD operations against test database

**Model tests:**
- Each Mongoose model: instantiate, save, query, update, delete
- Run against a test MongoDB database

---

## Phase 2 — Tailwind CSS v3→v4 Migration

Goal: migrate from Tailwind v3 (config-based) to v4 (CSS-based) without visual regressions.

### PostCSS & Build Config

**postcss.config.js:**
```js
// Before
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// After
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

Remove `autoprefixer` from dependencies — Tailwind v4 handles vendor prefixing automatically.

### CSS Changes

**Replace directives in `globals.css` and `theme.css`:**
```css
/* Before */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* After */
@import "tailwindcss";
```

**Theme tokens:**
Migrate from `tailwind.config.ts` to CSS `@theme` block in `globals.css`:

```css
@theme {
  --color-primary-500: #3b82f6;
  --color-primary-100: #fff1e6;
  --color-dark-100: #000000;
  --color-dark-200: #0f1117;
  --color-dark-300: #151821;
  --color-dark-400: #212734;
  --color-dark-500: #101012;
  --color-light-900: #ffffff;
  --color-light-800: #f4f6f8;
  --color-light-850: #fdfdfd;
  --color-light-700: #dce3f1;
  --color-light-500: #7b8ec8;
  --color-light-400: #858ead;
  --color-accent-blue: #1da1f2;
  --font-family-inter: var(--font-inter);
  --font-family-space-grotesk: var(--font-space-grotesk);
  --shadow-light-100: 0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px;
  --shadow-light-200: 10px 10px 20px 0px rgba(218, 213, 213, 0.10);
  --shadow-light-300: -10px 10px 20px 0px rgba(218, 213, 213, 0.10);
  --shadow-dark-100: 0px 2px 10px 0px rgba(46, 52, 56, 0.10);
  --shadow-dark-200: 2px 0px 20px 0px rgba(39, 36, 36, 0.04);
  --breakpoint-xs: 420px;
  --breakpoint-3xl: 1639px;
  /* keyframes omitted for brevity — kept in globals.css */
}
```

### Plugins

- `@tailwindcss/typography` → `@plugin "@tailwindcss/typography"` in CSS
- `tailwindcss-animate` — check v4 compatibility. If no v4-compatible version exists, migrate its `@keyframes` to native CSS `@keyframes` in `globals.css` and use the CSS `animate-*` utility classes directly

### @apply Classes

All existing `@apply` classes in `theme.css` reference custom color names (`bg-light-900`, `text-dark-500`) — these continue to work in v4 if defined as `@theme` CSS variables. No changes needed to the utility classes themselves.

### Shadcn Components

`components.json` references `tailwind.config.ts` — update the `tailwind.config` path, or remove if shadcn v4 handles CSS-based config natively.

### Phase 2 Tests

**Component tests:**
- Render key components: Navbar, ProductCard, ProductForm, dashboard widgets, auth forms
- Verify className-based styling still resolves correctly
- Test dark mode toggle renders with correct classes

**Visual smoke tests (via Playwright or simple page renders):**
- Homepage loads without CSS errors
- Product listing/detail pages render correctly
- Cart page renders correctly
- Dashboard pages render correctly
- Auth pages render correctly
- Mobile/responsive layout adjustments work

---

## Phase 3 — E2E Tests (Playwright)

Goal: full end-to-end test coverage of critical user flows.

### Setup

- Install `@playwright/test` and browser binaries
- Configure Playwright for Next.js (dev server + test database)
- Add `test:e2e` script to `package.json`

### Test Suites

**Auth flows:**
- Sign-up with email/password
- Sign-in with credentials (valid + invalid)
- Google/GitHub OAuth flow (mock OAuth responses in Playwright; avoid requiring real provider credentials)
- Protected route redirects when unauthenticated
- Session persistence across page reloads
- Sign-out clears session

**Cart flows:**
- Add product to cart
- Update quantity
- Remove product
- Cart persists across page navigation
- Checkout flow (address, payment fields)

**Admin flows:**
- Product: create, edit, delete
- Order: view list, update status
- User: view list, change role

**Navigation & browsing:**
- Search bar returns results
- Category/genre filtering
- Pagination works
- Product detail page renders correctly

**Error & edge cases:**
- Invalid login shows error
- Expired session redirects to login
- 404 page for unknown routes
- Empty states (no products, empty cart)

### CI Integration

Add `"test:e2e": "playwright test"` script to `package.json`. If CI is configured later, add `npx playwright test` to the CI pipeline.

---

## Execution Order

```
Phase 1 (safe updates + security + tests)
  ├── Package bumps & npm audit fix
  ├── TypeScript 6 migration
  ├── Mongoose 9 migration
  ├── Code cleanup
  ├── Write unit + API + model tests
  └── Verify: npm run build, all tests pass

Phase 2 (Tailwind v4 + tests)
  ├── PostCSS and CSS directive updates
  ├── Migrate theme tokens to @theme block
  ├── Plugin migration (typography, animate)
  ├── Remove tailwind.config.ts
  ├── Verify: visual smoke tests pass
  ├── Write component tests
  └── Verify: npm run build, all tests pass

Phase 3 (E2E tests)
  ├── Install & configure Playwright
  ├── Write auth, cart, admin, navigation test suites
  ├── Verify: all E2E tests pass
  └── Add test:e2e script
```

## Deferred (future scope)

- Auth changes
- Postgres migration with Prisma
- New UI redesign
