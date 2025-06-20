import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const anvil = /* @__PURE__ */ defineChain({
  id: 31337,
  name: "Anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Anvil Ether",
    symbol: "ETH",
  },
  rpc: "http://127.0.0.1:8545",
  testnet: true,
});
