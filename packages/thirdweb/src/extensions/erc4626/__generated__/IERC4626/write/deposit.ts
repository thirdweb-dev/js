import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "deposit" function.
 */

export type DepositParams = {
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

export const FN_SELECTOR = "0x6e553f65" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [
  {
    name: "shares",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "deposit" function.
 * @param options - The options for the deposit function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeDepositParams } "thirdweb/extensions/erc4626";
 * const result = encodeDepositParams({
 *  assets: ...,
 *  receiver: ...,
 * });
 * ```
 */
export function encodeDepositParams(options: DepositParams) {
  return encodeAbiParameters(FN_INPUTS, [options.assets, options.receiver]);
}

/**
 * Calls the "deposit" function on the contract.
 * @param options - The options for the "deposit" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { deposit } from "thirdweb/extensions/erc4626";
 *
 * const transaction = deposit({
 *  contract,
 *  assets: ...,
 *  receiver: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deposit(
  options: BaseTransactionOptions<
    | DepositParams
    | {
        asyncParams: () => Promise<DepositParams>;
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
            return [resolvedParams.assets, resolvedParams.receiver] as const;
          }
        : [options.assets, options.receiver],
  });
}
