import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const base = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api.basescan.org/api",
      name: "Basescan",
      url: "https://basescan.org",
    },
  ],
  id: 8453,
  name: "Base",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
