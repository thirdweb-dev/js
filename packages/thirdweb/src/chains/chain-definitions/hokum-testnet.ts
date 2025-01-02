import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const hokumTestnet = /*@__PURE__*/ defineChain({
  id: 20482050,
  name: "Hokum Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Hokum Explorer",
      url: "https://testnet-explorer.hokum.gg",
    },
  ],
  testnet: true,
});
