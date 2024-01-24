export const USER_ABORT_AUTHENTICATION_ERROR_MESSAGE =
  "User aborted the authentication flow";
export class UserAbortError extends Error {
  constructor() {
    super(USER_ABORT_AUTHENTICATION_ERROR_MESSAGE);
  }
}
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
