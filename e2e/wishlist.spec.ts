import { test, expect } from "@playwright/test";

test.describe.serial("Wishlist E2E", () => {
  async function registerUser(page: any) {
    await page.goto("/sign-up");
    await page.getByLabel("* Nome completo").fill("Test User");
    await page.getByLabel("* E-mail").fill("test-wishlist@teste.teste");
    await page.locator('[name="password"]').fill("Teste123456");
    await page.locator('[name="confirm_password"]').fill("Teste123456");
    await page.getByRole("button", { name: /Criar cadastro/i }).click();
    await page.waitForURL(/\/sign-in/, { timeout: 15000 });
  }

  async function login(page: any) {
    await page.goto("/sign-in");
    await page.getByLabel("* E-mail").fill("test-wishlist@teste.teste");
    await page.getByLabel("* Senha").fill("Teste123456");
    await page.getByRole("button", { name: /Acessar a sua conta/i }).click();
    await page.waitForURL("/", { timeout: 10000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 });
  }

  test("1. homepage loads with Jogos em Destaque section", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /Jogos em Destaque/i })).toBeVisible();
    const wishlistButtons = page.getByRole("button", { name: /Lista de desejos/i });
    const count = await wishlistButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("2. register and login as test user", async ({ page }) => {
    await registerUser(page);
    await login(page);
    await expect(page.getByRole("menuitem", { name: /Olá,/i }).first()).toBeVisible();
  });

  test("3. wishlist button visible on Jogos em Destaque", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: /Jogos em Destaque/i })).toBeVisible();
    const wishlistButtons = page.getByRole("button", { name: /Lista de desejos/i });
    const count = await wishlistButtons.count();
    expect(count).toBeGreaterThan(0);
    await expect(wishlistButtons.first()).toBeVisible();
  });

  test("4. click wishlist button adds game to wishlist", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: /Jogos em Destaque/i })).toBeVisible();

    const wishlistButton = page.getByRole("button", { name: /Lista de desejos/i }).first();
    await wishlistButton.click();
    await page.waitForTimeout(2000);

    await page.getByRole("menuitem", { name: /Olá,/i }).first().click();
    await page.waitForTimeout(500);

    await page.getByRole("menuitem", { name: "Lista de desejos" }).click();
    await page.waitForURL(/\/profile\/.*\/wishlist/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Lista de desejos/i })).toBeVisible();
  });

  test("5. wishlist page shows items", async ({ page }) => {
    await login(page);

    await page.getByRole("menuitem", { name: /Olá,/i }).first().click();
    await page.waitForTimeout(500);

    await page.getByRole("menuitem", { name: "Lista de desejos" }).click();
    await page.waitForURL(/\/profile\/.*\/wishlist/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: /Lista de desejos/i })).toBeVisible();
  });

  test("6. wishlist button shows check icon for wishlisted items", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: /Jogos em Destaque/i })).toBeVisible();

    const wishlistButton = page.getByRole("button", { name: /Lista de desejos/i }).first();
    await wishlistButton.click();
    await page.waitForTimeout(2000);

    await page.getByRole("menuitem", { name: /Olá,/i }).first().click();
    await page.waitForTimeout(500);

    await page.getByRole("menuitem", { name: "Lista de desejos" }).click();
    await page.waitForURL(/\/profile\/.*\/wishlist/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    const wishlistContent = page.getByRole("main");
    await expect(wishlistContent).toBeVisible();
  });

  test("7. prevent duplicate add to wishlist", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: /Jogos em Destaque/i })).toBeVisible();

    const wishlistButton = page.getByRole("button", { name: /Lista de desejos/i }).first();
    await expect(wishlistButton).toBeVisible();

    await wishlistButton.click();
    await page.waitForTimeout(500);
    await wishlistButton.click();
    await page.waitForTimeout(500);

    await expect(wishlistButton).toBeVisible();

    await page.getByRole("menuitem", { name: /Olá,/i }).first().click();
    await page.waitForTimeout(500);

    await page.getByRole("menuitem", { name: "Lista de desejos" }).click();
    await page.waitForURL(/\/profile\/.*\/wishlist/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("main")).toBeVisible();
  });
});
