import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const cronos = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Cronos Explorer",
      url: "https://explorer.cronos.org",
    },
  ],
  id: 25,
  name: "Cronos Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Cronos",
    symbol: "CRO",
  },
});
