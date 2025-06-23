import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const xaiSepolia = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Blockscout",
      url: "https://testnet-explorer-v2.xai-chain.net",
    },
  ],
  id: 37714555429,
  name: "Xai Sepolia",
  nativeCurrency: { decimals: 18, name: "sXAI", symbol: "sXAI" },
  testnet: true,
});
