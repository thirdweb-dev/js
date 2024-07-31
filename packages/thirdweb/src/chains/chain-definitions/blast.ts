import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const blast = /* @__PURE__ */ defineChain({
  id: 81457,
  name: "Blast",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Blastscan",
      url: "https://blastscan.io",
      apiUrl: "https://api.blastscan.io/api",
    },
  ],
});
