import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const palmTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Chainlens",
      url: "https://testnet.palm.chainlens.com",
    },
  ],
  id: 11297108099,
  name: "Palm Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "PALM",
    symbol: "PALM",
  },
  testnet: true,
});
