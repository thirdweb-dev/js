import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "burn" function.
 */
export type BurnParams = WithValue<{
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "id" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
}>;

export const FN_SELECTOR = "0xf5298aca" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
  {
    type: "uint256",
    name: "id",
  },
  {
    type: "uint256",
    name: "value",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "burn" function.
 * @param options - The options for the burn function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeBurnParams } "thirdweb/extensions/erc1155";
 * const result = encodeBurnParams({
 *  account: ...,
 *  id: ...,
 *  value: ...,
 * });
 * ```
 */
export function encodeBurnParams(options: BurnParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.account,
    options.id,
    options.value,
  ]);
}

/**
 * Calls the "burn" function on the contract.
 * @param options - The options for the "burn" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { burn } from "thirdweb/extensions/erc1155";
 *
 * const transaction = burn({
 *  contract,
 *  account: ...,
 *  id: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burn(
  options: BaseTransactionOptions<
    | BurnParams
    | {
        asyncParams: () => Promise<BurnParams>;
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
        resolvedParams.account,
        resolvedParams.id,
        resolvedParams.value,
      ] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
