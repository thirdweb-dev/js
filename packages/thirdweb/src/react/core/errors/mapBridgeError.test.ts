import { describe, expect, it } from "vitest";
import { ApiError } from "../../../bridge/types/Errors.js";
import { isRetryable, mapBridgeError } from "./mapBridgeError.js";

describe("mapBridgeError", () => {
  it("should return the same error for INVALID_INPUT", () => {
    const error = new ApiError({
      code: "INVALID_INPUT",
      correlationId: "test-correlation-id",
      message: "Invalid input provided",
      statusCode: 400,
    });

    const result = mapBridgeError(error);

    expect(result).toBe(error);
    expect(result.code).toBe("INVALID_INPUT");
    expect(result.message).toBe("Invalid input provided");
    expect(result.statusCode).toBe(400);
    expect(result.correlationId).toBe("test-correlation-id");
  });

  it("should return the same error for INTERNAL_SERVER_ERROR", () => {
    const error = new ApiError({
      code: "INTERNAL_SERVER_ERROR",
      correlationId: "internal-error-id",
      message: "Internal server error occurred",
      statusCode: 500,
    });

    const result = mapBridgeError(error);

    expect(result).toBe(error);
    expect(result.code).toBe("INTERNAL_SERVER_ERROR");
    expect(result.message).toBe("Internal server error occurred");
    expect(result.statusCode).toBe(500);
    expect(result.correlationId).toBe("internal-error-id");
  });

  it("should return the same error for ROUTE_NOT_FOUND", () => {
    const error = new ApiError({
      code: "ROUTE_NOT_FOUND",
      message: "No route found for the requested parameters",
      statusCode: 404,
    });

    const result = mapBridgeError(error);

    expect(result).toBe(error);
    expect(result.code).toBe("ROUTE_NOT_FOUND");
    expect(result.message).toBe("No route found for the requested parameters");
    expect(result.statusCode).toBe(404);
    expect(result.correlationId).toBeUndefined();
  });

  it("should return the same error for AMOUNT_TOO_LOW", () => {
    const error = new ApiError({
      code: "AMOUNT_TOO_LOW",
      correlationId: "amount-validation-id",
      message: "Amount is below minimum threshold",
      statusCode: 400,
    });

    const result = mapBridgeError(error);

    expect(result).toBe(error);
    expect(result.code).toBe("AMOUNT_TOO_LOW");
    expect(result.message).toBe("Amount is below minimum threshold");
    expect(result.statusCode).toBe(400);
    expect(result.correlationId).toBe("amount-validation-id");
  });
});

describe("isRetryable", () => {
  it("should return true for INTERNAL_SERVER_ERROR", () => {
    expect(isRetryable("INTERNAL_SERVER_ERROR")).toBe(true);
  });

  it("should return true for UNKNOWN_ERROR", () => {
    expect(isRetryable("UNKNOWN_ERROR")).toBe(true);
  });

  it("should return false for INVALID_INPUT", () => {
    expect(isRetryable("INVALID_INPUT")).toBe(false);
  });

  it("should return false for ROUTE_NOT_FOUND", () => {
    expect(isRetryable("ROUTE_NOT_FOUND")).toBe(false);
  });

  it("should return false for AMOUNT_TOO_LOW", () => {
    expect(isRetryable("AMOUNT_TOO_LOW")).toBe(false);
  });

  it("should return false for AMOUNT_TOO_HIGH", () => {
    expect(isRetryable("AMOUNT_TOO_HIGH")).toBe(false);
  });
});
