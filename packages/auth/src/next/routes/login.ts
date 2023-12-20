import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
  THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX,
} from "../../constants";
import { GenerateOptionsWithOptionalDomain } from "../../core";
import {
  LoginPayloadBodySchema,
  ThirdwebAuthContext,
} from "../types";

export default async function handler(
  req: NextRequest,
  ctx: ThirdwebAuthContext,
) {
  if (req.method !== "POST") {
    return Response.json(
      { error: "Invalid method. Only POST supported." },
      { status: 405 },
    );
  }

  const reqBody = await req.json();
  const parsedPayload = LoginPayloadBodySchema.safeParse(reqBody);

  // Get signed login payload from the frontend
  if (!parsedPayload.success) {
    return Response.json(
      { error: "Invalid login payload." },
      { status: 400 },
    );
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
      return Response.json(
        { error: err.message },
        { status: 400 },
      );
    } else if (typeof err === "string") {
      return Response.json(
        { error: err },
        { status: 400 },
      );
    } else {
      return Response.json(
        { error: "Invalid login payload" },
        { status: 400 },
      );
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
  const response = NextResponse.json({ token }, { status: 200 });
  response.cookies.set({
    name: `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${payload.payload.address}`,
    value: token,
    domain: ctx.cookieOptions?.domain,
    path: ctx.cookieOptions?.path || "/",
    sameSite: ctx.cookieOptions?.sameSite || "none",
    expires: new Date(exp * 1000),
    httpOnly: true,
    secure: ctx.cookieOptions?.secure || true,
  });

  response.cookies.set({
    name: THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE,
    value: payload.payload.address,
    domain: ctx.cookieOptions?.domain,
    path: ctx.cookieOptions?.path || "/",
    sameSite: ctx.cookieOptions?.sameSite || "none",
    expires: new Date(exp * 1000),
    httpOnly: true,
    secure: ctx.cookieOptions?.secure || true,
  });

  // Send token in body and as cookie for frontend and backend use cases
  return response;
}
