import { describe, expect, it } from "vitest";
import { render, waitFor } from "../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { SiteLink } from "./SiteLink.js";

describe("SiteLink", () => {
  it("renders anchor with correct href", () => {
    const testUrl = "https://example.com/";
    const { container } = render(
      <SiteLink client={TEST_CLIENT} href={testUrl}>
        Test Link
      </SiteLink>,
    );

    const anchor = container.querySelector("a");
    expect(anchor).toBeTruthy();
    expect(anchor?.href).toBe(testUrl);
    expect(anchor?.textContent).toBe("Test Link");
  });

  it("throws error if clientId is not provided", () => {
    const testUrl = "https://example.com/";
    expect(() =>
      render(
        // biome-ignore lint/suspicious/noExplicitAny: testing invalid input
        <SiteLink client={{} as any} href={testUrl}>
          Test Link
        </SiteLink>,
      ),
    ).toThrow("The SiteLink client must have a clientId");
  });

  it("adds wallet params to url when wallet is connected", async () => {
    const testUrl = "https://example.com/";
    const { container } = render(
      <SiteLink client={TEST_CLIENT} href={testUrl}>
        Test Link
      </SiteLink>,
      {
        setConnectedWallet: true,
      },
    );

    const anchor = container.querySelector("a");
    expect(anchor).toBeTruthy();
    await waitFor(() => expect(anchor?.href).toContain("walletId="));
  });

  it("uses inApp wallet when wallet is a smart wallet", async () => {
    const testUrl = "https://example.com/";
    const { container } = render(
      <SiteLink client={TEST_CLIENT} href={testUrl}>
        Test Link
      </SiteLink>,
      {
        setConnectedWallet: true,
        walletId: "smart",
      },
    );

    const anchor = container.querySelector("a");
    expect(anchor).toBeTruthy();
    await waitFor(() => expect(anchor?.href).toContain("walletId=inApp"));
  });
});
