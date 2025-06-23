import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const polygon = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api.polygonscan.com/api",
      name: "PolygonScan",
      url: "https://polygonscan.com",
    },
  ],
  id: 137,
  name: "Polygon",
  nativeCurrency: { decimals: 18, name: "POL", symbol: "POL" },
});
