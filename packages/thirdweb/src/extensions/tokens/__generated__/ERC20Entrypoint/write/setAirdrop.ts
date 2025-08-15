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
 * Represents the parameters for the "setAirdrop" function.
 */
export type SetAirdropParams = WithOverrides<{
  airdrop: AbiParameterToPrimitiveType<{ type: "address"; name: "airdrop" }>;
}>;

export const FN_SELECTOR = "0x72820dbc" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "airdrop",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setAirdrop` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setAirdrop` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isSetAirdropSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isSetAirdropSupported(["0x..."]);
 * ```
 */
export function isSetAirdropSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setAirdrop" function.
 * @param options - The options for the setAirdrop function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeSetAirdropParams } from "thirdweb/extensions/tokens";
 * const result = encodeSetAirdropParams({
 *  airdrop: ...,
 * });
 * ```
 */
export function encodeSetAirdropParams(options: SetAirdropParams) {
  return encodeAbiParameters(FN_INPUTS, [options.airdrop]);
}

/**
 * Encodes the "setAirdrop" function into a Hex string with its parameters.
 * @param options - The options for the setAirdrop function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeSetAirdrop } from "thirdweb/extensions/tokens";
 * const result = encodeSetAirdrop({
 *  airdrop: ...,
 * });
 * ```
 */
export function encodeSetAirdrop(options: SetAirdropParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetAirdropParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setAirdrop" function on the contract.
 * @param options - The options for the "setAirdrop" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setAirdrop } from "thirdweb/extensions/tokens";
 *
 * const transaction = setAirdrop({
 *  contract,
 *  airdrop: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setAirdrop(
  options: BaseTransactionOptions<
    | SetAirdropParams
    | {
        asyncParams: () => Promise<SetAirdropParams>;
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
      return [resolvedOptions.airdrop] as const;
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
