import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const blastSepolia = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Blast Sepolia Explorer",
      url: "https://testnet.blastscan.io",
    },
  ],
  id: 168587773,
  name: "Blast Sepolia Testnet",
  nativeCurrency: { decimals: 18, name: "Sepolia Ether", symbol: "ETH" },
  testnet: true,
});
