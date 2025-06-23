import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const berachain = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api.berascan.com/api",
      name: "berascan",
      url: "https://berascan.com/",
    },
  ],
  id: 80094,
  name: "Berachain",
  nativeCurrency: { decimals: 18, name: "BERA", symbol: "BERA" },
});
