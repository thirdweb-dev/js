import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const scrollSepoliaTestnet = /*@__PURE__*/ defineChain({
  id: 534353,
  name: "Scroll Sepolia Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Scroll Sepolia Etherscan",
      url: "https://sepolia.scrollscan.com",
    },
  ],
  testnet: true,
});
