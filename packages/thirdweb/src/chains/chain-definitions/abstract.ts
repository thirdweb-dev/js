import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const abstract = /* @__PURE__ */ defineChain({
  id: 2741,
  name: "Abstract",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Abstract Block Explorer",
      url: "https://explorer.abs.xyz",
    },
  ],
});
