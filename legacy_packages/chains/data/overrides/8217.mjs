// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Partial<Chain>} */
export default {
  chainId: 8217,
  rpc: [
    "https://public-en-cypress.klaytn.net",
    "https://klaytn-mainnet-rpc.allthatnode.com:8551",
    "https://klaytn.blockpi.network/v1/rpc/public",
  ],
  explorers: [
    {
      name: "klaytnfinder",
      url: "https://www.klaytnfinder.io/",
      standard: "none",
    },
  ],
  icon: {
    format: "png",
    url: "ipfs://bafkreigtgdivlmfvf7trqjqy4vkz2d26xk3iif6av265v4klu5qavsugm4",
    height: 1000,
    width: 1000,
  },
};
