import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { ANVIL_CHAIN } from "../../../../../../test/src/chains.js";
import { render, waitFor } from "../../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../../test/src/test-clients.js";
import { createWallet } from "../../../../../wallets/create-wallet.js";
import type { ConnectLocale } from "../locale/types.js";
import { SignatureScreen } from "./SignatureScreen.js";

const mockAuth = vi.hoisted(() => ({
  doLogin: vi.fn().mockResolvedValue(undefined),
  doLogout: vi.fn().mockResolvedValue(undefined),
  getLoginPayload: vi.fn().mockResolvedValue(undefined),
  isLoggedIn: vi.fn().mockResolvedValue(true),
}));

const useActiveWalletMock = vi.hoisted(() =>
  vi.fn().mockReturnValue(undefined),
);

const useAdminWalletMock = vi.hoisted(() => vi.fn().mockReturnValue(undefined));

vi.mock("../../../../core/hooks/auth/useSiweAuth", () => ({
  useSiweAuth: () => mockAuth,
}));

vi.mock("../../../../core/hooks/wallets/useActiveWallet", () => ({
  useActiveWallet: useActiveWalletMock,
}));

vi.mock("../../../../core/hooks/wallets/useActiveAccount", () => ({
  useActiveAccount: () => vi.fn().mockReturnValue(TEST_ACCOUNT_A),
}));

vi.mock("../../../../core/hooks/wallets/useAdminWallet", () => ({
  useAdminWallet: useAdminWalletMock,
}));

const mockConnectLocale = {
  agreement: {
    and: "and",
    prefix: "By connecting, you agree to our",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
  },
  signatureScreen: {
    instructionScreen: {
      disconnectWallet: "Disconnect",
      instruction: "Please sign the message",
      signInButton: "Sign In",
      title: "Sign Message",
    },
    signingScreen: {
      failedToSignIn: "Failed to sign in",
      inProgress: "Signing in progress...",
      prompt: "Please check your wallet",
      title: "Signing",
      tryAgain: "Try Again",
    },
    title: "Sign In",
  },
} as unknown as ConnectLocale;

