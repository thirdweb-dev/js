import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "onSignerRemoved" function.
 */

export type OnSignerRemovedParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
  creatorAdmin: AbiParameterToPrimitiveType<{
    type: "address";
    name: "creatorAdmin";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export const FN_SELECTOR = "0x0db33003" as const;
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
 * Encodes the parameters for the "onSignerRemoved" function.
 * @param options - The options for the onSignerRemoved function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeOnSignerRemovedParams } "thirdweb/extensions/erc4337";
 * const result = encodeOnSignerRemovedParams({
 *  signer: ...,
 *  creatorAdmin: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnSignerRemovedParams(options: OnSignerRemovedParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.signer,
    options.creatorAdmin,
    options.data,
  ]);
}

/**
 * Calls the "onSignerRemoved" function on the contract.
 * @param options - The options for the "onSignerRemoved" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { onSignerRemoved } from "thirdweb/extensions/erc4337";
 *
 * const transaction = onSignerRemoved({
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
export function onSignerRemoved(
  options: BaseTransactionOptions<
    | OnSignerRemovedParams
    | {
        asyncParams: () => Promise<OnSignerRemovedParams>;
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
