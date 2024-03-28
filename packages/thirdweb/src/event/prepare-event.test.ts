import { describe, it, expect } from "vitest";
import { prepareEvent } from "./prepare-event.js";

describe("prepareEvent", () => {
  it("should prepare event without params", () => {
    const event = prepareEvent({
      signature:
        "event Transfer(address indexed from, address indexed to, uint256 value)",
    });

    expect(event).toMatchInlineSnapshot(`
      {
        "abiEvent": {
          "inputs": [
            {
              "indexed": true,
              "name": "from",
              "type": "address",
            },
            {
              "indexed": true,
              "name": "to",
              "type": "address",
            },
            {
              "name": "value",
              "type": "uint256",
            },
          ],
          "name": "Transfer",
          "type": "event",
        },
        "hash": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        ],
      }
    `);
  });

  it("should prepare event with params", () => {
    const event = prepareEvent({
      signature:
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      filters: {
        from: "0x80f0d7c215ea4067609bd8f410b130d10cafa817",
        to: "0xe5c232f3fd62f104db6f2a05aa6b5d1db15a20f7",
      },
    });

    expect(event).toMatchInlineSnapshot(`
      {
        "abiEvent": {
          "inputs": [
            {
              "indexed": true,
              "name": "from",
              "type": "address",
            },
            {
              "indexed": true,
              "name": "to",
              "type": "address",
            },
            {
              "name": "value",
              "type": "uint256",
            },
          ],
          "name": "Transfer",
          "type": "event",
        },
        "hash": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x00000000000000000000000080f0d7c215ea4067609bd8f410b130d10cafa817",
          "0x000000000000000000000000e5c232f3fd62f104db6f2a05aa6b5d1db15a20f7",
        ],
      }
    `);
  });
});
