import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const coreMainnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Core Scan",
      url: "https://scan.coredao.org/",
    },
  ],
  id: 1116,
  name: "Core",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
});
