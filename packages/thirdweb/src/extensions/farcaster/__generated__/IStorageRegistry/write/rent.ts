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
 * Represents the parameters for the "rent" function.
 */
export type RentParams = WithOverrides<{
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  units: AbiParameterToPrimitiveType<{ type: "uint256"; name: "units" }>;
}>;

export const FN_SELECTOR = "0x783a112b" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
  {
    type: "uint256",
    name: "units",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "overpayment",
  },
] as const;

/**
 * Checks if the `rent` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `rent` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isRentSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = isRentSupported(["0x..."]);
 * ```
 */
export function isRentSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "rent" function.
 * @param options - The options for the rent function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRentParams } from "thirdweb/extensions/farcaster";
 * const result = encodeRentParams({
 *  fid: ...,
 *  units: ...,
 * });
 * ```
 */
export function encodeRentParams(options: RentParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid, options.units]);
}

/**
 * Encodes the "rent" function into a Hex string with its parameters.
 * @param options - The options for the rent function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRent } from "thirdweb/extensions/farcaster";
 * const result = encodeRent({
 *  fid: ...,
 *  units: ...,
 * });
 * ```
 */
export function encodeRent(options: RentParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRentParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "rent" function on the contract.
 * @param options - The options for the "rent" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { rent } from "thirdweb/extensions/farcaster";
 *
 * const transaction = rent({
 *  contract,
 *  fid: ...,
 *  units: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function rent(
  options: BaseTransactionOptions<
    | RentParams
    | {
        asyncParams: () => Promise<RentParams>;
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
      return [resolvedOptions.fid, resolvedOptions.units] as const;
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
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}
