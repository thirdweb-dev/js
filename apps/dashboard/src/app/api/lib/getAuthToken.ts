import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

export function getAuthToken() {
  const cookiesManager = (cookies() as unknown as UnsafeUnwrappedCookies);
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const token = activeAccount
    ? cookiesManager.get(COOKIE_PREFIX_TOKEN + activeAccount)?.value
    : null;

  return token;
}

export function getAuthTokenWalletAddress() {
  const cookiesManager = (cookies() as unknown as UnsafeUnwrappedCookies);
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  if (!activeAccount) {
    return null;
  }

  const token = cookiesManager.get(COOKIE_PREFIX_TOKEN + activeAccount)?.value;

  if (token) {
    return activeAccount;
  }

  return null;
}
