import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const soneiumMinato = /* @__PURE__ */ defineChain({
  id: 1946,
  name: "Soneium Minato",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Minato Explorer",
      url: "https://explorer-testnet.soneium.org/",
    },
  ],
  testnet: true,
});
