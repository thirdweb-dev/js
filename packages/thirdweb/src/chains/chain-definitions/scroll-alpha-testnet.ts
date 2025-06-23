import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const scrollAlphaTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Scroll Alpha Testnet Block Explorer",
      url: "https://alpha-blockscout.scroll.io",
    },
  ],
  id: 534353,
  name: "Scroll Alpha Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  testnet: true,
});
