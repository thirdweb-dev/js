import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "reveal" function.
 */
export type RevealParams = WithOverrides<{
  identifier: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "identifier";
  }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
}>;

export const FN_SELECTOR = "0xce805642" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "identifier",
  },
  {
    type: "bytes",
    name: "key",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
    name: "revealedURI",
  },
] as const;

/**
 * Encodes the parameters for the "reveal" function.
 * @param options - The options for the reveal function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeRevealParams } "thirdweb/extensions/erc721";
 * const result = encodeRevealParams({
 *  identifier: ...,
 *  key: ...,
 * });
 * ```
 */
export function encodeRevealParams(options: RevealParams) {
  return encodeAbiParameters(FN_INPUTS, [options.identifier, options.key]);
}

/**
 * Calls the "reveal" function on the contract.
 * @param options - The options for the "reveal" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { reveal } from "thirdweb/extensions/erc721";
 *
 * const transaction = reveal({
 *  contract,
 *  identifier: ...,
 *  key: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function reveal(
  options: BaseTransactionOptions<
    | RevealParams
    | {
        asyncParams: () => Promise<RevealParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.identifier, resolvedOptions.key] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
