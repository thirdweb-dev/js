export const USER_ABORT_AUTHENTICATION_ERROR_MESSAGE =
  "User aborted the authentication flow";

/**
 * Error thrown when user aborts the authentication flow
 */
export class UserAbortError extends Error {
  /**
   * Constructed when throwing error for user aborting authentication flow
   * @example
   * ```ts
   * throw new UserAbortError();
   * ```
   */
  constructor() {
    super(USER_ABORT_AUTHENTICATION_ERROR_MESSAGE);
    this.name = "UserAbortError";
  }
}
/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends Error {
  /**
   * Constructed when throwing error for authentication failure other than user abort
   * @param message - Error message
   * @example
   * ```ts
   * throw new AuthenticationError("Authentication failed");
   * ```
   */
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}
