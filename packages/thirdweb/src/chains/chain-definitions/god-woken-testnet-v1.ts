import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const godWokenTestnetV1 = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "GWScan Block Explorer",
      url: "https://v1.testnet.gwscan.com",
    },
  ],
  id: 71401,
  name: "Godwoken Testnet v1",
  nativeCurrency: {
    decimals: 18,
    name: "pCKB",
    symbol: "pCKB",
  },
  testnet: true,
});
