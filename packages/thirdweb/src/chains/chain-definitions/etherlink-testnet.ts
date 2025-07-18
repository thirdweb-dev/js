import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const etherlinkTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Etherlink Testnet Explorer",
      url: "https://testnet.explorer.etherlink.com/",
    },
  ],
  id: 128123,
  name: "Etherlink Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Etherlink",
    symbol: "XTZ",
  },
  testnet: true,
});
