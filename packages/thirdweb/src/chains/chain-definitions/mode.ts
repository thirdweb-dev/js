import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const mode = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Modescout",
      url: "https://explorer.mode.network/",
    },
  ],
  id: 34443,
  name: "Mode",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
