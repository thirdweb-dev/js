import { describe, it, expect, vi, afterEach } from "vitest";
import { eth_blockNumber } from "./eth_blockNumber.js";
import { getRpcClient } from "../rpc.js";
import { FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

const rpcClient = getRpcClient({
  chain: FORKED_ETHEREUM_CHAIN,
  client: TEST_CLIENT,
});

describe("eth_blockNumber", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the block number", async () => {
    const blockNumber = await eth_blockNumber(rpcClient);
    expect(blockNumber).toEqual(19139495n);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should dedupe requests", async () => {
    const [blockNumber1, blockNumber2, blockNumber3] = await Promise.all([
      eth_blockNumber(rpcClient),
      eth_blockNumber(rpcClient),
      eth_blockNumber(rpcClient),
    ]);
    // obviously these should all be correct
    expect(blockNumber1).toEqual(19139495n);
    expect(blockNumber2).toEqual(19139495n);
    expect(blockNumber3).toEqual(19139495n);
    // should only have been called once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    // check the exact payload, we should not have more than one ethBlockNumber request in the body!
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:8555",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify([
          { method: "eth_blockNumber", id: 0, jsonrpc: "2.0" },
        ]),
      }),
    );
  });
});
