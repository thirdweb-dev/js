import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { GenerateOptionsWithOptionalDomain } from "../../core";
import { LoginPayloadBodySchema, ThirdwebAuthContext } from "../types";
import { serialize } from "cookie";
import { Request, Response } from "express";

export default async function handler(
  req: Request,
  res: Response,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsedPayload = LoginPayloadBodySchema.safeParse(req.body);

  // Get signed login payload from the frontend
  if (!parsedPayload.success) {
    return res.status(400).json({ error: "Invalid login payload" });
  }

  const payload = parsedPayload.data.payload;

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
    token = await ctx.auth.generate(payload, generateOptions);
  } catch (err: any) {
    if (err.message) {
      return res.status(400).json({ error: err.message });
    } else if (typeof err === "string") {
      return res.status(400).json({ error: err });
    } else {
      return res.status(400).json({ error: "Invalid login payload" });
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
  res.setHeader("Set-Cookie", [
    serialize(
      `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${payload.payload.address}`,
      token,
      {
        domain: ctx.cookieOptions?.domain,
        path: ctx.cookieOptions?.path || "/",
        sameSite: ctx.cookieOptions?.sameSite || "none",
        expires: new Date(exp * 1000),
        httpOnly: true,
        secure: ctx.cookieOptions?.secure || true,
      },
    ),
    serialize(THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE, payload.payload.address, {
      domain: ctx.cookieOptions?.domain,
      path: ctx.cookieOptions?.path || "/",
      sameSite: ctx.cookieOptions?.sameSite || "none",
      expires: new Date(exp * 1000),
      httpOnly: true,
      secure: ctx.cookieOptions?.secure || true,
    }),
  ]);

  // Send token in body and as cookie for frontend and backend use cases
  return res.status(200).json({ token });
}
