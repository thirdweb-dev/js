import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "deleteRule" function.
 */
export type DeleteRuleParams = WithOverrides<{
  ruleId: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "ruleId" }>;
}>;

export const FN_SELECTOR = "0x9d907761" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "ruleId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `deleteRule` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `deleteRule` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isDeleteRuleSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = await isDeleteRuleSupported(contract);
 * ```
 */
export async function isDeleteRuleSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deleteRule" function.
 * @param options - The options for the deleteRule function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeDeleteRuleParams } "thirdweb/extensions/thirdweb";
 * const result = encodeDeleteRuleParams({
 *  ruleId: ...,
 * });
 * ```
 */
export function encodeDeleteRuleParams(options: DeleteRuleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.ruleId]);
}

/**
 * Encodes the "deleteRule" function into a Hex string with its parameters.
 * @param options - The options for the deleteRule function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeDeleteRule } "thirdweb/extensions/thirdweb";
 * const result = encodeDeleteRule({
 *  ruleId: ...,
 * });
 * ```
 */
export function encodeDeleteRule(options: DeleteRuleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDeleteRuleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deleteRule" function on the contract.
 * @param options - The options for the "deleteRule" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { deleteRule } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deleteRule({
 *  contract,
 *  ruleId: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deleteRule(
  options: BaseTransactionOptions<
    | DeleteRuleParams
    | {
        asyncParams: () => Promise<DeleteRuleParams>;
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
      return [resolvedOptions.ruleId] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
  });
}
