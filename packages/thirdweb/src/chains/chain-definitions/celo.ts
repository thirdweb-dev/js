import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const celo = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "blockscout",
      url: "https://explorer.celo.org",
    },
  ],
  id: 42220,
  name: "Celo Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "CELO",
    symbol: "CELO",
  },
});
