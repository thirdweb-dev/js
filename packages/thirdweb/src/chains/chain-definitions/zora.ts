import { defineChain } from "../utils.js";

export const zora = /*@__PURE__*/ defineChain({
  id: 7777777,
  name: "Zora",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  blockExplorers: [
    {
      name: "Explorer",
      url: "https://explorer.zora.energy",
      apiUrl: "https://explorer.zora.energy/api",
    },
  ],
});
