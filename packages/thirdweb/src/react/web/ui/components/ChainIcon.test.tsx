import { describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { render } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { ChainIcon, getSrcChainIcon } from "./ChainIcon.js";
import { fallbackChainIcon } from "./fallbackChainIcon.js";

const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)("ChainIcon-legacy", () => {
  it("getSrcChainIcon should return fallbackChainIcon if chainIconUrl does not exist", () => {
    expect(getSrcChainIcon({ client })).toBe(fallbackChainIcon);
  });

  it("getSrcChainIcon should return the resolved url", () => {
    const resolvedUrl = getSrcChainIcon({
      chainIconUrl: TEST_CONTRACT_URI,
      client,
    });
    expect(resolvedUrl.startsWith("https://")).toBe(true);
  });

  it("getSrcChainIcon should return the fallbackChainIcon if fails to resolve", () => {
    expect(getSrcChainIcon({ chainIconUrl: "test", client })).toBe(
      fallbackChainIcon,
    );
  });

  it("should render an image", () => {
    const { container } = render(
      <ChainIcon
        chainIconUrl="ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png"
        client={client}
        size="lg"
      />,
    );

    const image = container.querySelector("img");
    expect(image).toBeTruthy();

    expect(
      image?.src.includes("QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9"),
    ).toBe(true);
  });

  it("should render ChainActiveDot if the `active` prop is set to true", () => {
    const { container } = render(
      <ChainIcon
        active
        chainIconUrl="ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png"
        client={client}
        size="lg"
      />,
    );
    const activeDot = container.querySelector(
      ".tw-chain-active-dot-legacy-chain-icon",
    );
    expect(activeDot).toBeTruthy();
  });
});
