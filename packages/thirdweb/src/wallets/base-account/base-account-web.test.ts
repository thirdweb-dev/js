import type { ProviderInterface } from "@base-org/account";
import * as ox__Hex from "ox/Hex";
import * as ox__TypedData from "ox/TypedData";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { TEST_WALLET_A } from "~test/addresses.js";
import { BASE_ACCOUNT } from "../constants.js";
import type { Wallet } from "../interfaces/wallet.js";
import {
  autoConnectBaseAccountSDK,
  connectBaseAccountSDK,
  isBaseAccountSDKWallet,
} from "./base-account-web.js";

// Mock dependencies
vi.mock("@base-org/account", () => ({
  createBaseAccountSDK: vi.fn(() => ({
    getProvider: () => ({
      disconnect: vi.fn(),
      emit: vi.fn(),
      off: vi.fn(),
      on: vi.fn(),
      request: vi.fn(),
    }),
  })),
}));

vi.mock("../../utils/address.js", () => ({
  getAddress: vi.fn((address) => address),
}));

vi.mock("../../chains/utils.js", () => ({
  getCachedChain: vi.fn((chainId) => ({ id: chainId })),
  getChainMetadata: vi.fn(async (_chain) => ({
    explorers: [{ url: "https://explorer.test" }],
    name: "Test Chain",
    nativeCurrency: { decimals: 18, name: "Test Coin", symbol: "TC" },
  })),
}));

vi.mock("../utils/normalizeChainId.js", () => ({
  normalizeChainId: vi.fn((chainId) => Number(chainId)),
}));

vi.mock("ox/Hex", async () => {
  const actualModule = await vi.importActual("ox/Hex");
  return {
    ...actualModule,
    toNumber: vi.fn((hex) => Number.parseInt(hex, 16)),
    validate: vi.fn(() => true),
  };
});

vi.mock("ox/TypedData", () => ({
  extractEip712DomainTypes: vi.fn(() => []),
  serialize: vi.fn(() => "serializedData"),
  validate: vi.fn(),
}));

describe("Base Account Web", () => {
  let provider: ProviderInterface;

  beforeEach(async () => {
    // Reset module to clear cached provider
    vi.resetModules();
    const module = await import("./base-account-web.js");
    provider = await module.getBaseAccountWebProvider();
  });

  test("getBaseAccountWebProvider initializes provider", async () => {
    expect(provider).toBeDefined();
    expect(provider.request).toBeInstanceOf(Function);
  });

  test("isBaseAccountSDKWallet returns true for Base Account wallet", () => {
    const wallet: Wallet = { id: BASE_ACCOUNT } as Wallet;
    expect(isBaseAccountSDKWallet(wallet)).toBe(true);
  });

  test("isBaseAccountSDKWallet returns false for non-Base Account wallet", () => {
    const wallet: Wallet = { id: "other" } as unknown as Wallet;
    expect(isBaseAccountSDKWallet(wallet)).toBe(false);
  });

  test("connectBaseAccountSDK connects to the wallet", async () => {
    provider.request = vi
      .fn()
      .mockResolvedValueOnce([TEST_WALLET_A])
      .mockResolvedValueOnce("0x1");
    const emitter = { emit: vi.fn() };
    const options = { client: {} };

    const [account, chain] = await connectBaseAccountSDK(
      // biome-ignore lint/suspicious/noExplicitAny: Inside tests
      options as any,
      // biome-ignore lint/suspicious/noExplicitAny: Inside tests
      emitter as any,
      provider,
    );

    expect(account.address).toBe(TEST_WALLET_A);
    expect(chain.id).toBe(1);
  });

  test("autoConnectBaseAccountSDK auto-connects to the wallet", async () => {
    provider.request = vi
      .fn()
      .mockResolvedValueOnce([TEST_WALLET_A])
      .mockResolvedValueOnce("0x1");
    const emitter = { emit: vi.fn() };
    const options = { client: {} };

    const [account, chain] = await autoConnectBaseAccountSDK(
      // biome-ignore lint/suspicious/noExplicitAny: Inside tests
      options as any,
      // biome-ignore lint/suspicious/noExplicitAny: Inside tests
      emitter as any,
      provider,
    );

    expect(account.address).toBe(TEST_WALLET_A);
    expect(chain.id).toBe(1);
  });

  test("signMessage uses ox__Hex for validation", async () => {
    const account = {
      address: TEST_WALLET_A,
      signMessage: async ({ message }: { message: string }) => {
        const messageToSign = `0x${ox__Hex.fromString(message)}`;
        const res = await provider.request({
          method: "personal_sign",
          params: [messageToSign, account.address],
        });
        expect(ox__Hex.validate(res)).toBe(true);
        return res;
      },
    };

    provider.request = vi.fn().mockResolvedValue("0xsignature");
    const signature = await account.signMessage({ message: "hello" });
    expect(signature).toBe("0xsignature");
  });

  test("signTypedData uses ox__TypedData for serialization", async () => {
    const account = {
      address: TEST_WALLET_A,
      // biome-ignore lint/suspicious/noExplicitAny: Inside tests
      signTypedData: async (typedData: any) => {
        const { domain, message, primaryType } = typedData;
        const types = {
          EIP712Domain: ox__TypedData.extractEip712DomainTypes(domain),
          ...typedData.types,
        };
        ox__TypedData.validate({ domain, message, primaryType, types });
        const stringifiedData = ox__TypedData.serialize({
          domain: domain ?? {},
          message,
          primaryType,
          types,
        });
        const res = await provider.request({
          method: "eth_signTypedData_v4",
          params: [account.address, stringifiedData],
        });
        expect(ox__Hex.validate(res)).toBe(true);
        return res;
      },
    };

    provider.request = vi.fn().mockResolvedValue("0xsignature");
    const signature = await account.signTypedData({
      domain: {},
      message: {},
      primaryType: "EIP712Domain",
      types: {},
    });
    expect(signature).toBe("0xsignature");
  });
});
