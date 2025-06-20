import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const frameTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Frame Testnet Explorer",
      url: "https://explorer.testnet.frame.xyz",
    },
  ],
  id: 68840142,
  name: "Frame Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  testnet: true,
});
