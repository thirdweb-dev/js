"use server";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import { COOKIE_PREFIX_TOKEN } from "../constants/cookie";
import { API_SERVER_URL } from "../constants/env";

/**
 * Check that the connected wallet is valid for the current active account
 */
export async function isWalletValidForActiveAccount(params: {
  address: string;
  account: Account;
  authToken: string;
}) {
  const cookieStore = await cookies();
  const authCookieNameForAddress =
    COOKIE_PREFIX_TOKEN + getAddress(params.address);

  // authToken for this wallet address should be present
  const authTokenForAddress = cookieStore.get(authCookieNameForAddress)?.value;
  if (!authTokenForAddress) {
    return false;
  }

  // this authToken should be same as current active authToken
  if (authTokenForAddress !== params.authToken) {
    return false;
  }

  // authToken should be valid
  const accountRes = await fetch(`${API_SERVER_URL}/v1/account/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authTokenForAddress}`,
    },
  });

  if (accountRes.status !== 200) {
    return false;
  }

  const account = (await accountRes.json()).data as Account;

  // the current account should match the account fetched for the authToken
  return account.id === params.account.id;
}
