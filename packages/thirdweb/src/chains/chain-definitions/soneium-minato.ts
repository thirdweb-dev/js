import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const soneiumMinato = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Minato Explorer",
      url: "https://explorer-testnet.soneium.org/",
    },
  ],
  id: 1946,
  name: "Soneium Minato",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  testnet: true,
});
