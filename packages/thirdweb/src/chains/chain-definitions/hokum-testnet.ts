import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const hokumTestnet = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Hokum Explorer",
      url: "https://testnet-explorer.hokum.gg",
    },
  ],
  id: 20482050,
  name: "Hokum Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  testnet: true,
});
