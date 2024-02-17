import { defineChain } from "../utils.js";

export const zoraSepolia = /*@__PURE__*/ defineChain({
  id: 999999999,
  name: "Zora Sepolia",

  nativeCurrency: {
    decimals: 18,
    name: "Zora Sepolia",
    symbol: "ETH",
  },
  blockExplorers: [
    {
      name: "Zora Sepolia Explorer",
      url: "https://sepolia.explorer.zora.energy/",
      apiUrl: "https://sepolia.explorer.zora.energy/api",
    },
  ],
  testnet: true,
});
