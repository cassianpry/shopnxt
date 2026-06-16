import { test, expect } from "@playwright/test";

test.describe("Wishlist Flow", () => {
  test("1. non-logged user clicking wishlist is redirected to sign-in", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const wishlistButton = page.getByRole("button", { name: /Lista de desejos/i }).first();
    await wishlistButton.click();

    await page.waitForURL(/\/sign-in/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: /Acesso do cliente/i })).toBeVisible();
  });

  test("2. register, login, and add game to wishlist", async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: { url: string; status: number }[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("response", (res) => {
      if (res.status() >= 400) {
        failedRequests.push({ url: res.url(), status: res.status() });
      }
    });

    // Register a fresh user (matching wishlist.spec.ts selectors)
    await page.goto("/sign-up");
    const email = `test-wishlist-flow-${Date.now()}@teste.teste`;
    const password = "Teste123456";
    await page.getByLabel("* Nome completo").fill("Test User");
    await page.getByLabel("* E-mail").fill(email);
    await page.locator('[name="password"]').fill(password);
    await page.locator('[name="confirm_password"]').fill(password);
    await page.getByRole("button", { name: /Criar cadastro/i }).click();

    // After registration, user is redirected to /sign-in
    await page.waitForURL("/sign-in", { timeout: 15000 });
    await page.waitForLoadState("networkidle", { timeout: 10000 });

    // Login with the newly registered user
    await page.getByLabel("* E-mail").fill(email);
    await page.getByLabel("* Senha").fill(password);
    await page.getByRole("button", { name: /Acessar a sua conta/i }).click();
    await page.waitForURL("/", { timeout: 10000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Now add game to wishlist
    const wishlistButton = page.getByRole("button", { name: /Lista de desejos/i }).first();
    await expect(wishlistButton).toBeVisible({ timeout: 5000 });
    await wishlistButton.click();
    await page.waitForTimeout(2000);

    await page.getByRole("menuitem", { name: /Olá,/i }).first().click();
    await page.waitForTimeout(500);

    await page.getByRole("menuitem", { name: "Lista de desejos" }).click();
    await page.waitForURL(/\/profile\/.*\/wishlist/, { timeout: 15000 });
    await page.waitForLoadState("networkidle", { timeout: 10000 });

    await expect(page.getByRole("heading", { name: /Lista de desejos/i })).toBeVisible({ timeout: 5000 });

    await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));

    const pageContent = await page.textContent("main");
    const has403 = pageContent?.includes("403") || pageContent?.includes("não autorizado") || pageContent?.includes("Unauthorized");

    expect(has403).toBe(false);
    console.log("Failed requests:", JSON.stringify(failedRequests, null, 2));
    expect(consoleErrors.filter((e) => e.includes("403") || e.includes("401") || e.includes("wishlist"))).toEqual([]);
  });
});
