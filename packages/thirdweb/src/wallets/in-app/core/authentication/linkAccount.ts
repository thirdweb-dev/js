import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import type { Ecosystem } from "../wallet/types.js";
import type { ClientScopedStorage } from "./client-scoped-storage.js";
import type { Profile } from "./types.js";

/**
 * Links a new account to the current one using an auth token.
 * For the public-facing API, use `wallet.linkProfile` instead.
 *
 * @internal
 */
export async function linkAccount({
  client,
  ecosystem,
  tokenToLink,
  storage,
}: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  tokenToLink: string;
  storage: ClientScopedStorage;
}): Promise<Profile[]> {
  const clientFetch = getClientFetch(client, ecosystem);
  const IN_APP_URL = getThirdwebBaseUrl("inAppWallet");
  const currentAccountToken = await storage.getAuthCookie();

  if (!currentAccountToken) {
    throw new Error("Failed to link account, no user logged in");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer iaw-auth-token:${currentAccountToken}`,
    "Content-Type": "application/json",
  };
  const linkedDetailsResp = await clientFetch(
    `${IN_APP_URL}/api/2024-05-05/account/connect`,
    {
      body: stringify({
        accountAuthTokenToConnect: tokenToLink,
      }),
      headers,
      method: "POST",
    },
  );

  if (!linkedDetailsResp.ok) {
    const body = await linkedDetailsResp.json();
    throw new Error(body.message || "Failed to link account.");
  }

  const { linkedAccounts } = await linkedDetailsResp.json();

  return (linkedAccounts ?? []) satisfies Profile[];
}

/**
 * Links a new account to the current one using an auth token.
 * For the public-facing API, use `wallet.linkProfile` instead.
 *
 * @internal
 */
export async function unlinkAccount({
  client,
  ecosystem,
  profileToUnlink,
  allowAccountDeletion = false,
  storage,
}: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  profileToUnlink: Profile;
  allowAccountDeletion?: boolean;
  storage: ClientScopedStorage;
}): Promise<Profile[]> {
  const clientFetch = getClientFetch(client, ecosystem);
  const IN_APP_URL = getThirdwebBaseUrl("inAppWallet");
  const currentAccountToken = await storage.getAuthCookie();

  if (!currentAccountToken) {
    throw new Error("Failed to unlink account, no user logged in");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer iaw-auth-token:${currentAccountToken}`,
    "Content-Type": "application/json",
  };
  const linkedDetailsResp = await clientFetch(
    `${IN_APP_URL}/api/2024-05-05/account/disconnect`,
    {
      body: stringify({
        allowAccountDeletion,
        details: profileToUnlink.details,
        type: profileToUnlink.type,
      }),
      headers,
      method: "POST",
    },
  );

  if (!linkedDetailsResp.ok) {
    const body = await linkedDetailsResp.json();
    throw new Error(body.message || "Failed to unlink account.");
  }

  const { linkedAccounts } = await linkedDetailsResp.json();

  return (linkedAccounts ?? []) satisfies Profile[];
}

/**
 * Gets the linked accounts for the current user.
 * For the public-facing API, use `wallet.getProfiles` instead.
 *
 * @internal
 */
export async function getLinkedProfilesInternal({
  client,
  ecosystem,
  storage,
}: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  storage: ClientScopedStorage;
}): Promise<Profile[]> {
  const clientFetch = getClientFetch(client, ecosystem);
  const IN_APP_URL = getThirdwebBaseUrl("inAppWallet");
  const currentAccountToken = await storage.getAuthCookie();
  if (!currentAccountToken) {
    throw new Error("Failed to get linked accounts, no user logged in");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer iaw-auth-token:${currentAccountToken}`,
    "Content-Type": "application/json",
  };

  const linkedAccountsResp = await clientFetch(
    `${IN_APP_URL}/api/2024-05-05/accounts`,
    {
      headers,
      method: "GET",
    },
  );

  if (!linkedAccountsResp.ok) {
    const body = await linkedAccountsResp.json();
    throw new Error(body.message || "Failed to get linked accounts.");
  }

  const { linkedAccounts } = await linkedAccountsResp.json();

  return (linkedAccounts ?? []) satisfies Profile[];
}
