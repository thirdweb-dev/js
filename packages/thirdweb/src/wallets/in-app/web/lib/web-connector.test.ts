import { describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { createWalletAdapter } from "../../../../adapters/wallet-adapter.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import { backendAuthenticate } from "../../core/authentication/backend.js";
import { guestAuthenticate } from "../../core/authentication/guest.js";
import { siweAuthenticate } from "../../core/authentication/siwe.js";
import { loginWithOauth } from "./auth/oauth.js";
import { verifyOtp } from "./auth/otp.js";
import { InAppWebConnector } from "./web-connector.js";

vi.mock("./auth/oauth");
vi.mock("./auth/iframe-auth.ts", () => {
  const Auth = vi.fn();
  Auth.prototype.loginWithAuthToken = vi.fn(() => {
    return Promise.resolve({
      user: {
        authDetails: {
          recoveryShareManagement: "ENCLAVE",
          userWalletId: "123",
        },
        status: "Logged In, Wallet Initialized",
        walletAddress: "0x123",
      },
    });
  });
  return { Auth };
});
vi.mock("../../core/authentication/siwe");
vi.mock("../../core/authentication/guest");
vi.mock("../../core/authentication/backend");
vi.mock("./auth/otp");
vi.mock("../../core/authentication/authEndpoint");
vi.mock("../../core/authentication/jwt");
vi.mock("../../web/utils/iFrameCommunication/InAppWalletIframeCommunicator");

describe("InAppWebConnector.connect", () => {
  const mockAuthToken = {
    storedToken: {
      authDetails: {
        userWalletId: "123",
        recoveryShareManagement: "ENCLAVE" as const,
      },
      authProvider: "EmailOtp" as const,
      cookieString: "mock-cookie",
      developerClientId: TEST_CLIENT.clientId,
      isNewUser: false,
      jwtToken: "mock-jwt-token",
      shouldStoreCookieString: true,
    },
  };

  const connector = new InAppWebConnector({
    client: TEST_CLIENT,
  });
  const mockWallet = createWalletAdapter({
    adaptedAccount: TEST_ACCOUNT_A,
    client: TEST_CLIENT,
    chain: ethereum,
    onDisconnect: () => {},
    switchChain: () => {},
  });
  const mockAccount = mockWallet.getAccount();
  if (!mockAccount) {
    throw new Error("mockAccount is undefined");
  }

  it("should handle email authentication", async () => {
    vi.mocked(verifyOtp).mockResolvedValueOnce(mockAuthToken);

    const result = await connector.connect({
      strategy: "email",
      email: "test@example.com",
      verificationCode: "123456",
    });

    expect(verifyOtp).toHaveBeenCalledWith({
      strategy: "email",
      email: "test@example.com",
      verificationCode: "123456",
      client: TEST_CLIENT,
      ecosystem: undefined,
    });

    expect(result).toBeDefined();
  });

  it("should handle wallet authentication", async () => {
    vi.mocked(siweAuthenticate).mockResolvedValueOnce(mockAuthToken);

    const mockWallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      client: TEST_CLIENT,
      chain: ethereum,
      onDisconnect: () => {},
      switchChain: () => {},
    });

    await connector.connect({
      strategy: "wallet",
      chain: ethereum,
      wallet: mockWallet,
    });

    expect(siweAuthenticate).toHaveBeenCalledWith({
      wallet: mockWallet,
      chain: ethereum,
      client: TEST_CLIENT,
      ecosystem: undefined,
    });
  });

  it("should handle guest authentication", async () => {
    vi.mocked(guestAuthenticate).mockResolvedValueOnce(mockAuthToken);

    await connector.connect({
      strategy: "guest",
    });

    expect(guestAuthenticate).toHaveBeenCalled();
  });

  it("should handle backend authentication", async () => {
    vi.mocked(backendAuthenticate).mockResolvedValueOnce(mockAuthToken);

    await connector.connect({
      strategy: "backend",
      walletSecret: "secret123",
    });

    expect(backendAuthenticate).toHaveBeenCalledWith({
      walletSecret: "secret123",
      client: TEST_CLIENT,
      ecosystem: undefined,
    });
  });

  it("should handle oauth authentication", async () => {
    vi.mocked(loginWithOauth).mockResolvedValueOnce(mockAuthToken);

    await connector.connect({
      strategy: "google",
    });

    expect(loginWithOauth).toHaveBeenCalledWith({
      authOption: "google",
      client: TEST_CLIENT,
      ecosystem: undefined,
      closeOpenedWindow: undefined,
      openedWindow: undefined,
    });
  });

  it("should throw error for invalid strategy", async () => {
    await expect(
      connector.connect({
        // @ts-expect-error invalid strategy
        strategy: "invalid",
      }),
    ).rejects.toThrow("Invalid param: invalid");
  });
});
