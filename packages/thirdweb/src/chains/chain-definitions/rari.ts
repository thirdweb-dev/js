import { defineChain } from "../utils.js";

export const rari = /* @__PURE__ */ defineChain({
  id: 1380012617,
  name: "Rarichain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "rarichain-explorer",
      url: "https://mainnet.explorer.rarichain.org",
    },
  ],
});
