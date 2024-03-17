import { ethereum } from "../../src/chains/chain-definitions/ethereum.js";
import { optimism } from "../../src/chains/chain-definitions/optimism.js";
import { defineChain } from "../../src/chains/utils.js";

// eslint-disable-next-line turbo/no-undeclared-env-vars
export const poolId = Number(process.env.VITEST_POOL_ID ?? 1);

export const FORKED_ETHEREUM_RPC = `http://127.0.0.1:8545/${poolId}`;
export const FORKED_OPTIMISM_RPC = `http://127.0.0.1:8546/${poolId}`;

export const FORKED_ETHEREUM_CHAIN = defineChain({
  ...ethereum,
  // override the rpc url
  rpc: FORKED_ETHEREUM_RPC,
});

export const FORKED_OPTIMISM_CHAIN = defineChain({
  ...optimism,
  // override the rpc url
  rpc: FORKED_OPTIMISM_RPC,
});

export const FORK_BLOCK_NUMBER = 19139495n;
export const OPTIMISM_FORK_BLOCK_NUMBER = 117525204n;
