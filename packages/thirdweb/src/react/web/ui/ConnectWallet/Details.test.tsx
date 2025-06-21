import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { VITALIK_WALLET } from "~test/addresses.js";
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { base } from "../../../../chains/chain-definitions/base.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import { useActiveAccount } from "../../../../react/core/hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../../react/core/hooks/wallets/useActiveWalletChain.js";
import { AccountProvider } from "../../../core/account/provider.js";
import { ThirdwebProvider } from "../../providers/thirdweb-provider.js";
import {
  ConnectedToSmartWallet,
  ConnectedWalletDetails,
  DetailsModal,
  detailsBtn_formatFiatBalanceForButton,
  detailsBtn_formatTokenBalanceForButton,
  InAppWalletUserInfo,
  NetworkSwitcherButton,
  StyledChevronRightIcon,
  SwitchNetworkButton,
  useWalletDetailsModal,
} from "./Details.js";
import en from "./locale/en.js";
import { getConnectLocale } from "./locale/getConnectLocale.js";

/**
 * Tests for the Details button and Details Modal (parts of the ConnectButton component)
 */
const queryClient = new QueryClient();
const client = TEST_CLIENT;
vi.mock("../../../core/hooks/wallets/useActiveAccount.js", () => ({
  useActiveAccount: vi.fn(),
}));

const mockDetailsModalOptions = {};
const mockSupportedTokens = {};
const mockSupportedNFTs = {};
// biome-ignore lint/suspicious/noExplicitAny: Mock
const mockChains: any[] = [];
const mockDisplayBalanceToken = {};
const mockConnectOptions = {};
// biome-ignore lint/suspicious/noExplicitAny: Mock
const mockAssetTabs: any[] = [];
const mockOnDisconnect = vi.fn();

describe("Details button", () => {
  it("should render (when a wallet is connected)", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={undefined}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={undefined}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );

    const elements = container.getElementsByClassName("tw-connected-wallet");
    expect(!!elements.length).toBe(true);
  });

  it("should render with showBalanceInFiat", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={{
              showBalanceInFiat: "USD",
            }}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={undefined}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );

    const elements = container.getElementsByClassName("tw-connected-wallet");
    expect(!!elements.length).toBe(true);
  });

  it("should render with custom UI from the `render` prop", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={{
              render: () => <p className="thirdweb_tw" />,
            }}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={undefined}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );

    const element = container.querySelector("p.thirdweb_tw");
    expect(element).not.toBe(null);
  });

  it("should render style properly", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={{
              style: {
                color: "red",
                width: "4444px",
              },
            }}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={undefined}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );
    const element = container.querySelector(
      '[data-test="connected-wallet-details"]',
    );
    if (!element) {
      throw new Error("Details button not rendered properly");
    }
    const styles = window.getComputedStyle(element);
    expect(styles.color).toBe("red");
    expect(styles.width).toBe("4444px");
  });

  it("should render the Balance section", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={undefined}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={undefined}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );

    const elements = container.getElementsByClassName(
      "tw-connected-wallet__balance",
    );
    expect(!!elements.length).toBe(true);
  });

  it("should render the Address section if detailsButton.connectedAccountName is not passed", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={undefined}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={undefined}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );

    const elements = container.getElementsByClassName(
      "tw-connected-wallet__address",
    );
    expect(!!elements.length).toBe(true);
  });

  it("should NOT render the Address section if detailsButton.connectedAccountName is passed", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={{
              connectedAccountName: "test name",
            }}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={undefined}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );

    const elements = container.getElementsByClassName(
      "tw-connected-wallet__address",
    );
    expect(elements.length).toBe(1);
    expect(elements[0]?.innerHTML).toBe("test name");
  });

  it("should render a custom img if detailsButton?.connectedAccountAvatarUrl is passed", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={{
              connectedAccountAvatarUrl: "https://thirdweb.com/cat.png",
            }}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={undefined}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );

    const elements = container.getElementsByTagName("img");
    expect(elements.length).toBe(1);
    expect(elements[0]?.src).toBe("https://thirdweb.com/cat.png");
  });

  it("should render AccountAvatar if no custom image is passed", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={{
              connectedAccountName: "test name",
            }}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={undefined}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );

    const elements = container.getElementsByClassName(
      "tw-connected-wallet__account_avatar",
    );
    expect(elements.length).toBe(1);
  });

  it("should render the SwitchNetworkButton if chain is mismatched", () => {
    vi.mock(
      "../../../../react/core/hooks/wallets/useActiveWalletChain.js",
      () => ({
        useActiveWalletChain: vi.fn(),
      }),
    );
    vi.mocked(useActiveWalletChain).mockReturnValue(base);
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AccountProvider address={VITALIK_WALLET} client={client}>
          <ConnectedWalletDetails
            chain={ethereum}
            chains={[]}
            client={client}
            connectLocale={en}
            connectOptions={undefined}
            detailsButton={{
              connectedAccountName: "test name",
            }}
            detailsModal={undefined}
            onDisconnect={() => {}}
            supportedNFTs={undefined}
            supportedTokens={undefined}
            switchButton={{
              className: "thirdwebSwitchBtn",
              label: "switchbtn",
              style: {
                color: "red",
              },
            }}
            theme={"dark"}
          />
        </AccountProvider>
      </QueryClientProvider>,
    );
    const element = container.querySelector(
      "button.tw-connect-wallet--switch-network",
    );
    expect(element).not.toBe(null);
    const element2 = container.querySelector("button.thirdwebSwitchBtn");
    expect(element2).not.toBe(null);
    expect(element && element.innerHTML === "switchbtn").toBe(true);
    vi.resetAllMocks();
  });

  it("should render the fiat value properly", () => {
    expect(
      detailsBtn_formatFiatBalanceForButton({ balance: 12.9231, symbol: "$" }),
    ).toBe(" ($13)");
  });

  it("should render the token balance properly", () => {
    expect(
      detailsBtn_formatTokenBalanceForButton({
        balance: 12.923111,
        symbol: "ETH",
      }),
    ).toBe("12.9231 ETH");
  });
});

