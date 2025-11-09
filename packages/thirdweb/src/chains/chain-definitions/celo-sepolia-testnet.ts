import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const celoSepoliaTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Celo Sepolia Explorer",
      url: "https://celo-sepolia.blockscout.com/",
    },
  ],
  id: 11142220,
  name: "Celo Sepolia Testnet",
  nativeCurrency: { decimals: 18, name: "CELO", symbol: "CELO-S" },
  testnet: true,
});
