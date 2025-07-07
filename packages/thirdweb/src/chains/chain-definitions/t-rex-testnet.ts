import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const tRexTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "T-Rex Testnet Block Explorer",
      url: "https://testnet.trex.xyz/",
    },
  ],
  id: 1962,
  name: "T-Rex Testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  testnet: true,
});
