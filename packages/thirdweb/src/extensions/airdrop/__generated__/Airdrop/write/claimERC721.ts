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
 * Represents the parameters for the "claimERC721" function.
 */
export type ClaimERC721Params = WithOverrides<{
  token: AbiParameterToPrimitiveType<{ type: "address"; name: "_token" }>;
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "_receiver" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  proofs: AbiParameterToPrimitiveType<{ type: "bytes32[]"; name: "_proofs" }>;
}>;

export const FN_SELECTOR = "0x1290be10" as const;
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
    type: "bytes32[]",
    name: "_proofs",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `claimERC721` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claimERC721` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isClaimERC721Supported } from "thirdweb/extensions/airdrop";
 *
 * const supported = isClaimERC721Supported(["0x..."]);
 * ```
 */
export function isClaimERC721Supported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "claimERC721" function.
 * @param options - The options for the claimERC721 function.
 * @returns The encoded ABI parameters.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeClaimERC721Params } from "thirdweb/extensions/airdrop";
 * const result = encodeClaimERC721Params({
 *  token: ...,
 *  receiver: ...,
 *  tokenId: ...,
 *  proofs: ...,
 * });
 * ```
 */
export function encodeClaimERC721Params(options: ClaimERC721Params) {
  return encodeAbiParameters(FN_INPUTS, [
    options.token,
    options.receiver,
    options.tokenId,
    options.proofs,
  ]);
}

/**
 * Encodes the "claimERC721" function into a Hex string with its parameters.
 * @param options - The options for the claimERC721 function.
 * @returns The encoded hexadecimal string.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { encodeClaimERC721 } from "thirdweb/extensions/airdrop";
 * const result = encodeClaimERC721({
 *  token: ...,
 *  receiver: ...,
 *  tokenId: ...,
 *  proofs: ...,
 * });
 * ```
 */
export function encodeClaimERC721(options: ClaimERC721Params) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeClaimERC721Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "claimERC721" function on the contract.
 * @param options - The options for the "claimERC721" function.
 * @returns A prepared transaction object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { claimERC721 } from "thirdweb/extensions/airdrop";
 *
 * const transaction = claimERC721({
 *  contract,
 *  token: ...,
 *  receiver: ...,
 *  tokenId: ...,
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
export function claimERC721(
  options: BaseTransactionOptions<
    | ClaimERC721Params
    | {
        asyncParams: () => Promise<ClaimERC721Params>;
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
