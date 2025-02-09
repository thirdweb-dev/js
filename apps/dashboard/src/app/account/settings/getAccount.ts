import { accountCacheTag } from "@/constants/cacheTags";
import { API_SERVER_URL } from "@/constants/env";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { unstable_cache } from "next/cache";
import { getAuthToken } from "../../api/lib/getAuthToken";
import { loginRedirect } from "../../login/loginRedirect";
import { isOnboardingComplete } from "../../login/onboarding/isOnboardingRequired";

/**
 * Just get the account object without enforcing onboarding.
 * In most cases - you should just be using `getValidAccount`
 */
export async function getRawAccount() {
  const authToken = await getAuthToken();

  if (!authToken) {
    return undefined;
  }

  return getCachedRawAccountForAuthToken(authToken);
}

export async function getCachedRawAccountForAuthToken(authToken: string) {
  const getCachedAccount = unstable_cache(
    getRawAccountForAuthToken,
    ["getRawAccount"],
    {
      tags: [accountCacheTag(authToken)],
    },
  );

  return getCachedAccount(authToken);
}

async function getRawAccountForAuthToken(authToken: string) {
  console.log("FETCHING ACCOUNT -------------");
  const res = await fetch(`${API_SERVER_URL}/v1/account/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const json = await res.json();

  if (json.error) {
    console.error(json.error);
    return undefined;
  }

  return json.data as Account;
}

/**
 * If there's no account or account onboarding not complete, redirect to login page
 * @param pagePath - the path of the current page to redirect back to after login/onboarding
 */
export async function getValidAccount(pagePath?: string) {
  const account = await getRawAccount();

  // enforce login & onboarding
  if (!account || !isOnboardingComplete(account)) {
    loginRedirect(pagePath);
  }

  return account;
}
