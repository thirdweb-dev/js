import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "depositRewardTokens" function.
 */
export type DepositRewardTokensParams = WithOverrides<{
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_amount" }>;
}>;

export const FN_SELECTOR = "0x16c621e0" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_amount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "depositRewardTokens" function.
 * @param options - The options for the depositRewardTokens function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeDepositRewardTokensParams } "thirdweb/extensions/erc721";
 * const result = encodeDepositRewardTokensParams({
 *  amount: ...,
 * });
 * ```
 */
export function encodeDepositRewardTokensParams(
  options: DepositRewardTokensParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.amount]);
}

/**
 * Calls the "depositRewardTokens" function on the contract.
 * @param options - The options for the "depositRewardTokens" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { depositRewardTokens } from "thirdweb/extensions/erc721";
 *
 * const transaction = depositRewardTokens({
 *  contract,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function depositRewardTokens(
  options: BaseTransactionOptions<
    | DepositRewardTokensParams
    | {
        asyncParams: () => Promise<DepositRewardTokensParams>;
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
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.amount] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
