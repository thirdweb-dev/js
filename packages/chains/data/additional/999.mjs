// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Zora Testnet",
  chain: "ETH",
  rpc: ["https://testnet.rpc.zora.co/"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "GETH",
    decimals: 18,
  },
  icon: {
    url: "ipfs://QmZ6qaRwTPFEZUspwMUjaxC6KhmzcELdRQcQzS3P72Dzts/Vector.svg",
    height: 512,
    width: 512,
    format: "svg",
  },
  shortName: "zora-testnet",
  chainId: 999,
  networkId: 999,
  testnet: true,
  redFlags: ["reusedChainId"],
};
