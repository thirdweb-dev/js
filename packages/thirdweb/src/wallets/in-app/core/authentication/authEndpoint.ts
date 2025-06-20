import type { ThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import { ROUTE_AUTH_ENDPOINT_CALLBACK } from "../../native/helpers/constants.js";
import { createErrorMessage } from "../../native/helpers/errors.js";
import type { Ecosystem } from "../wallet/types.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

export async function authEndpoint(args: {
  payload: string;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const clientFetch = getClientFetch(args.client, args.ecosystem);

  const res = await clientFetch(ROUTE_AUTH_ENDPOINT_CALLBACK, {
    body: stringify({
      developerClientId: args.client.clientId,
      payload: args.payload,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      `Custom auth endpoint authentication error: ${error.message}`,
    );
  }

  try {
    const { verifiedToken } = await res.json();

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
