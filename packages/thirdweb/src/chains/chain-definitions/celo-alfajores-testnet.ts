import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const celoAlfajoresTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Alfajoresscan",
      url: "https://alfajores.celoscan.io",
    },
  ],
  id: 44787,
  name: "Celo Alfajores Testnet",
  nativeCurrency: { decimals: 18, name: "CELO", symbol: "CELO" },
  testnet: true,
});
