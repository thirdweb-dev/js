import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "createRuleThreshold" function.
 */
export type CreateRuleThresholdParams = WithOverrides<{
  rule: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "rule";
    components: [
      { type: "address"; name: "token" },
      { type: "uint8"; name: "tokenType" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "balance" },
      { type: "uint256"; name: "score" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x1022a25e" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "token",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "balance",
        type: "uint256",
      },
      {
        name: "score",
        type: "uint256",
      },
    ],
    name: "rule",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "ruleId",
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `createRuleThreshold` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createRuleThreshold` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isCreateRuleThresholdSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isCreateRuleThresholdSupported(["0x..."]);
 * ```
 */
export function isCreateRuleThresholdSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createRuleThreshold" function.
 * @param options - The options for the createRuleThreshold function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeCreateRuleThresholdParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeCreateRuleThresholdParams({
 *  rule: ...,
 * });
 * ```
 */
export function encodeCreateRuleThresholdParams(
  options: CreateRuleThresholdParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.rule]);
}

/**
 * Encodes the "createRuleThreshold" function into a Hex string with its parameters.
 * @param options - The options for the createRuleThreshold function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeCreateRuleThreshold } from "thirdweb/extensions/thirdweb";
 * const result = encodeCreateRuleThreshold({
 *  rule: ...,
 * });
 * ```
 */
export function encodeCreateRuleThreshold(options: CreateRuleThresholdParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateRuleThresholdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createRuleThreshold" function on the contract.
 * @param options - The options for the "createRuleThreshold" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createRuleThreshold } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = createRuleThreshold({
 *  contract,
 *  rule: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function createRuleThreshold(
  options: BaseTransactionOptions<
    | CreateRuleThresholdParams
    | {
        asyncParams: () => Promise<CreateRuleThresholdParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.rule] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
