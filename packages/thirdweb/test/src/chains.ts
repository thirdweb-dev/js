import { defineChain } from "../../src/chain/index.js";

const FORKED_ETHEREUM_RPC = "http://localhost:8555";
export const FORKED_ETHEREUM_CHAIN = defineChain({
  id: 1,
  rpc: FORKED_ETHEREUM_RPC,
});
