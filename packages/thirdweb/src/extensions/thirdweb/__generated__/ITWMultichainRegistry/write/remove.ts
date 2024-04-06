import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "remove" function.
 */

export type RemoveParams = {
  deployer: AbiParameterToPrimitiveType<{ type: "address"; name: "_deployer" }>;
  deployment: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_deployment";
  }>;
  chainId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_chainId" }>;
};

export const FN_SELECTOR = "0x59e5fd04" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_deployer",
  },
  {
    type: "address",
    name: "_deployment",
  },
  {
    type: "uint256",
    name: "_chainId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "remove" function.
 * @param options - The options for the remove function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeRemoveParams } "thirdweb/extensions/thirdweb";
 * const result = encodeRemoveParams({
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 * });
 * ```
 */
export function encodeRemoveParams(options: RemoveParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.deployer,
    options.deployment,
    options.chainId,
  ]);
}

/**
 * Calls the "remove" function on the contract.
 * @param options - The options for the "remove" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { remove } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = remove({
 *  contract,
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function remove(
  options: BaseTransactionOptions<
    | RemoveParams
    | {
        asyncParams: () => Promise<RemoveParams>;
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
              resolvedParams.deployer,
              resolvedParams.deployment,
              resolvedParams.chainId,
            ] as const;
          }
        : [options.deployer, options.deployment, options.chainId],
  });
}
