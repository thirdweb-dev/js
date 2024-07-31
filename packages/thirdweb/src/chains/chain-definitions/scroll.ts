import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const scroll = /*@__PURE__*/ defineChain({
  id: 534352,
  name: "Scroll",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Scrollscan",
      url: "https://scrollscan.com",
    },
  ],
});
