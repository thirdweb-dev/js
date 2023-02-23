// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Partial<Chain>} */
export default {
  icon: {
    url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/arbitrum/512.png",
    height: 512,
    width: 512,
    format: "png",
    sizes: [16, 32, 64, 128, 256, 512],
  },
  rpc: [
    "https://abritrum-goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
  ],
};
