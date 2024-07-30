import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const palm = /* @__PURE__ */ defineChain({
  id: 11297108109,
  name: "Palm",
  nativeCurrency: {
    name: "PALM",
    symbol: "PALM",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Chainlens",
      url: "https://palm.chainlens.com",
    },
  ],
});
