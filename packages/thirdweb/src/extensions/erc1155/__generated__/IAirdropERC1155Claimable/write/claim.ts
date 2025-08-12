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
 * Represents the parameters for the "claim" function.
 */
export type ClaimParams = WithOverrides<{
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "receiver" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "quantity" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  proofs: AbiParameterToPrimitiveType<{ type: "bytes32[]"; name: "proofs" }>;
  proofMaxQuantityForWallet: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proofMaxQuantityForWallet";
  }>;
}>;

export const FN_SELECTOR = "0x38524a10" as const;
const FN_INPUTS = [
  {
    name: "receiver",
    type: "address",
  },
  {
    name: "quantity",
    type: "uint256",
  },
  {
    name: "tokenId",
    type: "uint256",
  },
  {
    name: "proofs",
    type: "bytes32[]",
  },
  {
    name: "proofMaxQuantityForWallet",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `claim` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claim` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isClaimSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isClaimSupported(["0x..."]);
 * ```
 */
export function isClaimSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "claim" function.
 * @param options - The options for the claim function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeClaimParams } from "thirdweb/extensions/erc1155";
 * const result = encodeClaimParams({
 *  receiver: ...,
 *  quantity: ...,
 *  tokenId: ...,
 *  proofs: ...,
 *  proofMaxQuantityForWallet: ...,
 * });
 * ```
 */
export function encodeClaimParams(options: ClaimParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.receiver,
    options.quantity,
    options.tokenId,
    options.proofs,
    options.proofMaxQuantityForWallet,
  ]);
}

/**
 * Encodes the "claim" function into a Hex string with its parameters.
 * @param options - The options for the claim function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeClaim } from "thirdweb/extensions/erc1155";
 * const result = encodeClaim({
 *  receiver: ...,
 *  quantity: ...,
 *  tokenId: ...,
 *  proofs: ...,
 *  proofMaxQuantityForWallet: ...,
 * });
 * ```
 */
export function encodeClaim(options: ClaimParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeClaimParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "claim" function on the contract.
 * @param options - The options for the "claim" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { claim } from "thirdweb/extensions/erc1155";
 *
 * const transaction = claim({
 *  contract,
 *  receiver: ...,
 *  quantity: ...,
 *  tokenId: ...,
 *  proofs: ...,
 *  proofMaxQuantityForWallet: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function claim(
  options: BaseTransactionOptions<
    | ClaimParams
    | {
        asyncParams: () => Promise<ClaimParams>;
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
      return [
        resolvedOptions.receiver,
        resolvedOptions.quantity,
        resolvedOptions.tokenId,
        resolvedOptions.proofs,
        resolvedOptions.proofMaxQuantityForWallet,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
