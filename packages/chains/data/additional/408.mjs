// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Omega Mainnet",
  chain: "OmegaNetwork",
  shortName: "OmegaNetwork",
  chainId: 408,
  testnet: false,
  icon: {
    format: "png",
    url: "ipfs://bafkreig676zxfhwhcx5bvvvjxedx6ftr2wq4iiznrwm3c6ozrprbc4oxwm",
    height: 512,
    width: 512,
  },
  rpc: ["https://mainnet-rpc.omtch.com"],
  nativeCurrency: {
    name: "Omega Network Coin",
    symbol: "OMN",
    decimals: 18,
  },
};
