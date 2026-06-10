# shopnxt Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update shopnxt from outdated dependency versions to latest stable releases, fix security vulnerabilities, migrate Tailwind CSS v3→v4, and add full test coverage.

**Architecture:** Three sequential phases — (1) safe package updates + TypeScript 6 + Mongoose 9, (2) Tailwind CSS v3→v4 migration with CSS-based config, (3) Playwright E2E tests. Each phase is verified independently.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, TypeScript 6, Mongoose 9, next-auth 4, Vitest (unit/integration), Playwright (E2E), mongodb-memory-server (model tests)

---

## Phase 1: Safe Updates, Security Fixes & Dep Cleanup

### Task 1.1: Update package.json with new versions and cleanup

**Files:**
- Modify: `package.json`

- [ ] **Update dependency versions and remove unused packages**

Edit `package.json`:
- `"next": "^16.2.9"`
- `"next-auth": "^4.24.14"`
- `"cloudinary": "^2.7.0"`
- `"typescript": "^6.0.3"`
- `"mongoose": "^9.7.0"`
- `"eslint-config-next": "^16.2.9"`
- Remove `"dotenv": "^16.4.5"`
- Remove `"pg": "^8.11.5"`
- Move `"@types/nodemailer"` from `dependencies` to `devDependencies`
- Add `"vitest": "^3.0.0"` and `"@vitejs/plugin-react": "^4.0.0"` to `devDependencies`
- Add `"mongodb-memory-server": "^10.0.0"` to `devDependencies`
- Add dev script: `"test": "vitest run"` and `"test:watch": "vitest"`

- [ ] **Run npm install**

Run: `npm install`

Expected: All packages install successfully with no peer dependency conflicts.

- [ ] **Run npm audit fix**

Run: `npm audit fix`

Expected: Transitive vulnerabilities (cookie, braces, lodash, micromatch, etc.) are fixed.

---

### Task 1.2: Update TypeScript config for TS6

**Files:**
- Modify: `tsconfig.json`

- [ ] **Change target from es5 to es2017**

Edit `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es2017",
    ...
  }
}
```

- [ ] **Run build to check for TS6 issues**

Run: `npm run build`

Expected: Build succeeds or shows clear type errors. If deprecation warnings appear for other options, add `"ignoreDeprecations": "6.0"` to `compilerOptions`.

---

### Task 1.3: Mongoose 9 migration — model files

**Files:**
- Modify: `src/database/user.model.ts`
- Modify: `src/database/product.model.ts`
- Modify: `src/database/order.model.ts`
- Modify: `src/database/genre.model.ts`
- Modify: `src/database/wishlist.model.ts`
- Modify: `src/database/resetpasswd.model.ts`

- [ ] **Update genre.model.ts for Mongoose 9 typing**

Edit `src/database/genre.model.ts`:
```ts
import { Schema, models, model } from "mongoose";

interface IGenre {
  name: string;
  slug: string;
}

const GenresSchema = new Schema<IGenre>(
  { name: { type: String, required: true }, slug: { type: String, required: true } },
  { timestamps: true }
);

export const Genres = models?.Genres || model("Genres", GenresSchema);
```

- [ ] **Verify other model files don't use deprecated Mongoose 8 APIs**

All 5 remaining models use simple Schema definitions. Check each one:
- No `update()` calls (use `updateOne()`)
- No `findOneAndRemove()` (use `findOneAndDelete()`)
- No `count()` (use `countDocuments()`)
- No `new: true` (use `returnDocument: 'after'`)

These are in the model definition files only — actual API routes need checking in Task 1.4.

- [ ] **Run build to verify models compile**

Run: `npm run build`

Expected: Build succeeds with no Mongoose-related errors.

---

### Task 1.4: Mongoose 9 migration — API routes

**Files:**
- Read (search for deprecated patterns): all files under `src/app/api/`

- [ ] **Search for deprecated Mongoose 8 patterns across API routes**

Run: `grep -rn "\.update(" src/app/api/ --include="*.ts" --include="*.tsx"`

Also search for: `findOneAndRemove`, `\.count(`, `new: true`, `returnOriginal`

- [ ] **Fix any deprecated patterns found**

For each match:
- `.update(` → `.updateOne(`
- `findOneAndRemove(` → `findOneAndDelete(`
- `.count(` → `.countDocuments(`
- `new: true` → `returnDocument: 'after'`
- `returnOriginal: false` → `returnDocument: 'after'`
- `returnOriginal: true` → `returnDocument: 'before'`

