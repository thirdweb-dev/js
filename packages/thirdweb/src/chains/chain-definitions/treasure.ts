import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const treasure = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Treasure Block Explorer",
      url: "https://treasurescan.io",
    },
  ],
  id: 61166,
  name: "Treasure",
  nativeCurrency: { decimals: 18, name: "MAGIC", symbol: "MAGIC" },
});
