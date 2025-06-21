import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { base } from "../../../../chains/chain-definitions/base.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import { useActiveWalletChain } from "../../../../react/core/hooks/wallets/useActiveWalletChain.js";
import en from "./locale/en.js";
import {
  ChainButton,
  NetworkButton,
  NetworkList,
  type NetworkSelectorChainProps,
  SectionLabel,
  StyledMagnifyingGlassIcon,
  TabButton,
} from "./NetworkSelector.js";

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
        client={client}
        confirming={true}
        connectLocale={en}
        onClick={() => {}}
        switchingFailed={false}
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
        client={client}
        confirming={true}
        connectLocale={en}
        onClick={() => {}}
        switchingFailed={true}
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
        client={client}
        confirming={true}
        connectLocale={en}
        onClick={() => {}}
        switchingFailed={true}
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
        client={client}
        confirming={false}
        connectLocale={en}
        onClick={() => {}}
        switchingFailed={false}
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

  it("NetworkList should render ChainIcon by default", async () => {
    render(
      <NetworkList
        chains={[ethereum, base]}
        client={client}
        connectLocale={en}
        onSwitch={() => {}}
      />,
    );

    await waitFor(
      () => {
        expect(
          screen.getByText("Ethereum", {
            exact: true,
            selector: "span",
          }),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Base", {
            exact: true,
            selector: "span",
          }),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("NetworkList should render the custom `renderChain`", () => {
    const CustomRender: React.FC<NetworkSelectorChainProps> = (props) => {
      return <span className="_test_">{props.chain.name}</span>;
    };

    const { container } = render(
      <NetworkList
        chains={[ethereum, base]}
        client={client}
        connectLocale={en}
        onSwitch={() => {}}
        renderChain={CustomRender}
      />,
    );

    const spans = container.querySelectorAll("span._test_");
    expect(spans.length).toBe(2);
  });
});
