import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const frameTestnet = /*@__PURE__*/ defineChain({
  id: 68840142,
  name: "Frame Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Frame Testnet Explorer",
      url: "https://explorer.testnet.frame.xyz",
    },
  ],
  testnet: true,
});
