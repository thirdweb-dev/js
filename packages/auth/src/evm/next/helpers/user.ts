import { Json } from "../../core/schema";
import { ThirdwebAuthContext, ThirdwebAuthUser } from "../types";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { NextRequest } from "next/server";

export async function getUser<TData extends Json = Json>(
  req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
  ctx: ThirdwebAuthContext,
): Promise<ThirdwebAuthUser<TData> | null> {
  const token =
    typeof req.cookies.get === "function"
      ? (req.cookies as any).get("thirdweb_auth_token")
      : (req.cookies as any).thirdweb_auth_token;

  if (!token) {
    return null;
  }

  let authenticatedUser;
  try {
    authenticatedUser = await ctx.auth.authenticate(token);
  } catch {
    return null;
  }

  if (ctx.callbacks?.user?.validateSessionId) {
    try {
      await ctx.callbacks.user.validateSessionId(
        authenticatedUser.token.jti,
        req,
      );
    } catch {
      return null;
    }
  }

  if (!ctx.callbacks?.user?.enhanceUser) {
    return authenticatedUser;
  }

  const data = await ctx.callbacks.user.enhanceUser<TData>(
    authenticatedUser,
    req,
  );

  return { ...authenticatedUser, data };
}
