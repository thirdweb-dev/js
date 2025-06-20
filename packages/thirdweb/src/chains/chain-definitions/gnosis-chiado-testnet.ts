import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const gnosisChiadoTestnet = /* @__PURE__ */ defineChain({
  blockExplorers: [
    {
      name: "blockscout",
      url: "https://gnosis-chiado.blockscout.com",
    },
  ],
  id: 10200,
  name: "Gnosis Chiado Testnet",
  nativeCurrency: { decimals: 18, name: "xDAI", symbol: "XDAI" },
  testnet: true,
});
