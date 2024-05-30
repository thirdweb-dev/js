import { defineChain } from "../utils.js";

export const hardhat = /* @__PURE__ */ defineChain({
  id: 31337,
  name: "Hardhat",
  rpc: "http://127.0.0.1:8545",
  testnet: true,
  nativeCurrency: {
    name: "Hardhat Ether",
    symbol: "ETH",
    decimals: 18,
  },
});
