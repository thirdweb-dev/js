import { test, expect } from "@playwright/test";

test("should work", async ({ page }, testInfo) => {
  await page.goto("http://localhost:" + testInfo.config.webServer!.port);

  const connectWalletEl = page.getByText("Connect Wallet");
  await expect(connectWalletEl).toBeVisible();
});
