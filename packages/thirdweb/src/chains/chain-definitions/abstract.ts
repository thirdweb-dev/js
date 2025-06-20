import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const abstract = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Abstract Block Explorer",
      url: "https://explorer.abs.xyz",
    },
  ],
  id: 2741,
  name: "Abstract",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