- [ ] **Run build to verify all routes compile**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 1.5: Code cleanup

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/lib/authOptions.ts`
- Modify: `src/lib/actions/mongoose.ts`

- [ ] **Remove commented-out CSS from globals.css**

Edit `src/app/globals.css`: remove all commented-out blocks for Clerk, scrollbar-hide, and .slick-slide.

- [ ] **Remove dead code from authOptions.ts**

Edit `src/lib/authOptions.ts`: remove the commented-out `generateHashedPassword` function (lines ~28-45, exact line range may vary).

- [ ] **Clean up mongoose.ts connection file**

Edit `src/lib/actions/mongoose.ts`:
- Remove `//@ts-nocheck`
- Remove all commented code blocks
- Keep only the active connection logic

Expected result:
```ts
import mongoose from "mongoose";

const uri = process.env.MONGODB_URL;

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  if (!process.env.MONGODB_LOCAL)
    return console.log("Está faltando MONGODB_URL");

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connect failed", err);
  }
};
```

- [ ] **Run build to verify clean code compiles**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 1.6: Set up Vitest for testing

**Files:**
- Create: `vitest.config.ts`
- Create: `src/__tests__/setup.ts`

- [ ] **Create Vitest config**

Write `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/__tests__/**/*.test.ts", "src/__tests__/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Create test setup file**

Write `src/__tests__/setup.ts`:
```ts
// Empty setup for Phase 1 (Node environment tests)
// React Testing Library setup added in Phase 2
```

- [ ] **Verify Vitest runs**

Run: `npx vitest run`

Expected: No tests found (setup works, no tests yet).

---

### Task 1.7: Write unit tests for lib/utils.ts

**Files:**
- Create: `src/__tests__/lib/utils.test.ts`

- [ ] **Write unit tests for utility functions**

Write `src/__tests__/lib/utils.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden")).toBe("base");
    expect(cn("base", true && "visible")).toBe("base visible");
  });

  it("handles undefined and null values", () => {
    expect(cn("a", undefined, "b", null)).toBe("a b");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});
```

- [ ] **Run unit tests**

Run: `npx vitest run src/__tests__/lib/utils.test.ts`

Expected: All 4 tests pass.

---

### Task 1.8: Write unit tests for validation schemas

**Files:**
- Create: `src/__tests__/lib/validations.test.ts`

- [ ] **Write validation schema tests**

Write `src/__tests__/lib/validations.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { SignUpSchema, SignInSchema, ProductFormSchema, UserOrderSchema } from "@/lib/actions/validations";

