import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(baseURL || "/");
});

test.describe("Homepage", () => {
  test("has correct title", async ({ page }) => {
    // Expect a title to be correct.
    await expect(page).toHaveTitle(
      "thirdweb: The complete web3 development platform",
    );
  });
});
