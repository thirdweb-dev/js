import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const xaiSepolia = /* @__PURE__ */ defineChain({
  id: 37714555429,
  name: "Xai Sepolia",
  nativeCurrency: { name: "sXAI", symbol: "sXAI", decimals: 18 },
  blockExplorers: [
    {
      name: "Blockscout",
      url: "https://testnet-explorer-v2.xai-chain.net",
    },
  ],
  testnet: true,
});
