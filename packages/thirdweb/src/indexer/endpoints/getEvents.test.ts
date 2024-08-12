import { assert, describe, expect, it } from "vitest";

import { createThirdwebClient } from "../../client/client.js";
import { getEvents } from "./getEvents.js";

describe.runIf(process.env.TW_SECRET_KEY)("chainsaw.getEvents", () => {
  const SECRET_KEY = process.env.TW_SECRET_KEY as string;
  const client = createThirdwebClient({ secretKey: SECRET_KEY });

  it("gets events", async () => {
    const contractAddress = "0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC";
    const { events } = await getEvents({
      client,
      chainIds: [1],
      contractAddresses: [contractAddress],
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
