import { beforeEach, describe, expect, it, vi } from "vitest";
import { baseSepolia } from "../../../../chains/chain-definitions/base-sepolia.js";
import { createThirdwebClient } from "../../../../client/client.js";
import { getEcosystemInfo } from "../../../ecosystem/get-ecosystem-wallet-auth-options.js";
import type { Account } from "../../../interfaces/wallet.js";
import type { InAppConnector } from "../interfaces/connector.js";
import { createInAppWallet } from "./in-app-core.js";
import { autoConnectInAppWallet, connectInAppWallet } from "./index.js";

vi.mock("../../../../analytics/track/connect.js", () => ({
  trackConnect: vi.fn(),
}));

vi.mock("./index.js", () => ({
  autoConnectInAppWallet: vi.fn(),
  connectInAppWallet: vi.fn(),
}));

vi.mock("../../../ecosystem/get-ecosystem-wallet-auth-options.js", () => ({
  getEcosystemInfo: vi.fn(),
}));

describe("createInAppWallet", () => {
  const mockClient = createThirdwebClient({
    clientId: "test-client",
  });
  const mockChain = baseSepolia;
  const mockAccount = { address: "0x123" } as Account;

  const mockConnectorFactory = vi.fn(() =>
    Promise.resolve({
      connect: vi.fn(),
      logout: vi.fn(() => Promise.resolve({ success: true })),
      authenticate: vi.fn(),
      getAccounts: vi.fn(),
      getAccount: vi.fn(),
      getProfiles: vi.fn(),
      getUser: vi.fn(),
      linkProfile: vi.fn(),
      preAuthenticate: vi.fn(),
    } as InAppConnector),
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should connect successfully", async () => {
    vi.mocked(connectInAppWallet).mockResolvedValue([mockAccount, mockChain]);

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
    expect(connectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        chain: mockChain,
      }),
      undefined,
      expect.any(Object),
    );
  });

  it("should auto connect successfully", async () => {
    vi.mocked(autoConnectInAppWallet).mockResolvedValue([
      mockAccount,
      mockChain,
    ]);

    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
    });

    const result = await wallet.autoConnect({
      client: mockClient,
      chain: mockChain,
    });

    expect(result).toBe(mockAccount);
    expect(autoConnectInAppWallet).toHaveBeenCalledWith(
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
        accountFactoryAddress: "0x456",
      },
      authOptions: [],
      name: "hello world",
      slug: "test-ecosystem",
    });

    vi.mocked(connectInAppWallet).mockResolvedValue([mockAccount, mockChain]);

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

    expect(result).toBe(mockAccount);
    expect(connectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        chain: mockChain,
      }),
      expect.objectContaining({
        smartAccount: expect.objectContaining({
          chain: mockChain,
          sponsorGas: true,
          factoryAddress: "0x456",
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
        accountFactoryAddress: "0x456",
      },
      authOptions: [],
      name: "hello world",
      slug: "test-ecosystem",
    });

    vi.mocked(connectInAppWallet).mockResolvedValue([mockAccount, mockChain]);

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

    expect(result).toBe(mockAccount);
    expect(connectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
      }),
      expect.objectContaining({
        smartAccount: expect.objectContaining({
          chain: mockChain,
          sponsorGas: true,
          factoryAddress: "0x456",
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
        accountFactoryAddress: "0x456",
      },
      authOptions: [],
      name: "hello world",
      slug: "test-ecosystem",
    });

    vi.mocked(autoConnectInAppWallet).mockResolvedValue([
      mockAccount,
      mockChain,
    ]);

    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
      ecosystem: { id: "ecosystem.test-ecosystem" },
    });

    const result = await wallet.autoConnect({
      client: mockClient,
      chain: mockChain,
    });

    expect(result).toBe(mockAccount);
    expect(autoConnectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
        chain: mockChain,
      }),
      expect.objectContaining({
        smartAccount: expect.objectContaining({
          chain: mockChain,
          sponsorGas: true,
          factoryAddress: "0x456",
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
        accountFactoryAddress: "0x456",
      },
      authOptions: [],
      name: "hello world",
      slug: "test-ecosystem",
    });

    vi.mocked(autoConnectInAppWallet).mockResolvedValue([
      mockAccount,
      mockChain,
    ]);

    const wallet = createInAppWallet({
      connectorFactory: mockConnectorFactory,
      ecosystem: { id: "ecosystem.test-ecosystem" },
    });

    const result = await wallet.autoConnect({
      client: mockClient,
    });

    expect(result).toBe(mockAccount);
    expect(autoConnectInAppWallet).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
      }),
      expect.objectContaining({
        smartAccount: expect.objectContaining({
          chain: mockChain,
          sponsorGas: true,
          factoryAddress: "0x456",
        }),
      }),
      expect.any(Object),
    );
  });
});
