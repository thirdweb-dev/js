import type { ThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import { ROUTE_AUTH_JWT_CALLBACK } from "../../native/helpers/constants.js";
import { createErrorMessage } from "../../native/helpers/errors.js";
import type { Ecosystem } from "../wallet/types.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

export async function customJwt(args: {
  jwt: string;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const clientFetch = getClientFetch(args.client, args.ecosystem);

  const res = await clientFetch(ROUTE_AUTH_JWT_CALLBACK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: stringify({
      jwt: args.jwt,
      developerClientId: args.client.clientId,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`JWT authentication error: ${error.message}`);
  }

  try {
    const { verifiedToken } = await res.json();

    return { storedToken: verifiedToken };
  } catch (e) {
    throw new Error(
      createErrorMessage("Malformed response from post jwt authentication", e),
    );
  }
}
