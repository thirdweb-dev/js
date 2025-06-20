import { describe, expect, it } from "vitest";
import { FORK_BLOCK_NUMBER } from "../../../test/src/chains.js";
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
      fromBlock: FORK_BLOCK_NUMBER - 10n,
      useIndexer: false,
    });
    expect(events.length).toBe(261);
  });

  // TODO: investigate why RPC returns 0 events here
  it.skip("should get events for blockHash", async () => {
    const BLOCK_HASH =
      "0xb0ad5ee7b4912b50e5a2d7993796944653a4c0632c57740fe4a7a1c61e426324";
    const events = await getContractEvents({
      blockHash: BLOCK_HASH,
      contract: USDT_CONTRACT,
    });

    expect(events.length).toBe(14);
  });

  it("should get events for blockRange", async () => {
    const events = await getContractEvents({
      blockRange: 10n,
      contract: USDT_CONTRACT,
      useIndexer: false,
    });
    expect(events.length).toBe(241);

    const explicitEvents = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: FORK_BLOCK_NUMBER - 9n, // 1 less than range as fromBlock and toBlock are inclusive
      toBlock: FORK_BLOCK_NUMBER,
      useIndexer: false,
    });
    expect(explicitEvents.length).toEqual(events.length);
  });

  it("should get events for blockRange using fromBlock and toBlock", async () => {
    const eventsFromBlock = await getContractEvents({
      blockRange: 20n,
      contract: USDT_CONTRACT,
      fromBlock: FORK_BLOCK_NUMBER - 49n,
      useIndexer: false,
    });
    expect(eventsFromBlock.length).toBe(412);

    const eventsToBlock = await getContractEvents({
      blockRange: 20n,
      contract: USDT_CONTRACT,
      toBlock: FORK_BLOCK_NUMBER - 30n,
      useIndexer: false,
    });
    expect(eventsToBlock.length).toBe(eventsFromBlock.length);

    const explicitEvents = await getContractEvents({
      contract: USDT_CONTRACT,
      fromBlock: FORK_BLOCK_NUMBER - 49n,
      toBlock: FORK_BLOCK_NUMBER - 30n,
      useIndexer: false,
    });
    expect(explicitEvents.length).toEqual(eventsFromBlock.length);
  });

  it("should get individual events with signature", async () => {
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
      events: [
        prepareEvent({
          signature: "event Burn(address indexed burner, uint256 amount)",
        }),
      ],
      fromBlock: FORK_BLOCK_NUMBER - 100n,
      useIndexer: false,
    });
    expect(events.length).toMatchInlineSnapshot("0");
  });

  it("should get specified events", async () => {
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
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
      fromBlock: FORK_BLOCK_NUMBER - 10n,
      toBlock: FORK_BLOCK_NUMBER,
      useIndexer: false,
    });
    expect(events.length).toMatchInlineSnapshot("9");
  });

  it("should get individual events with extension", async () => {
    const events = await getContractEvents({
      contract: DOODLES_CONTRACT,
      events: [transferEvent()],
      fromBlock: FORK_BLOCK_NUMBER - 1000n,
      toBlock: FORK_BLOCK_NUMBER,
      useIndexer: false,
    });
    expect(events.length).toBe(38);
  });

  it("should get individual events with filters", async () => {
    const events = await getContractEvents({
      contract: DOODLES_CONTRACT,
      events: [
        transferEvent({
          from: "0xB81965DdFdDA3923f292a47A1be83ba3A36B5133",
        }),
      ],
      fromBlock: FORK_BLOCK_NUMBER - 1000n,
      toBlock: FORK_BLOCK_NUMBER,
      useIndexer: false,
    });
    expect(events.length).toBe(2);
  });

  // insight tests

  it("should get events for blockHash using indexer", async () => {
    const BLOCK_HASH =
      "0xb0ad5ee7b4912b50e5a2d7993796944653a4c0632c57740fe4a7a1c61e426324";
    const events = await getContractEvents({
      blockHash: BLOCK_HASH,
      contract: USDT_CONTRACT,
      useIndexer: true,
    });

    expect(events.length).toBe(14);
  });

  it("should get individual events with extension no filter using indexer", async () => {
    const events = await getContractEvents({
      contract: DOODLES_CONTRACT,
      events: [transferEvent()],
      fromBlock: FORK_BLOCK_NUMBER - 1000n,
      toBlock: FORK_BLOCK_NUMBER,
      useIndexer: true,
    });
    expect(events.length).toBe(38);
  });

  it("should get events for signature using indexer", async () => {
    const events = await getContractEvents({
      contract: DOODLES_CONTRACT,
      events: [
        transferEvent({
          from: "0xB81965DdFdDA3923f292a47A1be83ba3A36B5133",
        }),
      ],
      fromBlock: FORK_BLOCK_NUMBER - 1000n,
      toBlock: FORK_BLOCK_NUMBER,
      useIndexer: true,
    });

    expect(events.length).toBe(2);
  });

  it("should get specified events using indexer", async () => {
    const events = await getContractEvents({
      contract: USDT_CONTRACT,
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
      fromBlock: FORK_BLOCK_NUMBER - 10n,
      toBlock: FORK_BLOCK_NUMBER,
      useIndexer: true,
    });
    expect(events.length).toMatchInlineSnapshot("9");
  });
});
