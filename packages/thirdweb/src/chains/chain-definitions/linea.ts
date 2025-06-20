import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const linea = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api.lineascan.build/api",
      name: "LineaScan",
      url: "https://lineascan.build",
    },
  ],
  id: 59144,
  name: "Linea",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
