import { generateJWT } from "./core/generate-jwt.js";
import { generateLoginPayload } from "./core/generate-login-payload.js";
import type { AuthOptions } from "./core/types.js";
import { verifyJWT } from "./core/verify-jwt.js";
import { verifyLoginPayload } from "./core/verify-login-payload.js";

/**
 * Creates an authentication object with the given options.
 * @param options - The options for creating the authentication object.
 * @returns The created authentication object.
 * @example
 * ```ts
 * import { createAuth } from 'thirdweb/auth';
 *
 * const auth = createAuth({...});
 *
 * // 1. generate a login payload for a client on the server side
 * const loginPayload = await auth.generatePayload({ address: '0x123...' });
 *
 * // 2. send the login payload to the client
 *
 * // 3. verify the login payload that the client sends back later
 * const verifiedPayload = await auth.verifyPayload({ payload: loginPayload, signature: '0x123...' });
 *
 * // 4. generate a JWT for the client
 * const jwt = await auth.generateJWT({ payload: verifiedPayload });
 *
 * // 5. set the JWT as a cookie or otherwise provide it to the client
 *
 * // 6. authenticate the client based on the JWT on subsequent calls
 *  const { valid, parsedJWT } = await auth.verifyJWT({ jwt });
 *
 * ```
 * @auth
 */
export function createAuth(options: AuthOptions) {
  return {
    generatePayload: generateLoginPayload(options),
    verifyPayload: verifyLoginPayload(options),
    generateJWT: generateJWT(options),
    verifyJWT: verifyJWT(options),
  };
}
