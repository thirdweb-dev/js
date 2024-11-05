import { describe, expect, it } from "vitest";
import { render, waitFor } from "../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { SiteEmbed } from "./SiteEmbed.js";

describe("SiteEmbed", () => {
  it("renders iframe with correct src", () => {
    const testUrl = "https://example.com/";
    const { container } = render(
      <SiteEmbed src={testUrl} client={TEST_CLIENT} />,
    );

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe?.src).toBe(testUrl);
  });

  it("throws error if clientId is not provided", () => {
    const testUrl = "https://example.com/";
    expect(() =>
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid input
      render(<SiteEmbed src={testUrl} client={{} as any} />),
    ).toThrow("The SiteEmbed client must have a clientId");
  });

  it("adds wallet params to url when wallet is connected", async () => {
    const testUrl = "https://example.com/";
    const { container } = render(
      <SiteEmbed src={testUrl} client={TEST_CLIENT} />,
      {
        setConnectedWallet: true,
      },
    );

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    await waitFor(() => expect(iframe?.src).toContain("walletId="));
  });
});
