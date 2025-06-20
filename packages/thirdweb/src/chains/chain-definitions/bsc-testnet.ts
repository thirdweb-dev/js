import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const bscTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "bscscan-testnet",
      url: "https://testnet.bscscan.com",
    },
  ],
  id: 97,
  name: "BNB Smart Chain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BNB Chain Native Token",
    symbol: "tBNB",
  },
});
