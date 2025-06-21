import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const treasureTopaz = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Treasure Topaz Block Explorer",
      url: "https://topaz.treasurescan.io",
    },
  ],
  id: 978658,
  name: "Treasure Topaz",
  nativeCurrency: { decimals: 18, name: "MAGIC", symbol: "MAGIC" },
});
