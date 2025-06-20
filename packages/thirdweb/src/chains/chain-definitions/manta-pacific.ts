import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const mantaPacific = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "manta-pacific Explorer",
      url: "https://pacific-explorer.manta.network",
    },
  ],
  id: 169,
  name: "Manta Pacific Mainnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
});
