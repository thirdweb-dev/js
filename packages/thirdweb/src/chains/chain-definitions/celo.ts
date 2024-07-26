import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const celo = /* @__PURE__ */ defineChain({
  id: 42220,
  name: "Celo Mainnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "blockscout",
      url: "https://explorer.celo.org",
    },
  ],
});
