import { describe, test, expect } from "vitest";
import { roundUpGas } from "./op-gas-fee-reducer.js";
import { hexToBigInt, numberToHex } from "../utils/encoding/hex.js";

describe("opGasFeeReducer", () => {
  test("should turn '0x3F1234' into '0x400000'", () => {
    const result = roundUpGas(hexToBigInt("0x3F1234"));
    expect(numberToHex(result)).toBe("0x400000");
  });
});
