import { defineChain } from "../utils.js";

export const polygonMumbai = /*@__PURE__*/ defineChain({
  id: 80001,
  name: "Polygon Mumbai",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  blockExplorers: [
    {
      name: "PolygonScan",
      url: "https://mumbai.polygonscan.com",
      apiUrl: "https://mumbai.polygonscan.com/api",
    },
  ],
  testnet: true,
});

/**
 * @alias polygonMumbai
 */
export const mumbai = polygonMumbai;
