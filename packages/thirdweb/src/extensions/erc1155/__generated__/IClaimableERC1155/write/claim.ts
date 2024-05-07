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
 * Represents the parameters for the "claim" function.
 */
export type ClaimParams = WithOverrides<{
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "_receiver" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
}>;

export const FN_SELECTOR = "0x2bc43fd9" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `claim` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `claim` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isClaimSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isClaimSupported(contract);
 * ```
 */
export async function isClaimSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
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
 * import { encodeClaimParams } "thirdweb/extensions/erc1155";
 * const result = encodeClaimParams({
 *  receiver: ...,
 *  tokenId: ...,
 *  quantity: ...,
 * });
 * ```
 */
export function encodeClaimParams(options: ClaimParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.receiver,
    options.tokenId,
    options.quantity,
  ]);
}

/**
 * Encodes the "claim" function into a Hex string with its parameters.
 * @param options - The options for the claim function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeClaim } "thirdweb/extensions/erc1155";
 * const result = encodeClaim({
 *  receiver: ...,
 *  tokenId: ...,
 *  quantity: ...,
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
 * import { claim } from "thirdweb/extensions/erc1155";
 *
 * const transaction = claim({
 *  contract,
 *  receiver: ...,
 *  tokenId: ...,
 *  quantity: ...,
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.receiver,
        resolvedOptions.tokenId,
        resolvedOptions.quantity,
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
