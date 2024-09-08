import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "setClaimConditions" function.
 */
export type SetClaimConditionsParams = WithOverrides<{
  phases: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "phases";
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

export const FN_SELECTOR = "0x74bc7db7" as const;
const FN_INPUTS = [
  {
    type: "tuple[]",
    name: "phases",
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
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setClaimConditions` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isSetClaimConditionsSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = isSetClaimConditionsSupported(["0x..."]);
 * ```
 */
export function isSetClaimConditionsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setClaimConditions" function.
 * @param options - The options for the setClaimConditions function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeSetClaimConditionsParams } from "thirdweb/extensions/erc20";
 * const result = encodeSetClaimConditionsParams({
 *  phases: ...,
 *  resetClaimEligibility: ...,
 * });
 * ```
 */
export function encodeSetClaimConditionsParams(
  options: SetClaimConditionsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.phases,
    options.resetClaimEligibility,
  ]);
}

/**
 * Encodes the "setClaimConditions" function into a Hex string with its parameters.
 * @param options - The options for the setClaimConditions function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeSetClaimConditions } from "thirdweb/extensions/erc20";
 * const result = encodeSetClaimConditions({
 *  phases: ...,
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
 * @extension ERC20
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setClaimConditions } from "thirdweb/extensions/erc20";
 *
 * const transaction = setClaimConditions({
 *  contract,
 *  phases: ...,
 *  resetClaimEligibility: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
        resolvedOptions.phases,
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
  });
}
