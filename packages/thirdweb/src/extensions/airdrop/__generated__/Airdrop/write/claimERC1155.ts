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
 * Represents the parameters for the "claimERC1155" function.
 */
export type ClaimERC1155Params = WithOverrides<{
  token: AbiParameterToPrimitiveType<{ type: "address"; name: "_token" }>;
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "_receiver" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
  proofs: AbiParameterToPrimitiveType<{ type: "bytes32[]"; name: "_proofs" }>;
}>;

export const FN_SELECTOR = "0xc6fa26ab" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_token",
  },
  {
    type: "address",
    name: "_receiver",
  },
  {
    type: "uint256",
    name: "_tokenId",
  },
  {
    type: "uint256",
    name: "_quantity",
  },
  {
    type: "bytes32[]",
    name: "_proofs",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `claimERC1155` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claimERC1155` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isClaimERC1155Supported } from "thirdweb/extensions/airdrop";
 *
 * const supported = isClaimERC1155Supported(["0x..."]);
 * ```
 */
export function isClaimERC1155Supported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "claimERC1155" function.
 * @param options - The options for the claimERC1155 function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeClaimERC1155Params } from "thirdweb/extensions/airdrop";
 * const result = encodeClaimERC1155Params({
 *  token: ...,
 *  receiver: ...,
 *  tokenId: ...,
 *  quantity: ...,
 *  proofs: ...,
 * });
 * ```
 */
export function encodeClaimERC1155Params(options: ClaimERC1155Params) {
  return encodeAbiParameters(FN_INPUTS, [
    options.token,
    options.receiver,
    options.tokenId,
    options.quantity,
    options.proofs,
  ]);
}

/**
 * Encodes the "claimERC1155" function into a Hex string with its parameters.
 * @param options - The options for the claimERC1155 function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeClaimERC1155 } from "thirdweb/extensions/airdrop";
 * const result = encodeClaimERC1155({
 *  token: ...,
 *  receiver: ...,
 *  tokenId: ...,
 *  quantity: ...,
 *  proofs: ...,
 * });
 * ```
 */
export function encodeClaimERC1155(options: ClaimERC1155Params) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeClaimERC1155Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "claimERC1155" function on the contract.
 * @param options - The options for the "claimERC1155" function.
 * @returns A prepared transaction object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { claimERC1155 } from "thirdweb/extensions/airdrop";
 *
 * const transaction = claimERC1155({
 *  contract,
 *  token: ...,
 *  receiver: ...,
 *  tokenId: ...,
 *  quantity: ...,
 *  proofs: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function claimERC1155(
  options: BaseTransactionOptions<
    | ClaimERC1155Params
    | {
        asyncParams: () => Promise<ClaimERC1155Params>;
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
        resolvedOptions.token,
        resolvedOptions.receiver,
        resolvedOptions.tokenId,
        resolvedOptions.quantity,
        resolvedOptions.proofs,
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
