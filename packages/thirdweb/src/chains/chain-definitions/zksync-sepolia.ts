import { defineChain } from "../utils.js";

export const zkSyncSepolia = /*@__PURE__*/ defineChain({
  id: 300,
  name: "ZkSync Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  blockExplorers: [
    {
      name: "zkSync Sepolia Block Explorer",
      url: "https://sepolia.explorer.zksync.io",
      apiUrl: "https://block-explorer-api.sepolia.zksync.dev/api",
    },
  ],
});
