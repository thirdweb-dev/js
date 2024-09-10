import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const assetChainTestnet = /* @__PURE__ */ defineChain({
  id: 42421,
  name: "AssetChain Testnet",
  nativeCurrency: {
    name: "Real World Asset",
    symbol: "RWA",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Asset Chain Testnet Explorer",
      url: "https://scan-testnet.assetchain.org",
      apiUrl: "https://scan-testnet.assetchain.org/api",
    },
  ],
  testnet: true,
});
