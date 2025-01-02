import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const scrollAlphaTestnet = /*@__PURE__*/ defineChain({
  id: 534353,
  name: "Scroll Alpha Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Scroll Alpha Testnet Block Explorer",
      url: "https://alpha-blockscout.scroll.io",
    },
  ],
  testnet: true,
});
