import type { AuthorizationInput } from "./authorize/index.js";

/**
 * Computes the appropriate auth headers based on the auth data.
 *
 * @param authData - The auth data to use.
 * @param serviceApiKey - The service api key to use.
 * @returns The auth headers.
 */
export function getAuthHeaders(
  authData: AuthorizationInput,
  serviceApiKey?: string,
): HeadersInit {
  const { teamId, clientId, jwt, secretKey, incomingServiceApiKey } = authData;

  switch (true) {
    // 1. if we have a secret key, we'll use it
    case !!secretKey:
      return {
        "x-secret-key": secretKey,
      };

    // 2. if we have a JWT AND either a teamId or clientId, we'll use the JWT for auth
    case !!(jwt && (teamId || clientId)):
      return {
        Authorization: `Bearer ${jwt}`,
      };

    // 3. if we have an incoming service api key, we'll use it
    case !!incomingServiceApiKey: {
      return {
        "x-service-api-key": incomingServiceApiKey,
      };
    }

    // 4. if we have a service api key provided by the service, use it
    case !!serviceApiKey: {
      return {
        "x-service-api-key": serviceApiKey,
      };
    }

    // 5. otherwise leave auth headers empty
    default: {
      return {};
    }
  }
}
