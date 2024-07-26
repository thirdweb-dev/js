import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const lineaSepolia = /* @__PURE__ */ defineChain({
  id: 59141,
  name: "Linea Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "LineaScan",
      url: "https://sepolia.lineascan.build",
      apiUrl: "https://api-sepolia.lineascan.build/api",
    },
  ],
  testnet: true,
});
