import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "deposit" function.
 */

type DepositParamsInternal = {
  assets: AbiParameterToPrimitiveType<{
    name: "assets";
    type: "uint256";
    internalType: "uint256";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
};

export type DepositParams = Prettify<
  | DepositParamsInternal
  | {
      asyncParams: () => Promise<DepositParamsInternal>;
    }
>;
const METHOD = [
  "0x6e553f65",
  [
    {
      name: "assets",
      type: "uint256",
      internalType: "uint256",
    },
    {
      name: "receiver",
      type: "address",
      internalType: "address",
    },
  ],
  [
    {
      name: "shares",
      type: "uint256",
      internalType: "uint256",
    },
  ],
] as const;

/**
 * Calls the "deposit" function on the contract.
 * @param options - The options for the "deposit" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```
 * import { deposit } from "thirdweb/extensions/erc4626";
 *
 * const transaction = deposit({
 *  assets: ...,
 *  receiver: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deposit(options: BaseTransactionOptions<DepositParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.assets, resolvedParams.receiver] as const;
          }
        : [options.assets, options.receiver],
  });
}
