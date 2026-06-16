import { test, expect } from "@playwright/test";

test.describe("Products", () => {
  test("browse page loads with product section", async ({ page }) => {
    await page.goto("/browse");
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("search field is present on homepage", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder(/Buscar jogos/i);
    await expect(searchInput.first()).toBeVisible();
  });
});
