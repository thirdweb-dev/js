import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "onSignerAdded" function.
 */

export type OnSignerAddedParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
  creatorAdmin: AbiParameterToPrimitiveType<{
    type: "address";
    name: "creatorAdmin";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export const FN_SELECTOR = "0x9ddbb9d8" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "signer",
  },
  {
    type: "address",
    name: "creatorAdmin",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "onSignerAdded" function.
 * @param options - The options for the onSignerAdded function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeOnSignerAddedParams } "thirdweb/extensions/erc4337";
 * const result = encodeOnSignerAddedParams({
 *  signer: ...,
 *  creatorAdmin: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnSignerAddedParams(options: OnSignerAddedParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.signer,
    options.creatorAdmin,
    options.data,
  ]);
}

/**
 * Calls the "onSignerAdded" function on the contract.
 * @param options - The options for the "onSignerAdded" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { onSignerAdded } from "thirdweb/extensions/erc4337";
 *
 * const transaction = onSignerAdded({
 *  contract,
 *  signer: ...,
 *  creatorAdmin: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function onSignerAdded(
  options: BaseTransactionOptions<
    | OnSignerAddedParams
    | {
        asyncParams: () => Promise<OnSignerAddedParams>;
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
            return [
              resolvedParams.signer,
              resolvedParams.creatorAdmin,
              resolvedParams.data,
            ] as const;
          }
        : [options.signer, options.creatorAdmin, options.data],
  });
}
