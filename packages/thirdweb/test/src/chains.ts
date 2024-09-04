import { anvil } from "../../src/chains/chain-definitions/anvil.js";
import { ethereum } from "../../src/chains/chain-definitions/ethereum.js";
import { polygon } from "../../src/chains/chain-definitions/polygon.js";
import { optimism } from "../../src/chains/chain-definitions/optimism.js";
import { defineChain } from "../../src/chains/utils.js";

export const poolId = Number(process.env.VITEST_POOL_ID ?? 1);

export const FORKED_ETHEREUM_RPC = `http://127.0.0.1:8645/${poolId}`;
export const FORKED_ETHEREUM_WITH_MINING_RPC = `http://127.0.0.1:8646/${poolId}`;
export const FORKED_OPTIMISM_RPC = `http://127.0.0.1:8647/${poolId}`;
export const ANVIL_RPC = `http://127.0.0.1:8648/${poolId}`;
export const FORKED_POLYGON_RPC = `http://127.0.0.1:8649/${poolId}`;

export const FORKED_ETHEREUM_CHAIN = defineChain({
  ...ethereum,
  // override the rpc url
  rpc: FORKED_ETHEREUM_RPC,
});

export const FORKED_POLYGON_CHAIN = defineChain({
  ...polygon,
  // override the rpc url
  rpc: FORKED_POLYGON_RPC,
});

export const FORKED_ETHEREUM_CHAIN_WITH_MINING = defineChain({
  ...ethereum,
  // override the rpc url
  rpc: FORKED_ETHEREUM_WITH_MINING_RPC,
});

export const FORKED_OPTIMISM_CHAIN = defineChain({
  ...optimism,
  // override the rpc url
  rpc: FORKED_OPTIMISM_RPC,
});

export const ANVIL_CHAIN = defineChain({
  ...anvil,
  // override the rpc url
  rpc: ANVIL_RPC,
});

export const FORK_BLOCK_NUMBER = 19139495n;
export const OPTIMISM_FORK_BLOCK_NUMBER = 117525204n;
export const POLYGON_FORK_BLOCK_NUMBER = 61430000n;
