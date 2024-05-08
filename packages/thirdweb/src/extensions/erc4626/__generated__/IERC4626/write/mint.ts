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
 * Represents the parameters for the "mint" function.
 */
export type MintParams = WithOverrides<{
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
}>;

export const FN_SELECTOR = "0x94bf804d" as const;
const FN_INPUTS = [
  {
    name: "shares",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "receiver",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "assets",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `mint` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `mint` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isMintSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = await isMintSupported(contract);
 * ```
 */
export async function isMintSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "mint" function.
 * @param options - The options for the mint function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeMintParams } "thirdweb/extensions/erc4626";
 * const result = encodeMintParams({
 *  shares: ...,
 *  receiver: ...,
 * });
 * ```
 */
export function encodeMintParams(options: MintParams) {
  return encodeAbiParameters(FN_INPUTS, [options.shares, options.receiver]);
}

/**
 * Encodes the "mint" function into a Hex string with its parameters.
 * @param options - The options for the mint function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeMint } "thirdweb/extensions/erc4626";
 * const result = encodeMint({
 *  shares: ...,
 *  receiver: ...,
 * });
 * ```
 */
export function encodeMint(options: MintParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeMintParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "mint" function on the contract.
 * @param options - The options for the "mint" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { mint } from "thirdweb/extensions/erc4626";
 *
 * const transaction = mint({
 *  contract,
 *  shares: ...,
 *  receiver: ...,
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
export function mint(
  options: BaseTransactionOptions<
    | MintParams
    | {
        asyncParams: () => Promise<MintParams>;
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
      return [resolvedOptions.shares, resolvedOptions.receiver] as const;
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
