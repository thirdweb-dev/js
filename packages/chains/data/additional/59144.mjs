// @ts-check
/** @typedef { import("../../src/types").Chain } Chain */

/** @type {Omit<Chain, "slug">} */
export default {
  name: "Linea Mainnet",
  chain: "Linea Mainnet",
  shortName: "linea-mainnet",
  chainId: 59144,
  testnet: false,
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: [],
  explorers: [
    {
      name: "Linea Scan",
      url: "https://lineascan.build",
      standard: "",
    },
  ],
  faucets: ["https://www.infura.io/faucet/linea"],
  infoURL: "https://docs.linea.build/overview",
  icon: {
    url: "ipfs://QmURjritnHL7a8TwZgsFwp3f272DJmG5paaPtWDZ98QZwH",
    height: 512,
    width: 512,
    format: "svg",
  },
};
