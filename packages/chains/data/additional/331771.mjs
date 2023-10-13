// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "POP Mainnet",
  chain: "POP",
  shortName: "POP",
  chainId: 331771,
  testnet: false,
  icon: {
    format: "png",
    url: "ipfs://QmP8rYvcc7aJB3c2YZxjxaySvHapHnoK8MnxuSuDT4PtF2",
    height: 400,
    width: 400,
  },
  rpc: [
    "https://rpc00.proofofpepe.tech",
    "https://rpc01.proofofpepe.tech",
    "https://rpc02.proofofpepe.tech",
  ],
  nativeCurrency: {
    name: "Pepe",
    symbol: "PEPE",
    decimals: 18,
  },
  explorers: [
    { name: "Pepescan", url: "https://pepescan.app", standard: "none" },
  ],
};
