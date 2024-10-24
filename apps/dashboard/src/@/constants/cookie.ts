import { cookies } from "next/headers";

export const COOKIE_ACTIVE_ACCOUNT = "tw_active_account";
export const COOKIE_PREFIX_TOKEN = "tw_token_";

export async function getActiveAccountCookie() {
  return (await cookies()).get(COOKIE_ACTIVE_ACCOUNT)?.value;
}

export async function getJWTCookie(address: string) {
  return (await cookies()).get(COOKIE_PREFIX_TOKEN + address)?.value;
}
