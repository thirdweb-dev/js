import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const rari = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "rarichain-explorer",
      url: "https://mainnet.explorer.rarichain.org",
    },
  ],
  id: 1380012617,
  name: "Rarichain",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
});
