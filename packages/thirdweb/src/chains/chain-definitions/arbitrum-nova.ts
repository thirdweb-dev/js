import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const arbitrumNova = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Arbiscan",
      url: "https://nova.arbiscan.io/",
    },
  ],
  id: 42170,
  name: "Arbitrum Nova",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
