import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import type { Profile } from "./types.js";

/**
 * @description
 * Links a new account to the current one using an auth token.
 * For the public-facing API, use `wallet.addAuthMethod` instead.
 *
 * @internal
 */
export async function linkAccount({
  client,
  tokenToLink,
}: {
  client: ThirdwebClient;
  tokenToLink: string;
}): Promise<Profile[]> {
  const IN_APP_URL = getThirdwebBaseUrl("inAppWallet");
  const currentAccountToken = localStorage.getItem(
    `walletToken-${client.clientId}`,
  );

  if (!currentAccountToken) {
    throw new Error("Failed to link account, no user logged in");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer iaw-auth-token:${currentAccountToken}`,
    "x-thirdweb-client-id": client.clientId,
  };

  const linkedDetailsResp = await fetch(
    `${IN_APP_URL}/api/2024-05-05/account/connect`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        accountAuthTokenToConnect: tokenToLink,
      }),
    },
  );

  if (!linkedDetailsResp.ok) {
    const body = await linkedDetailsResp.json();
    throw new Error(`Failed to link account: ${body.message || "Unknown"}`);
  }

  const { linkedAccounts } = await linkedDetailsResp.json();

  return (linkedAccounts ?? []) satisfies Profile[];
}

/**
 * @description
 * Gets the linked accounts for the current user.
 * For the public-facing API, use `wallet.getConnectedProfiles` instead.
 *
 * @internal
 */
export async function getLinkedProfilesInternal({
  client,
}: { client: ThirdwebClient }): Promise<Profile[]> {
  const IN_APP_URL = getThirdwebBaseUrl("inAppWallet");
  const currentAccountToken = localStorage.getItem(
    `walletToken-${client.clientId}`,
  );

  if (!currentAccountToken) {
    throw new Error("Failed to get linked accounts, no user logged in");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer iaw-auth-token:${currentAccountToken}`,
    "x-thirdweb-client-id": client.clientId,
  };

  const linkedAccountsResp = await fetch(
    `${IN_APP_URL}/api/2024-05-05/accounts`,
    {
      method: "GET",
      headers,
    },
  );

  if (!linkedAccountsResp.ok) {
    throw new Error(`Failed to get accounts: ${linkedAccountsResp.text}`);
  }

  const { linkedAccounts } = await linkedAccountsResp.json();

  return (linkedAccounts ?? []) satisfies Profile[];
}
