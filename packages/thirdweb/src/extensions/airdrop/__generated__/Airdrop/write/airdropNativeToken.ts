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
 * Represents the parameters for the "airdropNativeToken" function.
 */
export type AirdropNativeTokenParams = WithOverrides<{
  contents: AbiParameterToPrimitiveType<{
    name: "_contents";
    type: "tuple[]";
    internalType: "struct Airdrop.AirdropContentERC20[]";
    components: [
      { name: "recipient"; type: "address"; internalType: "address" },
      { name: "amount"; type: "uint256"; internalType: "uint256" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x0d5818f7" as const;
const FN_INPUTS = [
  {
    name: "_contents",
    type: "tuple[]",
    internalType: "struct Airdrop.AirdropContentERC20[]",
    components: [
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `airdropNativeToken` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `airdropNativeToken` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isAirdropNativeTokenSupported } from "thirdweb/extensions/airdrop";
 *
 * const supported = await isAirdropNativeTokenSupported(contract);
 * ```
 */
export async function isAirdropNativeTokenSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
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
 * import { encodeAirdropNativeTokenParams } "thirdweb/extensions/airdrop";
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
 * import { encodeAirdropNativeToken } "thirdweb/extensions/airdrop";
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
 * ...
 *
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
  });
}
