import { defineChain } from "../utils.js";

/**
 * @chain
 * Curtis test network (Ape Chain testnet variant).
 */
export const curtis = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Curtis Explorer",
      url: "https://explorer.curtis.apechain.com",
    },
  ],
  id: 33_111,
  name: "Curtis",
  nativeCurrency: { name: "ApeCoin", symbol: "APE", decimals: 18 },
  testnet: true,
});
