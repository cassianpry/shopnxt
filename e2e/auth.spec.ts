import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("shows sign-in page", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(
      page.getByRole("heading", { name: /acesso do cliente/i })
    ).toBeVisible();
  });

  test("shows sign-up page", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(
      page.getByRole("heading", { name: /criar seu cadastro/i })
    ).toBeVisible();
  });

  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("shows validation errors on empty form", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: /acessar a sua conta/i }).click();
    await expect(page.getByText(/precisa ser preenchido/i).first()).toBeVisible();
  });
});
