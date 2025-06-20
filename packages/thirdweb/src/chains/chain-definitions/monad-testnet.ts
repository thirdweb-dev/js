import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const monadTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com/",
    },
  ],
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { decimals: 18, name: "Mon", symbol: "MON" },
  testnet: true,
});
