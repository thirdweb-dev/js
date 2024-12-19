import * as ox__Authorization from "ox/Authorization";
import * as ox__Signature from "ox/Signature";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { Authorization, SignedAuthorization } from "./authorization.js";

/**
 * Signs a single EIP-7702 authorization using the provided account.
 *
 * @param options - The options for signing the authorization.
 * @param options.authorization - The authorization object to be signed.
 * @param options.account - The account used to sign the authorization.
 * @returns A promise that resolves to a `SignedAuthorization` object.
 *
 * @example
 * ```typescript
 * const signedAuth = await signAuthorization({
 *   authorization: myAuthorization,
 *   account: myAccount,
 * });
 * ```
 *
 * @beta
 * @transaction
 */
export async function signAuthorization(options: {
  authorization: Authorization;
  account: Account;
}): Promise<SignedAuthorization> {
  const { authorization, account } = options;
  const hexSignature = await account.signMessage({
    message: { raw: ox__Authorization.getSignPayload(authorization) },
  });
  return ox__Authorization.from(authorization, {
    signature: ox__Signature.fromHex(hexSignature),
  });
}

/**
 * Signs a list of EIP-7702 authorizations using the provided account.
 *
 * @param options - The options for signing the authorizations.
 * @param options.authorizations - An array of authorization objects to be signed.
 * @param options.account - The account used to sign the authorizations.
 * @returns A promise that resolves to an array of `SignedAuthorization` objects.
 *
 * @example
 * ```typescript
 * const signedAuths = await signAuthorizations({
 *   authorizations: [auth1, auth2],
 *   account: myAccount,
 * });
 * ```
 *
 * @beta
 * @transaction
 */
export async function signAuthorizations(options: {
  authorizations: Authorization[];
  account: Account;
}): Promise<SignedAuthorization[]> {
  const { authorizations, account } = options;

  return Promise.all(
    authorizations.map(async (authorization: Authorization) =>
      signAuthorization({
        authorization,
        account,
      }),
    ),
  );
}
