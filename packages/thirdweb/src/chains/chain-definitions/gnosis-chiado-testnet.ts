import { defineChain } from "../utils.js";

export const gnosisChiadoTestnet = /* @__PURE__ */ defineChain({
  id: 10200,
  name: "Gnosis Chiado Testnet",
  nativeCurrency: { name: "xDAI", symbol: "XDAI", decimals: 18 },
  blockExplorers: [
    {
      name: "blockscout",
      url: "https://gnosis-chiado.blockscout.com",
    },
  ],
  testnet: true,
});
