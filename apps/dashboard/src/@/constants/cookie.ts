import { cookies } from "next/headers";

export const COOKIE_ACTIVE_ACCOUNT = "tw_active_account";
export const COOKIE_PREFIX_TOKEN = "tw_token_";

export function getActiveAccountCookie() {
  return cookies().get(COOKIE_ACTIVE_ACCOUNT)?.value;
}

export function getJWTCookie(address: string) {
  return cookies().get(COOKIE_PREFIX_TOKEN + address)?.value;
}
