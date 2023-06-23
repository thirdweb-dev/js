// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Shardeum Sphinx DApp 1.X",
  shortName: "Sphinx",
  chain: "Shardeum",
  chainId: 8081,
  icon: {
    height: 1200,
    width: 1200,
    url: "ipfs://QmQWzHUy4kmk1eGksDREGQL3GWrssdAPBxHt4aKGAFHSfJ",
    format: "png",
  },
  rpc: ["https://dapps.shardeum.org/sphinx"],
  nativeCurrency: {
    name: "Shardeum",
    symbol: "SHM",
    decimals: 18,
  },
  explorers: [
    {
      name: "Shardeum Scan",
      url: "https://explorer-dapps.shardeum.org",
      standard: "EIP3091",
    },
  ],
  faucets: ["https://faucet-dapps.shardeum.org/"],
  infoURL: "https://docs.shardeum.org/",
  testnet: true,
};
