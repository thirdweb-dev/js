import type { Account } from "../../wallets/interfaces/wallet.js";
import { stringToBytes } from "../encoding/to-bytes.js";
import { randomBytesHex } from "../random.js";
import { uint8ArrayToBase64 } from "../uint8-array.js";
import { PRECOMPILED_B64_ENCODED_JWT_HEADER } from "./jwt-header.js";
import type { JWTPayload } from "./types.js";

export type JWTPayloadInput<Tctx = unknown> = {
  iss: string;
  sub: string;
  aud: string;
  exp: Date;
  nbf: Date;
  iat: Date;
  jti?: string;
  ctx?: Tctx;
};

type EncodeJWTParams = { payload: JWTPayloadInput; account: Account };

/**
 * Builds a JSON Web Token (JWT) using the provided options.
 * @param options - The options for building the JWT.
 * @returns The generated JWT.
 * @throws Error if the account is not found.
 * @example
 * ```ts
 * import { encodeJWT } from 'thirdweb/utils';
 *
 * const jwt = await encodeJWT({
 *  payload: {
 *    iss: '0x1234567890123456789012345678901234567890',
 *    sub: '0x1234567890123456789012345678901234567890',
 *    aud: '0x1234567890123456789012345678901234567890',
 *    exp: new Date(Date.now() + 1000 * 60 * 60),
 *    nbf: new Date(),
 *    iat: new Date(),
 *    jti: '1234567890',
 *    ctx: {
 *        example: 'example',
 *    },
 *  },
 *  wallet,
 * });
 * ```
 */
export async function encodeJWT(options: EncodeJWTParams) {
  const payload = await ensureJWTPayload(options.payload);
  const message = JSON.stringify(payload);

  const signature = await options.account.signMessage({ message });

  const encodedData = uint8ArrayToBase64(
    stringToBytes(JSON.stringify(payload)),
    { urlSafe: true },
  );

  const encodedSignature = uint8ArrayToBase64(stringToBytes(signature), {
    urlSafe: true,
  });

  // Generate a JWT with base64 encoded header, payload, and signature
  return `${PRECOMPILED_B64_ENCODED_JWT_HEADER}.${encodedData}.${encodedSignature}`;
}

async function ensureJWTPayload(payload: JWTPayloadInput): Promise<JWTPayload> {
  return {
    iss: payload.iss,
    sub: payload.sub,
    aud: payload.aud,
    exp: Math.floor(payload.exp.getTime() / 1000),
    nbf: Math.floor(payload.nbf.getTime() / 1000),
    iat: Math.floor(payload.iat.getTime() / 1000),
    // default to uuid if jti is not provided
    jti: payload.jti || (await randomBytesHex()),
    ctx: payload.ctx,
  };
}
