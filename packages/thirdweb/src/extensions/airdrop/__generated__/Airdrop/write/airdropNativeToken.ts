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
 * Represents the parameters for the "airdropNativeToken" function.
 */
export type AirdropNativeTokenParams = WithOverrides<{
  contents: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "_contents";
    components: [
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "amount" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x0d5818f7" as const;
const FN_INPUTS = [
  {
    type: "tuple[]",
    name: "_contents",
    components: [
      {
        type: "address",
        name: "recipient",
      },
      {
        type: "uint256",
        name: "amount",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `airdropNativeToken` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `airdropNativeToken` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isAirdropNativeTokenSupported } from "thirdweb/extensions/airdrop";
 *
 * const supported = isAirdropNativeTokenSupported(["0x..."]);
 * ```
 */
export function isAirdropNativeTokenSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "airdropNativeToken" function.
 * @param options - The options for the airdropNativeToken function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeAirdropNativeTokenParams } from "thirdweb/extensions/airdrop";
 * const result = encodeAirdropNativeTokenParams({
 *  contents: ...,
 * });
 * ```
 */
export function encodeAirdropNativeTokenParams(
  options: AirdropNativeTokenParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.contents]);
}

/**
 * Encodes the "airdropNativeToken" function into a Hex string with its parameters.
 * @param options - The options for the airdropNativeToken function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeAirdropNativeToken } from "thirdweb/extensions/airdrop";
 * const result = encodeAirdropNativeToken({
 *  contents: ...,
 * });
 * ```
 */
export function encodeAirdropNativeToken(options: AirdropNativeTokenParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAirdropNativeTokenParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "airdropNativeToken" function on the contract.
 * @param options - The options for the "airdropNativeToken" function.
 * @returns A prepared transaction object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { airdropNativeToken } from "thirdweb/extensions/airdrop";
 *
 * const transaction = airdropNativeToken({
 *  contract,
 *  contents: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function airdropNativeToken(
  options: BaseTransactionOptions<
    | AirdropNativeTokenParams
    | {
        asyncParams: () => Promise<AirdropNativeTokenParams>;
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
      return [resolvedOptions.contents] as const;
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
