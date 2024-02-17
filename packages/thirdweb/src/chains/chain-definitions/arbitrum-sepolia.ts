import { defineChain } from "../utils.js";

export const arbitrumSepolia = /* @__PURE__ */ defineChain({
  id: 421_614,
  name: "Arbitrum Sepolia",
  nativeCurrency: {
    name: "Arbitrum Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Arbiscan",
      url: "https://sepolia.arbiscan.io",
      apiUrl: "https://sepolia.arbiscan.io/api",
    },
  ],
  testnet: true,
});
