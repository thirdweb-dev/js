import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const optimism = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://api-optimistic.etherscan.io",
      name: "Optimism Explorer",
      url: "https://optimistic.etherscan.io",
    },
  ],
  id: 10,
  name: "OP Mainnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
