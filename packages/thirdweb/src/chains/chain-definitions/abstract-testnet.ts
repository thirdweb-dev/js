import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const abstractTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Abstract Testnet Block Explorer",
      url: "https://explorer.testnet.abs.xyz",
    },
  ],
  id: 11124,
  name: "Abstract Testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  testnet: true,
});
