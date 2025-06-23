import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const assetChainTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://scan-testnet.assetchain.org/api",
      name: "Asset Chain Testnet Explorer",
      url: "https://scan-testnet.assetchain.org",
    },
  ],
  id: 42421,
  name: "AssetChain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Real World Asset",
    symbol: "RWA",
  },
  testnet: true,
});
