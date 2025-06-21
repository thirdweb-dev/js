import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const baseSepolia = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api-sepolia.basescan.org/api",
      name: "Basescan",
      url: "https://sepolia.basescan.org",
    },
  ],
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: { decimals: 18, name: "Sepolia Ether", symbol: "ETH" },
  testnet: true,
});
