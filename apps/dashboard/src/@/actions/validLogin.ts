"use server";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import { getCachedRawAccountForAuthToken } from "../../app/account/settings/getAccount";
import { COOKIE_PREFIX_TOKEN } from "../constants/cookie";

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
  const account = await getCachedRawAccountForAuthToken(authTokenForAddress);

  if (!account) {
    return false;
  }

  // the current account should match the account fetched for the authToken
  return account.id === params.account.id;
}
