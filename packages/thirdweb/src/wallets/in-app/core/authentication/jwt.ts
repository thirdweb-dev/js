import type { ThirdwebClient } from "../../../../client/client.js";
import { getSessionHeaders } from "../../native/helpers/api/fetchers.js";
import { ROUTE_AUTH_JWT_CALLBACK } from "../../native/helpers/constants.js";
import { createErrorMessage } from "../../native/helpers/errors.js";
import type { ClientScopedStorage } from "./client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

export async function customJwt(args: {
  jwt: string;
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const resp = await fetch(ROUTE_AUTH_JWT_CALLBACK, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      jwt: args.jwt,
      developerClientId: args.client.clientId,
    }),
  });

  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(`JWT authentication error: ${error.message}`);
  }

  try {
    const { verifiedToken } = await resp.json();
    return { storedToken: verifiedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post jwt authentication", e),
    );
  }
}
