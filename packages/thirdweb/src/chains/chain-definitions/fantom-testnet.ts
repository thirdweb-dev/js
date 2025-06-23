import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const fantomTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "ftmscan",
      url: "https://testnet.ftmscan.com",
    },
  ],
  id: 4002,
  name: "Fantom Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
  testnet: true,
});
