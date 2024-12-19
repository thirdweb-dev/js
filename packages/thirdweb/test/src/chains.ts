import { anvil } from "../../src/chains/chain-definitions/anvil.js";
import { base } from "../../src/chains/chain-definitions/base.js";
import { ethereum } from "../../src/chains/chain-definitions/ethereum.js";
import { optimism } from "../../src/chains/chain-definitions/optimism.js";
import { polygon } from "../../src/chains/chain-definitions/polygon.js";
import { defineChain } from "../../src/chains/utils.js";
export const poolId = Number(process.env.VITEST_POOL_ID ?? 1);

export const FORKED_ETHEREUM_RPC = `http://127.0.0.1:8645/${poolId}`;
export const FORKED_ETHEREUM_WITH_MINING_RPC = `http://127.0.0.1:8646/${poolId}`;
export const FORKED_OPTIMISM_RPC = `http://127.0.0.1:8647/${poolId}`;
export const ANVIL_RPC = `http://127.0.0.1:8648/${poolId}`;
export const FORKED_POLYGON_RPC = `http://127.0.0.1:8649/${poolId}`;
export const FORKED_BASE_RPC = `http://127.0.0.1:8650/${poolId}`;
export const CLEAN_ANVIL_RPC = `http://127.0.0.1:8651/${poolId}`;
// export const FORKED_ODYSSEY_RPC = `http://127.0.0.1:8652/${poolId}`;

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

export const CLEAN_ANVIL_CHAIN = defineChain({
  ...anvil,
  id: 31338,
  // override the rpc url
  rpc: CLEAN_ANVIL_RPC,
});

export const FORKED_BASE_CHAIN = defineChain({
  ...base,
  // override the rpc url
  rpc: FORKED_BASE_RPC,
});

// export const FORKED_ODYSSEY_CHAIN = defineChain({
//   id: 911867,
//   // override the rpc url
//   rpc: FORKED_ODYSSEY_RPC,
// });

export const FORK_BLOCK_NUMBER = 19139495n;
export const OPTIMISM_FORK_BLOCK_NUMBER = 117525204n;
export const POLYGON_FORK_BLOCK_NUMBER = 61430000n;
export const BASE_FORK_BLOCK_NUMBER = 19559480n;
