import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const mantaPacificTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "manta-testnet Explorer",
      url: "https://manta-testnet.calderaexplorer.xyz",
    },
  ],
  id: 3441005,
  name: "Manta Pacific Testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  testnet: true,
});
