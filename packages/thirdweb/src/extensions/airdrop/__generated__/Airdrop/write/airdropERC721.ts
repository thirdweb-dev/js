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
 * Represents the parameters for the "airdropERC721" function.
 */
export type AirdropERC721Params = WithOverrides<{
  tokenAddress: AbiParameterToPrimitiveType<{
    name: "_tokenAddress";
    type: "address";
    internalType: "address";
  }>;
  contents: AbiParameterToPrimitiveType<{
    name: "_contents";
    type: "tuple[]";
    internalType: "struct Airdrop.AirdropContentERC721[]";
    components: [
      { name: "recipient"; type: "address"; internalType: "address" },
      { name: "tokenId"; type: "uint256"; internalType: "uint256" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x6d582ebe" as const;
const FN_INPUTS = [
  {
    name: "_tokenAddress",
    type: "address",
    internalType: "address",
  },
  {
    name: "_contents",
    type: "tuple[]",
    internalType: "struct Airdrop.AirdropContentERC721[]",
    components: [
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `airdropERC721` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `airdropERC721` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isAirdropERC721Supported } from "thirdweb/extensions/airdrop";
 *
 * const supported = await isAirdropERC721Supported(contract);
 * ```
 */
export async function isAirdropERC721Supported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "airdropERC721" function.
 * @param options - The options for the airdropERC721 function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeAirdropERC721Params } "thirdweb/extensions/airdrop";
 * const result = encodeAirdropERC721Params({
 *  tokenAddress: ...,
 *  contents: ...,
 * });
 * ```
 */
export function encodeAirdropERC721Params(options: AirdropERC721Params) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenAddress,
    options.contents,
  ]);
}

/**
 * Encodes the "airdropERC721" function into a Hex string with its parameters.
 * @param options - The options for the airdropERC721 function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeAirdropERC721 } "thirdweb/extensions/airdrop";
 * const result = encodeAirdropERC721({
 *  tokenAddress: ...,
 *  contents: ...,
 * });
 * ```
 */
export function encodeAirdropERC721(options: AirdropERC721Params) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAirdropERC721Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "airdropERC721" function on the contract.
 * @param options - The options for the "airdropERC721" function.
 * @returns A prepared transaction object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { airdropERC721 } from "thirdweb/extensions/airdrop";
 *
 * const transaction = airdropERC721({
 *  contract,
 *  tokenAddress: ...,
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
export function airdropERC721(
  options: BaseTransactionOptions<
    | AirdropERC721Params
    | {
        asyncParams: () => Promise<AirdropERC721Params>;
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
      return [resolvedOptions.tokenAddress, resolvedOptions.contents] as const;
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
