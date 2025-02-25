import type { Page } from "@playwright/test";

export function getBaseURL(url: string | undefined) {
  if (process.env.ENVIRONMENT_URL) {
    url = process.env.ENVIRONMENT_URL;
  }
  if (!url) {
    url = "https://thirdweb.com/";
  }
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForPageLoad(
  page: Page,
  options: { loadTimeout: number; waitAfterLoad?: number },
) {
  await Promise.race([
    page.waitForLoadState("load"),
    wait(options.loadTimeout),
  ]);

  if (options.waitAfterLoad) {
    await wait(options.waitAfterLoad);
  }
}
