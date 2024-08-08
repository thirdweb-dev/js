import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const fraxtalTestnet = /* @__PURE__ */ defineChain({
  id: 2522,
  name: "Fraxtal Testnet",
  nativeCurrency: { name: "Frax Ether", symbol: "frxETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Fraxscan",
      url: "https://holesky.fraxscan.com/",
    },
  ],
  testnet: true,
});
