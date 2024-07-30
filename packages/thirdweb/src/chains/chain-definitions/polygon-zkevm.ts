import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const polygonZkEvm = /*@__PURE__*/ defineChain({
  id: 1101,
  name: "Polygon zkEVM",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "blockscout",
      url: "https://zkevm.polygonscan.com",
    },
  ],
});
