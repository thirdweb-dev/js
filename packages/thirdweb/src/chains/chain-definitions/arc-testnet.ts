import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const arcTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Arc Testnet Explorer",
      url: "https://testnet.arcscan.app",
    },
  ],
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { decimals: 6, name: "USDC", symbol: "USDC" },
  testnet: true,
});
