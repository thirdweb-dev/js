import type { ThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import type { Ecosystem } from "../../web/types.js";
import { getLoginCallbackUrl } from "./getLoginPath.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

/**
 * Does no real authentication, just issues a temporary token for the user.
 * @internal
 */
export async function guestAuthenticate(args: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const clientFetch = getClientFetch(args.client, args.ecosystem);
  const authResult = await (async () => {
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
      body: JSON.stringify({
        sessionId: "guest",
      }),
    });

    if (!res.ok) throw new Error("Failed to generate guest account");

    return (await res.json()) satisfies AuthStoredTokenWithCookieReturnType;
  })();
  return authResult;
}
