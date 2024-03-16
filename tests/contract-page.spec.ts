import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(
    baseURL
      ? `${baseURL}/1/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`
      : "/1/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
  );
});

test.describe("Contract Page", () => {
  test("BAYC", async ({ page }) => {
    // give it some time to load
    await wait(10000);
    // Expect the page to have the correct title.
    expect(await page.title()).toBe(
      "BoredApeYachtClub (BAYC) | Ethereum Smart Contract | thirdweb",
    );
    // expect the page to have the correct h1 tag.
    expect(await page.locator("h1").textContent()).toBe("BoredApeYachtClub");

    // find the extensions header
    const nftTabLinkEl = page.locator("a", { hasText: "NFTs" }).first();
    expect(await nftTabLinkEl.textContent()).toBe("NFTs");
  });
});

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
