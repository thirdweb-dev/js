import { Json } from "../../core/schema";
import { ThirdwebAuthContext, ThirdwebAuthUser } from "../types";
import { Request } from "express";

function getToken(req: Request): string | undefined {
  if (req.headers["authorization"]) {
    const authorizationHeader = req.headers["authorization"].split(" ");
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

export async function getUser<TData extends Json = Json>(
  req: Request,
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

  if (!ctx.callbacks?.user?.enhanceUser) {
    return authenticatedUser;
  }

  const data = await ctx.callbacks.user.enhanceUser<TData>(
    authenticatedUser,
    req,
  );

  return { ...authenticatedUser, data };
}
