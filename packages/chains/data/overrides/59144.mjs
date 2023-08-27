// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Partial<Chain>} */
export default {
  chainId: 59144,
  rpc: [
    "https://rpc.linea.build",
    "https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}",
  ],
  explorers: [
    { name: "lineascan", url: "https://lineascan.build", standard: "EIP3091" },
  ],
};
