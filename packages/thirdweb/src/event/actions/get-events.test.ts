import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  USDT_CONTRACT,
} from "../../../test/src/test-contracts.js";
import { transferEvent } from "../../extensions/erc721/__generated__/IERC721A/events/Transfer.js";
import { prepareEvent } from "../prepare-event.js";
import { getContractEvents } from "./get-events.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("getEvents", () => {
  it("should get all events", async () => {
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: 19139495n - 10n,
    });
    expect(events.length).toBe(261);
  });

  it("should get individual events with signature", async () => {
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: 19139495n - 100n,
      events: [
        prepareEvent({
          signature: "event Burn(address indexed burner, uint256 amount)",
        }),
      ],
    });
    expect(events.length).toMatchInlineSnapshot("0");
  });

  it("should get specified events", async () => {
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: 19139495n - 10n,
      events: [
        prepareEvent({
          signature: "event Burn(address indexed burner, uint256 amount)",
        }),
        prepareEvent({
          signature: {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
        }),
      ],
    });
    expect(events.length).toMatchInlineSnapshot("9");
  });

  it("should get individual events with extension", async () => {
    const events = await getContractEvents({
      contract: DOODLES_CONTRACT,
      fromBlock: 19139495n - 1000n,
      events: [transferEvent()],
    });
    expect(events.length).toBe(38);
  });
});
