import { describe, expect, it } from "vitest";
import type { ChainMetadata } from "../../chains/types.js";
import { getValidChainRPCs, getValidPublicRPCUrl } from "./chains.js";

const chain: ChainMetadata = {
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
  rpc: [
    "https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
    "ws://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
  ],
  testnet: false,
  infoURL: "https://ethereum.org",
  slug: "ethereum",
  networkId: 1,
  stackType: "l1",
};

describe("Wallet chain utils", () => {
  it("getValidPublicRPCUrl should work", () => {
    expect(getValidPublicRPCUrl(chain)).toStrictEqual([
      "https://1.rpc.thirdweb.com/",
    ]);
  });

  it("getValidChainRPCs should work for http mode", () => {
    expect(
      getValidChainRPCs({ rpc: chain.rpc, chainId: chain.chainId }),
    ).toStrictEqual(["https://1.rpc.thirdweb.com/"]);
  });

  it("getValidChainRPCs should work for ws mode", () => {
    expect(
      getValidChainRPCs(
        { rpc: chain.rpc, chainId: chain.chainId },
        undefined,
        "ws",
      ),
    ).toStrictEqual(["ws://1.rpc.thirdweb.com/"]);
  });

  it("should throw error if no RPC url is processed", () => {
    expect(() => getValidChainRPCs({ rpc: [], chainId: 1 })).toThrow();
  });
});
