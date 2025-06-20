import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const polygonZkEvm = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "blockscout",
      url: "https://zkevm.polygonscan.com",
    },
  ],
  id: 1101,
  name: "Polygon zkEVM",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
