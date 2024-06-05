import { defineChain } from "../utils.js";

export const polygonAmoy = /*@__PURE__*/ defineChain({
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  blockExplorers: [
    {
      name: "PolygonScan",
      url: "https://amoy.polygonscan.com",
      apiUrl: "https://api-amoy.polygonscan.com/api",
    },
  ],
  testnet: true,
});
