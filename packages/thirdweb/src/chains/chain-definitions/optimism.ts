import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const optimism = /* @__PURE__ */ defineChain({
  id: 10,
  name: "OP Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Optimism Explorer",
      url: "https://optimistic.etherscan.io",
      apiUrl: "https://api-optimistic.etherscan.io",
    },
  ],
});
