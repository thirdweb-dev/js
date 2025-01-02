import { describe, expect, it } from "vitest";
import {
  USDT_CONTRACT,
  USDT_CONTRACT_WITH_ABI,
} from "../../test/src/test-contracts.js";
import { resolveMethod } from "./resolve-method.js";

describe.runIf(process.env.TW_SECRET_KEY)("resolveMethod", () => {
  it("should return parseAbiItem result for function signature", async () => {
    const result = await resolveMethod(
      "function transfer(address to, uint256 amount)",
    )(USDT_CONTRACT);
    expect(result).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "name": "to",
            "type": "address",
          },
          {
            "name": "amount",
            "type": "uint256",
          },
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `);
  });

  it("should return parseAbiItem result for abi", async () => {
    const result = await resolveMethod("transfer")(USDT_CONTRACT_WITH_ABI);
    expect(result).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "name": "_to",
            "type": "address",
          },
          {
            "name": "_value",
            "type": "uint256",
          },
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `);
  });

  it("should return parseAbiItem result for abi", async () => {
    const result = await resolveMethod("transfer")(USDT_CONTRACT);
    expect(result).toMatchInlineSnapshot(`
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address",
          },
          {
            "name": "_value",
            "type": "uint256",
          },
        ],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `);
  });
});
