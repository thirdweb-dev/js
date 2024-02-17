import { defineChain } from "../utils.js";

export const avalanche = /* @__PURE__ */ defineChain({
  id: 43114,
  name: "Avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  blockExplorers: [
    {
      name: "SnowTrace",
      url: "https://snowtrace.io",
      apiUrl: "https://api.snowtrace.io/api",
    },
  ],
});
