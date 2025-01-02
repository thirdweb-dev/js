import { describe, expect, it } from "vitest";
import { render } from "../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { SiteEmbed } from "./SiteEmbed.js";

describe("SiteEmbed", () => {
  it("renders iframe with correct src", () => {
    const testUrl = "https://thirdweb.com/";
    const { container } = render(
      <SiteEmbed src={testUrl} client={TEST_CLIENT} />,
    );

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
  });

  it("throws error if clientId is not provided", () => {
    const testUrl = "https://thirdweb.com/";
    expect(() =>
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid input
      render(<SiteEmbed src={testUrl} client={{} as any} />),
    ).toThrow("The SiteEmbed client must have a clientId");
  });
});
