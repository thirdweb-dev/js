import { defineChain } from "../utils.js";

export const polygon = /*@__PURE__*/ defineChain({
  id: 137,
  name: "Polygon",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  blockExplorers: [
    {
      name: "PolygonScan",
      url: "https://polygonscan.com",
      apiUrl: "https://api.polygonscan.com/api",
    },
  ],
});