describe("Signature screen", () => {
  describe("Signature prompt screen", () => {
    beforeEach(() => {
      const metamaskWallet = createWallet("io.metamask");
      useActiveWalletMock.mockReturnValue(metamaskWallet);
      vi.clearAllMocks();
      mockAuth.doLogin.mockResolvedValue(undefined);
    });

    it("renders initial state correctly", () => {
      const { getByTestId } = render(
        <SignatureScreen
          auth={mockAuth}
          client={TEST_CLIENT}
          connectLocale={mockConnectLocale}
          modalSize="wide"
          onDone={() => {}}
        />,
        { setConnectedWallet: true },
      );

      expect(getByTestId("sign-in-button")).toBeInTheDocument();
      expect(getByTestId("disconnect-button")).toBeInTheDocument();
    });

    it("handles signing flow", async () => {
      const onDoneMock = vi.fn();
      const { getByRole, getByText } = render(
        <SignatureScreen
          auth={mockAuth}
          client={TEST_CLIENT}
          connectLocale={mockConnectLocale}
          modalSize="wide"
          onDone={onDoneMock}
        />,
        { setConnectedWallet: true },
      );

      const signInButton = getByRole("button", { name: "Sign In" });
      await userEvent.click(signInButton);

      // Should show signing in progress
      await waitFor(() => {
        expect(getByText("Signing in progress...")).toBeInTheDocument();
      });
    });

    it("handles error state", async () => {
      mockAuth.doLogin.mockRejectedValueOnce(new Error("Signing failed"));
      const { getByTestId, getByRole, getByText } = render(
        <SignatureScreen
          auth={mockAuth}
          client={TEST_CLIENT}
          connectLocale={mockConnectLocale}
          modalSize="wide"
          onDone={() => {}}
        />,
        { setConnectedWallet: true },
      );

      const signInButton = await waitFor(() => {
        return getByTestId("sign-in-button");
      });
      await userEvent.click(signInButton);

      // Should show error state
      await waitFor(
        () => {
          expect(getByText("Signing failed")).toBeInTheDocument();
          expect(
            getByRole("button", { name: "Try Again" }),
          ).toBeInTheDocument();
        },
        {
          timeout: 2000,
        },
      );
    });
  });

  it("Shows loading state when wallet is disconnected", async () => {
    useActiveWalletMock.mockReturnValueOnce(undefined);

    const { queryByTestId } = render(
      <SignatureScreen
        auth={mockAuth}
        client={TEST_CLIENT}
        connectLocale={mockConnectLocale}
        modalSize="wide"
        onDone={() => {}}
      />,
      { setConnectedWallet: true },
    );

    expect(queryByTestId("sign-in-button")).not.toBeInTheDocument();
  });

  describe("Headless signature screen", () => {
    function headlessTests() {
      it("automatically triggers sign in on mount", async () => {
        render(
          <SignatureScreen
            auth={mockAuth}
            client={TEST_CLIENT}
            connectLocale={mockConnectLocale}
            modalSize="wide"
            onDone={() => {}}
          />,
          { setConnectedWallet: true },
        );

        await waitFor(() => {
          expect(mockAuth.doLogin).toHaveBeenCalledTimes(1);
        });
      });

      it("shows signing message during signing state", async () => {
        const { getByText } = render(
          <SignatureScreen
            auth={mockAuth}
            client={TEST_CLIENT}
            connectLocale={mockConnectLocale}
            modalSize="wide"
            onDone={() => {}}
          />,
          { setConnectedWallet: true },
        );

        await waitFor(() => {
          expect(getByText("Signing")).toBeInTheDocument();
        });
      });

      it("shows error and retry button when signing fails", async () => {
        mockAuth.doLogin.mockRejectedValueOnce(
          new Error("Headless signing failed"),
        );

        const { getByText, getByRole } = render(
          <SignatureScreen
            auth={mockAuth}
            client={TEST_CLIENT}
            connectLocale={mockConnectLocale}
            modalSize="wide"
            onDone={() => {}}
          />,
          { setConnectedWallet: true },
        );

        await waitFor(
          () => {
            expect(getByText("Headless signing failed")).toBeInTheDocument();
            expect(
              getByRole("button", { name: "Try Again" }),
            ).toBeInTheDocument();
          },
          { timeout: 2000 },
        );
      });

      it("allows retry after failure", async () => {
        mockAuth.doLogin
          .mockRejectedValueOnce(new Error("Failed first time"))
          .mockResolvedValueOnce(undefined);

        const { getByRole, getByText } = render(
          <SignatureScreen
            auth={mockAuth}
            client={TEST_CLIENT}
            connectLocale={mockConnectLocale}
            modalSize="wide"
            onDone={() => {}}
          />,
          { setConnectedWallet: true },
        );

        // Wait for initial failure
        await waitFor(
          () => {
            expect(getByText("Failed first time")).toBeInTheDocument();
          },
          { timeout: 2000 },
        );

        // Click retry
        const retryButton = getByRole("button", { name: "Try Again" });
        await userEvent.click(retryButton);

        // Should show loading again
        await waitFor(() => {
          expect(getByText("Signing")).toBeInTheDocument();
        });

        // Should have called login twice
        expect(mockAuth.doLogin).toHaveBeenCalledTimes(2);
      });

      it("allows disconnecting wallet after failure", async () => {
        const mockDisconnect = vi.fn().mockResolvedValue(undefined);
        mockAuth.doLogin.mockRejectedValueOnce(new Error("Failed"));
        useActiveWalletMock.mockReturnValueOnce({
          ...createWallet("io.metamask"),
          disconnect: mockDisconnect,
        });

        const { getByTestId } = render(
          <SignatureScreen
            auth={mockAuth}
            client={TEST_CLIENT}
            connectLocale={mockConnectLocale}
            modalSize="wide"
            onDone={() => {}}
          />,
          { setConnectedWallet: true },
        );

        // Wait for failure and click disconnect
        await waitFor(
          () => {
            return getByTestId("disconnect-button");
          },
          { timeout: 2000 },
        ).then((button) => userEvent.click(button));

        // Should have attempted to disconnect
        await waitFor(() => {
          expect(mockDisconnect).toHaveBeenCalled();
        });
      });
    }

    describe("InApp wallet", () => {
      const inAppWallet = createWallet("inApp");
      beforeEach(() => {
        useActiveWalletMock.mockReturnValue(inAppWallet);
      });
      headlessTests();
    });

    describe("Ecosystem wallet", () => {
      const ecosystemWallet = createWallet("ecosystem.foo");
      beforeEach(() => {
        useActiveWalletMock.mockReturnValue(ecosystemWallet);
      });
      headlessTests();
    });

    describe("Smart Wallet (active) + Ecosystem wallet (admin)", () => {
      const ecosystemWallet = createWallet("ecosystem.foo");
      const smartWallet = createWallet("smart", {
        chain: ANVIL_CHAIN,
        sponsorGas: false,
      });
      beforeEach(() => {
        useActiveWalletMock.mockReturnValue(smartWallet);
        useAdminWalletMock.mockReturnValue(ecosystemWallet);
      });
      headlessTests();
    });

    describe("Smart Wallet (active) + InApp wallet (admin)", () => {
      const ecosystemWallet = createWallet("inApp");
      const smartWallet = createWallet("smart", {
        chain: ANVIL_CHAIN,
        sponsorGas: false,
      });
      beforeEach(() => {
        useActiveWalletMock.mockReturnValue(smartWallet);
        useAdminWalletMock.mockReturnValue(ecosystemWallet);
      });
      headlessTests();
    });
  });
});
