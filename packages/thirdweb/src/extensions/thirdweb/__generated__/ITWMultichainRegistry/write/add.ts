import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "add" function.
 */

export type AddParams = {
  deployer: AbiParameterToPrimitiveType<{ type: "address"; name: "_deployer" }>;
  deployment: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_deployment";
  }>;
  chainId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_chainId" }>;
  metadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "metadataUri";
  }>;
};

export const FN_SELECTOR = "0x26c5b516" as const;
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
  {
    type: "string",
    name: "metadataUri",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "add" function.
 * @param options - The options for the add function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeAddParams } "thirdweb/extensions/thirdweb";
 * const result = encodeAddParams({
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 *  metadataUri: ...,
 * });
 * ```
 */
export function encodeAddParams(options: AddParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.deployer,
    options.deployment,
    options.chainId,
    options.metadataUri,
  ]);
}

/**
 * Calls the "add" function on the contract.
 * @param options - The options for the "add" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { add } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = add({
 *  contract,
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 *  metadataUri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function add(
  options: BaseTransactionOptions<
    | AddParams
    | {
        asyncParams: () => Promise<AddParams>;
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
              resolvedParams.metadataUri,
            ] as const;
          }
        : [
            options.deployer,
            options.deployment,
            options.chainId,
            options.metadataUri,
          ],
  });
}
