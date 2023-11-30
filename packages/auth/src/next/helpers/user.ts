import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { Json } from "../../core";
import { ThirdwebAuthContext, ThirdwebAuthUser } from "../types";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { NextRequest } from "next/server";

export function getCookie(
  req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
  cookie: string,
): string | undefined {
  if (typeof req.cookies.get === "function") {
    return req.cookies.get(cookie);
  }

  return (req.cookies as any)[cookie];
}

export function getActiveAccountCookie(ctx?: ThirdwebAuthContext): string {
  return (
    ctx?.cookieOptions?.activeTokenPrefix ?? THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE
  );
}

export function getActiveCookie(
  req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
  ctx?: ThirdwebAuthContext,
): string | undefined {
  if (!req.cookies) {
    return undefined;
  }

  const activeAccount = getCookie(req, getActiveAccountCookie(ctx));
  if (activeAccount) {
    return `${
      ctx?.cookieOptions?.tokenPrefix ?? THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX
    }_${activeAccount}`;
  }

  // If active account is not present, then use the old default
  return ctx?.cookieOptions?.tokenPrefix ?? THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX;
}

export function getToken(
  req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
  ctx?: ThirdwebAuthContext,
): string | undefined {
  if (!!(req as NextApiRequest).headers["authorization"]) {
    const authorizationHeader = (req as NextApiRequest).headers[
      "authorization"
    ]?.split(" ");
    if (authorizationHeader?.length === 2) {
      return authorizationHeader[1];
    }
  }

  if (!req.cookies) {
    return undefined;
  }

  const activeCookie = getActiveCookie(req, ctx);
  if (!activeCookie) {
    return undefined;
  }

  return getCookie(req, activeCookie);
}

export async function getUser<
  TData extends Json = Json,
  TSession extends Json = Json,
>(
  req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
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