const thirdwebWrapper: FC = ({ children }: React.PropsWithChildren) => (
  <ThirdwebProvider>{children}</ThirdwebProvider>
);

/**
 * useWalletDetailsModal
 */
describe("useWalletDetailsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return an object with an open function", () => {
    const { result } = renderHook(() => useWalletDetailsModal(), {
      wrapper: thirdwebWrapper,
    });
    expect(result.current).toHaveProperty("open");
    expect(typeof result.current.open).toBe("function");
  });

  it("should throw an error when opening modal without a connected wallet", () => {
    const { result } = renderHook(() => useWalletDetailsModal(), {
      wrapper: thirdwebWrapper,
    });

    expect(() =>
      result.current.open({
        client,
      }),
    ).toThrow("Wallet is not connected.");
  });
});

/**
 * SwitchNetworkButton
 */
describe("SwitchNetworkButton", () => {
  it("should render a default button", () => {
    const { container } = render(
      <SwitchNetworkButton connectLocale={en} targetChain={ethereum} />,
    );
    const element = container.querySelector(
      "button.tw-connect-wallet--switch-network",
    );
    expect(element).not.toBe(null);
  });

  it("should apply the style properly", () => {
    const { container } = render(
      <SwitchNetworkButton
        connectLocale={en}
        style={{ color: "red", width: "4444px" }}
        targetChain={ethereum}
      />,
    );
    const element = container.querySelector(
      "button.tw-connect-wallet--switch-network",
    );
    if (!element) {
      throw new Error("Failed to render SwitchNetworkButton");
    }
    const styles = window.getComputedStyle(element);
    expect(styles.color).toBe("red");
    expect(styles.width).toBe("4444px");
  });

  it("should apply the className properly", () => {
    const { container } = render(
      <SwitchNetworkButton
        className="thirdwebRocks"
        connectLocale={en}
        targetChain={ethereum}
      />,
    );
    const element = container.querySelector("button.thirdwebRocks");
    expect(element).not.toBe(null);
  });

  it("should render button's text with locale.switchNetwork by default", () => {
    const { container } = render(
      <SwitchNetworkButton connectLocale={en} targetChain={ethereum} />,
    );
    const element = container.querySelector(
      "button.tw-connect-wallet--switch-network",
    );
    if (!element) {
      throw new Error("Failed to render SwitchNetworkButton");
    }
    expect(element.innerHTML).toBe(en.switchNetwork);
  });

  it("should render `switchNetworkBtnTitle` properly", () => {
    const { container } = render(
      <SwitchNetworkButton
        connectLocale={en}
        switchNetworkBtnTitle="cat"
        targetChain={ethereum}
      />,
    );
    const element = container.querySelector(
      "button.tw-connect-wallet--switch-network",
    );
    if (!element) {
      throw new Error("Failed to render SwitchNetworkButton");
    }
    expect(element.innerHTML).toBe("cat");
  });
});

