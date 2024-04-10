import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "stake" function.
 */
export type StakeParams = WithOverrides<{
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
}>;

export const FN_SELECTOR = "0x0fbf0a93" as const;
const FN_INPUTS = [
  {
    type: "uint256[]",
    name: "tokenIds",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "stake" function.
 * @param options - The options for the stake function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeStakeParams } "thirdweb/extensions/erc721";
 * const result = encodeStakeParams({
 *  tokenIds: ...,
 * });
 * ```
 */
export function encodeStakeParams(options: StakeParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenIds]);
}

/**
 * Calls the "stake" function on the contract.
 * @param options - The options for the "stake" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { stake } from "thirdweb/extensions/erc721";
 *
 * const transaction = stake({
 *  contract,
 *  tokenIds: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function stake(
  options: BaseTransactionOptions<
    | StakeParams
    | {
        asyncParams: () => Promise<StakeParams>;
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
      return [resolvedOptions.tokenIds] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
