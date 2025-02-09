import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const treasure = /* @__PURE__ */ defineChain({
  id: 61166,
  name: "Treasure",
  nativeCurrency: { name: "MAGIC", symbol: "MAGIC", decimals: 18 },
  blockExplorers: [
    {
      name: "Treasure Block Explorer",
      url: "https://treasurescan.io",
    },
  ],
});
