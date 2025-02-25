import { expect, test } from "@playwright/test";
import { getBaseURL } from "./setup";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(`${getBaseURL(baseURL)}/1`);
});

test.describe("Chain Page", () => {
  test("redirects chain-id to correct slug", async ({ page }) => {
    // Expect the page to have the correct title.
    const pageUrl = page.url();
    expect(pageUrl).toContain("/ethereum");
  });
});
