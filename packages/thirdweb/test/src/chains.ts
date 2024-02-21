import { ethereum } from "../../src/chains/chain-definitions/ethereum.js";
import { defineChain } from "../../src/chains/utils.js";

const FORKED_ETHEREUM_RPC = "http://localhost:8555";
export const FORKED_ETHEREUM_CHAIN = defineChain({
  ...ethereum,
  // override the rpc url
  rpc: FORKED_ETHEREUM_RPC,
});
