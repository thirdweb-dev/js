import { type UnsafeUnwrappedCookies, cookies } from "next/headers";

export const COOKIE_ACTIVE_ACCOUNT = "tw_active_account";
export const COOKIE_PREFIX_TOKEN = "tw_token_";

export function getActiveAccountCookie() {
  return (cookies() as unknown as UnsafeUnwrappedCookies).get(
    COOKIE_ACTIVE_ACCOUNT,
  )?.value;
}

export function getJWTCookie(address: string) {
  return (cookies() as unknown as UnsafeUnwrappedCookies).get(
    COOKIE_PREFIX_TOKEN + address,
  )?.value;
}
