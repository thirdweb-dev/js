import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../../test/src/test-wallets.js";
import { baseSepolia } from "../../../../chains/chain-definitions/base-sepolia.js";
import { getEcosystemInfo } from "../../../ecosystem/get-ecosystem-wallet-auth-options.js";
import { predictSmartAccountAddress } from "../../../smart/lib/calls.js";
import { DEFAULT_ACCOUNT_FACTORY_V0_6 } from "../../../smart/lib/constants.js";
import type { AuthLoginReturnType } from "../authentication/types.js";
import type { InAppConnector } from "../interfaces/connector.js";
import { createInAppWallet } from "./in-app-core.js";
import * as InAppWallet from "./index.js";

vi.mock("../../../../analytics/track/connect.js", () => ({
  trackConnect: vi.fn(),
}));

vi.spyOn(InAppWallet, "connectInAppWallet");
vi.spyOn(InAppWallet, "autoConnectInAppWallet");
vi.mock("../../../ecosystem/get-ecosystem-wallet-auth-options.js", () => ({
  getEcosystemInfo: vi.fn(),
}));

describe.runIf(process.env.TW_SECRET_KEY)("createInAppWallet", () => {
  const mockClient = TEST_CLIENT;
  const mockChain = baseSepolia;
  const mockAccount = TEST_ACCOUNT_A;
  const mockUser = {
    status: "Logged In, Wallet Initialized",
    walletAddress: TEST_ACCOUNT_A.address,
    authDetails: {
      userWalletId: TEST_ACCOUNT_A.address,
      recoveryShareManagement: "ENCLAVE",
      email: "test@test.com",
    },
    account: mockAccount,
  } as const;
  const mockAuthResult: AuthLoginReturnType = {
    user: mockUser,
  };

  const mockConnectorFactory = vi.fn(() =>
    Promise.resolve({
      connect: vi.fn().mockResolvedValue(mockAuthResult),
      logout: vi.fn(() => Promise.resolve({ success: true })),
      authenticate: vi.fn(),
      getAccounts: vi.fn(),
      getAccount: vi.fn(),
      getProfiles: vi.fn(),
      getUser: vi.fn().mockResolvedValue(mockUser),
      linkProfile: vi.fn(),
      unlinkProfile: vi.fn(),
      preAuthenticate: vi.fn(),
    } as InAppConnector),
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should connect successfully", async () => {
    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
    });

    const result = await wallet.connect({
      client: mockClient,
      chain: mockChain,
      strategy: "email",
      email: "",
      verificationCode: "",
    });

    expect(result).toBe(mockAccount);
    expect(InAppWallet.connectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        chain: mockChain,
      }),
      undefined,
      expect.any(Object),
    );
  });

  it("should auto connect successfully", async () => {
    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
    });

    const result = await wallet.autoConnect({
      client: mockClient,
      chain: mockChain,
    });

    expect(result).toBe(mockAccount);
    expect(InAppWallet.autoConnectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        chain: mockChain,
      }),
      undefined,
      expect.any(Object),
    );
  });

  it("should handle ecosystem wallet connection with smart account settings", async () => {
    vi.mocked(getEcosystemInfo).mockResolvedValue({
      smartAccountOptions: {
        defaultChainId: mockChain.id,
        sponsorGas: true,
        accountFactoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
      },
      authOptions: [],
      name: "hello world",
      slug: "test-ecosystem",
    });

    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
      ecosystem: { id: "ecosystem.test-ecosystem" },
    });

    const result = await wallet.connect({
      client: mockClient,
      chain: mockChain,
      strategy: "email",
      email: "",
      verificationCode: "",
    });

    const expectedSmartAccountAddress = await predictSmartAccountAddress({
      factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
      chain: mockChain,
      adminAddress: TEST_ACCOUNT_A.address,
      client: mockClient,
    });
    expect(result.address).toBe(expectedSmartAccountAddress);
    expect(InAppWallet.connectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        chain: mockChain,
      }),
      expect.objectContaining({
        smartAccount: expect.objectContaining({
          chain: mockChain,
          sponsorGas: true,
          factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
        }),
      }),
      expect.any(Object),
    );
  });
  it("should handle ecosystem wallet connection with smart account settings even when no chain is set", async () => {
    vi.mocked(getEcosystemInfo).mockResolvedValue({
      smartAccountOptions: {
        defaultChainId: mockChain.id,
        sponsorGas: true,
        accountFactoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
      },
      authOptions: [],
      name: "hello world",
      slug: "test-ecosystem",
    });

    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
      ecosystem: { id: "ecosystem.test-ecosystem" },
    });

    const result = await wallet.connect({
      client: mockClient,
      strategy: "email",
      email: "",
      verificationCode: "",
    });

    const expectedSmartAccountAddress = await predictSmartAccountAddress({
      factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
      chain: mockChain,
      adminAddress: TEST_ACCOUNT_A.address,
      client: mockClient,
    });
    expect(result.address).toBe(expectedSmartAccountAddress);
    expect(InAppWallet.connectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
      }),
      expect.objectContaining({
        smartAccount: expect.objectContaining({
          chain: mockChain,
          sponsorGas: true,
          factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
        }),
      }),
      expect.any(Object),
    );
  });

  it("should handle ecosystem wallet auto connection with smart account settings", async () => {
    vi.mocked(getEcosystemInfo).mockResolvedValue({
      smartAccountOptions: {
        defaultChainId: mockChain.id,
        sponsorGas: true,
        accountFactoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
      },
      authOptions: [],
      name: "hello world",
      slug: "test-ecosystem",
    });

    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
      ecosystem: { id: "ecosystem.test-ecosystem" },
    });

    const result = await wallet.autoConnect({
      client: mockClient,
      chain: mockChain,
    });

    const expectedSmartAccountAddress = await predictSmartAccountAddress({
      factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
      chain: mockChain,
      adminAddress: TEST_ACCOUNT_A.address,
      client: mockClient,
    });
    expect(result.address).toBe(expectedSmartAccountAddress);
    expect(InAppWallet.autoConnectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        chain: mockChain,
      }),
      expect.objectContaining({
        smartAccount: expect.objectContaining({
          chain: mockChain,
          sponsorGas: true,
          factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
        }),
      }),
      expect.any(Object),
    );
  });

  it("should handle ecosystem wallet auto connection with smart account settings even when no chain is set", async () => {
    vi.mocked(getEcosystemInfo).mockResolvedValue({
      smartAccountOptions: {
        defaultChainId: mockChain.id,
        sponsorGas: true,
        accountFactoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
      },
      authOptions: [],
      name: "hello world",
      slug: "test-ecosystem",
    });

    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
      ecosystem: { id: "ecosystem.test-ecosystem" },
    });

    const result = await wallet.autoConnect({
      client: mockClient,
    });

    const expectedSmartAccountAddress = await predictSmartAccountAddress({
      factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
      chain: mockChain,
      adminAddress: TEST_ACCOUNT_A.address,
      client: mockClient,
    });
    expect(result.address).toBe(expectedSmartAccountAddress);
    expect(InAppWallet.autoConnectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
      }),
      expect.objectContaining({
        smartAccount: expect.objectContaining({
          chain: mockChain,
          sponsorGas: true,
          factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
        }),
      }),
      expect.any(Object),
    );
  });

  it("should return undefined for getAdminAccount if the account is not a smart account", () => {
    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
    });

    expect(wallet.getAdminAccount?.()).toBeUndefined();
  });

  it("should return undefined if no account is connected", () => {
    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
    });

    expect(wallet.getAdminAccount?.()).toBeUndefined();
  });

  it("should return the admin account for a smart account", async () => {
    vi.unmock("./index.js");
    vi.mocked(getEcosystemInfo).mockResolvedValue({
      smartAccountOptions: {
        defaultChainId: mockChain.id,
        sponsorGas: true,
        accountFactoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_6,
      },
      authOptions: [],
      name: "hello world",
      slug: "test-ecosystem",
    });

    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
      ecosystem: { id: "ecosystem.test-ecosystem" },
    });

    const smartAccount = await wallet.connect({
      client: mockClient,
      strategy: "email",
      email: "",
      verificationCode: "",
    });

    const adminAccount = wallet.getAdminAccount?.();
    expect(adminAccount).toBeDefined();
    expect(adminAccount?.address).not.toBe(smartAccount.address);
  });
});
