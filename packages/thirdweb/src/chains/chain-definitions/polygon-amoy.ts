import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const polygonAmoy = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api-amoy.polygonscan.com/api",
      name: "PolygonScan",
      url: "https://amoy.polygonscan.com",
    },
  ],
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: { decimals: 18, name: "MATIC", symbol: "MATIC" },
  testnet: true,
});
