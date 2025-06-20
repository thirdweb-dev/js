import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const hardhat = /* @__PURE__ */ defineChain({
  id: 31337,
  name: "Hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Hardhat Ether",
    symbol: "ETH",
  },
  rpc: "http://127.0.0.1:8545",
  testnet: true,
});
