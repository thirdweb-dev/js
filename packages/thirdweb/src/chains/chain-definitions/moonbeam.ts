import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const moonbeam = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "moonscan",
      url: "https://moonbeam.moonscan.io",
    },
  ],
  id: 1284,
  name: "Moonbeam",
  nativeCurrency: {
    decimals: 18,
    name: "Glimmer",
    symbol: "GLMR",
  },
});
