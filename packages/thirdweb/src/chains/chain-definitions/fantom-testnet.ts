import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const fantomTestnet = /* @__PURE__ */ defineChain({
  id: 4002,
  name: "Fantom Testnet",
  nativeCurrency: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "ftmscan",
      url: "https://testnet.ftmscan.com",
    },
  ],
  testnet: true,
});
