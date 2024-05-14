import { defineChain } from "../utils.js";

export const bsc = /* @__PURE__ */ defineChain({
  id: 56,
  name: "BNB Smart Chain Mainnet",
  nativeCurrency: {
    name: "BNB Chain Native Token",
    symbol: "BNB",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "bscscan",
      url: "https://bscscan.com",
    },
  ],
});
