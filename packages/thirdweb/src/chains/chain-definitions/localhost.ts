import { defineChain } from "../utils.js";

export const localhost = /* @__PURE__ */ defineChain({
  id: 1337,
  name: "Localhost",
  rpc: "http://127.0.0.1:8545",
  testnet: true,
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
});
