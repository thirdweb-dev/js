import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_DEFAULT_REFRESH_INTERVAL_IN_SECONDS,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { getToken, getUser } from "../helpers/user";
import { ThirdwebAuthContext } from "../types";

export default async function handler(
  req: NextRequest,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "GET") {
    return Response.json(
      { error: "Invalid method. Only GET supported." },
      { status: 405 },
    );
  }

  const user = await getUser(ctx);

  const response = NextResponse.json(user, { status: 200 });

  // Importantly, make sure the user was actually logged in before refreshing
  if (user) {
    const token = getToken();
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

        response.cookies.set({
          name: `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${user.address}`,
          value: refreshedToken,
          domain: ctx.cookieOptions?.domain,
          path: ctx.cookieOptions?.path || "/",
          sameSite: ctx.cookieOptions?.sameSite || "none",
          expires: new Date(refreshedPayload.payload.exp * 1000),
          httpOnly: true,
          secure: ctx.cookieOptions?.secure || true,
        });

        response.cookies.set({
          name: THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
          value: user.address,
          domain: ctx.cookieOptions?.domain,
          path: ctx.cookieOptions?.path || "/",
          sameSite: ctx.cookieOptions?.sameSite || "none",
          expires: new Date(refreshedPayload.payload.exp * 1000),
          httpOnly: true,
          secure: ctx.cookieOptions?.secure || true,
        });
      }
    }
  }

  return response;
}
