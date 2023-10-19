import { getToken, getUser } from "../helpers/user";
import { FastifyInstanceWithZod, ThirdwebAuthContext } from "../types";
import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_DEFAULT_REFRESH_INTERVAL_IN_SECONDS,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { z } from "zod";

export const userHandler = (
  fastify: FastifyInstanceWithZod,
  ctx: ThirdwebAuthContext,
) => {
  fastify.route({
    method: "GET",
    url: "/user",
    schema: {
      response: {
        200: z.any(),
      },
    },
    handler: async (req, res) => {
      const user = await getUser(req, ctx);

      // Importantly, make sure the user was actually logged in before refreshing
      if (user) {
        const token = getToken(req);
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
              ? new Date(
                  Date.now() + 1000 * ctx.authOptions.tokenDurationInSeconds,
                )
              : undefined;
            const refreshedToken = await ctx.auth.refresh(
              token,
              expirationTime,
            );
            const refreshedPayload = ctx.auth.parseToken(refreshedToken);

            res.setCookie(
              `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${user.address}`,
              refreshedToken,
              {
                domain: ctx.cookieOptions?.domain,
                path: ctx.cookieOptions?.path || "/",
                sameSite: ctx.cookieOptions?.sameSite || "none",
                expires: new Date(refreshedPayload.payload.exp * 1000),
                httpOnly: true,
                secure: ctx.cookieOptions?.secure || true,
              },
            );
            res.setCookie(THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE, user.address, {
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

      return res.status(200).send(user);
    },
  });
};
