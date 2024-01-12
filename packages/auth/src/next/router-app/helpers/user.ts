import { cookies, headers } from "next/headers";

import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../../constants";
import type { Json } from "../../../core";
import type { ThirdwebAuthUser } from "../../common/types";
import type { ThirdwebAuthContext } from "../types";

export function getCookie(cookie: string): string | undefined {
  return cookies().get(cookie)?.value;
}

export function getActiveCookie(): string | undefined {
  const activeAccount = getCookie(THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE);
  if (activeAccount) {
    return `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${activeAccount}`;
  }

  // If active account is not present, then use the old default
  return THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX;
}

export function getToken(): string | undefined {
  const headerList = headers();

  if (headerList.has("authorization")) {
    const authorizationHeader = headerList.get("authorization")?.split(" ");
    if (authorizationHeader?.length === 2) {
      return authorizationHeader[1];
    }
  }

  const activeCookie = getActiveCookie();
  if (!activeCookie) {
    return undefined;
  }

  return getCookie(activeCookie);
}

export async function getUser<
  TData extends Json = Json,
  TSession extends Json = Json,
>(
  ctx: ThirdwebAuthContext<TData, TSession>
): Promise<ThirdwebAuthUser<TData, TSession> | null> {
  const token = getToken();
  if (!token) {
    return null;
  }

  let authenticatedUser: ThirdwebAuthUser<TData, TSession>;
  try {
    authenticatedUser = await ctx.auth.authenticate<TSession>(token, {
      validateTokenId: async (tokenId: string) => {
        if (ctx.authOptions?.validateTokenId) {
          await ctx.authOptions?.validateTokenId(tokenId);
        }
      },
    });
  } catch (err) {
    return null;
  }

  if (ctx.callbacks?.onUser) {
    const data = await ctx.callbacks.onUser(authenticatedUser);
    if (data) {
      return { ...authenticatedUser, data };
    }
  }

  return authenticatedUser;
}
