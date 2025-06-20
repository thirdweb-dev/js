import { describe, expect, it } from "vitest";
import { render, waitFor } from "../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { SiteEmbed } from "./SiteEmbed.js";

describe("SiteEmbed", () => {
  it("renders iframe with correct src", () => {
    const testUrl = "https://thirdweb.com/";
    const { container } = render(
      <SiteEmbed client={TEST_CLIENT} src={testUrl} />,
    );

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
  });

  it("throws error if clientId is not provided", () => {
    const testUrl = "https://thirdweb.com/";
    expect(() =>
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid input
      render(<SiteEmbed client={{} as any} src={testUrl} />),
    ).toThrow("The SiteEmbed client must have a clientId");
  });

  it("uses inApp wallet when wallet is a smart wallet", async () => {
    const testUrl = "https://thirdweb.com/";
    const { container } = render(
      <SiteEmbed client={TEST_CLIENT} src={testUrl} />,
      {
        setConnectedWallet: true,
        walletId: "smart",
      },
    );

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    await waitFor(() => expect(iframe?.src).toContain("walletId=inApp"));
  });
});
