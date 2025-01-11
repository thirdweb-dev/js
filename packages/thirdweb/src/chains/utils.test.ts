import { defineChain as viemChain } from "viem";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { ANVIL_PKEY_A, TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { scroll } from "../chains/chain-definitions/scroll.js";
import { getRpcClient, prepareTransaction } from "../exports/thirdweb.js";
import { toSerializableTransaction } from "../transaction/actions/to-serializable-transaction.js";
import { privateKeyToAccount } from "../wallets/private-key.js";
import { avalanche } from "./chain-definitions/avalanche.js";
import { ethereum } from "./chain-definitions/ethereum.js";
import type { ChainMetadata, LegacyChain } from "./types.js";

import { base } from "viem/chains";
import {
  CUSTOM_CHAIN_MAP,
  cacheChains,
  convertApiChainToChain,
  convertLegacyChain,
  convertViemChain,
  defineChain,
  getCachedChain,
  getChainDecimals,
  getChainNativeCurrencyName,
  getChainSymbol,
  getRpcUrlForChain,
} from "./utils.js";

const legacyChain: LegacyChain = {
  chain: "ETH",
  chainId: 1,
  ens: {
    registry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  },
  explorers: [
    {
      name: "etherscan",
      url: "https://etherscan.io",
      standard: "EIP3091",
    },
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  icon: {
    url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    width: 512,
    height: 512,
    format: "png",
  },
  infoURL: "https://ethereum.org",
  name: "Ethereum Mainnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  networkId: 1,
  redFlags: [],
  rpc: ["https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
  shortName: "eth",
  slip44: 60,
  slug: "ethereum",
  testnet: false,
};

describe("defineChain", () => {
  it("should convert viem chain to thirdweb chain", () => {
    const zoraViem = viemChain({
      id: 7777777,
      name: "Zora",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
      rpcUrls: {
        default: {
          http: ["https://rpc.zora.energy"],
          webSocket: ["wss://rpc.zora.energy"],
        },
      },
      blockExplorers: {
        default: { name: "Explorer", url: "https://explorer.zora.energy" },
      },
    });
    const thirdwebViem = defineChain(zoraViem);

    expect(thirdwebViem.id).toEqual(zoraViem.id);
    expect(thirdwebViem.name).toEqual(zoraViem.name);
    expect(thirdwebViem.nativeCurrency).toEqual(zoraViem.nativeCurrency);
    expect(thirdwebViem.rpc).toEqual(zoraViem.rpcUrls.default.http[0]);
  });

  it("should not cache custom chains", async () => {
    const chain = defineChain({
      id: 123456789,
      name: "Test",
      rpc: "https://rpc.test.com",
    });
    expect(defineChain(123456789).rpc).not.toEqual(chain.rpc);
  });

  it("should overwrite custom chains with same id", async () => {
    const oldChain = defineChain({
      id: ANVIL_CHAIN.id,
      name: "Test",
      rpc: "FAIL",
    }); // this should get ignored
    getRpcClient({ chain: oldChain, client: TEST_CLIENT });

    const account = privateKeyToAccount({
      privateKey: ANVIL_PKEY_A,
      client: TEST_CLIENT,
    });
    const chain2 = defineChain({
      id: ANVIL_CHAIN.id,
      name: "Test2",
      rpc: ANVIL_CHAIN.rpc,
    }); // this should be the rpc used

    const tx = prepareTransaction({
      to: TEST_ACCOUNT_B.address,
      value: 100n,
      chain: chain2,
      client: TEST_CLIENT,
    });

    const serializableTransaction = await toSerializableTransaction({
      transaction: tx,
      from: account.address,
    });

    await account.sendTransaction(serializableTransaction);
    expect(defineChain(1).rpc).not.toEqual(chain2.rpc);
  });

  it("should return a default chain object if un-cached", () => {
    const uncachedChainId = 12345654321;
    const result = getCachedChain(uncachedChainId);
    expect(result.id).toBe(uncachedChainId);
    expect(result.rpc).toBe(`https://${uncachedChainId}.rpc.thirdweb.com`);
  });

  it("should return correct symbols for default chains", async () => {
    const avalancheResult = await getChainSymbol(avalanche);
    expect(avalancheResult).toBe("AVAX");
    const ethResult = await getChainSymbol(ethereum);
    expect(ethResult).toBe("ETH");
  });

  it("should return correct decimals for default chains", async () => {
    const avalancheResult = await getChainDecimals(avalanche);
    expect(avalancheResult).toBe(18);
    const ethResult = await getChainDecimals(ethereum);
    expect(ethResult).toBe(18);
  });

  it("should return correct native currency name for default chains", async () => {
    const avalancheResult = await getChainNativeCurrencyName(avalanche);
    expect(avalancheResult).toBe("Avalanche");
    const ethResult = await getChainNativeCurrencyName(ethereum);
    expect(ethResult).toBe("Ether");
  });

  it("getChainSymbol should work for chain object without symbol", async () => {
    const chain = defineChain(1);
    expect(await getChainSymbol(chain)).toBe("ETH");
  });

  it("getChainDecimals should work for chain object without decimals", async () => {
    const chain = defineChain(1);
    expect(await getChainDecimals(chain)).toBe(18);
  });

  it("getChainDecimals should return `18` if fails to resolve chain decimals", async () => {
    const nonExistentChain = defineChain(-1);
    expect(await getChainDecimals(nonExistentChain)).toBe(18);
  });

  it("getChainNativeCurrencyName should work for chain object without nativeCurrency", async () => {
    const chain = defineChain(1);
    expect(await getChainNativeCurrencyName(chain)).toBe("Ether");
  });

  it("should convert LegacyChain", () => {
    expect(convertLegacyChain(legacyChain)).toStrictEqual({
      id: 1,
      name: "Ethereum Mainnet",
      rpc: "https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
      blockExplorers: [
        {
          name: "etherscan",
          url: "https://etherscan.io",
          apiUrl: "https://etherscan.io",
        },
      ],
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      faucets: [],
      icon: {
        url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
        width: 512,
        height: 512,
        format: "png",
      },
      testnet: undefined,
    });
  });

  it("`defineChain` should work with Legacy chain", () => {
    expect(defineChain(legacyChain)).toStrictEqual({
      id: 1,
      name: "Ethereum Mainnet",
      rpc: "https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
      blockExplorers: [
        {
          name: "etherscan",
          url: "https://etherscan.io",
          apiUrl: "https://etherscan.io",
        },
      ],
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      faucets: [],
      icon: {
        url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
        width: 512,
        height: 512,
        format: "png",
      },
      testnet: undefined,
    });
  });

  it("should cache chains properly", () => {
    cacheChains([scroll]);
    expect(CUSTOM_CHAIN_MAP.get(scroll.id)).toStrictEqual(scroll);
  });

  it("Chain converted from viem should have the blockExplorers being an array", () => {
    expect(Array.isArray(convertViemChain(base).blockExplorers)).toBe(true);
  });

  it("convertApiChainToChain should work", () => {
    const ethChain: ChainMetadata = {
      chainId: 1,
      name: "Ethereum Mainnet",
      chain: "ETH",
      shortName: "eth",
      icon: {
        url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
        width: 512,
        height: 512,
        format: "png",
      },
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      ens: {
        registry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      },
      explorers: [
        {
          name: "etherscan",
          url: "https://etherscan.io",
          standard: "EIP3091",
        },
      ],
      rpc: ["https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
      testnet: false,
      infoURL: "https://ethereum.org",
      slug: "ethereum",
      networkId: 1,
      stackType: "l1",
    };

    expect(convertApiChainToChain(ethChain)).toStrictEqual({
      blockExplorers: [
        {
          apiUrl: "https://etherscan.io",
          name: "etherscan",
          url: "https://etherscan.io",
        },
      ],
      faucets: undefined,
      icon: {
        format: "png",
        height: 512,
        url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
        width: 512,
      },
      id: 1,
      name: "Ethereum Mainnet",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
      rpc: "https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
      testnet: undefined,
    });
  });

  describe("getRpcUrlForChain", () => {
    it("should construct RPC URL using chain ID and client ID when chain is a number", () => {
      const options = {
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
        chain: 1,
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://1.rpc.thirdweb.com/test-client-id");
    });

    it("should return the custom RPC URL if provided", () => {
      const options = {
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
        chain: {
          id: 1,
          rpc: "https://custom-rpc.com",
        },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://custom-rpc.com");
    });

    it("should add client ID to thirdweb RPC URL", () => {
      const options = {
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
        chain: {
          id: 1,
          rpc: "https://1.rpc.thirdweb.com",
        },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://1.rpc.thirdweb.com/test-client-id");
    });

    it("should honor client ID passed directly in rpc field", () => {
      const options = {
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
        chain: {
          id: 1,
          rpc: "https://1.rpc.thirdweb.com/abc",
        },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://1.rpc.thirdweb.com/abc");
    });

    it("should replace template string in rpc url", () => {
      const options = {
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
        chain: {
          id: 1,
          rpc: "https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
        },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://1.rpc.thirdweb.com/test-client-id");
    });

    it("should return the RPC URL without modification if it's not a thirdweb URL", () => {
      const options = {
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
        chain: {
          id: 1,
          rpc: "https://custom-rpc.com",
        },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://custom-rpc.com");
    });
  });
});
