import { serialize } from "cookie";
import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_DEFAULT_REFRESH_INTERVAL_IN_SECONDS,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { getToken, getUser } from "../helpers/user";
import { ThirdwebAuthContext } from "../types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported.",
    });
  }

  const user = await getUser(req, ctx);

  // Importantly, make sure the user was actually logged in before refreshing
  if (user) {
    const token = getToken(req, ctx);
    if (token) {
      const payload = ctx.auth.parseToken(token);

      const refreshDate = ctx.authOptions?.refreshIntervalInSeconds
        ? new Date(
            payload.payload.iat * 1000 +
              ctx.authOptions.refreshIntervalInSeconds * 1000,
          )
        : new Date(
            payload.payload.iat * 1000 +
              THIRDWEB_AUTH_DEFAULT_REFRESH_INTERVAL_IN_SECONDS * 1000,
          );

      if (new Date() > refreshDate) {
        const expirationTime = ctx.authOptions?.tokenDurationInSeconds
          ? new Date(Date.now() + 1000 * ctx.authOptions.tokenDurationInSeconds)
          : undefined;
        const refreshedToken = await ctx.auth.refresh(token, expirationTime);
        const refreshedPayload = ctx.auth.parseToken(refreshedToken);
        res.setHeader("Set-Cookie", [
          serialize(
            `${
              ctx.cookieOptions?.tokenPrefix ??
              THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX
            }_${user.address}`,
            refreshedToken,
            {
              domain: ctx.cookieOptions?.domain,
              path: ctx.cookieOptions?.path || "/",
              sameSite: ctx.cookieOptions?.sameSite || "none",
              expires: new Date(refreshedPayload.payload.exp * 1000),
              httpOnly: true,
              secure: ctx.cookieOptions?.secure || true,
            },
          ),
          serialize(
            ctx.cookieOptions?.activeTokenPrefix ??
              THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
            user.address,
            {
              domain: ctx.cookieOptions?.domain,
              path: ctx.cookieOptions?.path || "/",
              sameSite: ctx.cookieOptions?.sameSite || "none",
              expires: new Date(refreshedPayload.payload.exp * 1000),
              httpOnly: true,
              secure: ctx.cookieOptions?.secure || true,
            },
          ),
        ]);
      }
    }
  }

  return res.status(200).json(user);
}
