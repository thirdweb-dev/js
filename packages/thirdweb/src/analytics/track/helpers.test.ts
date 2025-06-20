import { describe, expect, it } from "vitest";
import { getErrorDetails, isInsufficientFundsError } from "./helpers.js";

describe("isInsufficientFundsError", () => {
  it("should detect basic insufficient funds error message", () => {
    const error = new Error("insufficient funds");
    expect(isInsufficientFundsError(error)).toBe(true);
  });

  it("should detect insufficient funds for gas error", () => {
    const error = new Error("Insufficient funds for gas * price + value");
    expect(isInsufficientFundsError(error)).toBe(true);
  });

  it("should detect insufficient funds for intrinsic transaction cost", () => {
    const error = new Error(
      "insufficient funds for intrinsic transaction cost",
    );
    expect(isInsufficientFundsError(error)).toBe(true);
  });

  it("should detect insufficient balance error", () => {
    const error = new Error("insufficient balance");
    expect(isInsufficientFundsError(error)).toBe(true);
  });

  it("should detect insufficient native funds error", () => {
    const error = new Error("Insufficient Native Funds");
    expect(isInsufficientFundsError(error)).toBe(true);
  });

  it("should detect INSUFFICIENT_FUNDS error code", () => {
    const error = { code: "INSUFFICIENT_FUNDS", message: "Transaction failed" };
    expect(isInsufficientFundsError(error)).toBe(true);
  });

  it("should detect reason field", () => {
    const error = {
      message: "Transaction failed",
      reason: "insufficient funds",
    };
    expect(isInsufficientFundsError(error)).toBe(true);
  });

  it("should detect error in nested data.message", () => {
    const error = { data: { message: "insufficient funds for gas" } };
    expect(isInsufficientFundsError(error)).toBe(true);
  });

  it("should handle string errors", () => {
    expect(isInsufficientFundsError("insufficient funds")).toBe(true);
  });

  it("should return false for non-insufficient funds errors", () => {
    const error = new Error("User rejected transaction");
    expect(isInsufficientFundsError(error)).toBe(false);
  });

  it("should return false for null/undefined", () => {
    expect(isInsufficientFundsError(null)).toBe(false);
    expect(isInsufficientFundsError(undefined)).toBe(false);
  });

  it("should be case insensitive", () => {
    const error = new Error("INSUFFICIENT FUNDS FOR GAS");
    expect(isInsufficientFundsError(error)).toBe(true);
  });
});

describe("getErrorDetails", () => {
  it("should extract message and code from Error object", () => {
    const error = new Error("Test error message");
    const details = getErrorDetails(error);
    expect(details.message).toBe("Test error message");
    expect(details.code).toBeUndefined();
  });

  it("should extract message and code from error object", () => {
    const error = { code: "TEST_CODE", message: "Test message" };
    const details = getErrorDetails(error);
    expect(details.message).toBe("Test message");
    expect(details.code).toBe("TEST_CODE");
  });

  it("should extract message from nested data", () => {
    const error = { data: { message: "Nested error message" } };
    const details = getErrorDetails(error);
    expect(details.message).toBe("Nested error message");
  });

  it("should handle string errors", () => {
    const details = getErrorDetails("String error");
    expect(details.message).toBe("String error");
    expect(details.code).toBeUndefined();
  });

  it("should handle null/undefined", () => {
    const details = getErrorDetails(null);
    expect(details.message).toBe("Unknown error");
    expect(details.code).toBeUndefined();
  });

  it("should extract reason as code", () => {
    const error = { message: "Test message", reason: "test_reason" };
    const details = getErrorDetails(error);
    expect(details.message).toBe("Test message");
    expect(details.code).toBe("test_reason");
  });
});
