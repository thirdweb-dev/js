import { defineChain } from "../utils.js";

export const cronos = /* @__PURE__ */ defineChain({
  id: 25,
  name: "Cronos Mainnet",
  nativeCurrency: {
    name: "Cronos",
    symbol: "CRO",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Cronos Explorer",
      url: "https://explorer.cronos.org",
    },
  ],
});
