import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ActiveBodySchema,
  ThirdwebAuthContext,
} from "../types";
import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_DEFAULT_TOKEN_DURATION_IN_SECONDS,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { getCookie } from "../helpers/user";

export default async function handler(
  req: NextRequest,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "POST") {
    return Response.json(
      { error: "Invalid method. Only POST supported." },
      { status: 405 },
    );
  }

  const reqBody = await req.json();
  const parsedPayload = ActiveBodySchema.safeParse(reqBody);

  if (!parsedPayload.success) {
    return Response.json(
      { error: "Please provide an address." },
      { status: 400 },
    );
  }

  let cookieExpiration: Date;

  const cookie = getCookie(`${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${parsedPayload.data.address}`);
  if (cookie) {
    // If the new account is already logged in, get the expiration time from the cookie
    const {
      payload: { exp },
    } = ctx.auth.parseToken(cookie);
    cookieExpiration = new Date(exp * 1000);
  } else if (ctx.authOptions?.tokenDurationInSeconds) {
    // Otherwise, if we have a token duration in seconds, set it to that
    cookieExpiration = new Date(
      Date.now() + 1000 * ctx.authOptions.tokenDurationInSeconds,
    );
  } else {
    // Otherwise, just default to 24 hours
    cookieExpiration = new Date(
      Date.now() + 1000 * THIRDWEB_AUTH_DEFAULT_TOKEN_DURATION_IN_SECONDS,
    );
  }

  const response = NextResponse.json('', { status: 200 });
  response.cookies.set({
    name: THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
    value: parsedPayload.data.address,
    domain: ctx.cookieOptions?.domain,
    path: ctx.cookieOptions?.path || "/",
    sameSite: ctx.cookieOptions?.sameSite || "none",
    expires: cookieExpiration,
    httpOnly: true,
    secure: ctx.cookieOptions?.secure || true,
  });

  return response;
}
