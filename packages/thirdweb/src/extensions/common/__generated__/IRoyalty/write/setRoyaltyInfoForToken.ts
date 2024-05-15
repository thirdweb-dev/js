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
 * Represents the parameters for the "setRoyaltyInfoForToken" function.
 */
export type SetRoyaltyInfoForTokenParams = WithOverrides<{
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipient";
  }>;
  bps: AbiParameterToPrimitiveType<{ type: "uint256"; name: "bps" }>;
}>;

export const FN_SELECTOR = "0x9bcf7a15" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "address",
    name: "recipient",
  },
  {
    type: "uint256",
    name: "bps",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setRoyaltyInfoForToken` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setRoyaltyInfoForToken` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isSetRoyaltyInfoForTokenSupported } from "thirdweb/extensions/common";
 *
 * const supported = await isSetRoyaltyInfoForTokenSupported(contract);
 * ```
 */
export async function isSetRoyaltyInfoForTokenSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setRoyaltyInfoForToken" function.
 * @param options - The options for the setRoyaltyInfoForToken function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetRoyaltyInfoForTokenParams } "thirdweb/extensions/common";
 * const result = encodeSetRoyaltyInfoForTokenParams({
 *  tokenId: ...,
 *  recipient: ...,
 *  bps: ...,
 * });
 * ```
 */
export function encodeSetRoyaltyInfoForTokenParams(
  options: SetRoyaltyInfoForTokenParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenId,
    options.recipient,
    options.bps,
  ]);
}

/**
 * Encodes the "setRoyaltyInfoForToken" function into a Hex string with its parameters.
 * @param options - The options for the setRoyaltyInfoForToken function.
 * @returns The encoded hexadecimal string.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetRoyaltyInfoForToken } "thirdweb/extensions/common";
 * const result = encodeSetRoyaltyInfoForToken({
 *  tokenId: ...,
 *  recipient: ...,
 *  bps: ...,
 * });
 * ```
 */
export function encodeSetRoyaltyInfoForToken(
  options: SetRoyaltyInfoForTokenParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetRoyaltyInfoForTokenParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the "setRoyaltyInfoForToken" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { setRoyaltyInfoForToken } from "thirdweb/extensions/common";
 *
 * const transaction = setRoyaltyInfoForToken({
 *  contract,
 *  tokenId: ...,
 *  recipient: ...,
 *  bps: ...,
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
export function setRoyaltyInfoForToken(
  options: BaseTransactionOptions<
    | SetRoyaltyInfoForTokenParams
    | {
        asyncParams: () => Promise<SetRoyaltyInfoForTokenParams>;
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
        resolvedOptions.tokenId,
        resolvedOptions.recipient,
        resolvedOptions.bps,
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
