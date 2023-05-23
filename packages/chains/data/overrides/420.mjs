// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Partial<Chain>} */
export default {
  icon: {
    url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/optimism/512.png",
    height: 512,
    width: 512,
    format: "png",
  },
  rpc: [
    "https://optimism-goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
  ],
  faucets: ["https://coinbase.com/faucets/optimism-goerli-faucet"],
};
