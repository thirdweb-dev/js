import { AuthOptions, AuthorizationResponse } from "./types";

export function validateAuthOptions(
  authOptions: AuthOptions,
): AuthorizationResponse {
  const { clientId, bundleId, origin } = authOptions;

  if (!clientId) {
    return {
      authorized: false,
      errorMessage: "The client ID is missing.",
      errorCode: "MISSING_CLIENT_ID",
      statusCode: 422,
    };
  }

  if (!bundleId && !origin) {
    return {
      authorized: false,
      errorMessage: "The bundle ID or Origin is missing.",
      errorCode: "MISSING_ORIGIN",
      statusCode: 422,
    };
  }

  return {
    authorized: true,
  };
}
