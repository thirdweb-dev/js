import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const apechain = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Apescan",
      url: "https://apescan.io",
    },
  ],
  id: 33139,
  name: "Ape Chain",
  nativeCurrency: {
    name: "ApeCoin",
    symbol: "APE",
    decimals: 18,
  },
});
