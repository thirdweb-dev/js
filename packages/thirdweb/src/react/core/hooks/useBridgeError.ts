import { ApiError } from "../../../bridge/types/Errors.js";
import { isRetryable, mapBridgeError } from "../errors/mapBridgeError.js";

/**
 * Parameters for the useBridgeError hook
 */
interface UseBridgeErrorParams {
  /**
   * The error to process. Can be an ApiError or generic Error.
   */
  error: Error | ApiError | null | undefined;
}

/**
 * Result returned by the useBridgeError hook
 */
interface UseBridgeErrorResult {
  /**
   * The mapped/normalized error, null if no error provided
   */
  mappedError: ApiError | null;

  /**
   * Whether this error can be retried
   */
  isRetryable: boolean;

  /**
   * User-friendly error message
   */
  userMessage: string;

  /**
   * Technical error code for debugging
   */
  errorCode: string | null;

  /**
   * HTTP status code if available
   */
  statusCode: number | null;

  /**
   * Whether this is a client-side error (4xx)
   */
  isClientError: boolean;

  /**
   * Whether this is a server-side error (5xx)
   */
  isServerError: boolean;
}

/**
 * Hook that processes bridge errors using mapBridgeError and isRetryable
 *
 * @param params - Parameters containing the error to process
 * @returns Processed error information with retry logic and user-friendly messages
 *
 * @example
 * ```tsx
 * const { data, error } = useBridgeRoutes({ client, originChainId: 1 });
 * const {
 *   mappedError,
 *   isRetryable,
 *   userMessage,
 *   isClientError
 * } = useBridgeError({ error });
 *
 * if (error) {
 *   return (
 *     <div>
 *       <p>{userMessage}</p>
 *       {isRetryable && <button onClick={retry}>Try Again</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBridgeError(
  params: UseBridgeErrorParams,
): UseBridgeErrorResult {
  const { error } = params;

  // No error case
  if (!error) {
    return {
      errorCode: null,
      isClientError: false,
      isRetryable: false,
      isServerError: false,
      mappedError: null,
      statusCode: null,
      userMessage: "",
    };
  }

  // Convert to ApiError if it's not already
  let apiError: ApiError;
  if (error instanceof ApiError) {
    apiError = mapBridgeError(error);
  } else {
    // Create ApiError from generic Error
    apiError = new ApiError({
      code: "UNKNOWN_ERROR",
      message: error.message || "An unknown error occurred",
      statusCode: 500, // Default for generic errors
    });
  }

  const statusCode = apiError.statusCode || null;
  const isClientError =
    statusCode !== null && statusCode >= 400 && statusCode < 500;
  const isServerError = statusCode !== null && statusCode >= 500;

  // Generate user-friendly message based on error code
  const userMessage = getUserFriendlyMessage(apiError);

  return {
    errorCode: apiError.code,
    isClientError,
    isRetryable: isRetryable(apiError.code),
    isServerError,
    mappedError: apiError,
    statusCode,
    userMessage,
  };
}

/**
 * Converts technical error codes to user-friendly messages
 */
function getUserFriendlyMessage(error: ApiError): string {
  switch (error.code) {
    case "INVALID_INPUT":
      return "Invalid input provided. Please check your parameters and try again.";
    case "ROUTE_NOT_FOUND":
      return "No route found for this transaction. Please try a different token pair or amount.";
    case "AMOUNT_TOO_LOW":
      return "The amount is too low for this transaction. Please increase the amount.";
    case "AMOUNT_TOO_HIGH":
      return "The amount is too high for this transaction. Please decrease the amount.";
    case "INTERNAL_SERVER_ERROR":
      return "A temporary error occurred. Please try again in a moment.";
    default:
      // Fallback to the original error message if available
      return error.message || "An unexpected error occurred. Please try again.";
  }
}
