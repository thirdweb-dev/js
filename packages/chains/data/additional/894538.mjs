// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Thirdweb Ava Testnet",
  chain: "TW",
  rpc: ["https://subnets.avax.network/thirdweb/testnet/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "TWT",
    symbol: "TWT",
    decimals: 18,
  },
  shortName: "tw-ava-testnet",
  chainId: 894538,
  networkId: 894538,
  testnet: true,
};
