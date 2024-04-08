import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "mintTo" function.
 */

export type MintToParams = {
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
};

export const FN_SELECTOR = "0x0075a317" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "to",
  },
  {
    type: "string",
    name: "uri",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "mintTo" function.
 * @param options - The options for the mintTo function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeMintToParams } "thirdweb/extensions/erc721";
 * const result = encodeMintToParams({
 *  to: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeMintToParams(options: MintToParams) {
  return encodeAbiParameters(FN_INPUTS, [options.to, options.uri]);
}

/**
 * Calls the "mintTo" function on the contract.
 * @param options - The options for the "mintTo" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { mintTo } from "thirdweb/extensions/erc721";
 *
 * const transaction = mintTo({
 *  contract,
 *  to: ...,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintTo(
  options: BaseTransactionOptions<
    | MintToParams
    | {
        asyncParams: () => Promise<MintToParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.to, resolvedParams.uri] as const;
          }
        : [options.to, options.uri],
  });
}
