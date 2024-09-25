import type { ThirdwebClient } from "../../../../client/client.js";
import { getSessionHeaders } from "../../native/helpers/api/fetchers.js";
import { ROUTE_AUTH_ENDPOINT_CALLBACK } from "../../native/helpers/constants.js";
import { createErrorMessage } from "../../native/helpers/errors.js";
import type { ClientScopedStorage } from "./client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

export async function authEndpoint(args: {
  payload: string;
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const resp = await fetch(ROUTE_AUTH_ENDPOINT_CALLBACK, {
    method: "POST",
    headers: {
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      payload: args.payload,
      developerClientId: args.client.clientId,
    }),
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(
      `Custom auth endpoint authentication error: ${error.message}`,
    );
  }

  try {
    const { verifiedToken } = await resp.json();

    return { storedToken: verifiedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage(
        "Malformed response from post auth_endpoint authentication",
        e,
      ),
    );
  }
}
