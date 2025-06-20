import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const avalancheFuji = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api-testnet.snowtrace.io/api",
      name: "SnowTrace",
      url: "https://testnet.snowtrace.io",
    },
  ],
  id: 43113,
  name: "Avalanche Fuji",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche Fuji",
    symbol: "AVAX",
  },
  testnet: true,
});
