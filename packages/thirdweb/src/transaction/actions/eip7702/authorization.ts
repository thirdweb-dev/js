import type * as ox__Authorization from "ox/Authorization";
import type { Address } from "../../../utils/address.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";

/**
 * An EIP-7702 authorization object fully prepared and ready for signing.
 *
 * @beta
 * @transaction
 */
export type AuthorizationRequest = {
  address: Address;
  chainId: number;
  nonce: bigint;
};

/**
 * Represents a signed EIP-7702 authorization object.
 *
 * @beta
 * @transaction
 */
export type SignedAuthorization = ox__Authorization.ListSigned[number];

/**
 * Sign the given EIP-7702 authorization object.
 * @param options - The options for `signAuthorization`
 * Refer to the type [`SignAuthorizationOptions`](https://portal.thirdweb.com/references/typescript/v5/SignAuthorizationOptions)
 * @returns The signed authorization object
 *
 * ```ts
 * import { signAuthorization } from "thirdweb";
 *
 * const authorization = await signAuthorization({
 *     request: {
 *         address: "0x...",
 *         chainId: 911867,
 *         nonce: 100n,
 *     },
 *     account: myAccount,
 * });
 * ```
 *
 * @beta
 * @transaction
 */
export async function signAuthorization(options: {
  account: Account;
  request: AuthorizationRequest;
}): Promise<SignedAuthorization> {
  const { account, request } = options;
  if (typeof account.signAuthorization === "undefined") {
    throw new Error(
      "This account type does not yet support signing EIP-7702 authorizations",
    );
  }
  return account.signAuthorization(request);
}
