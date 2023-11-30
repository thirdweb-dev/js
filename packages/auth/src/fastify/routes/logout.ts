import { z } from "zod";
import {
  getActiveAccountCookie,
  getActiveCookie,
  getUser,
} from "../helpers/user";
import {
  ErrorResponseSchema,
  FastifyInstanceWithZod,
  ThirdwebAuthContext,
} from "../types";

export const logoutHandler = (
  fastify: FastifyInstanceWithZod,
  ctx: ThirdwebAuthContext,
) => {
  fastify.route({
    method: "POST",
    url: "/logout",
    schema: {
      response: {
        200: z.object({
          message: z.string(),
        }),
        400: ErrorResponseSchema,
      },
    },
    handler: async (req, res) => {
      const activeCookie = getActiveCookie(req, ctx);
      const activeAccountCookie = getActiveAccountCookie(ctx);

      if (!activeCookie) {
        return res.status(400).send({
          error: "No logged in user to logout.",
        });
      }

      if (ctx.callbacks?.onLogout) {
        const user = await getUser(req, ctx);
        if (user) {
          await ctx.callbacks.onLogout(user, req);
        }
      }

      const opts = {
        domain: ctx.cookieOptions?.domain,
        path: ctx.cookieOptions?.path || "/",
        sameSite: ctx.cookieOptions?.sameSite || "none",
        expires: new Date(),
        httpOnly: true,
        secure: ctx.cookieOptions?.secure || true,
      };

      // Set the access token to 'none' and expire immediately
      res.setCookie(activeCookie, "", opts);
      res.setCookie(activeAccountCookie, "", opts);

      return res.status(200).send({
        message: JSON.stringify({ activeCookie, activeAccountCookie }),
      });
    },
  });
};
