import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const avalanche = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api.snowtrace.io/api",
      name: "SnowTrace",
      url: "https://snowtrace.io",
    },
  ],
  id: 43114,
  name: "Avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
});
