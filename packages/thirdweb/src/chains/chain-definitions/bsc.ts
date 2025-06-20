import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const bsc = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "bscscan",
      url: "https://bscscan.com",
    },
  ],
  id: 56,
  name: "BNB Smart Chain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "BNB Chain Native Token",
    symbol: "BNB",
  },
});
