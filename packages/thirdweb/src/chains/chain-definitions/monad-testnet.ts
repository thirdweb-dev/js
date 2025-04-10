import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const monadTestnet = /*@__PURE__*/ defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Mon", symbol: "MON", decimals: 18 },
  blockExplorers: [
    {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com/",
    },
  ],
  testnet: true,
});
