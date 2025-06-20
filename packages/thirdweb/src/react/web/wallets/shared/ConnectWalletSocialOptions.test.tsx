import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
} from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { createWallet } from "../../../../wallets/create-wallet.js";
import { ConnectWalletSocialOptions } from "./ConnectWalletSocialOptions.js";
import en from "./locale/en.js";

describe("ConnectWalletSocialOptions", () => {
  const mockSelect = vi.fn();
  const mockDone = vi.fn();

  const defaultProps = {
    chain: undefined,
    client: TEST_CLIENT,
    disabled: false,
    done: mockDone,
    isLinking: false,
    locale: en,
    select: mockSelect,
    size: "compact" as const,
  };

  it("renders Sign in with Wallet button when enabled and not linking", () => {
    render(
      <ConnectWalletSocialOptions
        {...defaultProps}
        wallet={createWallet("inApp", {
          auth: {
            options: ["wallet"],
          },
        })}
      />,
    );

    const walletButton = screen.getByRole("button", {
      name: /sign in with wallet/i,
    });

    expect(walletButton).toBeInTheDocument();
    expect(walletButton).toHaveTextContent("Sign in with Wallet");
  });

  it("does not render Sign in with Wallet button when isLinking is true", () => {
    render(
      <ConnectWalletSocialOptions
        {...defaultProps}
        isLinking={true}
        wallet={createWallet("inApp", {
          auth: {
            options: ["wallet"],
          },
        })}
      />,
    );

    const walletButton = screen.queryByRole("button", {
      name: /sign in with wallet/i,
    });

    expect(walletButton).not.toBeInTheDocument();
  });

  it("calls handleWalletLogin when Sign in with Wallet button is clicked", () => {
    render(
      <ConnectWalletSocialOptions
        {...defaultProps}
        wallet={createWallet("inApp", {
          auth: {
            options: ["wallet"],
          },
        })}
      />,
    );

    const walletButton = screen.getByRole("button", {
      name: /sign in with wallet/i,
    });

    fireEvent.click(walletButton);

    expect(mockSelect).toHaveBeenCalled();
  });
});
