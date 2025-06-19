import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const berachain = /* @__PURE__ */ defineChain({
  id: 80094,
  name: "Berachain",
  nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
  blockExplorers: [
    {
      name: "berascan",
      url: "https://berascan.com/",
      apiUrl: "https://api.berascan.com/api",
    },
  ],
});
