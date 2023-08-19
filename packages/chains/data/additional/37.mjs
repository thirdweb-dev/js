// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Xpla Mainnet",
  chain: "XPLA",
  rpc: ["https://dimension-evm-rpc.xpla.dev"],
  nativeCurrency: {
    name: "XPLA",
    symbol: "XPLA",
    decimals: 18,
  },
  infoURL: "https://xpla.io/",
  shortName: "xpla",
  chainId: 37,
  icon: {
    url: "ipfs://Qmf4GoxfpeA5VGqu7KP5eyv1WKaCpNDbvMxq1MjQBwFWxq",
    width: 512,
    height: 512,
    format: "png",
  },
  explorers: [
    {
      name: "XPLA Explorer",
      url: "https://explorer.xpla.io",
      standard: "none",
    },
  ],
  testnet: false,
};
