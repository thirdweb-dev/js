import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const polygonMumbai = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://mumbai.polygonscan.com/api",
      name: "PolygonScan",
      url: "https://mumbai.polygonscan.com",
    },
  ],
  id: 80001,
  name: "Polygon Mumbai",
  nativeCurrency: { decimals: 18, name: "MATIC", symbol: "MATIC" },
  testnet: true,
});

/**
 * @alias polygonMumbai
 */
export const mumbai = polygonMumbai;
