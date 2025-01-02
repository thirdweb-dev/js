import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { render, waitFor } from "../../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../../test/src/test-clients.js";
import { createWallet } from "../../../../../wallets/create-wallet.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import type { ConnectLocale } from "../locale/types.js";
import { SignatureScreen } from "./SignatureScreen.js";

const mockAuth = vi.hoisted(() => ({
  doLogin: vi.fn().mockResolvedValue(undefined),
  doLogout: vi.fn().mockResolvedValue(undefined),
  getLoginPayload: vi.fn().mockResolvedValue(undefined),
  isLoggedIn: vi.fn().mockResolvedValue(true),
}));

vi.mock("../../../../core/hooks/auth/useSiweAuth", () => ({
  useSiweAuth: () => mockAuth,
}));

vi.mock("../../../../core/hooks/wallets/useActiveWallet", () => ({
  useActiveWallet: vi.fn().mockReturnValue(createWallet("io.metamask")),
}));

vi.mock("../../../../core/hooks/wallets/useActiveAccount", () => ({
  useActiveAccount: () => vi.fn().mockReturnValue(TEST_ACCOUNT_A),
}));

vi.mock("../../../../core/hooks/wallets/useAdminWallet", () => ({
  useAdminWallet: () => vi.fn().mockReturnValue(null),
}));

const mockConnectLocale = {
  signatureScreen: {
    title: "Sign In",
    instructionScreen: {
      title: "Sign Message",
      instruction: "Please sign the message",
      signInButton: "Sign In",
      disconnectWallet: "Disconnect",
    },
    signingScreen: {
      title: "Signing",
      inProgress: "Signing in progress...",
      failedToSignIn: "Failed to sign in",
      prompt: "Please check your wallet",
      tryAgain: "Try Again",
    },
  },
  agreement: {
    prefix: "By connecting, you agree to our",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",
  },
} as unknown as ConnectLocale;

describe("SignatureScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.doLogin.mockResolvedValue(undefined);
  });

  it("renders initial state correctly", () => {
    const { getByTestId } = render(
      <SignatureScreen
        onDone={() => {}}
        modalSize="wide"
        connectLocale={mockConnectLocale}
        client={TEST_CLIENT}
        auth={mockAuth}
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
        onDone={onDoneMock}
        modalSize="wide"
        connectLocale={mockConnectLocale}
        client={TEST_CLIENT}
        auth={mockAuth}
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

  it("shows loading state when wallet is undefined", async () => {
    vi.mocked(useActiveWallet).mockReturnValueOnce(undefined);

    const { queryByTestId } = render(
      <SignatureScreen
        onDone={() => {}}
        modalSize="wide"
        connectLocale={mockConnectLocale}
        client={TEST_CLIENT}
        auth={mockAuth}
      />,
      { setConnectedWallet: true },
    );

    expect(queryByTestId("sign-in-button")).not.toBeInTheDocument();
  });

  it("handles error state", async () => {
    mockAuth.doLogin.mockRejectedValueOnce(new Error("Signing failed"));
    const { getByTestId, getByRole, getByText } = render(
      <SignatureScreen
        onDone={() => {}}
        modalSize="wide"
        connectLocale={mockConnectLocale}
        client={TEST_CLIENT}
        auth={mockAuth}
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
        expect(getByRole("button", { name: "Try Again" })).toBeInTheDocument();
      },
      {
        timeout: 2000,
      },
    );
  });

  describe("HeadlessSignIn", () => {
    const mockWallet = createWallet("inApp");
    beforeEach(() => {
      vi.mocked(useActiveWallet).mockReturnValue(mockWallet);
    });

    it("automatically triggers sign in on mount", async () => {
      render(
        <SignatureScreen
          onDone={() => {}}
          modalSize="wide"
          connectLocale={mockConnectLocale}
          client={TEST_CLIENT}
          auth={mockAuth}
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
          onDone={() => {}}
          modalSize="wide"
          connectLocale={mockConnectLocale}
          client={TEST_CLIENT}
          auth={mockAuth}
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
          onDone={() => {}}
          modalSize="wide"
          connectLocale={mockConnectLocale}
          client={TEST_CLIENT}
          auth={mockAuth}
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
          onDone={() => {}}
          modalSize="wide"
          connectLocale={mockConnectLocale}
          client={TEST_CLIENT}
          auth={mockAuth}
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
      vi.mocked(useActiveWallet).mockReturnValueOnce({
        ...createWallet("io.metamask"),
        disconnect: mockDisconnect,
      });

      const { getByTestId } = render(
        <SignatureScreen
          onDone={() => {}}
          modalSize="wide"
          connectLocale={mockConnectLocale}
          client={TEST_CLIENT}
          auth={mockAuth}
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
  });
});
