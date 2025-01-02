import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const loot = /* @__PURE__ */ defineChain({
  id: 5151706,
  name: "Loot Chain Mainnet",
  nativeCurrency: {
    name: "AGLD",
    symbol: "AGLD",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Explorer",
      url: "https://explorer.lootchain.com/",
    },
  ],
});
