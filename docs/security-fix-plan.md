# ShopNXT Security Fix Plan

## Overview

Fix all frontend security breaches, audit-discovered vulnerabilities, and Dependabot alerts in the ShopNXT e-commerce application.

**Source:** Full codebase security audit + GitHub Dependabot alerts (30 open alerts)

---

## Phase 1 — Critical + Package Updates

| # | Task | Files | Priority |
|---|------|-------|----------|
| 1 | **Fix auth middleware** — exclude `/api/auth`, `/api/register`, `/api/forgot-password` from admin-only check | `src/proxy.ts` | 🔴 Critical |
| 2 | **Fix stored XSS** — sanitize with DOMPurify before `html-react-parser` renders product `about` field | `src/components/product/ParseHTML.tsx` | 🔴 Critical |
| 3 | **Remove PCI-DSS fields** — strip `cardNumber`, `expireDate`, `cvv` from checkout form, API route, and order model; add placeholder for future payment provider | `UserCheckoutForm.tsx`, `order/route.ts`, `order.model.ts` | 🔴 Critical |
| 4 | **Server-side Zod validation** — apply existing Zod schemas in all API route handlers; forbid `role` field from client request body | All `app/api/*/route.ts` files | 🔴 Critical |
| 5 | **Update ALL outdated packages** — especially `next` (fixes 16 Dependabot alerts), `tinymce` (3), `mongoose` (1), `multer` (2), `postcss` (1), `brace-expansion`/`braces` (3), `bcrypt`, `zod`, etc. | `package.json` | 🔴 Critical |

### Detailed: Fix auth middleware (in `proxy.ts`)
- Add `matcher` exclusion for `/api/auth/:path*`, `/api/register`, `/api/forgot-password/:path*`
- Change `authorized` callback to allow unauthenticated access to the excluded routes
- Ensure authenticated non-admin users can access product, order, wishlist APIs

### Detailed: Stored XSS fix
- Install `DOMPurify` (`npm install isomorphic-dompurify`)
- In `ParseHTML.tsx:39`, wrap: `parse(DOMPurify.sanitize(data))`
- Also sanitize on write in `ProductForm.tsx`/`product/route.ts`

### Detailed: Server-side validation
- In every `POST`/`PUT` handler, validate `await schema.parse(body)` from Zod
- Explicitly pick allowed fields for update: never spread `data` directly into `$set`
- Use `delete data.role` or use a whitelist of updatable fields

---

## Phase 2 — High Severity + Dependabot-Disclosed Issues

| # | Task | Files | Priority |
|---|------|-------|----------|
| 6 | **Fix IDOR** — add ownership checks to order, user, and wishlist APIs; only admins can view all records | `order/[id]/route.ts`, `user/[id]/route.ts`, `wishlist/[id]/route.ts` | 🟠 High |
| 7 | **Fix password reset** — hash reset token with SHA-256 before DB storage; never return token in API response; fix broken expiration logic | `forgot-password/route.ts`, `forgot-password/[id]/route.ts`, `resetpasswd.model.ts` | 🟠 High |
| 8 | **Strengthen password policy** — min 8 chars, require uppercase + lowercase + number + special character | `lib/actions/validations.ts` | 🟠 High |
| 9 | **Add rate limiting** — on `/api/register`, `/api/auth/*`, `/api/forgot-password/*`; account lockout after 5 failed attempts | New utility + route handlers | 🟠 High |
| 10 | **Sanitize error responses** — never return raw error objects; return `{ error: "Internal server error" }` with server-side logging | All `app/api/*/route.ts` files | 🟠 High |
| 11 | **File upload validation** — client: accept only `image/jpeg|png|webp` ≤5MB; server: validate MIME type & size | `ProductForm.tsx`, `product/upload/route.ts` | 🟠 High |
| 12 | **Minimize JWT payload** — store only `id`, `email`, `role`; look up fresh data server-side | `lib/authOptions.ts` | 🟠 High |
| 13 | **Add CSP + security headers** — `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` | `next.config.js` or middleware | 🟠 High |

---

## Phase 3 — Medium / Low

| # | Task | Files | Priority |
|---|------|-------|----------|
| 14 | **Prevent ReDoS** — escape user input before passing to `$regex` in MongoDB queries | `product/route.ts`, `user/route.ts`, `order/route.ts`, `genre/route.ts` | 🟡 Medium |
| 15 | **Validate localStorage cart** — add Zod schema check when parsing stored cart data | `context/CartContext.tsx` | 🟡 Medium |
| 16 | **Remove `NEXT_PUBLIC_` from TinyMCE key** — proxy through server endpoint instead | `ProductForm.tsx` | ⚪ Low |
| 17 | **Strip `_id` from API responses** — return `id: string` instead of raw MongoDB ObjectId | All response helpers | ⚪ Low |
| 18 | **Add CSRF protection** — SameSite cookies or double-submit cookie pattern | `next.config.js` + middleware | ⚪ Low |

---

## Dependabot Alerts Coverage

| Alert | Package | Fix |
|-------|---------|-----|
| #130, #129 | brace-expansion | Update to latest (via npm audit fix) |
| #128, #127 | multer | Update multer or replace with busboy |
| #126 | @babel/runtime | Update babel deps |
| #125 | braces | Update (transitive dep via micromatch) |
| #124, #123, #122 | tinymce | Update @tinymce/tinymce-react + tinymce |
| #121 | uuid | Already likely transitive; updated via npm audit fix |
| #120-118, #116-103 | next | Update Next.js to latest ^16.x |
| #102 | mongoose | Update mongoose to latest ^9.x |
| #100 | postcss | Update postcss to latest ^8.x |

---

## Execution Order

1. Phase 1 tasks (run in parallel where possible)
2. `npm audit fix` + `npm update` after Phase 1
3. Phase 2 tasks (sequential, auth-related changes first)
4. Phase 3 tasks (lowest priority, can be batched)
5. Run `npm run test` to verify nothing is broken
6. Run `npm run lint` to verify code quality
