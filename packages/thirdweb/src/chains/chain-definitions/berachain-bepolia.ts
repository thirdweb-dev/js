import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const berachainBepolia = /* @__PURE__ */ defineChain({
  id: 80069,
  name: "Berachain Bepolia",
  nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
  blockExplorers: [
    {
      name: "beratrail",
      url: "https://bepolia.beratrail.io/",
    },
  ],
  testnet: true,
});
