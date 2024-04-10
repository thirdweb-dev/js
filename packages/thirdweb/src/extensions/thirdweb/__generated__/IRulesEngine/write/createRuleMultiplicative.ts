import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "createRuleMultiplicative" function.
 */
export type CreateRuleMultiplicativeParams = WithOverrides<{
  rule: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "rule";
    components: [
      { type: "address"; name: "token" },
      { type: "uint8"; name: "tokenType" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "scorePerOwnedToken" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x1e2e9cb5" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "rule",
    components: [
      {
        type: "address",
        name: "token",
      },
      {
        type: "uint8",
        name: "tokenType",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "uint256",
        name: "scorePerOwnedToken",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
    name: "ruleId",
  },
] as const;

/**
 * Encodes the parameters for the "createRuleMultiplicative" function.
 * @param options - The options for the createRuleMultiplicative function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeCreateRuleMultiplicativeParams } "thirdweb/extensions/thirdweb";
 * const result = encodeCreateRuleMultiplicativeParams({
 *  rule: ...,
 * });
 * ```
 */
export function encodeCreateRuleMultiplicativeParams(
  options: CreateRuleMultiplicativeParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.rule]);
}

/**
 * Calls the "createRuleMultiplicative" function on the contract.
 * @param options - The options for the "createRuleMultiplicative" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { createRuleMultiplicative } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = createRuleMultiplicative({
 *  contract,
 *  rule: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createRuleMultiplicative(
  options: BaseTransactionOptions<
    | CreateRuleMultiplicativeParams
    | {
        asyncParams: () => Promise<CreateRuleMultiplicativeParams>;
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
      return [resolvedOptions.rule] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
