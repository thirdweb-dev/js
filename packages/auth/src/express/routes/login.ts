import { GenerateOptions } from "../../core";
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

  // Get signed login payload from the frontend
  if (!payload) {
    return res.status(400).json({ error: "Missing login payload" });
  }

  const validateNonce = async (nonce: string) => {
    if (ctx.authOptions?.validateNonce) {
      await ctx.authOptions?.validateNonce(nonce, req);
    }
  };

  const getTokenContext = ctx.callbacks?.login?.enhanceToken
    ? async (address: string) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return await ctx.callbacks!.login!.enhanceToken(address, req);
      }
    : undefined;

  const expirationTime = ctx.authOptions?.tokenDurationInSeconds
    ? new Date(Date.now() + 1000 * ctx.authOptions.tokenDurationInSeconds)
    : undefined;

  const generateOptions: GenerateOptions = {
    verifyOptions: {
      statement: ctx.authOptions?.statement,
      uri: ctx.authOptions?.uri,
      version: ctx.authOptions?.version,
      chainId: ctx.authOptions?.chainId,
      validateNonce,
      resources: ctx.authOptions?.resources,
    },
    expirationTime,
    tokenContext: getTokenContext,
  };

  let token: string;
  try {
    // Generate an access token with the SDK using the signed payload
    token = await ctx.auth.generate(payload, generateOptions);
  } catch {
    return res.status(403).json({ error: "Invalid login payload" });
  }

  // Securely set httpOnly cookie on request to prevent XSS on frontend
  // And set path to / to enable thirdweb_auth_token usage on all endpoints
  res.setHeader(
    "Set-Cookie",
    serialize("thirdweb_auth_token", token, {
      domain: ctx.cookieOptions?.domain,
      path: ctx.cookieOptions?.path || "/",
      sameSite: ctx.cookieOptions?.sameSite || "none",
      httpOnly: true,
      secure: true,
    }),
  );

  if (ctx.callbacks?.login?.onLogin) {
    const user = await ctx.auth.authenticate(token);

    if (user) {
      await ctx.callbacks.login.onLogin(user, req);
    }
  }

  // Send token in body and as cookie for frontend and backend use cases
  return res.status(200).json({ token });
}
