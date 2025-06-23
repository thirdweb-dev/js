import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const localhost = /* @__PURE__ */ defineChain({
  id: 1337,
  name: "Localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpc: "http://127.0.0.1:8545",
  testnet: true,
});
