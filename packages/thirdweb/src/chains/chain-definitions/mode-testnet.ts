import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const modeTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Modescout",
      url: "https://sepolia.explorer.mode.network/",
    },
  ],
  id: 919,
  name: "Mode Testnet",
  nativeCurrency: { decimals: 18, name: "Sepolia Ether", symbol: "ETH" },
  testnet: true,
});
