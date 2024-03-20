import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "withdraw" function.
 */

type WithdrawParamsInternal = {
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
  owner: AbiParameterToPrimitiveType<{
    name: "owner";
    type: "address";
    internalType: "address";
  }>;
};

export type WithdrawParams = Prettify<
  | WithdrawParamsInternal
  | {
      asyncParams: () => Promise<WithdrawParamsInternal>;
    }
>;
const METHOD = [
  "0xb460af94",
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
    {
      name: "owner",
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
 * Calls the "withdraw" function on the contract.
 * @param options - The options for the "withdraw" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```
 * import { withdraw } from "thirdweb/extensions/erc4626";
 *
 * const transaction = withdraw({
 *  assets: ...,
 *  receiver: ...,
 *  owner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdraw(options: BaseTransactionOptions<WithdrawParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.assets,
              resolvedParams.receiver,
              resolvedParams.owner,
            ] as const;
          }
        : [options.assets, options.receiver, options.owner],
  });
}
