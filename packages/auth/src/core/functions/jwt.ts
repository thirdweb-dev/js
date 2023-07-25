import {
  AuthenticationPayload,
  AuthenticationPayloadData,
  AuthenticationPayloadDataSchema,
} from "../schema/authenticate";
import { CreateJwtParams, RefreshJwtParams } from "../schema/functions";
import { RefreshOptionsSchema } from "../schema/refresh";

/**
 * Create a JWT token based on the authentication payload
 */
export async function createJWT({
  wallet,
  payload,
}: CreateJwtParams): Promise<string> {
  const payloadData = AuthenticationPayloadDataSchema.parse(payload);

  const message = JSON.stringify(payloadData);
  const signature = await wallet.signMessage(message);

  // Header used for JWT token specifying hash algorithm
  const header = {
    // Specify ECDSA with SHA-256 for hashing algorithm
    alg: "ES256",
    typ: "JWT",
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64");
  const encodedData = Buffer.from(JSON.stringify(payloadData))
    .toString("base64")
    .replace(/=/g, "");
  const encodedSignature = Buffer.from(signature).toString("base64");

  // Generate a JWT with base64 encoded header, payload, and signature
  const jwt = `${encodedHeader}.${encodedData}.${encodedSignature}`;

  return jwt;
}

/**
 * Parse data from an encoded auth JWT
 */
export function parseJWT(jwt: string): AuthenticationPayload {
  const encodedPayload = jwt.split(".")[1];
  const encodedSignature = jwt.split(".")[2];
  const payload: AuthenticationPayloadData = JSON.parse(
    Buffer.from(encodedPayload, "base64").toString(),
  );
  const signature = Buffer.from(encodedSignature, "base64").toString();

  return {
    payload,
    signature,
  };
}

export async function refreshJWT({
  wallet,
  jwt,
  options,
}: RefreshJwtParams): Promise<string> {
  const { payload } = parseJWT(jwt);
  const parsedOptions = RefreshOptionsSchema.parse(options);
  return createJWT({
    wallet,
    payload: {
      iss: payload.iss,
      sub: payload.sub,
      aud: payload.aud,
      nbf: new Date(),
      exp: parsedOptions.expirationTime,
      iat: new Date(),
      ctx: payload.ctx,
    },
  });
}
