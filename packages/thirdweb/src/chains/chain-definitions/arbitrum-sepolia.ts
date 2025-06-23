import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const arbitrumSepolia = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://sepolia.arbiscan.io/api",
      name: "Arbiscan",
      url: "https://sepolia.arbiscan.io",
    },
  ],
  id: 421614,
  name: "Arbitrum Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Arbitrum Sepolia Ether",
    symbol: "ETH",
  },
  testnet: true,
});
