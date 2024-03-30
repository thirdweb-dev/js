import type { Hex } from "../encoding/hex.js";
import { base64ToString } from "../uint8-array.js";
import { PRECOMPILED_B64_ENCODED_JWT_HEADER } from "./jwt-header.js";
import type { JWTPayload } from "./types.js";

/**
 * Decodes a JSON Web Token (JWT) and returns the decoded payload and signature.
 * @param jwt - The JWT string to decode.
 * @returns An object containing the decoded payload and signature.
 * @throws {Error} If the JWT header is invalid or if the JWT is invalid.
 * @example
 * ```ts
 * import { decodeJWT } from 'thirdweb/utils';
 *
 * const { payload, signature } = decodeJWT(jwt);
 * ```
 */
export function deccodeJWT(jwt: string) {
  const [encodedHeader, encodedPayload, encodedSignature] = jwt.split(".");

  if (encodedHeader !== PRECOMPILED_B64_ENCODED_JWT_HEADER) {
    throw new Error("Invalid JWT header");
  }
  if (!encodedPayload || !encodedSignature) {
    throw new Error("Invalid JWT");
  }

  const payload: JWTPayload = JSON.parse(base64ToString(encodedPayload));
  const signature = base64ToString(encodedSignature) as Hex;

  return {
    payload,
    signature,
  };
}
