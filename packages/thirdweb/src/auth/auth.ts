import { generateLoginPayload } from "./core/generate-login-payload.js";
import type { AuthOptions } from "./core/types.js";
import { verifyLoginPayload } from "./core/verify-login-payload.js";

/**
 * Creates an authentication object with the given options.
 * @param options - The options for creating the authentication object.
 * @returns The created authentication object.
 * @example
 * ```ts
 * import { createAuth } from 'thirdweb/auth';
 *
 * const auth = createAuth({});
 */
export function createAuth(options: AuthOptions) {
  return {
    generatePayload: generateLoginPayload(options),
    verifyPayload: verifyLoginPayload(options),
  };
}
