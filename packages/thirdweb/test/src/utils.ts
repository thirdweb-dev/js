import { getRpcClient } from "../../src/rpc/rpc.js";
import { FORKED_ETHEREUM_CHAIN } from "./chains.js";
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
