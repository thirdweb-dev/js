import { describe, expect, test } from "vitest";
import { hexToBigInt, numberToHex } from "../utils/encoding/hex.js";
import { roundUpGas } from "./op-gas-fee-reducer.js";

describe("opGasFeeReducer", () => {
  test("should turn '0x3F1234' into '0x400000'", () => {
    const result = roundUpGas(hexToBigInt("0x3F1234"));
    expect(numberToHex(result)).toBe("0x400000");
  });
});
