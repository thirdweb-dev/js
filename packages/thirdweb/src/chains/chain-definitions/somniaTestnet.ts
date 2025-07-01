import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const somniaTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://shannon-explorer.somnia.network/api",
      name: "Somnia Testnet Explorer",
      url: "https://shannon-explorer.somnia.network/",
    },
  ],
  id: 50312,
  name: "Somnia Testnet",
  nativeCurrency: { decimals: 18, name: "Somnia Testnet Token", symbol: "STT" },
  testnet: true,
});
