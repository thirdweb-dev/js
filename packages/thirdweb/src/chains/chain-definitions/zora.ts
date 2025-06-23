import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const zora = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://explorer.zora.energy/api",
      name: "Explorer",
      url: "https://explorer.zora.energy",
    },
  ],
  id: 7777777,
  name: "Zora",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
});
