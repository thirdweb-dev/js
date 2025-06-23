import { describe, expect, it } from "vitest";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import {
  isNativeToken,
  NATIVE_TOKEN,
  type NativeToken,
} from "./nativeToken.js"; // Replace with the actual file name// Assuming this is defined in a constants file

describe("isNativeToken", () => {
  it("should return true for NATIVE_TOKEN", () => {
    expect(isNativeToken(NATIVE_TOKEN)).toBe(true);
  });

  it("should return true for an object with nativeToken property", () => {
    const token: NativeToken = { nativeToken: true };
    expect(isNativeToken(token)).toBe(true);
  });

  it("should return true for a token with the native token address", () => {
    const token = { address: NATIVE_TOKEN_ADDRESS };
    expect(isNativeToken(token)).toBe(true);
  });

  it("should return true for a token with the native token address in uppercase", () => {
    const token = { address: NATIVE_TOKEN_ADDRESS.toUpperCase() };
    expect(isNativeToken(token)).toBe(true);
  });

  it("should return false for a non-native token", () => {
    const token = { address: "0x1234567890123456789012345678901234567890" };
    expect(isNativeToken(token)).toBe(false);
  });

  it("should return false for an empty object", () => {
    expect(isNativeToken({})).toBe(false);
  });

  it("should return false for a token with a similar but incorrect address", () => {
    const token = { address: `${NATIVE_TOKEN_ADDRESS.slice(0, -1)}0` };
    expect(isNativeToken(token)).toBe(false);
  });
});
