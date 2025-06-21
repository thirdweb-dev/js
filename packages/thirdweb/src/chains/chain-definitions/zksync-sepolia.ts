import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const zkSyncSepolia = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://block-explorer-api.sepolia.zksync.dev/api",
      name: "zkSync Sepolia Block Explorer",
      url: "https://sepolia.explorer.zksync.io",
    },
  ],
  id: 300,
  name: "ZkSync Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
});
