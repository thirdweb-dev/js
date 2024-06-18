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
 * Represents the parameters for the "setSaleRecipientForToken" function.
 */
export type SetSaleRecipientForTokenParams = WithOverrides<{
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  saleRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_saleRecipient";
  }>;
}>;

export const FN_SELECTOR = "0x29c49b9b" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_tokenId",
  },
  {
    type: "address",
    name: "_saleRecipient",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setSaleRecipientForToken` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setSaleRecipientForToken` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isSetSaleRecipientForTokenSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isSetSaleRecipientForTokenSupported(contract);
 * ```
 */
export async function isSetSaleRecipientForTokenSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setSaleRecipientForToken" function.
 * @param options - The options for the setSaleRecipientForToken function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSetSaleRecipientForTokenParams } "thirdweb/extensions/erc1155";
 * const result = encodeSetSaleRecipientForTokenParams({
 *  tokenId: ...,
 *  saleRecipient: ...,
 * });
 * ```
 */
export function encodeSetSaleRecipientForTokenParams(
  options: SetSaleRecipientForTokenParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenId,
    options.saleRecipient,
  ]);
}

/**
 * Encodes the "setSaleRecipientForToken" function into a Hex string with its parameters.
 * @param options - The options for the setSaleRecipientForToken function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSetSaleRecipientForToken } "thirdweb/extensions/erc1155";
 * const result = encodeSetSaleRecipientForToken({
 *  tokenId: ...,
 *  saleRecipient: ...,
 * });
 * ```
 */
export function encodeSetSaleRecipientForToken(
  options: SetSaleRecipientForTokenParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetSaleRecipientForTokenParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setSaleRecipientForToken" function on the contract.
 * @param options - The options for the "setSaleRecipientForToken" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { setSaleRecipientForToken } from "thirdweb/extensions/erc1155";
 *
 * const transaction = setSaleRecipientForToken({
 *  contract,
 *  tokenId: ...,
 *  saleRecipient: ...,
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
export function setSaleRecipientForToken(
  options: BaseTransactionOptions<
    | SetSaleRecipientForTokenParams
    | {
        asyncParams: () => Promise<SetSaleRecipientForTokenParams>;
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
      return [resolvedOptions.tokenId, resolvedOptions.saleRecipient] as const;
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
