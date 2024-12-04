import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import { useActiveWalletChain } from "../../../../react/core/hooks/wallets/useActiveWalletChain.js";
import {
  ChainButton,
  NetworkButton,
  SectionLabel,
  StyledMagnifyingGlassIcon,
  TabButton,
} from "./NetworkSelector.js";
import en from "./locale/en.js";

const client = TEST_CLIENT;

describe("NetworkSelector", () => {
  it("StyledMagnifyingGlassIcon should render a svg element", () => {
    const { container } = render(<StyledMagnifyingGlassIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("NetworkButton should render a button", () => {
    const { container } = render(<NetworkButton />);
    const button = container.querySelector("button");
    expect(button).toBeTruthy();
  });

  it("SectionLabel should render a <p>", () => {
    const { container } = render(<SectionLabel />);
    const p = container.querySelector("p");
    expect(p).toBeTruthy();
  });

  it("TabButton should render a button", () => {
    const { container } = render(<TabButton />);
    const button = container.querySelector("button");
    expect(button).toBeTruthy();
  });

  it("ChainButton should render ChainIcon", async () => {
    const { container } = render(
      <ChainButton
        chain={ethereum}
        onClick={() => {}}
        confirming={true}
        switchingFailed={false}
        client={client}
        connectLocale={en}
      />,
    );
    await waitFor(
      () => {
        const image = container.querySelector("img");
        expect(image).toBeTruthy();
        expect(
          image?.src.includes("QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9"),
        ).toBe(true);
      },
      {
        timeout: 10000,
      },
    );
  });

  it("ChainButton should render ChainName", async () => {
    render(
      <ChainButton
        chain={ethereum}
        onClick={() => {}}
        confirming={true}
        switchingFailed={true}
        client={client}
        connectLocale={en}
      />,
    );
    await waitFor(
      () =>
        expect(
          screen.getByText("Ethereum", {
            exact: true,
            selector: "span",
          }),
        ).toBeInTheDocument(),
      { timeout: 2000 },
    );
  });

  it("ChainButton should render ChainActiveDot if active prop is set to true", async () => {
    vi.mock(
      "../../../../react/core/hooks/wallets/useActiveWalletChain.js",
      () => ({
        useActiveWalletChain: vi.fn(),
      }),
    );
    vi.mocked(useActiveWalletChain).mockReturnValue(ethereum);
    const { container } = render(
      <ChainButton
        chain={ethereum}
        onClick={() => {}}
        confirming={true}
        switchingFailed={true}
        client={client}
        connectLocale={en}
      />,
    );
    await waitFor(() => {
      const dot = container.querySelector(
        ".tw-chain-active-dot-button-network-selector",
      );
      expect(dot).toBeTruthy();
    });
  });

  it("ChainButton should still render ChainName if both `confirming` and switchingFailed` are false", async () => {
    const { container } = render(
      <ChainButton
        chain={ethereum}
        onClick={() => {}}
        confirming={false}
        switchingFailed={false}
        client={client}
        connectLocale={en}
      />,
    );

    await waitFor(
      () => {
        const element = container.querySelector(
          ".tw-chain-icon-none-confirming",
        );
        expect(element).toBeTruthy();
      },
      { timeout: 1500 },
    );
  });
});
