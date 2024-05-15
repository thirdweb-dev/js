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
 * Represents the parameters for the "airdropERC20WithSignature" function.
 */
export type AirdropERC20WithSignatureParams = WithOverrides<{
  req: AbiParameterToPrimitiveType<{
    name: "req";
    type: "tuple";
    internalType: "struct Airdrop.AirdropRequestERC20";
    components: [
      { name: "uid"; type: "bytes32"; internalType: "bytes32" },
      { name: "tokenAddress"; type: "address"; internalType: "address" },
      { name: "expirationTimestamp"; type: "uint256"; internalType: "uint256" },
      {
        name: "contents";
        type: "tuple[]";
        internalType: "struct Airdrop.AirdropContentERC20[]";
        components: [
          { name: "recipient"; type: "address"; internalType: "address" },
          { name: "amount"; type: "uint256"; internalType: "uint256" },
        ];
      },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{
    name: "signature";
    type: "bytes";
    internalType: "bytes";
  }>;
}>;

export const FN_SELECTOR = "0xaaba07f6" as const;
const FN_INPUTS = [
  {
    name: "req",
    type: "tuple",
    internalType: "struct Airdrop.AirdropRequestERC20",
    components: [
      {
        name: "uid",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "expirationTimestamp",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "contents",
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
    ],
  },
  {
    name: "signature",
    type: "bytes",
    internalType: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `airdropERC20WithSignature` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `airdropERC20WithSignature` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isAirdropERC20WithSignatureSupported } from "thirdweb/extensions/airdrop";
 *
 * const supported = await isAirdropERC20WithSignatureSupported(contract);
 * ```
 */
export async function isAirdropERC20WithSignatureSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "airdropERC20WithSignature" function.
 * @param options - The options for the airdropERC20WithSignature function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeAirdropERC20WithSignatureParams } "thirdweb/extensions/airdrop";
 * const result = encodeAirdropERC20WithSignatureParams({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeAirdropERC20WithSignatureParams(
  options: AirdropERC20WithSignatureParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.req, options.signature]);
}

/**
 * Encodes the "airdropERC20WithSignature" function into a Hex string with its parameters.
 * @param options - The options for the airdropERC20WithSignature function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeAirdropERC20WithSignature } "thirdweb/extensions/airdrop";
 * const result = encodeAirdropERC20WithSignature({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeAirdropERC20WithSignature(
  options: AirdropERC20WithSignatureParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAirdropERC20WithSignatureParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "airdropERC20WithSignature" function on the contract.
 * @param options - The options for the "airdropERC20WithSignature" function.
 * @returns A prepared transaction object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { airdropERC20WithSignature } from "thirdweb/extensions/airdrop";
 *
 * const transaction = airdropERC20WithSignature({
 *  contract,
 *  req: ...,
 *  signature: ...,
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
export function airdropERC20WithSignature(
  options: BaseTransactionOptions<
    | AirdropERC20WithSignatureParams
    | {
        asyncParams: () => Promise<AirdropERC20WithSignatureParams>;
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
      return [resolvedOptions.req, resolvedOptions.signature] as const;
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
