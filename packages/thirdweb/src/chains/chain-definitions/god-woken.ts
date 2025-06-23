import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const godWoken = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "GWScan Block Explorer",
      url: "https://v1.gwscan.com",
    },
  ],
  id: 71402,
  name: "Godwoken Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "pCKB",
    symbol: "pCKB",
  },
});
