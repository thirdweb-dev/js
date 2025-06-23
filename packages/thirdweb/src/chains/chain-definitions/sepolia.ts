import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const sepolia = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api-sepolia.etherscan.io/api",
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
    },
  ],
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { decimals: 18, name: "Sepolia Ether", symbol: "ETH" },
  testnet: true,
});
