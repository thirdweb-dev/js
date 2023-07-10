// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Partial<Chain>} */
export default {
  icon: {
    url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    height: 512,
    width: 512,
    format: "png",
  },
  rpc: ["https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}"],
  faucets: ["https://faucet.paradigm.xyz/"],
};
