import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const metalL2Testnet = /* @__PURE__ */ defineChain({
  id: 1740,
  name: "Metal L2 Testnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Blockscout",
      url: "https://testnet.explorer.metall2.com",
    },
  ],
  testnet: true,
});
