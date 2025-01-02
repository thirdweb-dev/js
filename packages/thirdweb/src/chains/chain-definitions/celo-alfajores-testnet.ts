import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const celoAlfajoresTestnet = /* @__PURE__ */ defineChain({
  id: 44787,
  name: "Celo Alfajores Testnet",
  nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
  blockExplorers: [
    {
      name: "Alfajoresscan",
      url: "https://alfajores.celoscan.io",
    },
  ],
  testnet: true,
});
