import { serialize } from "cookie";
import { getCookie } from "../helpers/user";
import { ActiveBodySchema, ThirdwebAuthContext } from "../types";
import { NextApiRequest, NextApiResponse } from "next";
import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_DEFAULT_TOKEN_DURATION_IN_SECONDS,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Invalid method. Only POST supported.",
    });
  }

  const parsedPayload = ActiveBodySchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return res.status(400).json({ error: "Please provide an address" });
  }

  let cookieExpiration: Date;
  const cookie = getCookie(
    req,
    `${ctx.cookieOptions?.tokenPrefix ?? THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${
      parsedPayload.data.address
    }`,
  );

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

  res.setHeader("Set-Cookie", [
    serialize(
      ctx.cookieOptions?.activeTokenPrefix ??
        THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
      parsedPayload.data.address,
      {
        domain: ctx.cookieOptions?.domain,
        path: ctx.cookieOptions?.path || "/",
        sameSite: ctx.cookieOptions?.sameSite || "none",
        expires: cookieExpiration,
        httpOnly: true,
        secure: ctx.cookieOptions?.secure || true,
      },
    ),
  ]);

  return res.status(200).end();
}
