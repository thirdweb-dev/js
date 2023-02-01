import { Json } from "../../core/schema";
import { ThirdwebAuthContext, ThirdwebAuthUser } from "../types";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { NextRequest } from "next/server";

function getToken(
  req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
): string | undefined {
  if (!!(req as NextApiRequest).headers["authorization"]) {
    const authorizationHeader = (req as NextApiRequest).headers[
      "authorization"
    ]?.split(" ");
    if (authorizationHeader?.length === 2) {
      return authorizationHeader[1];
    }

    return undefined;
  }

  const cookie: string | undefined = !req.cookies
    ? undefined
    : typeof req.cookies.get === "function"
    ? (req.cookies as any).get("thirdweb_auth_token")
    : (req.cookies as any).thirdweb_auth_token;

  return cookie;
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

  const data = await ctx.callbacks.onUser(authenticatedUser);
  if (!data) {
    return authenticatedUser;
  }

  return { ...authenticatedUser, data: data };
}
