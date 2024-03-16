import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(baseURL ? `${baseURL}/1` : "/1");
});

test.describe("Chain Page", () => {
  test("redirects chain-id to correct slug", async ({ page }) => {
    // Expect the page to have the correct title.
    const pageUrl = page.url();
    expect(pageUrl).toContain("/ethereum");
  });
});
