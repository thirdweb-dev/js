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
 * Represents the parameters for the "setClaimConditions" function.
 */
export type SetClaimConditionsParams = WithOverrides<{
  phase: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "phase";
    components: [
      { type: "uint256"; name: "startTimestamp" },
      { type: "uint256"; name: "maxClaimableSupply" },
      { type: "uint256"; name: "supplyClaimed" },
      { type: "uint256"; name: "quantityLimitPerWallet" },
      { type: "bytes32"; name: "merkleRoot" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
      { type: "string"; name: "metadata" },
    ];
  }>;
  resetClaimEligibility: AbiParameterToPrimitiveType<{
    type: "bool";
    name: "resetClaimEligibility";
  }>;
}>;

export const FN_SELECTOR = "0x426cfaf3" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "phase",
    components: [
      {
        type: "uint256",
        name: "startTimestamp",
      },
      {
        type: "uint256",
        name: "maxClaimableSupply",
      },
      {
        type: "uint256",
        name: "supplyClaimed",
      },
      {
        type: "uint256",
        name: "quantityLimitPerWallet",
      },
      {
        type: "bytes32",
        name: "merkleRoot",
      },
      {
        type: "uint256",
        name: "pricePerToken",
      },
      {
        type: "address",
        name: "currency",
      },
      {
        type: "string",
        name: "metadata",
      },
    ],
  },
  {
    type: "bool",
    name: "resetClaimEligibility",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setClaimConditions` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setClaimConditions` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isSetClaimConditionsSupported } from "thirdweb/extensions/common";
 *
 * const supported = await isSetClaimConditionsSupported(contract);
 * ```
 */
export async function isSetClaimConditionsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setClaimConditions" function.
 * @param options - The options for the setClaimConditions function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetClaimConditionsParams } "thirdweb/extensions/common";
 * const result = encodeSetClaimConditionsParams({
 *  phase: ...,
 *  resetClaimEligibility: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionsParams(
  options: SetClaimConditionsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.phase,
    options.resetClaimEligibility,
  ]);
}

/**
 * Encodes the "setClaimConditions" function into a Hex string with its parameters.
 * @param options - The options for the setClaimConditions function.
 * @returns The encoded hexadecimal string.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetClaimConditions } "thirdweb/extensions/common";
 * const result = encodeSetClaimConditions({
 *  phase: ...,
 *  resetClaimEligibility: ...,
 * });
 * ```
 */
export function encodeSetClaimConditions(options: SetClaimConditionsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetClaimConditionsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setClaimConditions" function on the contract.
 * @param options - The options for the "setClaimConditions" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { setClaimConditions } from "thirdweb/extensions/common";
 *
 * const transaction = setClaimConditions({
 *  contract,
 *  phase: ...,
 *  resetClaimEligibility: ...,
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
export function setClaimConditions(
  options: BaseTransactionOptions<
    | SetClaimConditionsParams
    | {
        asyncParams: () => Promise<SetClaimConditionsParams>;
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
      return [
        resolvedOptions.phase,
        resolvedOptions.resetClaimEligibility,
      ] as const;
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
