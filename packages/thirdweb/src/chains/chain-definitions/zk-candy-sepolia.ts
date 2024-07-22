import { defineChain } from "../utils.js";

export const zkCandySepolia = /*@__PURE__*/ defineChain({
  id: 302,
  name: "zkCandy Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  blockExplorers: [
    {
      name: "zkCandy Block Explorer",
      url: "https://sepolia.explorer.zkcandy.io",
    },
  ],
  testnet: true,
});
