import {
  ActiveBodySchema,
  ErrorResponseSchema,
  FastifyInstanceWithZod,
  ThirdwebAuthContext,
} from "../types";
import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_DEFAULT_TOKEN_DURATION_IN_SECONDS,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { getCookie } from "../helpers/user";
import { z } from "zod";

export const switchAccountHandler = (
  fastify: FastifyInstanceWithZod,
  ctx: ThirdwebAuthContext,
) => {
  fastify.route<{
    Body: z.infer<typeof ActiveBodySchema>;
  }>({
    method: "POST",
    url: "/switch-account",
    schema: {
      body: ActiveBodySchema,
      response: {
        200: z.any(),
        400: ErrorResponseSchema,
      },
    },
    handler: async (req, res) => {
      let cookieExpiration: Date;
      const cookie = getCookie(
        req,
        `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${req.body.address}`,
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

      res.setCookie(THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE, req.body.address, {
        domain: ctx.cookieOptions?.domain,
        path: ctx.cookieOptions?.path || "/",
        sameSite: ctx.cookieOptions?.sameSite || "none",
        expires: cookieExpiration,
        httpOnly: true,
        secure: ctx.cookieOptions?.secure || true,
      });

      return res.status(200).send();
    },
  });
};
