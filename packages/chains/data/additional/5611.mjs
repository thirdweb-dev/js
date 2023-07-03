// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "opBNB",
  chain: "opBNB",
  shortName: "opBNB",
  chainId: 5611,
  testnet: true,
  nativeCurrency: {
    name: "Testnet bnb",
    symbol: "Tbnb",
    decimals: 18,
  },
  rpc: ["https://opbnb-testnet-rpc.bnbchain.org"],
  explorers: [
    {
      name: "opBNB Scan",
      url: "https://opbnbscan.com/",
      standard: "",
    },
  ],
  faucets: ["https://opbnb-testnet-bridge.bnbchain.org/"],
  infoURL: "https://docs.bnbchain.org/",
  icon: {
    url: "ipfs://QmfFvfFsQKby3M32uqr8T55ENBnTHL8bkdeeu6rYVL2n4z/opbnblogo.svg",
    height: 512,
    width: 512,
    format: "svg",
  },
};
