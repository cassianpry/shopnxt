import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads with expected content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/descobrir/i).first()).toBeVisible();
  });

  test("browse page loads products", async ({ page }) => {
    await page.goto("/browse");
    await expect(page.getByText(/navegar/i).first()).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: /jogos digitais/i })
    ).toBeVisible();
  });

  test("404 page for unknown routes", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(
      page.getByText(/404/i).or(page.getByText(/not found/i))
    ).toBeVisible();
  });
});
