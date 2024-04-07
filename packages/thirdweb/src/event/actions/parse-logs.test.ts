import type { RpcLog } from "viem";
import { describe, expect, it } from "vitest";
import { prepareEvent } from "../prepare-event.js";
import { parseEventLogs } from "./parse-logs.js";

const LOGS = [
  {
    address: "0x06450dee7fd2fb8e39061434babcfc05599a6fb8",
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x00000000000000000000000080f0d7c215ea4067609bd8f410b130d10cafa817",
    ],
    data: "0x0000000000000000000000000000000000000000000000000000000000000000",
    blockNumber: "0x125544b",
    transactionHash:
      "0x7d674c4a6b17eae2b0490dfc007bdb345e5046da3815e91ef5a4e252f81c3e19",
    transactionIndex: "0x59",
    blockHash:
      "0x2a26c203c100c58404d58abfb340920647e6ce962f1669c4e5c2d1741d5cdb1f",
    logIndex: "0xd8",
    removed: false,
  },
  {
    address: "0x06450dee7fd2fb8e39061434babcfc05599a6fb8",
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x000000000000000000000000e5c232f3fd62f104db6f2a05aa6b5d1db15a20f7",
    ],
    data: "0x0000000000000000000000000000000000000000001a7a608c0cd81965d40000",
    blockNumber: "0x125544b",
    transactionHash:
      "0x7d674c4a6b17eae2b0490dfc007bdb345e5046da3815e91ef5a4e252f81c3e19",
    transactionIndex: "0x59",
    blockHash:
      "0x2a26c203c100c58404d58abfb340920647e6ce962f1669c4e5c2d1741d5cdb1f",
    logIndex: "0xd9",
    removed: false,
  },
  {
    address: "0x06450dee7fd2fb8e39061434babcfc05599a6fb8",
    topics: [
      "0xd74752b13281df13701575f3a507e9b1242e0b5fb040143211c481c1fce573a6",
      "0x00000000000000000000000080f0d7c215ea4067609bd8f410b130d10cafa817",
    ],
    data: "0x0000000000000000000000000000000000000000001a7a608c0cd81965d40000",
    blockNumber: "0x125544b",
    transactionHash:
      "0x7d674c4a6b17eae2b0490dfc007bdb345e5046da3815e91ef5a4e252f81c3e19",
    transactionIndex: "0x59",
    blockHash:
      "0x2a26c203c100c58404d58abfb340920647e6ce962f1669c4e5c2d1741d5cdb1f",
    logIndex: "0xda",
    removed: false,
  },
] satisfies RpcLog[];

describe("parseLogs", () => {
  it("should parse logs", () => {
    const event = prepareEvent({
      signature:
        "event Transfer(address indexed from, address indexed to, uint256 value)",
    });
    const result = parseEventLogs({ logs: LOGS, events: [event] });
    // there's 3 logs but only 2 match the event
    expect(result.length).toBe(2);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "address": "0x06450dee7fd2fb8e39061434babcfc05599a6fb8",
          "args": {
            "from": "0x0000000000000000000000000000000000000000",
            "to": "0x80F0d7c215Ea4067609BD8F410b130d10cAfA817",
            "value": 0n,
          },
          "blockHash": "0x2a26c203c100c58404d58abfb340920647e6ce962f1669c4e5c2d1741d5cdb1f",
          "blockNumber": "0x125544b",
          "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "eventName": "Transfer",
          "logIndex": "0xd8",
          "removed": false,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x00000000000000000000000080f0d7c215ea4067609bd8f410b130d10cafa817",
          ],
          "transactionHash": "0x7d674c4a6b17eae2b0490dfc007bdb345e5046da3815e91ef5a4e252f81c3e19",
          "transactionIndex": "0x59",
        },
        {
          "address": "0x06450dee7fd2fb8e39061434babcfc05599a6fb8",
          "args": {
            "from": "0x0000000000000000000000000000000000000000",
            "to": "0xe5c232F3FD62F104dB6F2a05aa6b5d1Db15a20f7",
            "value": 32009981000000000000000000n,
          },
          "blockHash": "0x2a26c203c100c58404d58abfb340920647e6ce962f1669c4e5c2d1741d5cdb1f",
          "blockNumber": "0x125544b",
          "data": "0x0000000000000000000000000000000000000000001a7a608c0cd81965d40000",
          "eventName": "Transfer",
          "logIndex": "0xd9",
          "removed": false,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000e5c232f3fd62f104db6f2a05aa6b5d1db15a20f7",
          ],
          "transactionHash": "0x7d674c4a6b17eae2b0490dfc007bdb345e5046da3815e91ef5a4e252f81c3e19",
          "transactionIndex": "0x59",
        },
      ]
    `);
  });
});
