import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const fraxtalTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Fraxscan",
      url: "https://holesky.fraxscan.com/",
    },
  ],
  id: 2522,
  name: "Fraxtal Testnet",
  nativeCurrency: { decimals: 18, name: "Frax Ether", symbol: "frxETH" },
  testnet: true,
});
