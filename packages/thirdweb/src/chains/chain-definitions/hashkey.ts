import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const Hashkey = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Hashkey Explorer",
      url: "https://hashkey.blockscout.com/",
    },
  ],
  rpc: "https://mainnet.hsk.xyz",
  id: 177,
  name: "Hashkey",
  nativeCurrency: {
    decimals: 18,
    name: "HashKey Platform Token",
    symbol: "HSK",
  },
});
