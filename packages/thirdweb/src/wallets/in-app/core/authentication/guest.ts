import type { ThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import { randomBytesHex } from "../../../../utils/random.js";
import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import type { Ecosystem } from "../wallet/types.js";
import { ClientScopedStorage } from "./client-scoped-storage.js";
import { getLoginCallbackUrl } from "./getLoginPath.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

/**
 * Does no real authentication, just issues a temporary token for the user.
 * @internal
 */
export async function guestAuthenticate(args: {
  client: ThirdwebClient;
  storage: AsyncStorage;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const storage = new ClientScopedStorage({
    storage: args.storage,
    clientId: args.client.clientId,
    ecosystem: args.ecosystem,
  });

  let sessionId = await storage.getGuestSessionId();
  if (!sessionId) {
    sessionId = randomBytesHex(32);
    storage.saveGuestSessionId(sessionId);
  }

  const clientFetch = getClientFetch(args.client, args.ecosystem);
  const path = getLoginCallbackUrl({
    authOption: "guest",
    client: args.client,
    ecosystem: args.ecosystem,
  });
  const res = await clientFetch(`${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: stringify({
      sessionId,
    }),
  });

  if (!res.ok) throw new Error("Failed to generate guest account");

  return (await res.json()) satisfies AuthStoredTokenWithCookieReturnType;
}
