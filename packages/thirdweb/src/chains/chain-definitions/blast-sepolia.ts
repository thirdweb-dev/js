import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const blastSepolia = /* @__PURE__ */ defineChain({
  id: 168587773,
  name: "Blast Sepolia Testnet",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Blast Sepolia Explorer",
      url: "https://testnet.blastscan.io",
    },
  ],
  testnet: true,
});
