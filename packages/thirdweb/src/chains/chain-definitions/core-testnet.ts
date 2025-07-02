import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const coreTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "Core Testnet Scan",
      url: "https://scan.test2.btcs.network/",
    },
  ],
  id: 1114,
  name: "Core Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  testnet: true,
});
