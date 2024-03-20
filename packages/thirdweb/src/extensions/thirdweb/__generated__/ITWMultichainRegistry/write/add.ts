import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "add" function.
 */

type AddParamsInternal = {
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

export type AddParams = Prettify<
  | AddParamsInternal
  | {
      asyncParams: () => Promise<AddParamsInternal>;
    }
>;
const METHOD = [
  "0x26c5b516",
  [
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
  ],
  [],
] as const;

/**
 * Calls the "add" function on the contract.
 * @param options - The options for the "add" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { add } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = add({
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
export function add(options: BaseTransactionOptions<AddParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
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
