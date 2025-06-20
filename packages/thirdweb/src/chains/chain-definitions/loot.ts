import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const loot = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Explorer",
      url: "https://explorer.lootchain.com/",
    },
  ],
  id: 5151706,
  name: "Loot Chain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "AGLD",
    symbol: "AGLD",
  },
});
