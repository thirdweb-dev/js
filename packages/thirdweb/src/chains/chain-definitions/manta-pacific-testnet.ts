import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const mantaPacificTestnet = /* @__PURE__ */ defineChain({
  id: 3441005,
  name: "Manta Pacific Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: [
    {
      name: "manta-testnet Explorer",
      url: "https://manta-testnet.calderaexplorer.xyz",
    },
  ],
  testnet: true,
});
