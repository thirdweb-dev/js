/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: expected here */
import { defineChain as viemChain } from "viem";
import { base } from "viem/chains";
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
      standard: "EIP3091",
      url: "https://etherscan.io",
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
    format: "png",
    height: 512,
    url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    width: 512,
  },
  infoURL: "https://ethereum.org",
  name: "Ethereum Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
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
      blockExplorers: {
        default: { name: "Explorer", url: "https://explorer.zora.energy" },
      },
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
      client: TEST_CLIENT,
      privateKey: ANVIL_PKEY_A,
    });
    const chain2 = defineChain({
      id: ANVIL_CHAIN.id,
      name: "Test2",
      rpc: ANVIL_CHAIN.rpc,
    }); // this should be the rpc used

    const tx = prepareTransaction({
      chain: chain2,
      client: TEST_CLIENT,
      to: TEST_ACCOUNT_B.address,
      value: 100n,
    });

    const serializableTransaction = await toSerializableTransaction({
      from: account.address,
      transaction: tx,
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
      blockExplorers: [
        {
          apiUrl: "https://etherscan.io",
          name: "etherscan",
          url: "https://etherscan.io",
        },
      ],
      faucets: [],
      icon: {
        format: "png",
        height: 512,
        url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
        width: 512,
      },
      id: 1,
      name: "Ethereum Mainnet",
      nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
      rpc: "https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
      testnet: undefined,
    });
  });

  it("`defineChain` should work with Legacy chain", () => {
    expect(defineChain(legacyChain)).toStrictEqual({
      blockExplorers: [
        {
          apiUrl: "https://etherscan.io",
          name: "etherscan",
          url: "https://etherscan.io",
        },
      ],
      faucets: [],
      icon: {
        format: "png",
        height: 512,
        url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
        width: 512,
      },
      id: 1,
      name: "Ethereum Mainnet",
      nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
      rpc: "https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
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
      chain: "ETH",
      chainId: 1,
      ens: {
        registry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      },
      explorers: [
        {
          name: "etherscan",
          standard: "EIP3091",
          url: "https://etherscan.io",
        },
      ],
      icon: {
        format: "png",
        height: 512,
        url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
        width: 512,
      },
      infoURL: "https://ethereum.org",
      name: "Ethereum Mainnet",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
      networkId: 1,
      rpc: ["https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
      shortName: "eth",
      slug: "ethereum",
      stackType: "l1",
      testnet: false,
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
        chain: 1,
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://1.rpc.thirdweb.com/test-client-id");
    });

    it("should return the custom RPC URL if provided", () => {
      const options = {
        chain: {
          id: 1,
          rpc: "https://custom-rpc.com",
        },
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://custom-rpc.com");
    });

    it("should add client ID to thirdweb RPC URL", () => {
      const options = {
        chain: {
          id: 1,
          rpc: "https://1.rpc.thirdweb.com",
        },
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://1.rpc.thirdweb.com/test-client-id");
    });

    it("should honor client ID passed directly in rpc field", () => {
      const options = {
        chain: {
          id: 1,
          rpc: "https://1.rpc.thirdweb.com/abc",
        },
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://1.rpc.thirdweb.com/abc");
    });

    it("should replace template string in rpc url", () => {
      const options = {
        chain: {
          id: 1,
          rpc: "https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
        },
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://1.rpc.thirdweb.com/test-client-id");
    });

    it("should return the RPC URL without modification if it's not a thirdweb URL", () => {
      const options = {
        chain: {
          id: 1,
          rpc: "https://custom-rpc.com",
        },
        client: { ...TEST_CLIENT, clientId: "test-client-id" },
      };
      const result = getRpcUrlForChain(options);
      expect(result).toBe("https://custom-rpc.com");
    });
  });
});
