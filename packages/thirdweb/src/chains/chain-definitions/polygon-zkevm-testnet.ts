import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const polygonZkEvmTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Polygon zkEVM explorer",
      url: "https://explorer.public.zkevm-test.net",
    },
  ],
  id: 1442,
  name: "Polygon zkEVM Testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  testnet: true,
});
