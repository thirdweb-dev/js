import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "removeFor" function.
 */

type RemoveForParamsInternal = {
  fidOwner: AbiParameterToPrimitiveType<{ type: "address"; name: "fidOwner" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
};

export type RemoveForParams = Prettify<
  | RemoveForParamsInternal
  | {
      asyncParams: () => Promise<RemoveForParamsInternal>;
    }
>;
const FN_SELECTOR = "0x787bd966" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "fidOwner",
  },
  {
    type: "bytes",
    name: "key",
  },
  {
    type: "uint256",
    name: "deadline",
  },
  {
    type: "bytes",
    name: "sig",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "removeFor" function.
 * @param options - The options for the removeFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```
 * import { encodeRemoveForParams } "thirdweb/extensions/farcaster";
 * const result = encodeRemoveForParams({
 *  fidOwner: ...,
 *  key: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeRemoveForParams(options: RemoveForParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [
    options.fidOwner,
    options.key,
    options.deadline,
    options.sig,
  ]);
}

/**
 * Calls the "removeFor" function on the contract.
 * @param options - The options for the "removeFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { removeFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = removeFor({
 *  fidOwner: ...,
 *  key: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function removeFor(options: BaseTransactionOptions<RemoveForParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.fidOwner,
              resolvedParams.key,
              resolvedParams.deadline,
              resolvedParams.sig,
            ] as const;
          }
        : [options.fidOwner, options.key, options.deadline, options.sig],
  });
}
