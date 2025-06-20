import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const scroll = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Scrollscan",
      url: "https://scrollscan.com",
    },
  ],
  id: 534352,
  name: "Scroll",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
});