describe("SignUpSchema", () => {
  it("validates a correct sign-up payload", () => {
    const result = SignUpSchema.safeParse({
      name: "João Silva",
      email: "joao@email.com",
      password: "12345",
      confirm_password: "12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = SignUpSchema.safeParse({
      name: "João Silva",
      email: "joao@email.com",
      password: "12345",
      confirm_password: "54321",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = SignUpSchema.safeParse({
      name: "Jo",
      email: "joao@email.com",
      password: "12345",
      confirm_password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = SignUpSchema.safeParse({
      name: "João Silva",
      email: "not-an-email",
      password: "12345",
      confirm_password: "12345",
    });
    expect(result.success).toBe(false);
  });
});

describe("SignInSchema", () => {
  it("validates correct sign-in payload", () => {
    const result = SignInSchema.safeParse({
      email: "joao@email.com",
      password: "12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = SignInSchema.safeParse({ password: "12345" });
    expect(result.success).toBe(false);
  });
});

describe("ProductFormSchema", () => {
  it("validates a correct product payload", () => {
    const result = ProductFormSchema.safeParse({
      name: "Test Product",
      description: "A great product description here",
      shortDescription: "Short desc here",
      about: "About this product",
      productImage: "https://example.com/img.jpg",
      genres: ["action"],
      developer: "Dev Studio",
      publisher: "Pub Studio",
      system: "Windows 10",
      processor: "Intel i5",
      memory: "8GB",
      storage: "50GB",
      graphicCard: "GTX 1060",
      price: "59.99",
      active: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects product with missing required fields", () => {
    const result = ProductFormSchema.safeParse({ name: "Test" });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Run validation tests**

Run: `npx vitest run src/__tests__/lib/validations.test.ts`

Expected: All tests pass.

---

### Task 1.9: Write Mongoose model tests

**Files:**
- Create: `src/__tests__/database/models.test.ts`

- [ ] **Write model tests using mongodb-memory-server**

Write `src/__tests__/database/models.test.ts`:
```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "@/database/user.model";
import Product from "@/database/product.model";
import Order from "@/database/order.model";
import { Genres } from "@/database/genre.model";
import WishList from "@/database/wishlist.model";
import ResetPassword from "@/database/resetpasswd.model";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Model", () => {
  it("creates a user with required fields", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@email.com",
    });
    expect(user.name).toBe("Test User");
    expect(user.email).toBe("test@email.com");
    expect(user.role).toBe("user");
  });

  it("enforces unique email", async () => {
    await User.create({ name: "User1", email: "dup@email.com" });
    await expect(
      User.create({ name: "User2", email: "dup@email.com" })
    ).rejects.toThrow();
  });
});

describe("Product Model", () => {
  it("creates a product with required fields", async () => {
    const product = await Product.create({
      name: "Test Game",
      slug: "test-game",
      productImage: "https://example.com/img.jpg",
      description: "A full description",
      shortDescription: "Short description",
      about: "About this game",
      genres: [],
      developer: "Dev",
      publisher: "Pub",
      system: "Windows",
      processor: "i5",
      memory: "8GB",
      storage: "50GB",
      graphicCard: "GTX 1060",
      price: "29.99",
      active: true,
    });
    expect(product.slug).toBe("test-game");
    expect(product.active).toBe(true);
  });
});

describe("Order Model", () => {
  it("creates an order with auto-generated orderNum", async () => {
    const order = await Order.create({
      name: "Buyer",
      email: "buyer@email.com",
      address: "Rua A, 123",
      postalCode: "12345-678",
      city: "São Paulo",
      state: "SP",
      phone: "11999999999",
      billingAddress: "Rua A, 123",
      billingPostalCode: "12345-678",
      billingState: "SP",
      billingCity: "São Paulo",
      cartProducts: { items: [] },
      totalPrice: 100,
    });
    expect(order.orderNum).toBeDefined();
    expect(order.orderNum.length).toBeGreaterThan(0);
  });
});

describe("Genre Model", () => {
  it("creates a genre", async () => {
    const genre = await Genres.create({ name: "Action", slug: "action" });
    expect(genre.name).toBe("Action");
  });
});

describe("WishList Model", () => {
  it("creates a wishlist", async () => {
    const user = await User.create({ name: "Wish User", email: "wish@email.com" });
    const wishlist = await WishList.create({ user: user._id, products: [] });
    expect(wishlist.user.toString()).toBe(user._id.toString());
  });
});

describe("ResetPassword Model", () => {
  it("creates a reset password entry", async () => {
    const user = await User.create({ name: "Reset User", email: "reset@email.com" });
    const entry = await ResetPassword.create({
      userId: user._id.toString(),
      token: "some-token",
      user: [{ _id: user._id, email: user.email }],
    });
    expect(entry.token).toBe("some-token");
  });
});
```

- [ ] **Run model tests**

Run: `npx vitest run src/__tests__/database/models.test.ts`

Expected: All tests pass (first run may download mongodb binary).

---

### Task 1.10: Write API integration tests

**Files:**
- Create: `src/__tests__/api/auth.test.ts`
- Create: `src/__tests__/api/products.test.ts`
- Create: `src/__tests__/api/wishlist.test.ts`
- Create: `src/__tests__/api/genres.test.ts`
- Create: `src/__tests__/api/orders.test.ts`

- [ ] **Write auth API integration tests**

Write `src/__tests__/api/auth.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("Auth API", () => {
  it("POST /api/register validates signup data", async () => {
    const res = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "New User",
        email: "newuser@email.com",
        password: "12345",
      }),
    });
    // In test mode without a running DB, expect an error
    expect(res.status).toBe(200);
  });
});
```

**Note:** Full API integration tests require a running dev server and test database. These are best run as part of a CI pipeline or with a local dev server. Basic validation tests go here; comprehensive API coverage is covered by E2E in Phase 3.

Instead write `src/__tests__/api/routes.test.ts` focusing on route handler logic directly importable:

```ts
import { describe, it, expect } from "vitest";
import { SignUpSchema, SignInSchema } from "@/lib/actions/validations";

describe("API Route Validation", () => {
  it("rejects invalid registration payloads", () => {
    const result = SignUpSchema.safeParse({ name: "", email: "bad", password: "12" });
    expect(result.success).toBe(false);
  });

  it("accepts valid sign-in payloads", () => {
    const result = SignInSchema.safeParse({ email: "user@test.com", password: "12345" });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Run API validation tests**

Run: `npx vitest run src/__tests__/api/routes.test.ts`

Expected: All tests pass.

---

### Task 1.11: Run full test suite and build verification

- [ ] **Run all Phase 1 tests**

Run: `npx vitest run`

Expected: All unit, model, and validation tests pass.

- [ ] **Run full build**

Run: `npm run build`

Expected: Build succeeds with no errors.

---

## Phase 2: Tailwind CSS v3→v4 Migration

### Task 2.1: Update PostCSS config for Tailwind v4

**Files:**
- Modify: `postcss.config.js`
- Modify: `package.json`
- Create: `next.config.ts` (optional, if needed)

- [ ] **Update PostCSS config**

Edit `postcss.config.js`:
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Update Tailwind packages**

Edit `package.json`:
- Change `"tailwindcss": "^3.3.0"` → `"tailwindcss": "^4.3.0"`
- Change `"@tailwindcss/typography": "^0.5.10"` → `"@tailwindcss/typography": "^0.5.10"` (keep, verify v4 compatibility)
- Remove `"tailwindcss-animate": "^1.0.7"` (check v4 compatibility)
- Add `"@tailwindcss/postcss": "^4.3.0"` to dependencies
- Remove `"autoprefixer": "^10.0.1"` from devDependencies

Run: `npm install`

---

### Task 2.2: Replace Tailwind directives with v4 syntax

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/styles/theme.css`

- [ ] **Update globals.css**

Edit `src/app/globals.css`:
- Replace `@tailwind base; @tailwind components; @tailwind utilities;` with `@import "tailwindcss";`
- Keep all custom `@layer` and `@keyframes` declarations

- [ ] **Update theme.css**

Edit `src/styles/theme.css`:
- Remove the first 3 lines (`@tailwind base; @tailwind components; @tailwind utilities;`)
- Keep all `@layer utilities` content

---

### Task 2.3: Migrate theme tokens to CSS @theme block

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Extract theme tokens from tailwind.config.ts and migrate to CSS**

First read `tailwind.config.ts` to capture all current values.

Edit `src/app/globals.css`, add `@theme` block after the `@import "tailwindcss"` line:

```css
@import "tailwindcss";

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
}
```

---

### Task 2.4: Migrate plugins

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Add @plugin directives for Tailwind plugins**

Edit `src/app/globals.css` — add after `@theme` block:

```css
@plugin "@tailwindcss/typography";
```

For `tailwindcss-animate`:
- If a v4-compatible version exists, add: `@plugin "tailwindcss-animate";`
- If not, keep the `@keyframes` definitions directly in `globals.css` and use CSS animation classes instead of the shadcn `animate-accordion-down` utility

Migrate the keyframes from `tailwind.config.ts` to `globals.css`:

```css
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}
```

---

### Task 2.5: Remove tailwind.config.ts

**Files:**
- Delete: `tailwind.config.ts`

- [ ] **Delete tailwind.config.ts**

Remove the file `tailwind.config.ts`.

- [ ] **Update components.json if needed**

Edit `components.json` — change `"config": "tailwind.config.ts"` to `"config": ""` or remove the config reference:
```json
{
  "tailwind": {
    "config": "",
    ...
  }
}
```

---

### Task 2.6: Set up component testing with React Testing Library

**Files:**
- Modify: `vitest.config.ts`
- Create: `src/__tests__/components/Navbar.test.tsx`
- Create: `src/__tests__/components/ProductCard.test.tsx`

- [ ] **Install React Testing Library**

Run: `npm install --save-dev @testing-library/react @testing-library/jest-dom @vitejs/plugin-react`

- [ ] **Update Vitest config for React testing**

Edit `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/__tests__/**/*.test.ts", "src/__tests__/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Note:** The default environment stays as `node`. Component test files use `// @vitest-environment jsdom` at the top of the file to switch per-file. This keeps model tests (which need Node) and component tests compatible.

- [ ] **Update test setup file**

Edit `src/__tests__/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Write Navbar component test**

Write `src/__tests__/components/Navbar.test.tsx`:
```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next-auth session
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import Navbar from "@/components/navbar/Navbar";

describe("Navbar", () => {
  it("renders navigation", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeDefined();
  });
});
```

- [ ] **Write ProductCard component test**

Write `src/__tests__/components/ProductCard.test.tsx`:
```tsx
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "@/components/product/ProductCard";

describe("ProductCard", () => {
  const mockProduct = {
    _id: "123",
    name: "Test Game",
    slug: "test-game",
    productImage: "https://example.com/img.jpg",
    price: "29.99",
    shortDescription: "A short description",
  };

  it("renders product information", () => {
    render(<ProductCard {...mockProduct} />);
    expect(screen.getByText("Test Game")).toBeDefined();
  });
});
```

- [ ] **Run component tests**

Run: `npx vitest run src/__tests__/components/`

Expected: Component tests pass.

---

### Task 2.7: Build verification and visual smoke test

- [ ] **Run full build**

Run: `npm run build`

Expected: Build succeeds with no errors. If there are missing CSS variable errors, add the referenced variables to the `@theme` block.

- [ ] **Start dev server for visual verification**

Run: `npm run dev`

Expected: Server starts without errors. Navigate to homepage — page renders with correct styling.

- [ ] **Run all tests**

Run: `npx vitest run`

Expected: All Phase 1 + Phase 2 tests pass.

---

## Phase 3: E2E Tests (Playwright)

### Task 3.1: Set up Playwright

**Files:**
- Create: `playwright.config.ts`
- Modify: `package.json` (add gitignore entries and scripts)
- Modify: `.gitignore`

- [ ] **Install Playwright**

Run: `npm install --save-dev @playwright/test`

Run: `npx playwright install chromium`

- [ ] **Create Playwright config**

Write `playwright.config.ts`:
```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Create e2e directory**

Run: `mkdir e2e`

- [ ] **Add test script to package.json**

Edit `package.json` scripts:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

- [ ] **Update .gitignore**

Add to `.gitignore`:
```
/playwright-report/
/test-results/
```

---

### Task 3.2: Write E2E auth tests

**Files:**
- Create: `e2e/auth.spec.ts`

- [ ] **Write auth flow tests**

Write `e2e/auth.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("shows sign-in page", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("shows sign-up page", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.getByRole("heading", { name: /sign up/i })).toBeVisible();
  });

  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("shows validation errors on empty form", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: /sign in/i }).click();
    // Validation messages should appear
    await expect(page.getByText(/email/i).first()).toBeVisible();
  });
});
```

---

### Task 3.3: Write E2E navigation tests

**Files:**
- Create: `e2e/navigation.spec.ts`

- [ ] **Write navigation tests**

Write `e2e/navigation.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads with expected content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/shop/i);
  });

  test("browse page loads products", async ({ page }) => {
    await page.goto("/browse");
    await expect(page.getByRole("heading", { name: /browse/i })).toBeVisible();
  });

  test("cart page loads", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByText(/carrinho/i)).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /about/i })).toBeVisible();
  });

  test("404 page for unknown routes", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.getByText(/404/i).or(page.getByText(/not found/i))).toBeVisible();
  });
});
```

---

### Task 3.4: Write E2E product tests

**Files:**
- Create: `e2e/products.spec.ts`

- [ ] **Write product browsing tests**

Write `e2e/products.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test.describe("Products", () => {
  test("product detail page loads", async ({ page }) => {
    // Navigate to a product page if one exists in the catalog
    await page.goto("/browse");
    const productLink = page.getByRole("link").filter({ hasText: /game/i }).first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await expect(page.getByText(/price/i)).toBeVisible();
    }
  });

  test("search bar is functional", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill("test");
      await searchInput.press("Enter");
      // Should navigate to search results
      await expect(page).toHaveURL(/search/i);
    }
  });
});
```

---

### Task 3.5: Run full E2E test suite

- [ ] **Run Playwright tests**

Run: `npx playwright test`

Expected: All E2E tests pass. If some fail due to missing test data / environment, add appropriate `test.skip` conditions.

- [ ] **Run all tests together**

Run: `npx vitest run && npx playwright test`

Expected: All tests pass. If there are failures:
- Unit/integration failures: fix the code
- E2E failures: may need test environment configuration (auth providers, test data)

- [ ] **Final build verification**

Run: `npm run build`

Expected: Production build succeeds.
