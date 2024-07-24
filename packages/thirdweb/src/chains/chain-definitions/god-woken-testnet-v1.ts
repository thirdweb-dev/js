import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const godWokenTestnetV1 = /*@__PURE__*/ defineChain({
  id: 71401,
  name: "Godwoken Testnet v1",
  nativeCurrency: {
    name: "pCKB",
    symbol: "pCKB",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "GWScan Block Explorer",
      url: "https://v1.testnet.gwscan.com",
    },
  ],
  testnet: true,
});
