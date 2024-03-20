import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAccountsOfSigner" function.
 */
export type GetAccountsOfSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

const METHOD = [
  "0x0e6254fd",
  [
    {
      type: "address",
      name: "signer",
    },
  ],
  [
    {
      type: "address[]",
      name: "accounts",
    },
  ],
] as const;

/**
 * Calls the "getAccountsOfSigner" function on the contract.
 * @param options - The options for the getAccountsOfSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
 * import { getAccountsOfSigner } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAccountsOfSigner({
 *  signer: ...,
 * });
 *
 * ```
 */
export async function getAccountsOfSigner(
  options: BaseTransactionOptions<GetAccountsOfSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.signer],
  });
}
