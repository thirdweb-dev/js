import type { Account } from "../../wallets/interfaces/wallet.js";
import { createLoginMessage } from "./create-login-message.js";
import type { LoginPayload } from "./types.js";

export type SignLoginPayloadParams = {
  payload: LoginPayload;
  account: Account;
};

/**
 * Signs the login payload using the provided account.
 * @param options - The options for signing the login payload.
 * @returns An object containing the signature and the payload.
 * @example
 * ```ts
 * import { signLoginPayload } from 'thirdweb/auth';
 *
 * const { signature, payload } = await signLoginPayload({
 *  payload: loginPayload,
 *  account: account,
 * });
 * ```
 * @auth
 */
export async function signLoginPayload(options: SignLoginPayloadParams) {
  const { payload, account } = options;
  const signature = await account.signMessage({
    message: createLoginMessage(payload),
  });
  return {
    signature,
    payload,
  };
}
