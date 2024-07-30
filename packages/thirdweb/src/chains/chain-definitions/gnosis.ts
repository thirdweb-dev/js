import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const gnosis = /* @__PURE__ */ defineChain({
  id: 100,
  name: "Gnosis",
  nativeCurrency: { name: "xDAI", symbol: "XDAI", decimals: 18 },
  blockExplorers: [
    {
      name: "blockscout",
      url: "https://gnosis.blockscout.com",
    },
  ],
});
