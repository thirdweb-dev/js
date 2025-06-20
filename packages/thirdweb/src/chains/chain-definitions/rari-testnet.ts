import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const rariTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "rarichain-testnet-explorer",
      url: "https://explorer.rarichain.org",
    },
  ],
  id: 1918988905,
  name: "RARIchain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  testnet: true,
});
