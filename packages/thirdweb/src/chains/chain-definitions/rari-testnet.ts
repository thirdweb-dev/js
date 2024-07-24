import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const rariTestnet = /*@__PURE__*/ defineChain({
  id: 1918988905,
  name: "RARIchain Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "rarichain-testnet-explorer",
      url: "https://explorer.rarichain.org",
    },
  ],
  testnet: true,
});
