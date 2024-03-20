import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

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
    method: [
      "0x9b249f69",
      [
        {
          type: "bytes",
          name: "initCode",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.initCode] as const;
          }
        : [options.initCode],
  });
}
