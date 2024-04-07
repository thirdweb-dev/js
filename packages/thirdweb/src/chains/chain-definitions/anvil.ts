import { defineChain } from "../utils.js";

export const anvil = /* @__PURE__ */ defineChain({
  id: 31337,
  name: "Anvil",
  rpc: "http://localhost:8545",
  testnet: true,
});
