import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const scrollSepoliaTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Scroll Sepolia Etherscan",
      url: "https://sepolia.scrollscan.com",
    },
  ],
  id: 534353,
  name: "Scroll Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  testnet: true,
});
