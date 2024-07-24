import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const polygonZkEvmTestnet = /*@__PURE__*/ defineChain({
  id: 1442,
  name: "Polygon zkEVM Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Polygon zkEVM explorer",
      url: "https://explorer.public.zkevm-test.net",
    },
  ],
  testnet: true,
});
