import type { ApiError } from "../../../bridge/types/Errors.js";

/**
 * Maps raw ApiError instances from the Bridge SDK into UI-friendly domain errors.
 * Currently returns the same error; will evolve to provide better user-facing messages.
 *
 * @param e - The raw ApiError from the Bridge SDK
 * @returns The mapped ApiError (currently unchanged)
 */
export function mapBridgeError(e: ApiError): ApiError {
  // For now, return the same error
  // TODO: This will evolve to provide better user-facing error messages
  return e;
}

/**
 * Determines if an error code represents a retryable error condition.
 *
 * @param code - The error code from ApiError
 * @returns true if the error is retryable, false otherwise
 */
export function isRetryable(code: ApiError["code"]): boolean {
  // Treat INTERNAL_SERVER_ERROR & UNKNOWN_ERROR as retryable
  return code === "INTERNAL_SERVER_ERROR" || code === "UNKNOWN_ERROR";
}
