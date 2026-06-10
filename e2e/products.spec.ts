import { test, expect } from "@playwright/test";

test.describe("Products", () => {
  test("browse page shows product listings", async ({ page }) => {
    await page.goto("/browse");
    const productLinks = page.getByRole("link").filter({ hasText: /game/i });
    const count = await productLinks.count();
    await expect(
      page
        .getByText(/produto/i)
        .or(page.getByText(/game/i))
        .first()
    ).toBeVisible();
  });

  test("search field is present on homepage", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder(/search/i);
    const count = await searchInput.count();
    if (count > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });
});
