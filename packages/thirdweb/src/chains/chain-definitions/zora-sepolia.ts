import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const zoraSepolia = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://sepolia.explorer.zora.energy/api",
      name: "Zora Sepolia Explorer",
      url: "https://sepolia.explorer.zora.energy/",
    },
  ],
  id: 999999999,
  name: "Zora Sepolia",

  nativeCurrency: {
    decimals: 18,
    name: "Zora Sepolia",
    symbol: "ETH",
  },
  testnet: true,
});
