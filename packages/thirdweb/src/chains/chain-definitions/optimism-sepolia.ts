import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const optimismSepolia = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      apiUrl: "https://optimism-sepolia.blockscout.com/api",
      name: "Blockscout",
      url: "https://optimism-sepolia.blockscout.com",
    },
  ],
  id: 11155420,
  name: "OP Sepolia",
  nativeCurrency: { decimals: 18, name: "Sepolia Ether", symbol: "ETH" },
  testnet: true,
});
