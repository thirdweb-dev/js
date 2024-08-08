import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const modeTestnet = /* @__PURE__ */ defineChain({
  id: 919,
  name: "Mode Testnet",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Modescout",
      url: "https://sepolia.explorer.mode.network/",
    },
  ],
  testnet: true,
});
