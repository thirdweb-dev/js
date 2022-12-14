import { LoginPayloadBodySchema, ThirdwebAuthContext } from "../types";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { payload } = LoginPayloadBodySchema.parse(req.body);

  // Get signed login payload from the frontend
  if (!payload) {
    return res.status(400).json({ error: "Missing login payload" });
  }

  let tokenContext = undefined;
  if (ctx.callbacks?.login?.enhanceToken) {
    tokenContext = await ctx.callbacks.login.enhanceToken(
      payload.payload.address,
      req,
    );
  }

  const validateNonce = async (nonce: string) => {
    if (ctx.callbacks?.login?.validateNonce) {
      await ctx.callbacks.login.validateNonce(nonce, req);
    }
  };

  let token;
  try {
    // Generate an access token with the SDK using the signed payload
    token = await ctx.auth.generate(payload, {
      ...(ctx.verificationOptions || {}),
      context: tokenContext,
      validateNonce,
    });
  } catch {
    return res.status(403).json({ error: "Invalid login payload" });
  }

  // Securely set httpOnly cookie on request to prevent XSS on frontend
  // And set path to / to enable thirdweb_auth_token usage on all endpoints
  res.setHeader(
    "Set-Cookie",
    serialize("thirdweb_auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
