import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const zkCandySepolia = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "zkCandy Block Explorer",
      url: "https://sepolia.explorer.zkcandy.io",
    },
  ],
  id: 302,
  name: "zkCandy Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  testnet: true,
});
