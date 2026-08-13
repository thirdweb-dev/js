import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getLoginUrl } from "./getLoginPath.js";

describe("getLoginUrl", () => {
  it("appends redirect params including state in redirect mode", () => {
    const url = getLoginUrl({
      authFlow: "link",
      authOption: "google",
      client: TEST_CLIENT,
      mode: "redirect",
      redirectUrl: "https://example.com/app",
      state: "abc123",
    });

    const redirectUrl = decodeURIComponent(url.split("redirectUrl=")[1] ?? "");
    expect(redirectUrl).toContain("walletId=inApp");
    expect(redirectUrl).toContain("authProvider=google");
    expect(redirectUrl).toContain("authFlow=link");
    expect(redirectUrl).toContain("state=abc123");
  });

  it("does not append a redirect url in popup mode", () => {
    const url = getLoginUrl({
      authOption: "google",
      client: TEST_CLIENT,
      mode: "popup",
    });
    expect(url).not.toContain("redirectUrl=");
  });
});
