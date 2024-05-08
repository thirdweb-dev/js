import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  USDT_CONTRACT,
} from "../../../test/src/test-contracts.js";
import { transferEvent } from "../../extensions/erc721/__generated__/IERC721A/events/Transfer.js";
import { prepareEvent } from "../prepare-event.js";
import { getContractEvents } from "./get-events.js";

const LATEST_SIMULATED_BLOCK = 19139495n;

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("getEvents", () => {
  it("should get all events", async () => {
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: LATEST_SIMULATED_BLOCK - 10n,
    });
    expect(events.length).toBe(261);
  });

  it("should get events for blockHash", async () => {
    const BLOCK_HASH =
      "0xb0ad5ee7b4912b50e5a2d7993796944653a4c0632c57740fe4a7a1c61e426324";
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
      blockHash: BLOCK_HASH,
    });

    expect(events.length).toBe(14);
  });

  it("should get events for blockRange", async () => {
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
      blockRange: 10n,
    });
    expect(events.length).toBe(261);

    const explicitEvents = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: LATEST_SIMULATED_BLOCK - 10n,
      toBlock: LATEST_SIMULATED_BLOCK,
    });
    expect(explicitEvents.length).toEqual(events.length);
  });

  it("should get events for blockRange using fromBlock and toBlock", async () => {
    const eventsFromBlock = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: LATEST_SIMULATED_BLOCK - 50n,
      blockRange: 20n,
    });
    expect(eventsFromBlock.length).toBe(426);

    const eventsToBlock = await getContractEvents({
      contract: USDT_CONTRACT,
      toBlock: LATEST_SIMULATED_BLOCK - 30n,
      blockRange: 20n,
    });
    expect(eventsToBlock.length).toBe(426);

    const explicitEvents = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: LATEST_SIMULATED_BLOCK - 50n,
      toBlock: LATEST_SIMULATED_BLOCK - 30n,
    });
    expect(explicitEvents.length).toEqual(eventsFromBlock.length);
  });

  it("should get individual events with signature", async () => {
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: LATEST_SIMULATED_BLOCK - 100n,
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
      fromBlock: LATEST_SIMULATED_BLOCK - 10n,
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
      fromBlock: LATEST_SIMULATED_BLOCK - 1000n,
      events: [transferEvent()],
    });
    expect(events.length).toBe(38);
  });
});
