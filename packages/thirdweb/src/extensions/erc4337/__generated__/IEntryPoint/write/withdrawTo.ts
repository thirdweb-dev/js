import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "withdrawTo" function.
 */
export type WithdrawToParams = WithValue<{
  withdrawAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "withdrawAddress";
  }>;
  withdrawAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "withdrawAmount";
  }>;
}>;

export const FN_SELECTOR = "0x205c2878" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "withdrawAddress",
  },
  {
    type: "uint256",
    name: "withdrawAmount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "withdrawTo" function.
 * @param options - The options for the withdrawTo function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeWithdrawToParams } "thirdweb/extensions/erc4337";
 * const result = encodeWithdrawToParams({
 *  withdrawAddress: ...,
 *  withdrawAmount: ...,
 * });
 * ```
 */
export function encodeWithdrawToParams(options: WithdrawToParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.withdrawAddress,
    options.withdrawAmount,
  ]);
}

/**
 * Calls the "withdrawTo" function on the contract.
 * @param options - The options for the "withdrawTo" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { withdrawTo } from "thirdweb/extensions/erc4337";
 *
 * const transaction = withdrawTo({
 *  contract,
 *  withdrawAddress: ...,
 *  withdrawAmount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdrawTo(
  options: BaseTransactionOptions<
    | WithdrawToParams
    | {
        asyncParams: () => Promise<WithdrawToParams>;
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
        resolvedParams.withdrawAddress,
        resolvedParams.withdrawAmount,
      ] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
