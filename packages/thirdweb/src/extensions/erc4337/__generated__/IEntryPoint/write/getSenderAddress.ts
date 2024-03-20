import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "getSenderAddress" function.
 */

type GetSenderAddressParamsInternal = {
  initCode: AbiParameterToPrimitiveType<{ type: "bytes"; name: "initCode" }>;
};

export type GetSenderAddressParams = Prettify<
  | GetSenderAddressParamsInternal
  | {
      asyncParams: () => Promise<GetSenderAddressParamsInternal>;
    }
>;
const FN_SELECTOR = "0x9b249f69" as const;
const FN_INPUTS = [
  {
    type: "bytes",
    name: "initCode",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "getSenderAddress" function.
 * @param options - The options for the getSenderAddress function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```
 * import { encodeGetSenderAddressParams } "thirdweb/extensions/erc4337";
 * const result = encodeGetSenderAddressParams({
 *  initCode: ...,
 * });
 * ```
 */
export function encodeGetSenderAddressParams(
  options: GetSenderAddressParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.initCode]);
}

/**
 * Calls the "getSenderAddress" function on the contract.
 * @param options - The options for the "getSenderAddress" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { getSenderAddress } from "thirdweb/extensions/erc4337";
 *
 * const transaction = getSenderAddress({
 *  initCode: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function getSenderAddress(
  options: BaseTransactionOptions<GetSenderAddressParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.initCode] as const;
          }
        : [options.initCode],
  });
}
