import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const berachainBepolia = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "beratrail",
      url: "https://bepolia.beratrail.io/",
    },
  ],
  id: 80069,
  name: "Berachain Bepolia",
  nativeCurrency: { decimals: 18, name: "BERA", symbol: "BERA" },
  testnet: true,
});
