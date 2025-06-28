import type { ThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import { randomBytesHex } from "../../../../utils/random.js";
import type { Ecosystem } from "../wallet/types.js";
import type { ClientScopedStorage } from "./client-scoped-storage.js";
import { getLoginCallbackUrl } from "./getLoginPath.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

/**
 * Does no real authentication, just issues a temporary token for the user.
 * @internal
 */
export async function guestAuthenticate(args: {
  client: ThirdwebClient;
  storage: ClientScopedStorage;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  let sessionId = await args.storage.getGuestSessionId();
  if (!sessionId) {
    sessionId = randomBytesHex(32);
    args.storage.saveGuestSessionId(sessionId);
  }

  const clientFetch = getClientFetch(args.client, args.ecosystem);
  const path = getLoginCallbackUrl({
    authOption: "guest",
    client: args.client,
    ecosystem: args.ecosystem,
  });
  const res = await clientFetch(`${path}`, {
    body: stringify({
      sessionId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(
      `Failed to generate guest account: ${res.status} ${res.statusText} ${error}`,
    );
  }

  return (await res.json()) satisfies AuthStoredTokenWithCookieReturnType;
}
