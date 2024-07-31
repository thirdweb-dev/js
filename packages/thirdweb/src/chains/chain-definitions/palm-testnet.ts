import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const palmTestnet = /* @__PURE__ */ defineChain({
  id: 11297108099,
  name: "Palm Testnet",
  nativeCurrency: {
    name: "PALM",
    symbol: "PALM",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Chainlens",
      url: "https://testnet.palm.chainlens.com",
    },
  ],
  testnet: true,
});
