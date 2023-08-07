// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Xai Görli Orbit",
  chain: "Xai Görli Orbit Testnet",
  shortName: "xai-goerli",
  chainId: 47279324479,
  testnet: true,
  nativeCurrency: {
    name: "Xai Görli Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: ["https://testnet.xai-chain.net/rpc"],
  explorers: [
    {
      name: "Xai Görli Testnet Explorer",
      url: "https://testnet-explorer.xai-chain.net",
      standard: "EIP3091",
    },
  ],
  faucets: [],
  infoURL: "https://xai.games/",
};
