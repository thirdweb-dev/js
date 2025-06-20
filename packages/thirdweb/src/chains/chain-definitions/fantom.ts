import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const fantom = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "ftmscan",
      url: "https://ftmscan.com",
    },
  ],
  id: 250,
  name: "Fantom Opera",
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
});
