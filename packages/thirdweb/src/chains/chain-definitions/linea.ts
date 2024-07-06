import { defineChain } from "../utils.js";

export const linea = /* @__PURE__ */ defineChain({
  id: 59144,
  name: "Linea",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "LineaScan",
      url: "https://lineascan.build",
      apiUrl: "https://api.lineascan.build/api",
    },
  ],
});
