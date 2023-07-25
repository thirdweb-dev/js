// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "ProofOfPepe Testnet",
  chain: "POPTestnet",
  shortName: "POPTestnet",
  chainId: 331769,
  testnet: true,
  rpc: ["https://testnet01.proofofpepe.tech"],
  nativeCurrency: {
    name: "POP",
    symbol: "POP",
    decimals: 18,
  },
  explorers: [
    {
      name: "ProofOfPepe Explorer",
      url: "https://pepescan.app/",
      standard: "EIP3091",
    },
  ],
};
