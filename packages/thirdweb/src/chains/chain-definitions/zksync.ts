import { defineChain } from "../utils.js";

export const zkSync = /*@__PURE__*/ defineChain({
  id: 324,
  name: "ZkSync Era",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  blockExplorers: [
    {
      name: "zkSync Era Block Explorer",
      url: "https://explorer.zksync.io",
      apiUrl: "https://block-explorer-api.zksync.dev/api",
    },
  ],
});
