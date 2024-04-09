import { describe, expect, it } from "vitest";
import { FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getRpcClient } from "../rpc.js";
import { eth_getLogs } from "./eth_getLogs.js";

const rpcClient = getRpcClient({
  chain: FORKED_ETHEREUM_CHAIN,
  client: TEST_CLIENT,
});

describe.runIf(process.env.TW_SECRET_KEY)("eth_getLogs", () => {
  it("should return unparsed logs, without events", async () => {
    const logs = await eth_getLogs(rpcClient);
    expect(logs).toMatchInlineSnapshot("[]");
  });
});
