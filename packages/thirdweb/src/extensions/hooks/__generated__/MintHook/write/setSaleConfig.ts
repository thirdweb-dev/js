import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setSaleConfig" function.
 */

export type SetSaleConfigParams = {
  primarySaleRecipient: AbiParameterToPrimitiveType<{
    name: "_primarySaleRecipient";
    type: "address";
    internalType: "address";
  }>;
  platformFeeRecipient: AbiParameterToPrimitiveType<{
    name: "_platformFeeRecipient";
    type: "address";
    internalType: "address";
  }>;
  platformFeeBps: AbiParameterToPrimitiveType<{
    name: "_platformFeeBps";
    type: "uint16";
    internalType: "uint16";
  }>;
};

const FN_SELECTOR = "0x09d3e819" as const;
const FN_INPUTS = [
  {
    name: "_primarySaleRecipient",
    type: "address",
    internalType: "address",
  },
  {
    name: "_platformFeeRecipient",
    type: "address",
    internalType: "address",
  },
  {
    name: "_platformFeeBps",
    type: "uint16",
    internalType: "uint16",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setSaleConfig" function.
 * @param options - The options for the setSaleConfig function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeSetSaleConfigParams } "thirdweb/extensions/hooks";
 * const result = encodeSetSaleConfigParams({
 *  primarySaleRecipient: ...,
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 * ```
 */
export function encodeSetSaleConfigParams(options: SetSaleConfigParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.primarySaleRecipient,
    options.platformFeeRecipient,
    options.platformFeeBps,
  ]);
}

/**
 * Calls the "setSaleConfig" function on the contract.
 * @param options - The options for the "setSaleConfig" function.
 * @returns A prepared transaction object.
 * @extension HOOKS
 * @example
 * ```ts
 * import { setSaleConfig } from "thirdweb/extensions/hooks";
 *
 * const transaction = setSaleConfig({
 *  contract,
 *  primarySaleRecipient: ...,
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setSaleConfig(
  options: BaseTransactionOptions<
    | SetSaleConfigParams
    | {
        asyncParams: () => Promise<SetSaleConfigParams>;
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
              resolvedParams.primarySaleRecipient,
              resolvedParams.platformFeeRecipient,
              resolvedParams.platformFeeBps,
            ] as const;
          }
        : [
            options.primarySaleRecipient,
            options.platformFeeRecipient,
            options.platformFeeBps,
          ],
  });
}
