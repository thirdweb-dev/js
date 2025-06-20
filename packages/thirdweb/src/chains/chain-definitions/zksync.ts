import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const zkSync = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://block-explorer-api.zksync.dev/api",
      name: "zkSync Era Block Explorer",
      url: "https://explorer.zksync.io",
    },
  ],
  id: 324,
  name: "ZkSync Era",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
});
