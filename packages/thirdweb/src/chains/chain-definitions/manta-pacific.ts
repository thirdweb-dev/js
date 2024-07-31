import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const mantaPacific = /* @__PURE__ */ defineChain({
  id: 169,
  name: "Manta Pacific Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "manta-pacific Explorer",
      url: "https://pacific-explorer.manta.network",
    },
  ],
});
