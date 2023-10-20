import {
  FastifyInstanceWithZod,
  LoginPayloadBodySchema,
  ThirdwebAuthContext,
} from "../types";
import { GenerateOptionsWithOptionalDomain } from "../../core";
import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { z } from "zod";

export const loginHandler = (
  fastify: FastifyInstanceWithZod,
  ctx: ThirdwebAuthContext,
) => {
  fastify.route<{
    Body: z.infer<typeof LoginPayloadBodySchema>;
  }>({
    method: "POST",
    url: "/login",
    schema: {
      body: LoginPayloadBodySchema,
      response: {
        200: z.any(),
      },
    },
    handler: async (req, res) => {
      const validateNonce = async (nonce: string) => {
        if (ctx.authOptions?.validateNonce) {
          await ctx.authOptions?.validateNonce(nonce);
        }
      };

      const getSession = async (address: string) => {
        if (ctx.callbacks?.onLogin) {
          return ctx.callbacks.onLogin(address, req);
        }
      };

      const expirationTime = ctx.authOptions?.tokenDurationInSeconds
        ? new Date(Date.now() + 1000 * ctx.authOptions.tokenDurationInSeconds)
        : undefined;

      const generateOptions: GenerateOptionsWithOptionalDomain = {
        verifyOptions: {
          statement: ctx.authOptions?.statement,
          uri: ctx.authOptions?.uri,
          version: ctx.authOptions?.version,
          chainId: ctx.authOptions?.chainId,
          validateNonce,
          resources: ctx.authOptions?.resources,
        },
        expirationTime,
        session: getSession,
      };

      let token: string;
      try {
        // Generate an access token with the SDK using the signed payload
        token = await ctx.auth.generate(req.body.payload, generateOptions);
      } catch (err: any) {
        if (err.message) {
          return res.status(400).send({ error: err.message });
        } else if (typeof err === "string") {
          return res.status(400).send({ error: err });
        } else {
          return res.status(400).send({ error: "Invalid login payload" });
        }
      }

      if (ctx.callbacks?.onToken) {
        await ctx.callbacks.onToken(token, req);
      }

      const {
        payload: { exp },
      } = ctx.auth.parseToken(token);

      // Securely set httpOnly cookie on request to prevent XSS on frontend
      // And set path to / to enable thirdweb_auth_token usage on all endpoints
      res.setCookie(
        `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${req.body.payload.payload.address}`,
        token,
        {
          domain: ctx.cookieOptions?.domain,
          path: ctx.cookieOptions?.path || "/",
          sameSite: ctx.cookieOptions?.sameSite || "none",
          expires: new Date(exp * 1000),
          httpOnly: true,
          secure: ctx.cookieOptions?.secure || true,
        },
      );
      res.setCookie(
        THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
        req.body.payload.payload.address,
        {
          domain: ctx.cookieOptions?.domain,
          path: ctx.cookieOptions?.path || "/",
          sameSite: ctx.cookieOptions?.sameSite || "none",
          expires: new Date(exp * 1000),
          httpOnly: true,
          secure: ctx.cookieOptions?.secure || true,
        },
      );

      return res.status(200).send({ success: true });
    },
  });
};
