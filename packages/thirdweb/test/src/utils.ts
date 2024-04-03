import { getRpcClient } from "../../src/rpc/rpc.js";
import {
  FORKED_ETHEREUM_CHAIN,
  FORKED_ETHEREUM_RPC,
  FORK_BLOCK_NUMBER,
} from "./chains.js";
import { TEST_CLIENT } from "./test-clients.js";

export async function mineBlock() {
  const rpcClient = getRpcClient({
    chain: FORKED_ETHEREUM_CHAIN,
    client: TEST_CLIENT,
  });
  return rpcClient({
    method: "anvil_mine" as any,
    params: ["0x1"],
  });
}

export async function reset() {
  const rpcClient = getRpcClient({
    chain: FORKED_ETHEREUM_CHAIN,
    client: TEST_CLIENT,
  });
  return rpcClient({
    method: "anvil_reset" as any,
    params: [
      {
        forking: {
          blockNumber: Number(FORK_BLOCK_NUMBER),
          jsonRpcUrl: FORKED_ETHEREUM_RPC,
        },
      },
    ] as any,
  });
}
