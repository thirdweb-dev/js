import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const arbitrum = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api.arbiscan.io/api",
      name: "Arbiscan",
      url: "https://arbiscan.io",
    },
  ],
  id: 42161,
  name: "Arbitrum One",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
