import { defineChain } from "../utils.js";

export const bscTestnet = /* @__PURE__ */ defineChain({
  id: 97,
  name: "BNB Smart Chain Testnet",
  nativeCurrency: {
    name: "BNB Chain Native Token",
    symbol: "tBNB",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "bscscan-testnet",
      url: "https://testnet.bscscan.com",
    },
  ],
});
