import { describe, it, expect, vi, afterEach } from "vitest";
import { getRpcClient } from "../rpc.js";
import { FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { eth_getLogs } from "./eth_getLogs.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

const rpcClient = getRpcClient({
  chain: FORKED_ETHEREUM_CHAIN,
  client: TEST_CLIENT,
});

describe("eth_getLogs", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return unparsed logs, without events", async () => {
    const logs = await eth_getLogs(rpcClient);
    expect(logs).toMatchInlineSnapshot(`[]`);
  });
});
