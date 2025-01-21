import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const mode = /* @__PURE__ */ defineChain({
  id: 919,
  name: "Mode",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Modescout",
      url: "https://explorer.mode.network/",
    },
  ],
});
