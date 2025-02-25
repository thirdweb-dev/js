import { expect, test } from "@playwright/test";
import { getBaseURL } from "./setup";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(`${getBaseURL(baseURL)}/thirdweb.eth`);
});

test.describe("Publisher Page", () => {
  test("thirdweb.eth", async ({ page }) => {
    // Expect the page to have the correct title.
    expect(await page.locator("h1").textContent()).toBe("thirdweb.eth");
    expect(await page.locator("h2").nth(1).textContent()).toBe(
      "Published contracts",
    );
    // first h2 header, then 10 elements in first table -> should be 12th
    expect(await page.locator("h2").nth(12).textContent()).toBe(
      "Deployed contracts",
    );

    // 13 h2 headers to start
    expect((await page.locator("h2").all()).length).toBe(13);

    const publishedContractsShowMoreButton = page
      .locator("text=Show more")
      .first();
    await publishedContractsShowMoreButton.click();
    // should load 10 more elements
    expect((await page.locator("h2").all()).length).toBe(23);
  });
});
