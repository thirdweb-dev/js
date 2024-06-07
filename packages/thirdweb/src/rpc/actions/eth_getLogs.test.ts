import { describe, expect, it } from "vitest";
import { FORKED_ETHEREUM_CHAIN, STATELESS_CHAIN } from "~test/chains.js";
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

describe.runIf(process.env.STATELESS_URL)("eth_getLogs_stateless", () => {
  it("should return unparsed logs, without events", async () => {
    const sRPCClient = getRpcClient({
      chain: STATELESS_CHAIN,
      client: TEST_CLIENT,
      config: {
        minimumRequiredAttestations: 1,
        identities: [process.env.STATELESS_IDENTITY as string],
      }
    });

    const logs = await eth_getLogs(sRPCClient);
    expect(Array.isArray(logs)).toBe(true);
  });
});