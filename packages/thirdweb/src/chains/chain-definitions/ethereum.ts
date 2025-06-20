import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const ethereum = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  ],
  id: 1,
  name: "Ethereum",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
});

/**
 * @alias ethereum
 * @chain
 */
export const mainnet = ethereum;
