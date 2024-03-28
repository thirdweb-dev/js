// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Xpla Testnet",
  chain: "XPLA",
  rpc: ["https://cube-evm-rpc.xpla.dev"],
  nativeCurrency: {
    name: "XPLA",
    symbol: "XPLA",
    decimals: 18,
  },
  faucets: ["https://faucet.xpla.io/"],
  infoURL: "https://xpla.io/",
  shortName: "xpla-test",
  chainId: 47,
  icon: {
    url: "ipfs://QmbvEAKZfgJckEziU3mpCwz6jqMeWRcLgd8TNsWA7g8sD9/xpla.png",
    width: 512,
    height: 512,
    format: "png",
  },
  explorers: [
    {
      name: "XPLA Explorer",
      url: "https://explorer.xpla.io/testnet",
      standard: "none",
    },
  ],
  testnet: true,
  redFlags: ["reusedChainId"],
};
