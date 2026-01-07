import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const etherlinkShadownet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Etherlink Shadownet Explorer",
      url: "https://shadownet.explorer.etherlink.com/",
    },
  ],
  id: 127823,
  name: "Etherlink Shadownet",
  nativeCurrency: {
    decimals: 18,
    name: "Etherlink",
    symbol: "XTZ",
  },
  testnet: true,
});
