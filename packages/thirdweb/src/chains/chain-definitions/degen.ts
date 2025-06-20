import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const degen = /* @__PURE__ */ defineChain({
  blockExplorers: [],
  id: 666666666,
  name: "Degen Chain",
  nativeCurrency: {
    decimals: 18,
    name: "DEGEN",
    symbol: "DEGEN",
  },
});
