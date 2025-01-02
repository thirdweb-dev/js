import { getRpcClient } from "../../src/rpc/rpc.js";
import { stringify } from "../../src/utils/json.js";
import { wait } from "../../src/utils/promise/wait.js";
import { FORKED_ETHEREUM_CHAIN } from "./chains.js";
import { TEST_CLIENT } from "./test-clients.js";

export async function mineBlock(chain = FORKED_ETHEREUM_CHAIN) {
  const rpcClient = getRpcClient({
    chain,
    client: TEST_CLIENT,
  });
  const res = await rpcClient({
    method: "anvil_mine" as any,
    params: ["0x1"],
  });
  await wait(500); // wait for block to be fully mined
  return res;
}

export function cloneObject<T>(obj: T): T {
  return JSON.parse(stringify(obj));
}
