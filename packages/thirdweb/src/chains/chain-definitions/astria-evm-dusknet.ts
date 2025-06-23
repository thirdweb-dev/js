import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const astriaEvmDusknet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Astria EVM Dusknet Explorer",
      url: "https://explorer.evm.dusk-3.devnet.astria.org/",
    },
  ],
  id: 912559,
  name: "Astria EVM Dusknet",
  nativeCurrency: { decimals: 18, name: "RIA", symbol: "RIA" },
});
