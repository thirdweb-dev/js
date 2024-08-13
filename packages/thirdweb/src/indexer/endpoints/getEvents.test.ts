import { assert, describe, expect, it } from "vitest";

import { TEST_CLIENT } from "~test/test-clients.js";
import { defineChain } from "../../chains/utils.js";
import { getContract } from "../../contract/contract.js";
import { getEvents } from "./getEvents.js";

describe.runIf(process.env.TW_SECRET_KEY)("indexer.getEvents", () => {
  it("gets events", async () => {
    const contractAddress = "0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC";
    const contract = getContract({
      client: TEST_CLIENT,
      chain: defineChain(1),
      address: contractAddress,
    });

    const { events } = await getEvents({
      contract,
      startDate: new Date("2024-08-01T12:00:00.000Z"),
      endDate: new Date("2024-08-02T12:00:00.000Z"),
    });
    expect(events).toHaveLength(65);

    for (const event of events) {
      expect(event.time).toBeTypeOf("object");
      expect(event.eventName).toBeTypeOf("string");
      expect(event.chainId).toEqual(1);
      expect(event.address).toEqual(contractAddress.toLowerCase());
      assert.isArray(event.args);
      expect(event.count).toBeTypeOf("bigint");
    }
  });
});
