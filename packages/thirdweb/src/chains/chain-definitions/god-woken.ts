import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const godWoken = /* @__PURE__ */ defineChain({
  id: 71402,
  name: "Godwoken Mainnet",
  nativeCurrency: {
    name: "pCKB",
    symbol: "pCKB",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "GWScan Block Explorer",
      url: "https://v1.gwscan.com",
    },
  ],
});
