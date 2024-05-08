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
 * Represents the parameters for the "deposit" function.
 */
export type DepositParams = WithOverrides<{
  assets: AbiParameterToPrimitiveType<{
    name: "assets";
    type: "uint256";
    internalType: "uint256";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    internalType: "address";
  }>;
}>;

export const FN_SELECTOR = "0x6e553f65" as const;
const FN_INPUTS = [
  {
    name: "assets",
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
    name: "shares",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `deposit` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `deposit` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isDepositSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = await isDepositSupported(contract);
 * ```
 */
export async function isDepositSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deposit" function.
 * @param options - The options for the deposit function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeDepositParams } "thirdweb/extensions/erc4626";
 * const result = encodeDepositParams({
 *  assets: ...,
 *  receiver: ...,
 * });
 * ```
 */
export function encodeDepositParams(options: DepositParams) {
  return encodeAbiParameters(FN_INPUTS, [options.assets, options.receiver]);
}

/**
 * Encodes the "deposit" function into a Hex string with its parameters.
 * @param options - The options for the deposit function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeDeposit } "thirdweb/extensions/erc4626";
 * const result = encodeDeposit({
 *  assets: ...,
 *  receiver: ...,
 * });
 * ```
 */
export function encodeDeposit(options: DepositParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDepositParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deposit" function on the contract.
 * @param options - The options for the "deposit" function.
 * @returns A prepared transaction object.
 * @extension ERC4626
 * @example
 * ```ts
 * import { deposit } from "thirdweb/extensions/erc4626";
 *
 * const transaction = deposit({
 *  contract,
 *  assets: ...,
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
export function deposit(
  options: BaseTransactionOptions<
    | DepositParams
    | {
        asyncParams: () => Promise<DepositParams>;
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
      return [resolvedOptions.assets, resolvedOptions.receiver] as const;
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
