import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const blast = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api.blastscan.io/api",
      name: "Blastscan",
      url: "https://blastscan.io",
    },
  ],
  id: 81457,
  name: "Blast",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
