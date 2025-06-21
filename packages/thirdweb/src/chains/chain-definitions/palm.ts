import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const palm = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Chainlens",
      url: "https://palm.chainlens.com",
    },
  ],
  id: 11297108109,
  name: "Palm",
  nativeCurrency: {
    decimals: 18,
    name: "PALM",
    symbol: "PALM",
  },
});
