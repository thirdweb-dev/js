import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const metalL2Testnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Blockscout",
      url: "https://testnet.explorer.metall2.com",
    },
  ],
  id: 1740,
  name: "Metal L2 Testnet",
  nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" },
  testnet: true,
});
