import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const polygon = /*@__PURE__*/ defineChain({
  id: 137,
  name: "Polygon",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  blockExplorers: [
    {
      name: "PolygonScan",
      url: "https://polygonscan.com",
      apiUrl: "https://api.polygonscan.com/api",
    },
  ],
});
