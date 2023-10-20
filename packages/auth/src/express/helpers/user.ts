import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { Json } from "../../core";
import { ThirdwebAuthContext, ThirdwebAuthUser } from "../types";
import { Request } from "express";

export function getCookie(req: Request, cookie: string): string | undefined {
  if (typeof req.cookies.get === "function") {
    return req.cookies.get(cookie);
  }

  return req.cookies[cookie];
}

export function getActiveCookie(req: Request): string | undefined {
  if (!req.cookies) {
    return undefined;
  }

  const activeAccount = getCookie(req, THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE);
  if (activeAccount) {
    return `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${activeAccount}`;
  }

  // If active account is not present, then use the old default
  return THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX;
}

/**
 * @internal
 * @param req
 * @returns
 */
export function getToken(req: Request): string | undefined {
  if (req.headers["authorization"]) {
    const authorizationHeader = req.headers["authorization"].split(" ");
    if (authorizationHeader?.length === 2) {
      return authorizationHeader[1];
    }
  }

  if (!req.cookies) {
    return undefined;
  }

  const activeCookie = getActiveCookie(req);
  if (!activeCookie) {
    return undefined;
  }

  return getCookie(req, activeCookie);
}

export async function getUser<
  TData extends Json = Json,
  TSession extends Json = Json,
>(
  req: Request,
  ctx: ThirdwebAuthContext<TData, TSession>,
): Promise<ThirdwebAuthUser<TData, TSession> | null> {
  const token = getToken(req);

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

  if (!ctx.callbacks?.onUser) {
    return authenticatedUser;
  }

  const data = await ctx.callbacks.onUser(authenticatedUser, req);
  if (!data) {
    return authenticatedUser;
  }

  return { ...authenticatedUser, data: data };
}
