import { defineChain } from "../utils.js";

export const anvil = /* @__PURE__ */ defineChain({
  id: 31337,
  name: "Anvil",
  rpc: "http://127.0.0.1:8545",
  testnet: true,
  nativeCurrency: {
    name: "Anvil Ether",
    symbol: "ETH",
    decimals: 18,
  },
});
