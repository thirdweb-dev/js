import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const treasureTopaz = /* @__PURE__ */ defineChain({
  id: 978658,
  name: "Treasure Topaz",
  nativeCurrency: { name: "MAGIC", symbol: "MAGIC", decimals: 18 },
  blockExplorers: [
    {
      name: "Treasure Topaz Block Explorer",
      url: "https://topaz.treasurescan.io",
    },
  ],
});
