import { serialize } from "cookie";
import { THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX } from "../../constants";
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

  if (ctx.authOptions?.refreshIntervalInSeconds) {
    const token = getToken(req);
    if (token) {
      const payload = ctx.auth.parseToken(token);
      if (
        new Date() >
        new Date(
          payload.payload.iat * 1000 +
            ctx.authOptions.refreshIntervalInSeconds * 1000,
        )
      ) {
        const expirationTime = ctx.authOptions?.tokenDurationInSeconds
          ? new Date(Date.now() + 1000 * ctx.authOptions.tokenDurationInSeconds)
          : undefined;
        const refreshedToken = await ctx.auth.refresh(token, expirationTime);
        const refreshedPayload = ctx.auth.parseToken(refreshedToken);
        res.setHeader(
          "Set-Cookie",
          serialize(
            `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${refreshedPayload.payload.sub}`,
            refreshedToken,
            {
              domain: ctx.cookieOptions?.domain,
              path: ctx.cookieOptions?.path || "/",
              sameSite: ctx.cookieOptions?.sameSite || "none",
              expires: new Date(refreshedPayload.payload.exp * 1000),
              httpOnly: true,
              secure: true,
            },
          ),
        );
      }
    }
  }

  const user = await getUser(req, ctx);
  return res.status(200).json(user);
}
