import { encodeErrorResult, parseAbi } from "viem";
import { describe, expect, it } from "vitest";
import { extractErrorResult } from "./extract-error.js";

describe("extractErrorResult", () => {
  it("decodes common token errors without a contract", async () => {
    await expect(
      extractErrorResult({ error: { data: "0x7939f424" } }),
    ).resolves.toBe("TransferFromFailed");
  });

  it("decodes errors with arguments without a contract", async () => {
    const data = encodeErrorResult({
      abi: parseAbi([
        "error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)",
      ]),
      args: ["0x0000000000000000000000000000000000000001", 1n, 2n],
      errorName: "ERC20InsufficientBalance",
    });
    await expect(extractErrorResult({ error: { data } })).resolves.toBe(
      "ERC20InsufficientBalance - 0x0000000000000000000000000000000000000001,1,2",
    );
  });

  it("decodes revert strings without a contract", async () => {
    const data = encodeErrorResult({
      abi: parseAbi(["error Error(string)"]),
      args: ["not allowed"],
      errorName: "Error",
    });
    await expect(extractErrorResult({ error: { data } })).resolves.toBe(
      "Error - not allowed",
    );
  });

  it("returns the raw data for unknown errors", async () => {
    await expect(
      extractErrorResult({ error: { data: "0x12345678" } }),
    ).resolves.toBe("Execution Reverted: 0x12345678");
  });
});
