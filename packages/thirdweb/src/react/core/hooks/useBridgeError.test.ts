import { describe, expect, it } from "vitest";
import { ApiError } from "../../../bridge/types/Errors.js";
import { useBridgeError } from "./useBridgeError.js";

describe("useBridgeError", () => {
  it("should handle null error", () => {
    const result = useBridgeError({ error: null });

    expect(result).toEqual({
      mappedError: null,
      isRetryable: false,
      userMessage: "",
      errorCode: null,
      statusCode: null,
      isClientError: false,
      isServerError: false,
    });
  });

  it("should handle undefined error", () => {
    const result = useBridgeError({ error: undefined });

    expect(result).toEqual({
      mappedError: null,
      isRetryable: false,
      userMessage: "",
      errorCode: null,
      statusCode: null,
      isClientError: false,
      isServerError: false,
    });
  });

  it("should process ApiError correctly", () => {
    const apiError = new ApiError({
      code: "INVALID_INPUT",
      message: "Invalid parameters provided",
      statusCode: 400,
    });

    const result = useBridgeError({ error: apiError });

    expect(result.mappedError).toBeInstanceOf(ApiError);
    expect(result.errorCode).toBe("INVALID_INPUT");
    expect(result.statusCode).toBe(400);
    expect(result.isClientError).toBe(true);
    expect(result.isServerError).toBe(false);
    expect(result.isRetryable).toBe(false); // INVALID_INPUT is not retryable
    expect(result.userMessage).toBe(
      "Invalid input provided. Please check your parameters and try again.",
    );
  });

  it("should convert generic Error to ApiError", () => {
    const genericError = new Error("Network connection failed");

    const result = useBridgeError({ error: genericError });

    expect(result.mappedError).toBeInstanceOf(ApiError);
    expect(result.errorCode).toBe("UNKNOWN_ERROR");
    expect(result.statusCode).toBe(500);
    expect(result.isClientError).toBe(false);
    expect(result.isServerError).toBe(true);
    expect(result.isRetryable).toBe(true);
    expect(result.userMessage).toBe(
      "An unexpected error occurred. Please try again.",
    );
  });

  it("should identify server errors correctly", () => {
    const serverError = new ApiError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Server error",
      statusCode: 500,
    });

    const result = useBridgeError({ error: serverError });

    expect(result.statusCode).toBe(500);
    expect(result.isClientError).toBe(false);
    expect(result.isServerError).toBe(true);
    expect(result.isRetryable).toBe(true); // INTERNAL_SERVER_ERROR is retryable
    expect(result.userMessage).toBe(
      "A temporary error occurred. Please try again in a moment.",
    );
  });

  it("should provide user-friendly messages for known error codes", () => {
    // Test INVALID_INPUT
    const invalidInputError = new ApiError({
      code: "INVALID_INPUT",
      message: "Technical error message",
      statusCode: 400,
    });
    const invalidInputResult = useBridgeError({ error: invalidInputError });
    expect(invalidInputResult.userMessage).toBe(
      "Invalid input provided. Please check your parameters and try again.",
    );

    // Test INTERNAL_SERVER_ERROR
    const serverError = new ApiError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Technical error message",
      statusCode: 500,
    });
    const serverResult = useBridgeError({ error: serverError });
    expect(serverResult.userMessage).toBe(
      "A temporary error occurred. Please try again in a moment.",
    );
  });

  it("should use original error message for unknown error codes", () => {
    const unknownError = new ApiError({
      code: "UNKNOWN_ERROR",
      message: "Custom error message",
      statusCode: 418,
    });

    const result = useBridgeError({ error: unknownError });

    expect(result.userMessage).toBe(
      "An unexpected error occurred. Please try again.",
    );
    expect(result.errorCode).toBe("UNKNOWN_ERROR");
  });

  it("should detect client vs server errors correctly", () => {
    // Client error (4xx)
    const clientError = new ApiError({
      code: "INVALID_INPUT",
      message: "Bad request",
      statusCode: 400,
    });

    const clientResult = useBridgeError({ error: clientError });
    expect(clientResult.isClientError).toBe(true);
    expect(clientResult.isServerError).toBe(false);

    // Server error (5xx)
    const serverError = new ApiError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal error",
      statusCode: 503,
    });

    const serverResult = useBridgeError({ error: serverError });
    expect(serverResult.isClientError).toBe(false);
    expect(serverResult.isServerError).toBe(true);

    // No status code
    const noStatusError = new ApiError({
      code: "UNKNOWN_ERROR",
      message: "Unknown error",
      statusCode: 500,
    });

    const noStatusResult = useBridgeError({ error: noStatusError });
    expect(noStatusResult.isClientError).toBe(false);
    expect(noStatusResult.isServerError).toBe(true); // 500 is a server error
  });

  it("should handle Error without message", () => {
    const errorWithoutMessage = new Error();

    const result = useBridgeError({ error: errorWithoutMessage });

    expect(result.userMessage).toBe(
      "An unexpected error occurred. Please try again.",
    );
    expect(result.errorCode).toBe("UNKNOWN_ERROR");
  });
});
