// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Localhost",
  chain: "ETH",
  rpc: ["http://localhost:8545"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  // hard code eth icon for now
  icon: {
    url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    height: 512,
    width: 512,
    format: "png",
    sizes: [16, 32, 64, 128, 256, 512],
  },
  shortName: "local",
  chainId: 1337,
  networkId: 1337,
  testnet: true,
};
