import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const lineaSepolia = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api-sepolia.lineascan.build/api",
      name: "LineaScan",
      url: "https://sepolia.lineascan.build",
    },
  ],
  id: 59141,
  name: "Linea Sepolia",
  nativeCurrency: { decimals: 18, name: "Sepolia Ether", symbol: "ETH" },
  testnet: true,
});
