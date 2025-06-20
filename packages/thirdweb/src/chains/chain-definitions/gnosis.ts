import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const gnosis = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "blockscout",
      url: "https://gnosis.blockscout.com",
    },
  ],
  id: 100,
  name: "Gnosis",
  nativeCurrency: { decimals: 18, name: "xDAI", symbol: "XDAI" },
});
