import { defineChain } from "../utils.js";

export const avalancheFuji = /* @__PURE__ */ defineChain({
  id: 43113,
  name: "Avalanche Fuji",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche Fuji",
    symbol: "AVAX",
  },
  blockExplorers: [
    {
      name: "SnowTrace",
      url: "https://testnet.snowtrace.io",
      apiUrl: "https://api-testnet.snowtrace.io/api",
    },
  ],
  testnet: true,
});