describe("ConnectedToSmartWallet", () => {
  it("should render nothing since no active wallet exists in default test env", () => {
    const { container } = render(
      <ThirdwebProvider>
        <ConnectedToSmartWallet client={client} connectLocale={en} />
      </ThirdwebProvider>,
    );
    // no smart wallet exists in this env so this component should render null
    const element = container.querySelector("span");
    expect(element).toBe(null);
  });
});

describe("InAppWalletUserInfo", () => {
  it("should render a Skeleton since no active wallet exists in default test env", () => {
    const { container } = render(
      <ThirdwebProvider>
        <InAppWalletUserInfo client={client} locale={en} />
      </ThirdwebProvider>,
    );
    // no smart wallet exists in this env so this component should render null
    const element = container.querySelector(
      "div.InAppWalletUserInfo__skeleton",
    );
    expect(element).not.toBe(null);
  });
});

describe("Details Modal", () => {
  beforeEach(() => {
    // Mock the animate method
    HTMLDivElement.prototype.animate = vi.fn().mockReturnValue({
      onfinish: vi.fn(),
    });
  });

  it("should close the modal when activeAccount is falsy", async () => {
    const closeModalMock = vi.fn();
    const locale = await getConnectLocale("en_US");

    vi.mocked(useActiveAccount).mockReturnValue(undefined);

    render(
      <DetailsModal
        assetTabs={mockAssetTabs}
        chains={mockChains}
        client={TEST_CLIENT}
        closeModal={closeModalMock}
        connectOptions={mockConnectOptions}
        detailsModal={mockDetailsModalOptions}
        displayBalanceToken={mockDisplayBalanceToken}
        locale={locale}
        onDisconnect={mockOnDisconnect}
        supportedNFTs={mockSupportedNFTs}
        supportedTokens={mockSupportedTokens}
        theme="light"
      />,
    );

    await waitFor(() => {
      expect(closeModalMock).toHaveBeenCalled();
    });
  });

  it("should render the DetailsModal with default props", async () => {
    const closeModalMock = vi.fn();
    const locale = await getConnectLocale("en_US");

    render(
      <DetailsModal
        chains={mockChains}
        client={TEST_CLIENT}
        closeModal={closeModalMock}
        connectOptions={mockConnectOptions}
        locale={locale}
        onDisconnect={mockOnDisconnect}
        theme="light"
      />,
    );

    // Add assertions to check if the modal is rendered correctly
    expect(screen.getByText("Connect Modal")).toBeInTheDocument();
  });

  it("should call closeModal when the close button is clicked", async () => {
    const closeModalMock = vi.fn();
    const locale = await getConnectLocale("en_US");

    render(
      <DetailsModal
        chains={mockChains}
        client={TEST_CLIENT}
        closeModal={closeModalMock}
        connectOptions={mockConnectOptions}
        locale={locale}
        onDisconnect={mockOnDisconnect}
        theme="light"
      />,
    );

    // Simulate clicking the close button
    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(closeModalMock).toHaveBeenCalled();
    });
  });

  it("NetworkSwitcherButton should not render if no active chain", () => {
    const { container } = render(
      <AccountProvider address={VITALIK_WALLET} client={client}>
        <NetworkSwitcherButton
          client={client}
          disableSwitchChain={false}
          displayBalanceToken={undefined}
          setScreen={(_scr) => {}}
        />
      </AccountProvider>,
    );

    const element = container.querySelector(
      ".tw-internal-network-switcher-button",
    );
    expect(element).toBeFalsy();
  });

  it("NetworkSwitcherButton should render if there is an active chain", async () => {
    vi.mock(
      "../../../../react/core/hooks/wallets/useActiveWalletChain.js",
      () => ({
        useActiveWalletChain: vi.fn(),
      }),
    );
    vi.mocked(useActiveWalletChain).mockReturnValue(base);
    const { container } = render(
      <AccountProvider address={VITALIK_WALLET} client={client}>
        <NetworkSwitcherButton
          client={client}
          disableSwitchChain={false}
          displayBalanceToken={undefined}
          setScreen={(_scr) => {}}
        />
      </AccountProvider>,
    );
    await waitFor(
      () => {
        const element = container.querySelector(
          ".tw-internal-network-switcher-button",
        );
        expect(element).toBeTruthy();
      },
      { timeout: 2000 },
    );
  });

  it("StyledChevronRightIcon should render a svg element", () => {
    const { container } = render(<StyledChevronRightIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });
});
