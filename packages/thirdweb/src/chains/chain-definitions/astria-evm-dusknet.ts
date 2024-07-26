import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const astriaEvmDusknet = /* @__PURE__ */ defineChain({
  id: 912559,
  name: "Astria EVM Dusknet",
  nativeCurrency: { name: "RIA", symbol: "RIA", decimals: 18 },
  blockExplorers: [
    {
      name: "Astria EVM Dusknet Explorer",
      url: "https://explorer.evm.dusk-3.devnet.astria.org/",
    },
  ],
});
