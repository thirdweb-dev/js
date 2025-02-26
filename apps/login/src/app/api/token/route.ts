import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import { getKeyInfo } from "../../../lib/keys";
import type {
  Oauth2AuthToken,
  Oauth2AuthTokenRequest,
  Oauth2CodePayload,
  Oauth2RefreshToken,
  Oauth2RefreshTokenRequest,
} from "../../../lib/oauth";

const ACCESS_TOKEN_EXPIRATION_TIME = 900; // 15 minutes
const REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 30; // 30 days

// Helper for PKCE S256
function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest();
}

// biome-ignore lint/style/noRestrictedGlobals: is ok
function base64url(buffer: Buffer | Uint8Array) {
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Retrieve form data
    const body = (await req.json()) as
      | Oauth2AuthTokenRequest
      | Oauth2RefreshTokenRequest;
    const grantType = body.grant_type;

    switch (grantType) {
      case "authorization_code":
        return handleAuthorizationCode(body);
      case "refresh_token":
        return handleRefreshToken(body);
      default:
        return NextResponse.json(
          { error: "unsupported_grant_type" },
          {
            status: 400,
            headers: corsHeaders,
          },
        );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "server_error" },
      { status: 500, headers: corsHeaders },
    );
  }
}

async function handleAuthorizationCode(body: Oauth2AuthTokenRequest) {
  const code = body.code || "";
  const codeVerifier = body.code_verifier || "";
  const redirectUri = body.redirect_uri || "";
  const clientId = body.client_id || "";

  // Basic checks
  if (!code || !codeVerifier || !redirectUri || !clientId) {
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 400, headers: corsHeaders },
    );
  }

  const keyInfo = await getKeyInfo();

  // 1) Verify the code JWT
  let payload: Oauth2CodePayload;
  try {
    const { payload: verifiedPayload } = await jwtVerify<Oauth2CodePayload>(
      code,
      keyInfo.publicKey,
    );
    payload = verifiedPayload;

    // verify the redirect_uri
    if (payload.redirect_uri !== redirectUri) {
      return NextResponse.json(
        { error: "invalid_grant" },
        { status: 400, headers: corsHeaders },
      );
    }
    // verify the client_id
    if (payload.client_id !== clientId) {
      return NextResponse.json(
        { error: "invalid_grant" },
        { status: 400, headers: corsHeaders },
      );
    }
  } catch (err) {
    console.error("failed to verify code", err);
    return NextResponse.json(
      { error: "invalid_grant" },
      { status: 400, headers: corsHeaders },
    );
  }

  // 2) Validate PKCE
  const { code_challenge, code_challenge_method } = payload;
  if (!code_challenge) {
    return NextResponse.json(
      { error: "invalid_grant" },
      { status: 400, headers: corsHeaders },
    );
  }

  switch (code_challenge_method) {
    case "S256":
      {
        const expectedChallenge = base64url(sha256(codeVerifier));
        console.log(
          "expectedChallenge",
          expectedChallenge,
          "code_challenge",
          code_challenge,
          codeVerifier,
        );
        if (expectedChallenge !== code_challenge) {
          return NextResponse.json(
            { error: "invalid_grant" },
            { status: 400, headers: corsHeaders },
          );
        }
      }
      break;
    case "plain": {
      if (codeVerifier !== code_challenge) {
        return NextResponse.json(
          { error: "invalid_grant" },
          { status: 400, headers: corsHeaders },
        );
      }
      break;
    }
    default: {
      return NextResponse.json(
        { error: "invalid_request" },
        { status: 400, headers: corsHeaders },
      );
    }
  }

  // 3) Issue short-lived access token

  const now = Math.floor(Date.now() / 1000);
  const accessTokenExpiresIn = 900; // e.g., 15 minutes

  const JWT_PAYLOAD: Oauth2AuthToken = {
    sub: payload.sub,
    scope: payload.scope,
    permissions: payload.permissions,
    data: {},
  };

  const accessToken = await new SignJWT(JWT_PAYLOAD)
    .setProtectedHeader({ alg: keyInfo.alg, typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + accessTokenExpiresIn)
    .sign(keyInfo.privateKey);

  // 4) Issue refresh token (longer-lived)
  // TODO: consider storing somewhere for revocation/rotation
  const refreshTokenExpiresIn = 60 * 60 * 24 * 30; // 30 days
  const refreshToken = await new SignJWT({
    originalData: JWT_PAYLOAD,
  } satisfies Oauth2RefreshToken)
    .setProtectedHeader({ alg: keyInfo.alg, typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + refreshTokenExpiresIn)
    .sign(keyInfo.privateKey);

  // 5) Return tokens
  return NextResponse.json(
    {
      token_type: "Bearer",
      access_token: accessToken,
      expires_in: accessTokenExpiresIn,
      refresh_token: refreshToken,
    },
    {
      headers: corsHeaders,
    },
  );
}

async function handleRefreshToken(body: Oauth2RefreshTokenRequest) {
  const refreshToken = body.refresh_token || "";
  if (!refreshToken) {
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 400, headers: corsHeaders },
    );
  }

  const keyInfo = await getKeyInfo();
  // 1) Verify the refresh token JWT
  let payload: Oauth2RefreshToken;
  try {
    const { payload: verifiedPayload } = await jwtVerify<Oauth2RefreshToken>(
      refreshToken,
      keyInfo.publicKey,
    );
    payload = verifiedPayload;
    // If expired, jwtVerify will throw
  } catch (err) {
    console.error("failed to verify refresh token", err);
    return NextResponse.json(
      { error: "invalid_grant" },
      { status: 400, headers: corsHeaders },
    );
  }

  // 2) Issue new short-lived access token
  const now = Math.floor(Date.now() / 1000);

  const newAccessToken = await new SignJWT(payload.originalData)
    .setProtectedHeader({ alg: keyInfo.alg, typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + ACCESS_TOKEN_EXPIRATION_TIME)
    .sign(keyInfo.privateKey);

  // 3) Optionally rotate refresh token
  // TODO: do not need to to rotate this EVERY time, but also does not hurt to do, so carry on
  const newRefreshToken = await new SignJWT({
    originalData: payload.originalData,
  } satisfies Oauth2RefreshToken)
    .setProtectedHeader({ alg: keyInfo.alg, typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + REFRESH_TOKEN_EXPIRATION_TIME)
    .sign(keyInfo.privateKey);

  return NextResponse.json(
    {
      token_type: "Bearer",
      access_token: newAccessToken,
      expires_in: ACCESS_TOKEN_EXPIRATION_TIME,
      refresh_token: newRefreshToken,
    },
    {
      headers: corsHeaders,
    },
  );
}
