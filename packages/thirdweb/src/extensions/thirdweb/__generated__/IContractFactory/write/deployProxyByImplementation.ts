import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "deployProxyByImplementation" function.
 */

type DeployProxyByImplementationParamsInternal = {
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
};

export type DeployProxyByImplementationParams = Prettify<
  | DeployProxyByImplementationParamsInternal
  | {
      asyncParams: () => Promise<DeployProxyByImplementationParamsInternal>;
    }
>;
const FN_SELECTOR = "0x11b804ab" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "implementation",
  },
  {
    type: "bytes",
    name: "data",
  },
  {
    type: "bytes32",
    name: "salt",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Encodes the parameters for the "deployProxyByImplementation" function.
 * @param options - The options for the deployProxyByImplementation function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```
 * import { encodeDeployProxyByImplementationParams } "thirdweb/extensions/thirdweb";
 * const result = encodeDeployProxyByImplementationParams({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeDeployProxyByImplementationParams(
  options: DeployProxyByImplementationParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.implementation,
    options.data,
    options.salt,
  ]);
}

/**
 * Calls the "deployProxyByImplementation" function on the contract.
 * @param options - The options for the "deployProxyByImplementation" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { deployProxyByImplementation } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deployProxyByImplementation({
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deployProxyByImplementation(
  options: BaseTransactionOptions<DeployProxyByImplementationParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.implementation,
              resolvedParams.data,
              resolvedParams.salt,
            ] as const;
          }
        : [options.implementation, options.data, options.salt],
  });
}
