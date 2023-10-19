import { z } from "zod";
import { getActiveCookie, getUser } from "../helpers/user";
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
      const activeCookie = getActiveCookie(req);
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

      // Set the access token to 'none' and expire in 5 seconds
      res.setCookie(activeCookie, "", {
        domain: ctx.cookieOptions?.domain,
        path: ctx.cookieOptions?.path || "/",
        sameSite: ctx.cookieOptions?.sameSite || "none",
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
        secure: ctx.cookieOptions?.secure || true,
      });

      return res.status(200).send({ message: "Successfully logged out" });
    },
  });
};
