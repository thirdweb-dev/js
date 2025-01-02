import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const fantom = /* @__PURE__ */ defineChain({
  id: 250,
  name: "Fantom Opera",
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "ftmscan",
      url: "https://ftmscan.com",
    },
  ],
});
