import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const etherlink = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Etherlink Explorer",
      url: "https://explorer.etherlink.com/",
    },
  ],
  id: 42793,
  name: "Etherlink",
  nativeCurrency: {
    decimals: 18,
    name: "Etherlink",
    symbol: "XTZ",
  },
});
