import { defineChain } from "../utils.js";

export const optimismSepolia = /* @__PURE__ */ defineChain({
  id: 11155420,
  name: "OP Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "Blockscout",
      url: "https://optimism-sepolia.blockscout.com",
      apiUrl: "https://optimism-sepolia.blockscout.com/api",
    },
  ],
  testnet: true,
});
