import type { ThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import type { Ecosystem } from "../wallet/types.js";
import { getLoginUrl } from "./getLoginPath.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

/**
 * Authenticates via the wallet secret
 * @internal
 */
export async function backendAuthenticate(args: {
  client: ThirdwebClient;
  walletSecret: string;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const clientFetch = getClientFetch(args.client, args.ecosystem);
  const path = getLoginUrl({
    authOption: "backend",
    client: args.client,
    ecosystem: args.ecosystem,
  });
  const res = await clientFetch(`${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: stringify({
      walletSecret: args.walletSecret,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate backend account");
  }

  return (await res.json()) satisfies AuthStoredTokenWithCookieReturnType;
}
