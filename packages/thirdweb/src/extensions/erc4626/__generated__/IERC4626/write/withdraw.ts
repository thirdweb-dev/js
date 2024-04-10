import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "withdraw" function.
 */
export type WithdrawParams = WithValue<{
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
}>;

export const FN_SELECTOR = "0xb460af94" as const;
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
  {
    name: "owner",
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
 * Encodes the parameters for the "withdraw" function.
 * @param options - The options for the withdraw function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeWithdrawParams } "thirdweb/extensions/erc4626";
 * const result = encodeWithdrawParams({
 *  assets: ...,
 *  receiver: ...,
 *  owner: ...,
 * });
 * ```
 */
export function encodeWithdrawParams(options: WithdrawParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.assets,
    options.receiver,
    options.owner,
  ]);
}

/**
 * Calls the "withdraw" function on the contract.
 * @param options - The options for the "withdraw" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { withdraw } from "thirdweb/extensions/erc4626";
 *
 * const transaction = withdraw({
 *  contract,
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
export function withdraw(
  options: BaseTransactionOptions<
    | WithdrawParams
    | {
        asyncParams: () => Promise<WithdrawParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedParams = await asyncOptions();
      return [
        resolvedParams.assets,
        resolvedParams.receiver,
        resolvedParams.owner,
      ] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
