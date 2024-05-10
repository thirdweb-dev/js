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
 * Represents the parameters for the "mintTo" function.
 */
export type MintToParams = WithOverrides<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
}>;

export const FN_SELECTOR = "0x0075a317" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "to",
  },
  {
    type: "string",
    name: "uri",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `mintTo` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `mintTo` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isMintToSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isMintToSupported(contract);
 * ```
 */
export async function isMintToSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "mintTo" function.
 * @param options - The options for the mintTo function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeMintToParams } "thirdweb/extensions/erc721";
 * const result = encodeMintToParams({
 *  to: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeMintToParams(options: MintToParams) {
  return encodeAbiParameters(FN_INPUTS, [options.to, options.uri]);
}

/**
 * Encodes the "mintTo" function into a Hex string with its parameters.
 * @param options - The options for the mintTo function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeMintTo } "thirdweb/extensions/erc721";
 * const result = encodeMintTo({
 *  to: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeMintTo(options: MintToParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeMintToParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "mintTo" function on the contract.
 * @param options - The options for the "mintTo" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { mintTo } from "thirdweb/extensions/erc721";
 *
 * const transaction = mintTo({
 *  contract,
 *  to: ...,
 *  uri: ...,
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
export function mintTo(
  options: BaseTransactionOptions<
    | MintToParams
    | {
        asyncParams: () => Promise<MintToParams>;
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
      return [resolvedOptions.to, resolvedOptions.uri] as const;
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
