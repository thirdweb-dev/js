import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const degen = /* @__PURE__ */ defineChain({
  id: 666666666,
  name: "Degen Chain",
  nativeCurrency: {
    name: "DEGEN",
    symbol: "DEGEN",
    decimals: 18,
  },
  blockExplorers: [],
});
