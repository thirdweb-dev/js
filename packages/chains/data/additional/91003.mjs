// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Worlds Appchain",
  chain: "WRLDS",
  shortName: "WRLDS",
  chainId: 91003,
  testnet: true,
  rpc: ["https://api.evm.worlds.dev.eclipsenetwork.xyz/"],
  nativeCurrency: {
    name: "WRLDS",
    symbol: "WRLDS",
    decimals: 18,
  },
  faucets: ["https://faucet.evm.worlds.dev.eclipsenetwork.xyz/request_neon"],
};
