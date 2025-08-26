import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const HashkeyTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Hashkey Explorer",
      url: "https://testnet-explorer.hsk.xyz",
    },
  ],
  rpc: "https://testnet.hsk.xyz",
  id: 133,
  name: "Hashkey Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "HashKey Platform Token",
    symbol: "HSK",
  },
  testnet: true,
});
