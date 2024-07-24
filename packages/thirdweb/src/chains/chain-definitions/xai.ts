import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const xai = /*@__PURE__*/ defineChain({
  id: 660279,
  name: "Xai Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "XAI token",
    symbol: "XAI",
  },
  blockExplorers: [
    {
      name: "Blockscout",
      url: "https://explorer.xai-chain.net",
    },
  ],
});
