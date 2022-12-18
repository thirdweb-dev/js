import { Json } from "../../core/schema";
import { ThirdwebAuthContext, ThirdwebAuthUser } from "../types";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { NextRequest } from "next/server";

function getToken(
  req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
) {
  if (!!(req as NextApiRequest).headers["authorization"]) {
    const authorizationHeader = (req as NextApiRequest).headers[
      "authorization"
    ]?.split(" ");
    if (authorizationHeader?.length === 2) {
      return authorizationHeader[1];
    }

    return null;
  }

  const cookie =
    typeof req.cookies.get === "function"
      ? (req.cookies as any).get("thirdweb_auth_token")
      : (req.cookies as any).thirdweb_auth_token;

  return cookie;
}

export async function getUser<TData extends Json = Json>(
  req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
  ctx: ThirdwebAuthContext,
): Promise<ThirdwebAuthUser<TData> | null> {
  const token = getToken(req);

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

  if (!ctx.callbacks?.user?.setUserData) {
    return authenticatedUser;
  }

  const data = await ctx.callbacks.user.setUserData<TData>(
    authenticatedUser,
    req,
  );

  return { ...authenticatedUser, data };
}
