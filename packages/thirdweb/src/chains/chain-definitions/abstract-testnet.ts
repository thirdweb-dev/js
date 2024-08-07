import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const abstractTestnet = /* @__PURE__ */ defineChain({
  id: 11124,
  name: "Abstract Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Abstract Testnet Block Explorer",
      url: "https://explorer.testnet.abs.xyz",
    },
  ],
  testnet: true,
});
