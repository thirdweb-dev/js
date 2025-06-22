import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { Account } from "@/hooks/useApi";
import { getAuthToken } from "../../../../@/api/auth-token";
import { loginRedirect } from "../../login/loginRedirect";
import { isAccountOnboardingComplete } from "../../login/onboarding/isOnboardingRequired";

/**
 * Just get the account object without enforcing onboarding.
 * In most cases - you should just be using `getValidAccount`
 */
export async function getRawAccount() {
  const authToken = await getAuthToken();

  if (!authToken) {
    return undefined;
  }

  const res = await fetch(`${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/account/me`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    method: "GET",
  });

  if (!res.ok) {
    console.error("Error fetching account", res.status, res.statusText);
    return undefined;
  }

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
  if (!account || !isAccountOnboardingComplete(account)) {
    loginRedirect(pagePath);
  }

  return account;
}
